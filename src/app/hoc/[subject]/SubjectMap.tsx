"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { getSubject, tierLessons } from "@/content/subjects";
import type { Subject } from "@/content/types";
import type { Tier } from "@/content/types";
import { challengeOf, continueLessonId, currentTierIndex, tierUnlocked } from "@/lib/tiers";
import { useProgress } from "@/lib/store";
import { rankInfo } from "@/lib/ranks";
import { Art } from "@/components/Art";
import { IconBack, IconLock, IconStar } from "@/components/Icons";
import { Mascot } from "@/components/Mascot";
import { Scene } from "@/components/Scene";
import { LEVELS } from "@/lib/quiz";
import { Ico } from "@/components/Ico";

const OFFSETS = [0, 24, 0, -24]; // lệch ngang (%) để con đường uốn lượn
const ROW = 150; // chiều cao mỗi điểm dừng (px)
const UNIT_H = 90; // băng rôn chặng
const TIER_H = 170; // băng rôn trình độ
/** ảnh biểu tượng mặc định cho trình độ thứ 1, 2, 3, 4... */
const TIER_ICONS = ["level-mam", "level-choi", "level-cay", "level-hoa"];
const tierIcon = (t: Tier, i: number) => t.icon ?? TIER_ICONS[Math.min(i, TIER_ICONS.length - 1)];

const UNIT_COLORS = ["var(--color-sky)", "var(--color-peach)", "var(--color-mint)", "var(--color-lilac)"];

type Stop = { ti: number } & (
  | { kind: "tier" }
  | { kind: "unit"; title: string; color: string }
  | { kind: "lesson"; id: string; n: number; title: string; short: string; emoji: string; cover: string; glyph?: string }
  | { kind: "test" }
  | { kind: "challenge" }
  | { kind: "soon" }
  | { kind: "arena" }
);

const NODE = "shadow-[0_10px_24px_-8px_rgba(40,40,120,0.5)] transition group-hover:scale-105";
const LABEL = "absolute top-1/2 w-40 -translate-y-1/2 rounded-2xl bg-white/75 px-3 py-2 shadow-sm backdrop-blur sm:w-56";

/** Bản đồ một cây liên tục kiểu Duolingo: Lớp 6 → Lớp 7 → ... Trình độ chưa mở thì mờ và có ổ khóa. */
export function SubjectMap({ subjectId }: { subjectId: string }) {
  const s = getSubject(subjectId)!;
  const { lesson, data, ready } = useProgress();
  const wrap = useRef<HTMLDivElement>(null);
  const cyber = s.look?.theme === "cyber";

  const open = s.tiers.map((_, i) => tierUnlocked(s, i, lesson, data.unlocks));
  const cur = currentTierIndex(s, lesson, data.unlocks);
  // bài đang học: bài mở gần nhất (học xong rồi thì bài kế tiếp); chưa học bài nào thì bài đầu chưa có sao
  const currentId = continueLessonId(s, lesson, data.unlocks, data.last?.[s.id]);

  const stops: Stop[] = [];
  s.tiers.forEach((t, ti) => {
    stops.push({ ti, kind: "tier" });
    if (t.units.length === 0) {
      stops.push({ ti, kind: "soon" });
      return;
    }
    let n = 0;
    t.units.forEach((u, ui) => {
      stops.push({ ti, kind: "unit", title: u.title, color: UNIT_COLORS[ui % UNIT_COLORS.length] });
      u.lessons.forEach((l) => stops.push({ ti, kind: "lesson", id: l.id, n: ++n, title: l.title, short: l.short, emoji: l.emoji, cover: l.cover, glyph: l.glyph }));
    });
    stops.push({ ti, kind: "test" });
    if (ti === cur) stops.push({ ti, kind: "arena" });
    const next = s.tiers[ti + 1];
    if (next && next.units.length > 0 && !open[ti + 1]) stops.push({ ti, kind: "challenge" });
  });

  // toạ độ: băng rôn nằm giữa, điểm dừng lượn trái phải
  let y = 0;
  let k = 0;
  const pos = stops.map((st) => {
    if (st.kind === "tier" || st.kind === "unit") {
      const h = st.kind === "tier" ? TIER_H : UNIT_H;
      y += h;
      return { x: 50, y: y - h / 2 };
    }
    const p = { x: 50 + OFFSETS[k++ % OFFSETS.length], y: y + ROW / 2 };
    y += ROW;
    return p;
  });
  const height = y + 40;

  // đường đi: phần đã mở nét đậm, phần còn khóa nét mờ
  const nodes = stops.map((st, i) => ({ st, p: pos[i] })).filter(({ st }) => st.kind !== "unit");
  const seg = (from: number, to: number) =>
    nodes
      .slice(from, to)
      .map(({ p }, i, arr) => (i === 0 ? `M ${p.x} ${p.y}` : `C ${arr[i - 1].p.x} ${arr[i - 1].p.y + ROW / 2}, ${p.x} ${p.y - ROW / 2}, ${p.x} ${p.y}`))
      .join(" ");
  const firstLocked = nodes.findIndex(({ st }) => st.kind === "tier" && !open[st.ti]);
  const cut = firstLocked < 0 ? nodes.length : firstLocked;
  const pathOpen = seg(0, cut);
  const pathLocked = cut < nodes.length ? seg(Math.max(0, cut - 1), nodes.length) : "";

  function jump(tier: Tier) {
    document.getElementById(`cap-${tier.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `?cap=${tier.id}`);
  }

  // vào bản đồ: cuộn tới trình độ trên đường dẫn (?cap=), không thì tới bài đang học
  useEffect(() => {
    if (!ready) return;
    const cap = new URLSearchParams(location.search).get("cap");
    const el = (cap && document.getElementById(`cap-${cap}`)) || document.getElementById("bai-hien-tai");
    if (!el) return;
    const t = setTimeout(() => el.scrollIntoView({ block: cap ? "start" : "center" }), 80);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <div className={`space-y-4 ${cyber ? "theme-cyber" : ""}`}>
      <Scene image={s.look?.map ?? "bg-map"} variant={cyber ? "deep" : "map"} calm={s.look?.calm ?? true} />
      <div className="flex flex-wrap items-center gap-3">
        <Link href="/" className="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-[var(--shadow-pop)]" aria-label="Quay lại">
          <IconBack className="h-6 w-6" />
        </Link>
        {s.mascot === "bit" ? (
          <Mascot who="bit" mood="happy" size={56} className="shrink-0 drop-shadow" />
        ) : (
          <Art id={s.device === "fx580" ? "xixi" : s.cover} emoji={s.emoji} rounded={s.device === "fx580" ? "" : "rounded-full"} contain={s.device === "fx580"} className="h-14 w-14 shrink-0 drop-shadow" />
        )}
        <h1 className="ribbon text-2xl sm:text-3xl">{s.name}</h1>
        {s.arena !== false && ready && <RankChip s={s} />}
      </div>

      {/* lối tắt tới từng trình độ trên cây */}
      <nav className="sticky top-2 z-20 flex gap-2 overflow-x-auto pb-1 md:top-4" aria-label="Đi tới trình độ">
        {s.tiers.map((t, i) => (
          <button
            key={t.id}
            onClick={() => jump(t)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-display text-lg font-extrabold shadow-[var(--shadow-pop)] backdrop-blur transition hover:scale-105 ${
              i === cur ? "bg-sky text-white" : "bg-white/90 text-ink"
            }`}
          >
            <Art id={tierIcon(t, i)} emoji={t.emoji} rounded="" contain className={`h-8 w-8 shrink-0 ${open[i] ? "" : "opacity-60 grayscale"}`} />
            {t.name}
            {!open[i] && <IconLock className={`h-4 w-4 ${i === cur ? "text-white/80" : "text-ink-soft"}`} />}
          </button>
        ))}
      </nav>

      {/* chế độ chơi thêm của môn (vd. Gõ phím: sinh tồn, bài gõ hay, đua xe) */}
      {s.modes && (
        <div className="grid grid-cols-3 gap-3">
          {s.modes.map((m) => (
            <Link
              key={m.id}
              href={m.href}
              className={`group flex items-center gap-3 rounded-3xl p-3 transition hover:scale-[1.02] sm:p-4 ${cyber ? "cyber-panel" : "card"}`}
            >
              <Art id={m.icon ?? m.id} emoji={m.emoji} rounded="rounded-2xl" contain className="h-12 w-12 shrink-0 sm:h-16 sm:w-16" />
              <span className="min-w-0">
                <span className="block font-display text-lg font-extrabold leading-tight sm:text-xl">{m.name}</span>
                <span className={`hidden text-sm font-semibold sm:block ${cyber ? "text-cyan-100/75" : "text-ink-soft"}`}>{m.short}</span>
              </span>
            </Link>
          ))}
        </div>
      )}

      <div ref={wrap} className="relative mx-auto w-full max-w-3xl" style={{ height }}>
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden>
          {pathLocked && <path d={pathLocked} fill="none" stroke={cyber ? "#5b6aa8" : "white"} strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.4" />}
          <path d={pathOpen} fill="none" stroke={cyber ? "#123a8a" : "white"} strokeWidth="18" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity="0.85" />
          <path d={pathOpen} fill="none" stroke={cyber ? "#2fd3ff" : "#f3c27a"} strokeWidth="4" strokeDasharray="2 14" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {stops.map((st, i) => {
          const p = pos[i];
          const labelLeft = p.x > 50;
          const side = labelLeft ? "right-full mr-3 text-right" : "left-full ml-3";
          const style = { left: `${p.x}%`, top: p.y };
          const tier = s.tiers[st.ti];
          const locked = !open[st.ti];
          const dim = locked ? "opacity-55 grayscale-[45%]" : "";

          if (st.kind === "tier") {
            const prev = s.tiers[st.ti - 1];
            const showChallenge = locked && prev && open[st.ti - 1] && tier.units.length > 0;
            return (
              <div key={i} id={`cap-${tier.id}`} className="absolute w-[min(92%,30rem)] -translate-x-1/2 -translate-y-1/2 scroll-mt-24" style={style}>
                <div className={`flex items-center gap-3 rounded-[2rem] px-5 py-3 shadow-[var(--shadow-pop)] ${locked ? "bg-white/80" : "bg-sky text-white"}`}>
                  <span className={`relative grid h-16 w-16 shrink-0 place-items-center rounded-full ${locked ? "bg-line/60" : "bg-white/30"}`}>
                    <Art id={tierIcon(tier, st.ti)} emoji={tier.emoji} rounded="" contain className={`h-14 w-14 ${locked ? "opacity-50 grayscale" : ""}`} />
                    {locked && (
                      <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-ink/80">
                        <IconLock className="h-4 w-4 text-white" />
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-2xl font-extrabold leading-tight">{tier.name}</div>
                    <div className={`text-sm font-semibold ${locked ? "text-ink-soft" : "text-white/85"}`}>
                      {locked && prev
                        ? tier.units.length
                          ? `Học xong ${prev.name} hoặc vượt thử thách để mở`
                          : "Đang soạn"
                        : tier.short}
                    </div>
                  </div>
                  {showChallenge && (
                    <Link href={`/hoc/${s.id}/thu-thach/${prev.id}`} className="btn btn-peach shrink-0 px-4 py-2 text-base">
                      <Ico n="bolt" /> Thử thách
                    </Link>
                  )}
                </div>
              </div>
            );
          }
          if (st.kind === "unit") {
            return (
              <div key={i} className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap ${dim}`} style={style}>
                <span className="ribbon text-sm sm:text-base" style={{ ["--ribbon" as string]: st.color }}>
                  {st.title}
                </span>
              </div>
            );
          }
          if (st.kind === "lesson") {
            const prog = lesson(s.id, st.id);
            const current = !locked && st.id === currentId;
            const circle = (
              <>
                <span
                  className={`relative block h-24 w-24 overflow-hidden rounded-full border-[6px] sm:h-28 sm:w-28 ${NODE} ${
                    prog.stars > 0 ? "border-mint" : current ? "pulse-ring border-sky" : "border-white"
                  }`}
                >
                  {st.glyph ? (
                    <GlyphNode glyph={st.glyph} n={st.n} cyber={cyber} />
                  ) : (
                    <Art id={st.cover} emoji={st.emoji} rounded="rounded-full" className="h-full w-full" />
                  )}
                  {locked && (
                    <span className="absolute inset-0 grid place-items-center bg-ink/35">
                      <IconLock className="h-8 w-8 text-white" />
                    </span>
                  )}
                </span>
                {!locked && (
                  <span className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-white px-2 py-0.5 shadow">
                    {[1, 2, 3].map((v) => (
                      <IconStar key={v} filled={prog.stars >= v} className={`h-4 w-4 ${prog.stars >= v ? "text-sun" : "text-line"}`} />
                    ))}
                  </span>
                )}
                <span className={`${LABEL} w-28 ${side}`}>
                  <span className="block text-xs font-extrabold uppercase tracking-wide text-ink-soft text-outline">
                    {tier.name} · Bài {st.n}
                  </span>
                  <span className="block font-display text-base font-extrabold leading-tight text-ink text-outline sm:text-xl">{st.title}</span>
                  <span className="hidden text-sm font-semibold text-ink-soft text-outline sm:block">{st.short}</span>
                </span>
              </>
            );
            return (
              <motion.div
                key={i}
                id={current ? "bai-hien-tai" : undefined}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={style}
              >
                {locked ? (
                  <div className={`relative ${dim}`} aria-disabled>
                    {circle}
                  </div>
                ) : (
                  <Link href={`/hoc/${s.id}/${st.id}`} className="group relative block">
                    {circle}
                  </Link>
                )}
                {current && (
                  <Link
                    href={`/hoc/${s.id}/${st.id}`}
                    className="absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-sky px-3 py-1 text-sm font-extrabold text-white shadow-[var(--shadow-pop)] floaty"
                  >
                    ▶ Học tiếp
                  </Link>
                )}
                {current && <Mascot who={s.tiers[st.ti]?.mascot ?? s.mascot} mood="cheer" size={64} className={`floaty pointer-events-none absolute -top-10 ${labelLeft ? "-left-12" : "-right-12"} drop-shadow`} />}
              </motion.div>
            );
          }
          if (st.kind === "test") {
            const test = data.tests[`${s.id}:${tier.id}`];
            const level = test && LEVELS.find((l) => l.id === test.level);
            const body = (
              <>
                <span className={`relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border-[6px] border-white bg-peach-soft ${NODE}`}>
                  <Art id={level ? `level-${level.id}` : "mochi-think"} emoji={level ? level.emoji : "🏅"} rounded="" contain className="h-[88%] w-[88%]" />
                  {locked && <LockVeil />}
                </span>
                <span className={`${LABEL} ${side}`}>
                  <span className="block font-display text-xl font-extrabold text-ink text-outline">Kiểm tra {tier.name.toLowerCase()}</span>
                  <span className="block text-sm font-semibold text-ink-soft text-outline">{level ? `Lần trước: ${level.name} (${test!.pct}%)` : "15 câu, khoảng 12 phút"}</span>
                </span>
              </>
            );
            return (
              <div key={i} className={`absolute -translate-x-1/2 -translate-y-1/2 ${dim}`} style={style}>
                {locked ? (
                  <div className="relative">{body}</div>
                ) : (
                  <Link href={`/hoc/${s.id}/kiem-tra/${tier.id}`} className="group relative block">
                    {body}
                  </Link>
                )}
              </div>
            );
          }
          if (st.kind === "challenge") {
            const next = s.tiers[st.ti + 1];
            const ch = challengeOf(tier);
            const body = (
              <>
                <span className={`relative grid h-28 w-28 place-items-center overflow-hidden rounded-full border-[6px] border-white bg-sun-soft ${NODE}`}>
                  <Art id={tierIcon(next, st.ti + 1)} emoji="🚀" rounded="" contain className="h-[80%] w-[80%]" />
                  {locked && <LockVeil />}
                </span>
                <span className={`${LABEL} ${side}`}>
                  <span className="block font-display text-xl font-extrabold text-ink text-outline">Nhảy lên {next.name}</span>
                  <span className="block text-sm font-semibold text-ink-soft text-outline">
                    Thử thách {ch.count} câu, đúng {ch.pass} câu là mở luôn
                  </span>
                </span>
              </>
            );
            return (
              <div key={i} className={`absolute -translate-x-1/2 -translate-y-1/2 ${dim}`} style={style}>
                {locked ? (
                  <div className="relative">{body}</div>
                ) : (
                  <Link href={`/hoc/${s.id}/thu-thach/${tier.id}`} className="group relative block">
                    {body}
                  </Link>
                )}
              </div>
            );
          }
          if (st.kind === "soon") {
            return (
              <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2 opacity-80" style={style}>
                <div className="relative">
                  <span className={`grid h-28 w-28 place-items-center rounded-full border-[6px] border-white bg-lilac/70 ${NODE}`}>
                    <Mascot who={s.tiers[st.ti]?.mascot ?? s.mascot} mood="think" size={72} />
                  </span>
                  <span className={`${LABEL} ${side}`}>
                    <span className="block font-display text-xl font-extrabold text-ink text-outline">Đang soạn</span>
                    <span className="block text-sm font-semibold text-ink-soft text-outline">{tier.short}</span>
                  </span>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={style}>
              <Link href={`/thi-dau?mon=${s.id}&cap=${tier.id}`} className="group relative block">
                <span className={`relative block h-28 w-28 overflow-hidden rounded-full border-[6px] border-white ${NODE}`}>
                  <Art id="bg-arena" emoji="⚡" rounded="rounded-full" className="h-full w-full" />
                </span>
                <span className={`${LABEL} ${side}`}>
                  <span className="block font-display text-xl font-extrabold text-ink text-outline">Thi đấu cùng bạn</span>
                  <span className="block text-sm font-semibold text-ink-soft text-outline">Tạo phòng, gửi mã, cùng làm một đề</span>
                </span>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const GLYPH_BG = ["#ff8a5c", "#4f72ff", "#22b98c", "#9b7bff", "#ffb81f"];
/** Môn chữ: điểm dừng là chữ cái/vần viết to thay cho tranh */
const NEON = ["#2fd3ff", "#ff4fa3", "#3ee08f", "#7c6bff", "#ffb020"];
function GlyphNode({ glyph, n, cyber }: { glyph: string; n: number; cyber?: boolean }) {
  if (cyber) {
    // môn Gõ phím: điểm dừng là phím bấm neon
    const c = NEON[n % NEON.length];
    const size = glyph.length <= 3 ? "text-3xl" : glyph.length <= 5 ? "text-2xl" : "text-lg";
    return (
      <span className="grid h-full w-full place-items-center rounded-full bg-[#0b1233]" style={{ boxShadow: `inset 0 0 0 3px ${c}, inset 0 0 26px ${c}66` }}>
        <span className={`font-mono font-extrabold leading-none text-white ${size}`} style={{ textShadow: `0 0 12px ${c}` }}>
          {glyph}
        </span>
      </span>
    );
  }
  const parts = glyph.split(" ");
  const shown = parts.length > 3 ? parts.slice(0, 2).join(" ") + "…" : glyph;
  const size = shown.length <= 2 ? "text-5xl" : shown.length <= 5 ? "text-3xl" : shown.length <= 9 ? "text-xl" : "text-base";
  return (
    <span className="grid h-full w-full place-items-center rounded-full px-1 text-center" style={{ background: GLYPH_BG[n % GLYPH_BG.length] }}>
      <span className={`font-display font-extrabold leading-none text-white drop-shadow ${size}`}>{shown}</span>
    </span>
  );
}

function LockVeil() {
  return (
    <span className="absolute inset-0 grid place-items-center bg-ink/35">
      <IconLock className="h-8 w-8 text-white" />
    </span>
  );
}

/** hạng thi đấu của môn + còn bao nhiêu bài nữa lên hạng (động lực đi hết lộ trình) */
function RankChip({ s }: { s: Subject }) {
  const { lesson, data } = useProgress();
  const r = rankInfo(s, lesson, data.unlocks);
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/90 py-1.5 pl-4 pr-2 font-display text-base font-extrabold shadow-[var(--shadow-pop)]">
      <Ico n="medal-1" /> Hạng {r.rank.name}
      {r.next ? (
        <span className="rounded-full bg-sun-soft px-3 py-1 text-sm font-bold text-ink">
          Còn {r.next.left} bài nữa lên {r.next.name}
        </span>
      ) : (
        <span className="rounded-full bg-mint-soft px-3 py-1 text-sm font-bold text-ink">Hạng cao nhất</span>
      )}
    </div>
  );
}
