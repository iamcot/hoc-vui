"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";
import { setMuted } from "./sound";

export interface LessonState {
  /** đã học hết slide */
  read: boolean;
  /** số sao luyện tập tốt nhất 0-3 */
  stars: number;
  best: number;
}

export interface TestState {
  pct: number;
  level: string;
  at: string;
  weak: string[];
}

export interface Profile {
  name: string;
  avatar: string;
}

export interface ProgressData {
  xp: number;
  /** key: subjectId/lessonId */
  lessons: Record<string, LessonState>;
  /** key: subjectId:tierId */
  tests: Record<string, TestState>;
  /** trình độ đã mở khóa nhờ thử thách vượt cấp: subjectId -> [tierId] */
  unlocks: Record<string, string[]>;
  profile: Profile;
  sound: boolean;
  /** môn máy tính: bấm máy ảo trên màn hình hay máy thật */
  calcMode: "virtual" | "physical";
  /** XP theo ngày, dùng cho chuỗi ngày học: yyyy-mm-dd -> xp */
  days: Record<string, number>;
}

const EMPTY: ProgressData = {
  xp: 0,
  lessons: {},
  tests: {},
  unlocks: {},
  profile: { name: "", avatar: "fox" },
  sound: true,
  calcMode: "virtual",
  days: {},
};

const LS_KEY = "hocvui:v1";

function loadLocal(): ProgressData {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return migrate({ ...EMPTY, ...JSON.parse(raw) });
  } catch {
    /* chế độ riêng tư */
  }
  return EMPTY;
}
/** Dữ liệu cũ: môn "fx580-lop6" nay là trình độ "lop6" của môn "may-tinh". */
function migrate(d: ProgressData): ProgressData {
  const OLD = "fx580-lop6";
  if (!Object.keys(d.lessons).some((k) => k.startsWith(OLD + "/")) && !d.tests[OLD]) return d;
  const lessons: ProgressData["lessons"] = {};
  for (const [k, v] of Object.entries(d.lessons)) lessons[k.replace(OLD + "/", "may-tinh/")] = v;
  const tests = { ...d.tests };
  if (tests[OLD]) {
    tests["may-tinh:lop6"] = tests[OLD];
    delete tests[OLD];
  }
  return { ...d, lessons, tests };
}
function saveLocal(d: ProgressData) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(d));
  } catch {
    /* bỏ qua */
  }
}

const today = () => new Date().toLocaleDateString("sv-SE");

interface Store {
  data: ProgressData;
  ready: boolean;
  session: Session | null;
  online: boolean;
  lesson(subjectId: string, lessonId: string): LessonState;
  markRead(subjectId: string, lessonId: string): void;
  recordPractice(subjectId: string, lessonId: string, correct: number, total: number, hinted?: number): { stars: number; xp: number };
  /** key: subjectId:tierId */
  recordTest(key: string, t: TestState): void;
  unlockTier(subjectId: string, tierId: string): void;
  addXp(subjectId: string, amount: number, reason: string): void;
  setProfile(p: Partial<Profile>): void;
  setSound(on: boolean): void;
  setCalcMode(m: ProgressData["calcMode"]): void;
  signOut(): Promise<void>;
  streak: number;
}

const Ctx = createContext<Store | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProgressData>(EMPTY);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const sb = getSupabase();
  const dataRef = useRef(data);
  dataRef.current = data;

  useEffect(() => {
    const d = loadLocal();
    setData(d);
    setMuted(!d.sound);
    setReady(true);
  }, []);

  const update = useCallback((fn: (d: ProgressData) => ProgressData) => {
    setData((prev) => {
      const next = fn(prev);
      saveLocal(next);
      return next;
    });
  }, []);

  // Đăng nhập: lấy hồ sơ + tiến trình từ Supabase, gộp với dữ liệu trên máy
  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data: s }) => setSession(s.session));
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, [sb]);

  useEffect(() => {
    if (!sb || !session) return;
    const uid = session.user.id;
    (async () => {
      const [{ data: prof }, { data: rows }, { data: xpRow }, { data: unl }] = await Promise.all([
        sb.from("profiles").select("display_name, avatar").eq("id", uid).maybeSingle(),
        sb.from("lesson_progress").select("subject_id, lesson_id, read, stars, best").eq("user_id", uid),
        sb.rpc("my_total_xp"),
        sb.from("tier_unlocks").select("subject_id, tier_id").eq("user_id", uid),
      ]);
      const local = dataRef.current;
      const unlocks: ProgressData["unlocks"] = Object.fromEntries(Object.entries(local.unlocks).map(([k, v]) => [k, [...v]]));
      for (const r of unl ?? []) {
        unlocks[r.subject_id] = Array.from(new Set([...(unlocks[r.subject_id] ?? []), r.tier_id]));
      }
      const unlockRows = Object.entries(local.unlocks).flatMap(([subject_id, ids]) => ids.map((tier_id) => ({ user_id: uid, subject_id, tier_id })));
      if (unlockRows.length) await sb.from("tier_unlocks").upsert(unlockRows);
      const lessons = { ...local.lessons };
      const upserts: Record<string, unknown>[] = [];
      for (const r of rows ?? []) {
        const k = `${r.subject_id}/${r.lesson_id}`;
        const l = lessons[k];
        lessons[k] = { read: r.read || !!l?.read, stars: Math.max(r.stars, l?.stars ?? 0), best: Math.max(r.best, l?.best ?? 0) };
      }
      for (const [k, l] of Object.entries(local.lessons)) {
        const [subject_id, lesson_id] = k.split("/");
        upserts.push({ user_id: uid, subject_id, lesson_id, ...lessons[k] });
        void l;
      }
      if (upserts.length) await sb.from("lesson_progress").upsert(upserts);
      const serverXp = typeof xpRow === "number" ? xpRow : 0;
      if (local.xp > serverXp) {
        await sb.from("xp_events").insert({ user_id: uid, subject_id: "tong-hop", amount: local.xp - serverXp, reason: "dong-bo" });
      }
      update((d) => ({
        ...d,
        lessons,
        unlocks,
        xp: Math.max(d.xp, serverXp),
        profile: prof ? { name: prof.display_name ?? d.profile.name, avatar: prof.avatar ?? d.profile.avatar } : d.profile,
      }));
    })().catch(() => {});
  }, [sb, session, update]);

  const syncLesson = useCallback(
    (subjectId: string, lessonId: string, l: LessonState) => {
      if (!sb || !session) return;
      void sb.from("lesson_progress").upsert({ user_id: session.user.id, subject_id: subjectId, lesson_id: lessonId, ...l });
    },
    [sb, session],
  );

  const addXp = useCallback(
    (subjectId: string, amount: number, reason: string) => {
      if (amount <= 0) return;
      update((d) => ({ ...d, xp: d.xp + amount, days: { ...d.days, [today()]: (d.days[today()] ?? 0) + amount } }));
      if (sb && session) void sb.from("xp_events").insert({ user_id: session.user.id, subject_id: subjectId, amount, reason });
    },
    [sb, session, update],
  );

  const store = useMemo<Store>(() => {
    const lesson = (s: string, l: string) => data.lessons[`${s}/${l}`] ?? { read: false, stars: 0, best: 0 };
    let streak = 0;
    const d = new Date();
    if (!data.days[today()]) d.setDate(d.getDate() - 1);
    while (data.days[d.toLocaleDateString("sv-SE")]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return {
      data,
      ready,
      session,
      online: Boolean(sb),
      streak,
      lesson,
      markRead(s, l) {
        const cur = lesson(s, l);
        if (cur.read) return;
        const next = { ...cur, read: true };
        update((d) => ({ ...d, lessons: { ...d.lessons, [`${s}/${l}`]: next } }));
        syncLesson(s, l, next);
        addXp(s, 20, `doc:${l}`);
      },
      recordPractice(s, l, correct, total, hinted = 0) {
        const pct = Math.round((correct / Math.max(total, 1)) * 100);
        const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
        const cur = lesson(s, l);
        const next = { ...cur, stars: Math.max(cur.stars, stars), best: Math.max(cur.best, pct) };
        update((d) => ({ ...d, lessons: { ...d.lessons, [`${s}/${l}`]: next } }));
        syncLesson(s, l, next);
        const xp = Math.max(0, correct - hinted) * 5 + (stars > cur.stars ? (stars - cur.stars) * 10 : 0);
        addXp(s, xp, `luyen:${l}`);
        return { stars, xp };
      },
      recordTest(key, t) {
        update((d) => ({ ...d, tests: { ...d.tests, [key]: t } }));
        if (sb && session) void sb.from("level_tests").insert({ user_id: session.user.id, subject_id: key, pct: t.pct, level: t.level });
      },
      unlockTier(s, tier) {
        if (data.unlocks[s]?.includes(tier)) return;
        update((d) => ({ ...d, unlocks: { ...d.unlocks, [s]: [...(d.unlocks[s] ?? []), tier] } }));
        if (sb && session) void sb.from("tier_unlocks").upsert({ user_id: session.user.id, subject_id: s, tier_id: tier });
      },
      addXp,
      setProfile(p) {
        update((d) => ({ ...d, profile: { ...d.profile, ...p } }));
        if (sb && session) {
          const row: Record<string, string> = { id: session.user.id };
          if (p.name !== undefined) row.display_name = p.name;
          if (p.avatar !== undefined) row.avatar = p.avatar;
          void sb.from("profiles").upsert(row);
        }
      },
      setSound(on) {
        setMuted(!on);
        update((d) => ({ ...d, sound: on }));
      },
      setCalcMode(m) {
        update((d) => ({ ...d, calcMode: m }));
      },
      async signOut() {
        await sb?.auth.signOut();
        setSession(null);
      },
    };
  }, [data, ready, session, sb, update, syncLesson, addXp]);

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useProgress() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useProgress ngoài ProgressProvider");
  return s;
}
