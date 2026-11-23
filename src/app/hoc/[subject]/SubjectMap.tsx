"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getSubject } from "@/content/subjects";
import { challengeOf, currentTierIndex, tierUnlocked } from "@/lib/tiers";
import { useProgress } from "@/lib/store";
import { Art } from "@/components/Art";
import { IconBack, IconLock, IconStar } from "@/components/Icons";
import { Mascot } from "@/components/Mascot";
import { Scene } from "@/components/Scene";
import { LEVELS } from "@/lib/quiz";

const OFFSETS = [0, 24, 0, -24]; // lệch ngang (%) để con đường uốn lượn
const ROW = 150; // chiều cao mỗi chặng dừng (px)
const UNIT_COLORS = ["var(--color-sky)", "var(--color-peach)", "var(--color-mint)", "var(--color-lilac)"];

type Stop =
  | { kind: "unit"; title: string; color: string }
  | { kind: "lesson"; id: string; n: number; title: string; short: string; emoji: string; cover: string }
  | { kind: "test" }
  | { kind: "challenge" }
  | { kind: "arena" };

export function SubjectMap({ subjectId }: { subjectId: string }) {
  const s = getSubject(subjectId)!;
  const { lesson, data, ready } = useProgress();
  const [ti, setTi] = useState<number | null>(null);

  // mở đúng trình độ: theo ?cap= trên đường dẫn, không thì trình độ cao nhất đã mở
  useEffect(() => {
    if (!ready || ti !== null) return;
    const cap = new URLSearchParams(location.search).get("cap");
    const k = s.tiers.findIndex((t) => t.id === cap);
    setTi(k >= 0 ? k : currentTierIndex(s, lesson, data.unlocks));
  }, [ready, ti, s, lesson, data.unlocks]);

  const tIdx = ti ?? 0;
  const tier = s.tiers[tIdx];
  const prev = s.tiers[tIdx - 1];
  const nextTier = s.tiers[tIdx + 1];
  const open = tierUnlocked(s, tIdx, lesson, data.unlocks);
  const nextOpen = nextTier ? tierUnlocked(s, tIdx + 1, lesson, data.unlocks) : false;
  const lessons = tier.units.flatMap((u) => u.lessons);
  const currentId = (lessons.find((l) => lesson(s.id, l.id).stars === 0) ?? lessons[lessons.length - 1])?.id;
  const test = data.tests[`${s.id}:${tier.id}`];
  const level = test && LEVELS.find((l) => l.id === test.level);

  function pickTier(k: number) {
    setTi(k);
    history.replaceState(null, "", `?cap=${s.tiers[k].id}`);
  }

  const stops: Stop[] = [];
  let n = 0;
  tier.units.forEach((u, ui) => {
    stops.push({ kind: "unit", title: u.title, color: UNIT_COLORS[ui % UNIT_COLORS.length] });
    u.lessons.forEach((l) => stops.push({ kind: "lesson", id: l.id, n: ++n, title: l.title, short: l.short, emoji: l.emoji, cover: l.cover }));
  });
  if (lessons.length) {
    stops.push({ kind: "test" });
    if (nextTier && nextTier.units.length) stops.push({ kind: "challenge" });
    stops.push({ kind: "arena" });
  }

  // toạ độ các điểm dừng (bỏ qua băng rôn chặng)
  let y = 0;
  let k = 0;
  const pos = stops.map((st) => {
    if (st.kind === "unit") {
      y += 90;
      return { x: 50, y: y - 45 };
    }
    const p = { x: 50 + OFFSETS[k++ % OFFSETS.length], y: y + ROW / 2 };
    y += ROW;
    return p;
  });
  const height = y + 40;
  const pts = pos.filter((_, i) => stops[i].kind !== "unit");
  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `C ${pts[i - 1].x} ${pts[i - 1].y + ROW / 2}, ${p.x} ${p.y - ROW / 2}, ${p.x} ${p.y}`)).join(" ");

  return (
    <div className="space-y-4">
      <Scene image="bg-map" variant="map" />
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-[var(--shadow-pop)]" aria-label="Quay lại">
          <IconBack className="h-6 w-6" />
        </Link>
        <h1 className="ribbon text-2xl sm:text-3xl">
          {s.emoji} {s.name}
        </h1>
      </div>

      {/* các trình độ: lớp 6, 7, 8... */}
      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Trình độ">
        {s.tiers.map((t, k) => {
          const on = k === tIdx;
          const locked = !tierUnlocked(s, k, lesson, data.unlocks);
          return (
            <button
              key={t.id}
              onClick={() => pickTier(k)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-display text-lg font-extrabold shadow-[var(--shadow-pop)] transition ${
                on ? "bg-sky text-white" : "bg-white/90 text-ink"
              }`}
            >
              <span>{t.emoji}</span>
              {t.name}
              {locked && <IconLock className={`h-4 w-4 ${on ? "text-white/80" : "text-ink-soft"}`} />}
              {!locked && t.units.length === 0 && <span className={`text-xs font-bold ${on ? "text-white/80" : "text-ink-soft"}`}>sắp có</span>}
            </button>
          );
        })}
      </nav>

      {tier.units.length === 0 ? (
        <div className="bubble mx-auto flex max-w-xl items-center gap-4">
          <Mascot mood="think" size={96} className="floaty shrink-0" />
          <div>
            <h2 className="font-display text-2xl font-extrabold">{tier.name} đang được soạn</h2>
            <p className="text-ink-soft">{tier.short}. Mochi đang chuẩn bị, em quay lại sau nhé!</p>
          </div>
        </div>
      ) : (
        !open &&
        prev && (
          <div className="bubble mx-auto flex max-w-2xl flex-wrap items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-sun text-3xl">🔒</span>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl font-extrabold">{tier.name} chưa mở</h2>
              <p className="text-ink-soft">
                Học xong {prev.name}, hoặc vượt thử thách {challengeOf(prev).count} câu (đúng {challengeOf(prev).pass} câu) để mở luôn.
              </p>
            </div>
            <Link href={`/hoc/${s.id}/thu-thach/${prev.id}`} className="btn btn-peach">
              ⚡ Làm thử thách
            </Link>
          </div>
        )
      )}

      {lessons.length > 0 && (
      <div className={`relative mx-auto w-full max-w-3xl ${open ? "" : "pointer-events-none opacity-60 grayscale-[40%]"}`} style={{ height }}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden>
          <path d={path} fill="none" stroke="white" strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.85" />
          <path d={path} fill="none" stroke="#f3c27a" strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {stops.map((st, i) => {
          const p = pos[i];
          const labelLeft = p.x > 50;
          const style = { left: `${p.x}%`, top: p.y };
          if (st.kind === "unit") {
            return (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap" style={style}>
                <span className="ribbon text-sm sm:text-base" style={{ ["--ribbon" as string]: st.color }}>
                  {st.title}
                </span>
              </div>
            );
          }
          if (st.kind === "lesson") {
            const prog = lesson(s.id, st.id);
            const current = st.id === currentId;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={style}
              >
                <Link href={`/hoc/${s.id}/${st.id}`} className="group relative block" tabIndex={open ? undefined : -1}>
                  <span
                    className={`relative block h-24 w-24 overflow-hidden rounded-full border-[6px] shadow-[0_10px_24px_-8px_rgba(40,40,120,0.5)] transition group-hover:scale-105 sm:h-28 sm:w-28 ${
                      prog.stars > 0 ? "border-mint" : current ? "pulse-ring border-sky" : "border-white"
                    }`}
                  >
                    <Art id={st.cover} emoji={st.emoji} rounded="rounded-full" className="h-full w-full" />
                  </span>
                  <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-white px-2 py-0.5 shadow">
                    {[1, 2, 3].map((v) => (
                      <IconStar key={v} filled={prog.stars >= v} className={`h-4 w-4 ${prog.stars >= v ? "text-sun" : "text-line"}`} />
                    ))}
                  </span>
                  <span
                    className={`absolute top-1/2 w-28 -translate-y-1/2 rounded-2xl bg-white/75 px-3 py-2 shadow-sm backdrop-blur sm:w-56 ${labelLeft ? "right-full mr-3 text-right" : "left-full ml-3"}`}
                  >
                    <span className="block text-xs font-extrabold uppercase tracking-wide text-ink-soft text-outline">Bài {st.n}</span>
                    <span className="block font-display text-base font-extrabold leading-tight text-ink text-outline sm:text-xl">{st.title}</span>
                    <span className="hidden text-sm font-semibold text-ink-soft text-outline sm:block">{st.short}</span>
                  </span>
                </Link>
                {current && (
                  <Mascot
                    mood="cheer"
                    size={64}
                    className={`floaty pointer-events-none absolute -top-10 ${labelLeft ? "-left-12" : "-right-12"} drop-shadow`}
                  />
                )}
              </motion.div>
            );
          }
          if (st.kind === "test") {
            return (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
                <Link href={`/hoc/${s.id}/kiem-tra/${tier.id}`} className="group relative block">
                  <span className="grid h-28 w-28 place-items-center rounded-full border-[6px] border-white bg-peach text-5xl shadow-[0_10px_24px_-8px_rgba(40,40,120,0.5)] transition group-hover:scale-105">
                    {level ? level.emoji : "🏅"}
                  </span>
                  <span className={`absolute top-1/2 w-40 -translate-y-1/2 rounded-2xl bg-white/75 px-3 py-2 shadow-sm backdrop-blur sm:w-56 ${labelLeft ? "right-full mr-3 text-right" : "left-full ml-3"}`}>
                    <span className="block font-display text-xl font-extrabold text-ink text-outline">Kiểm tra {tier.name.toLowerCase()}</span>
                    <span className="block text-sm font-semibold text-ink-soft text-outline">{level ? `Lần trước: ${level.name} (${test!.pct}%)` : "15 câu, khoảng 12 phút"}</span>
                  </span>
                </Link>
              </div>
            );
          }
          if (st.kind === "challenge") {
            return (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
                <Link href={`/hoc/${s.id}/thu-thach/${tier.id}`} className="group relative block">
                  <span className="grid h-28 w-28 place-items-center rounded-full border-[6px] border-white bg-sun text-5xl shadow-[0_10px_24px_-8px_rgba(40,40,120,0.5)] transition group-hover:scale-105">
                    {nextOpen ? nextTier!.emoji : "🚀"}
                  </span>
                  <span className={`absolute top-1/2 w-40 -translate-y-1/2 rounded-2xl bg-white/75 px-3 py-2 shadow-sm backdrop-blur sm:w-56 ${labelLeft ? "right-full mr-3 text-right" : "left-full ml-3"}`}>
                    <span className="block font-display text-xl font-extrabold text-ink text-outline">Lên {nextTier!.name}</span>
                    <span className="block text-sm font-semibold text-ink-soft text-outline">
                      {nextOpen ? "Đã mở, bấm tab để học tiếp" : `Thử thách ${challengeOf(tier).count} câu, đạt là mở luôn`}
                    </span>
                  </span>
                </Link>
              </div>
            );
          }
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
              <Link href={`/thi-dau?mon=${s.id}&cap=${tier.id}`} className="group relative block">
                <span className="grid h-28 w-28 place-items-center rounded-full border-[6px] border-white bg-mint text-5xl shadow-[0_10px_24px_-8px_rgba(40,40,120,0.5)] transition group-hover:scale-105">⚡</span>
                <span className={`absolute top-1/2 w-40 -translate-y-1/2 rounded-2xl bg-white/75 px-3 py-2 shadow-sm backdrop-blur sm:w-56 ${labelLeft ? "right-full mr-3 text-right" : "left-full ml-3"}`}>
                  <span className="block font-display text-xl font-extrabold text-ink text-outline">Thi đấu cùng bạn</span>
                  <span className="block text-sm font-semibold text-ink-soft text-outline">Tạo phòng, gửi mã, cùng làm một đề</span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
}
