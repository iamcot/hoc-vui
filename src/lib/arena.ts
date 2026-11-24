"use client";
import { getSupabase } from "./supabase";

export const ROOM_QUESTIONS = 10;
export const ROOM_SECONDS = 120;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const newCode = () => Array.from({ length: 6 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
export const cleanCode = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

export interface Room {
  code: string;
  subject_id: string;
  /** trình độ của đề (null = trộn cả môn) */
  tier_id?: string | null;
  question_count: number;
  seconds: number;
  /** "free" = phòng tự do, hoặc id hạng (xem lib/ranks) */
  rank?: string;
}

export interface Entry {
  user_id: string;
  display_name: string;
  avatar: string;
  score: number;
  correct: number;
  time_ms: number;
  me?: boolean;
}

/** Điểm: 100 mỗi câu đúng + thưởng thời gian còn lại (chỉ khi đúng từ 60%) */
export function scoreOf(correct: number, total: number, msUsed: number, seconds: number) {
  const left = Math.max(0, seconds * 1000 - msUsed) / 1000;
  return correct * 100 + (correct / total >= 0.6 ? Math.round(left * 2) : 0);
}

const LOCAL_ROOMS = "hocvui:rooms";
function localRooms(): Record<string, { room: Room; entries: Entry[] }> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ROOMS) ?? "{}");
  } catch {
    return {};
  }
}
function saveLocalRooms(r: ReturnType<typeof localRooms>) {
  try {
    localStorage.setItem(LOCAL_ROOMS, JSON.stringify(r));
  } catch {
    /* bỏ qua */
  }
}

/** Tạo phòng. Không đăng nhập: phòng chỉ lưu trên máy, nhưng mã vẫn cho ra cùng đề ở máy khác. */
export async function createRoom(subjectId: string, tierId?: string | null, rank = "free"): Promise<Room> {
  const sb = getSupabase();
  const room: Room = { code: newCode(), subject_id: subjectId, tier_id: tierId ?? null, question_count: ROOM_QUESTIONS, seconds: ROOM_SECONDS, rank };
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (sb && s.session) {
    const { error } = await sb.from("challenges").insert(room);
    if (error) throw error;
  } else {
    const all = localRooms();
    all[room.code] = { room, entries: [] };
    saveLocalRooms(all);
  }
  return room;
}

/** Tìm phòng theo mã. Mã đặt ở máy khác khi chưa đăng nhập: mặc định môn đầu tiên. */
export async function findRoom(code: string, fallbackSubject: string, fallbackTier?: string | null): Promise<Room> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (sb && s.session) {
    const { data } = await sb.from("challenges").select("code, subject_id, tier_id, question_count, seconds, rank").eq("code", code).maybeSingle();
    if (data) return data as Room;
  }
  const local = localRooms()[code];
  if (local) return local.room;
  return { code, subject_id: fallbackSubject, tier_id: fallbackTier ?? null, question_count: ROOM_QUESTIONS, seconds: ROOM_SECONDS };
}

/** keepBest: đua lại nhiều lượt trong một phòng thì giữ điểm cao nhất (mặc định giữ lần đầu cho công bằng) */
export async function submitEntry(room: Room, e: { score: number; correct: number; time_ms: number }, me: { name: string; avatar: string }, keepBest = false) {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (sb && s.session) {
    const { error } = await sb.from("challenge_entries").insert({ code: room.code, ...e });
    // đã nộp rồi thì giữ lần đầu (công bằng cho cả phòng), trừ khi đua lại thì giữ điểm cao nhất
    if (error && !String(error.code).startsWith("23")) throw error;
    if (error && keepBest) await sb.from("challenge_entries").update(e).eq("code", room.code).eq("user_id", s.session.user.id).lt("score", e.score);
    return;
  }
  const all = localRooms();
  const r = all[room.code] ?? { room, entries: [] };
  r.entries.push({ user_id: `local-${r.entries.length}`, display_name: me.name || "Em", avatar: me.avatar, ...e });
  all[room.code] = r;
  saveLocalRooms(all);
}

export async function roomBoard(code: string): Promise<Entry[]> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (sb && s.session) {
    const { data } = await sb.rpc("challenge_board", { p_code: code });
    return ((data ?? []) as Entry[]).map((x) => ({ ...x, me: x.user_id === s.session!.user.id }));
  }
  return (localRooms()[code]?.entries ?? []).sort((a, b) => b.score - a.score || a.time_ms - b.time_ms);
}

export async function leaderboard(subject: string | null, days: number | null): Promise<Entry[] | null> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (!sb || !s.session) return null;
  const { data } = await sb.rpc("leaderboard", { p_subject: subject, p_days: days, p_limit: 50 });
  return ((data ?? []) as { user_id: string; display_name: string; avatar: string; xp: number }[]).map((r) => ({
    user_id: r.user_id,
    display_name: r.display_name,
    avatar: r.avatar,
    score: Number(r.xp),
    correct: 0,
    time_ms: 0,
    me: r.user_id === s.session!.user.id,
  }));
}

export async function myRooms(): Promise<string[]> {
  return Object.keys(localRooms());
}

export interface StarRow {
  pos: number;
  user_id: string;
  display_name: string;
  avatar: string;
  stars: number;
  me?: boolean;
}

/** Bảng xếp hạng sao. period: week | month | all; kind: stars | progress (số bài mới học xong). */
export async function starBoard(opts: { period: "week" | "month" | "all"; subject?: string | null; rank?: string | null; kind?: "stars" | "progress" }): Promise<StarRow[] | null> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (!sb || !s.session) return null;
  const { data, error } = await sb.rpc("star_board", { p_period: opts.period, p_subject: opts.subject ?? null, p_rank: opts.rank ?? null, p_kind: opts.kind ?? "stars", p_limit: 50 });
  if (error) {
    console.warn("Không tải được bảng xếp hạng:", error.message);
    return [];
  }
  return ((data ?? []) as StarRow[]).map((r) => ({ ...r, pos: Number(r.pos), stars: Number(r.stars), me: r.user_id === s.session!.user.id }));
}
