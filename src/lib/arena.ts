"use client";
import { getSupabase } from "./supabase";
import type { IcoId } from "@/components/Ico";

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
  /** "free" = phòng tự do, hoặc id cấp (xem lib/ranks) */
  rank?: string;
  /** phòng công khai: ai cũng vào được khi chủ phòng chưa bắt đầu */
  is_public?: boolean;
  started_at?: string | null;
  /** đua xe gõ phím: random | vi | en */
  mode?: RaceMode | null;
  created_by?: string;
}

export type RaceMode = "random" | "vi" | "en";
export const RACE_MODES: { id: RaceMode; name: string; short: string; hint: string }[] = [
  { id: "vi", name: "Đoạn văn tiếng Việt", short: "Tiếng Việt", hint: "Cả phòng gõ một đoạn văn tiếng Việt có dấu (phòng Sơ cấp: không dấu), Sơ cấp đoạn ngắn, Cao cấp đoạn dài" },
  { id: "en", name: "Đoạn văn tiếng Anh", short: "Tiếng Anh", hint: "Cả phòng gõ một đoạn văn tiếng Anh, Sơ cấp đoạn ngắn, Cao cấp đoạn dài" },
  { id: "random", name: "Gõ ngẫu nhiên", short: "Ngẫu nhiên", hint: "Chữ và từ trộn ngẫu nhiên từ các bài trong lộ trình của cấp phòng" },
];
/** các môn có đấu trường */
export const ARENA_SUBJECTS = ["may-tinh", "go-phim"];

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

/** Đường dẫn vào phòng: kèm môn, cấp, chế độ để máy chưa đăng nhập vẫn ra cùng đề. */
export function roomHref(r: Pick<Room, "code" | "subject_id" | "rank" | "mode" | "tier_id">) {
  const q = new URLSearchParams({ mon: r.subject_id });
  if (r.tier_id) q.set("cap", r.tier_id);
  if (r.rank) q.set("hang", r.rank);
  if (r.mode) q.set("kieu", r.mode);
  return `/thi-dau/${r.code}?${q}`;
}

/** Tạo phòng. Không đăng nhập: phòng chỉ lưu trên máy, nhưng mã vẫn cho ra cùng đề ở máy khác. */
export async function createRoom(opts: { subject: string; rank: string; isPublic?: boolean; mode?: RaceMode | null }): Promise<Room> {
  const sb = getSupabase();
  const room: Room = {
    code: newCode(),
    subject_id: opts.subject,
    tier_id: null,
    question_count: ROOM_QUESTIONS,
    seconds: ROOM_SECONDS,
    rank: opts.rank,
    mode: opts.mode ?? null,
  };
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (sb && s.session) {
    const { error } = await sb.from("challenges").insert({ ...room, is_public: !!opts.isPublic });
    if (error) throw error;
    return { ...room, is_public: !!opts.isPublic, created_by: s.session.user.id };
  }
  const all = localRooms();
  all[room.code] = { room: { ...room, created_by: "local" }, entries: [] };
  saveLocalRooms(all);
  return { ...room, created_by: "local" };
}

/** Tìm phòng theo mã. Mã đặt ở máy khác khi chưa đăng nhập: lấy môn, cấp, chế độ trên đường dẫn. */
export async function findRoom(code: string, fb: { subject: string; tier?: string | null; rank?: string | null; mode?: string | null }): Promise<Room> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (sb && s.session) {
    const { data } = await sb.from("challenges").select("code, subject_id, tier_id, question_count, seconds, rank, is_public, started_at, mode, created_by").eq("code", code).maybeSingle();
    if (data) return data as Room;
  }
  const local = localRooms()[code];
  if (local) return local.room;
  const mode = fb.mode === "random" || fb.mode === "en" || fb.mode === "vi" ? fb.mode : null;
  return { code, subject_id: fb.subject, tier_id: fb.tier ?? null, question_count: ROOM_QUESTIONS, seconds: ROOM_SECONDS, rank: fb.rank ?? "free", mode };
}

/** Phòng này có phải của mình không (phòng trên máy thì máy tạo là chủ) */
export async function isHost(room: Room): Promise<boolean> {
  if (room.created_by === "local") return true;
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  return !!s.session && s.session.user.id === room.created_by;
}

/** Chủ phòng bấm bắt đầu: phòng công khai đóng cửa với bạn mới */
export async function startRoom(room: Room) {
  const sb = getSupabase();
  if (!sb || room.started_at || room.created_by === "local") return;
  const { error } = await sb.rpc("start_room", { p_code: room.code });
  if (error) console.warn("Không đánh dấu phòng đã bắt đầu:", error.message);
}

/** Phòng có thông tin mới nhất (để biết chủ phòng đã bắt đầu chưa) */
export async function roomStarted(code: string): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.from("challenges").select("started_at").eq("code", code).maybeSingle();
  return !!data?.started_at;
}

export interface OpenRoom {
  code: string;
  subject_id: string;
  rank: string;
  mode: RaceMode | null;
  created_at: string;
  host_name: string;
  host_avatar: string;
  mine: boolean;
}

/** Các phòng công khai đang chờ người vào (chỉ khi đã đăng nhập) */
export async function openRooms(): Promise<OpenRoom[] | null> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (!sb || !s.session) return null;
  const { data, error } = await sb.rpc("open_rooms", { p_limit: 12 });
  if (error) {
    console.warn("Không tải được phòng công khai:", error.message);
    return [];
  }
  return (data ?? []) as OpenRoom[];
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

export type Period = "week" | "all";
/** các bảng xếp hạng: sao (mọi môn) và kỷ lục đặc thù của từng môn */
export type BoardId = "sao" | "sinh-ton" | "wpm";
export const BOARDS: { id: BoardId; name: string; short: string; unit: string; icon: IcoId; hint: string }[] = [
  { id: "sao", name: "Nhiều sao nhất", short: "Sao", unit: "sao", icon: "star", hint: "Sao có từ học bài, luyện tập, kiểm tra và thi đấu" },
  { id: "sinh-ton", name: "Gõ phím · Sinh tồn", short: "Sinh tồn", unit: "điểm", icon: "shark", hint: "Điểm cao nhất một lượt chơi Sinh tồn" },
  { id: "wpm", name: "Gõ phím · Gõ đoạn văn", short: "WPM", unit: "WPM", icon: "scroll", hint: "WPM cao nhất khi gõ một đoạn văn từ 120 ký tự, chính xác từ 85%" },
];

/**
 * Một bảng xếp hạng (top `limit`, luôn kèm dòng của người xem nếu ngoài top).
 * null = chưa đăng nhập hoặc chưa có máy chủ.
 */
export async function board(id: BoardId, period: Period, limit = 100): Promise<StarRow[] | null> {
  const sb = getSupabase();
  const { data: s } = (await sb?.auth.getSession()) ?? { data: { session: null } };
  if (!sb || !s.session) return null;
  const res =
    id === "sao"
      ? await sb.rpc("star_board", { p_period: period, p_subject: null, p_rank: null, p_kind: "stars", p_limit: limit })
      : await sb.rpc("record_board", { p_kind: id === "wpm" ? "wpm" : "survival", p_period: period, p_limit: limit });
  if (res.error) {
    console.warn("Không tải được bảng xếp hạng:", res.error.message);
    return [];
  }
  return ((res.data ?? []) as (StarRow & { value?: number })[]).map((r) => ({ ...r, pos: Number(r.pos), stars: Number(r.stars ?? r.value), me: r.user_id === s.session!.user.id }));
}

/** Ghi kỷ lục (máy chủ chỉ giữ khi vượt kỷ lục tuần của chính mình). Chưa đăng nhập thì bỏ qua. */
export async function submitRecord(kind: "survival" | "wpm", value: number) {
  const sb = getSupabase();
  if (!sb || value <= 0) return;
  const { data: s } = await sb.auth.getSession();
  if (!s.session) return;
  const { error } = await sb.rpc("submit_record", { p_kind: kind, p_value: Math.round(value) });
  if (error) console.warn("Không ghi được kỷ lục:", error.message);
}
