"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { SUBJECTS, allLessons } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { Mascot } from "@/components/Mascot";
import { Art } from "@/components/Art";

function greeting() {
  const h = new Date().getHours();
  return h < 11 ? "Chào buổi sáng" : h < 14 ? "Chào buổi trưa" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối";
}

export default function Home() {
  const { data, lesson, streak, ready } = useProgress();
  const ready1 = SUBJECTS.filter((s) => s.ready);
  const soon = SUBJECTS.filter((s) => !s.ready);
  const main = ready1[0];
  const lessons = allLessons(main);
  const next = lessons.find((l) => !lesson(main.id, l.id).read || lesson(main.id, l.id).stars === 0) ?? lessons[0];
  const doneCount = lessons.filter((l) => lesson(main.id, l.id).stars > 0).length;

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <Mascot mood="happy" size={84} className="floaty" />
        <div>
          <p className="text-ink-soft">{greeting()},</p>
          <h1 className="font-display text-3xl font-extrabold sm:text-4xl">{ready && data.profile.name ? data.profile.name : "bạn nhỏ"} 👋</h1>
        </div>
        <div className="ml-auto hidden gap-3 sm:flex">
          <Stat label="XP" value={data.xp} icon="⭐" tone="bg-sun-soft" />
          <Stat label="ngày liên tiếp" value={streak} icon="🔥" tone="bg-peach-soft" />
        </div>
      </header>

      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card grid gap-0 overflow-hidden sm:grid-cols-[1.1fr_1fr]">
        <Art id={next.cover} emoji={next.emoji} rounded="" className="aspect-[3/2] w-full sm:aspect-auto sm:h-full" />
        <div className="flex flex-col gap-3 p-5 sm:p-7">
          <span className="chip w-fit bg-sky-soft text-sky">
            {main.emoji} {main.name} · Lớp {main.grade}
          </span>
          <h2 className="font-display text-2xl font-extrabold">Học tiếp: {next.title}</h2>
          <p className="text-ink-soft">{next.short}</p>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${(doneCount / lessons.length) * 100}%` }} />
          </div>
          <p className="text-sm text-ink-soft">
            Đã xong {doneCount}/{lessons.length} bài
          </p>
          <div className="mt-auto flex flex-wrap gap-3 pt-2">
            <Link href={`/hoc/${main.id}/${next.id}`} className="btn btn-primary">
              Vào học ▶
            </Link>
            <Link href={`/hoc/${main.id}`} className="btn btn-ghost">
              Xem bản đồ
            </Link>
          </div>
        </div>
      </motion.section>

      <section className="space-y-4">
        <h2 className="font-display text-2xl font-extrabold">Môn học</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ready1.map((s) => (
            <Link key={s.id} href={`/hoc/${s.id}`} className="card group overflow-hidden transition hover:-translate-y-1">
              <Art id={s.cover} emoji={s.emoji} rounded="" className="aspect-[16/9] w-full" />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-extrabold">{s.name}</h3>
                  <span className="chip bg-mint-soft text-mint">Lớp {s.grade}</span>
                </div>
                <p className="text-sm text-ink-soft">{s.tagline}</p>
              </div>
            </Link>
          ))}
          {soon.map((s) => (
            <div key={s.id} className="card relative overflow-hidden opacity-80">
              <div className="grid aspect-[16/9] w-full place-items-center text-6xl" style={{ background: `${s.color}33` }}>
                <span className="floaty">{s.emoji}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl font-extrabold">{s.name}</h3>
                  <span className="chip bg-line text-ink-soft">Lớp {s.grade}</span>
                </div>
                <p className="text-sm text-ink-soft">{s.tagline}</p>
              </div>
              <span className="chip absolute right-3 top-3 bg-white/90 text-ink-soft">Sắp ra mắt</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon, tone }: { label: string; value: number; icon: string; tone: string }) {
  return (
    <div className={`rounded-2xl px-4 py-2 text-center ${tone}`}>
      <div className="font-display text-xl font-extrabold">
        {icon} {value}
      </div>
      <div className="text-xs text-ink-soft">{label}</div>
    </div>
  );
}
