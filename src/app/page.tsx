"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { SUBJECTS, tierLessons } from "@/content/subjects";
import { currentTierIndex } from "@/lib/tiers";
import { useProgress } from "@/lib/store";
import { Mascot } from "@/components/Mascot";
import { Art } from "@/components/Art";
import { Scene } from "@/components/Scene";

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
}

export default function Home() {
  const { data, lesson, streak, ready } = useProgress();
  const live = SUBJECTS.filter((s) => s.ready);
  const soon = SUBJECTS.filter((s) => !s.ready);
  const main = live[0];
  const tier = main.tiers[currentTierIndex(main, lesson, data.unlocks)];
  const lessons = tierLessons(tier);
  const next = lessons.find((l) => lesson(main.id, l.id).stars === 0) ?? lessons[0];
  const doneCount = lessons.filter((l) => lesson(main.id, l.id).stars > 0).length;

  return (
    <div className="space-y-10">
      <Scene image="bg-home" variant="meadow" />

      <header className="flex flex-wrap items-end gap-4">
        <Mascot mood="happy" size={110} className="floaty drop-shadow-lg" />
        <div className="bubble mb-4">
          <p className="text-ink-soft">{greeting()},</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{ready && data.profile.name ? data.profile.name : "bạn nhỏ"}! Hôm nay học gì nào?</h1>
        </div>
        <div className="mb-4 ml-auto flex gap-3">
          <Stat value={data.xp} label="XP" icon="⭐" cls="bg-sun text-ink" />
          <Stat value={streak} label="ngày" icon="🔥" cls="bg-peach text-white" />
        </div>
      </header>

      {/* Ảnh lớn "học tiếp": chữ đè lên tranh, không có khung thẻ */}
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
        <Link href={`/hoc/${main.id}/${next.id}`} className="group relative block overflow-hidden rounded-[2.5rem] shadow-[0_24px_50px_-24px_rgba(40,40,120,0.55)]">
          <Art id={next.cover} emoji={next.emoji} rounded="" className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.03] sm:aspect-[16/9] lg:aspect-[21/9]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f2350]/95 via-[#1f2350]/55 via-45% to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end gap-4 p-5 text-white sm:p-8">
            <div className="min-w-0 flex-1 space-y-2">
              <span className="ribbon text-sm" style={{ ["--ribbon" as string]: "var(--color-peach)" }}>
                Học tiếp · {tier.name} · Bài {lessons.indexOf(next) + 1}
              </span>
              <h2 className="font-display text-3xl font-extrabold drop-shadow sm:text-5xl">{next.title}</h2>
              <p className="text-white/85 sm:text-lg">{next.short}</p>
              <div className="flex max-w-sm items-center gap-3 pt-1">
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/30">
                  <div className="h-full rounded-full bg-sun" style={{ width: `${(doneCount / lessons.length) * 100}%` }} />
                </div>
                <span className="text-sm font-bold">
                  {doneCount}/{lessons.length} bài {tier.name.toLowerCase()}
                </span>
              </div>
            </div>
            <span className="btn btn-primary text-lg">Vào học ▶</span>
          </div>
        </Link>
      </motion.section>

      <section className="space-y-5">
        <h2 className="ribbon text-xl" style={{ ["--ribbon" as string]: "var(--color-mint)" }}>
          Các môn học
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((s, k) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * k }}>
              <Link href={`/hoc/${s.id}`} className="group relative block overflow-hidden rounded-[2rem] shadow-[0_18px_40px_-22px_rgba(40,40,120,0.6)]">
                <Art id={s.cover} emoji={s.emoji} rounded="" className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-sky">{s.levelsLabel}</span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <h3 className="font-display text-2xl font-extrabold drop-shadow">{s.name}</h3>
                  <p className="text-sm text-white/90">{s.tagline}</p>
                </div>
              </Link>
            </motion.div>
          ))}
          {soon.map((s, k) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (k + live.length) }}
              className="relative overflow-hidden rounded-[2rem]"
            >
              <Art id="subject-soon" emoji={s.emoji} rounded="" className="aspect-[4/3] w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <span className="absolute right-4 top-4 rounded-full bg-sun px-3 py-1 text-xs font-extrabold text-ink">Sắp ra mắt</span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="font-display text-2xl font-extrabold drop-shadow">
                  {s.emoji} {s.name} · {s.levelsLabel}
                </h3>
                <p className="text-sm text-white/90">{s.tagline}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, icon, cls }: { value: number; label: string; icon: string; cls: string }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-full px-4 py-2 font-display text-lg font-extrabold shadow-[var(--shadow-pop)] ${cls}`}>
      {icon} {value} <span className="text-sm font-bold opacity-80">{label}</span>
    </div>
  );
}
