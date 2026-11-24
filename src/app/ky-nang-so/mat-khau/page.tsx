"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { PasswordLab } from "@/components/digital/PasswordLab";
import { Scene } from "@/components/Scene";
import { Mascot } from "@/components/Mascot";
import { IconClose } from "@/components/Icons";
import { MusicToggle } from "@/components/Music";
import { useProgress } from "@/lib/store";
import { play } from "@/lib/sound";

const DONE_KEY = "hocvui:kns-pw-missions";
const MISSIONS = [
  { id: "manh", text: "Tạo một mật khẩu đạt mức Mạnh", ok: (score: number) => score >= 3 },
  { id: "rat-manh", text: "Tạo một mật khẩu Rất mạnh", ok: (score: number) => score >= 4 },
  { id: "cum-tu", text: "Rất mạnh, chỉ dùng chữ và dấu gạch (không cần số, ký hiệu khó nhớ)", ok: (score: number, pw: string) => score >= 4 && /^[a-zA-Z-]+$/.test(pw) },
];

function loadDone(): string[] {
  try {
    return JSON.parse(localStorage.getItem(DONE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

/** Phòng thử mật khẩu: tự do gõ thử + 3 nhiệm vụ nhỏ (mỗi nhiệm vụ cộng XP một lần) */
export default function PasswordPage() {
  const { addXp } = useProgress();
  const [done, setDone] = useState<string[]>([]);
  useEffect(() => setDone(loadDone()), []);

  function onScore(score: number, pw: string) {
    const newly = MISSIONS.filter((m) => !done.includes(m.id) && m.ok(score, pw));
    if (!newly.length) return;
    const next = [...done, ...newly.map((m) => m.id)];
    setDone(next);
    try {
      localStorage.setItem(DONE_KEY, JSON.stringify(next));
    } catch {
      /* bỏ qua */
    }
    play("correct");
    addXp("ky-nang-so", 10 * newly.length, `mat-khau:${newly.map((m) => m.id).join(",")}`);
  }

  return (
    <div className="min-h-dvh">
      <Scene image="bg-lesson" variant="desk" dim />
      <header className="sticky top-0 z-20 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/hoc/ky-nang-so" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
            <IconClose className="h-5 w-5" />
          </Link>
          <h1 className="flex-1 font-display text-xl font-extrabold">🔐 Phòng thử mật khẩu</h1>
          <MusicToggle />
        </div>
      </header>
      <main className="mx-auto grid max-w-5xl gap-5 px-4 py-5 sm:px-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <PasswordLab onScore={onScore} />
        <div className="space-y-4">
          <div className="flex items-start gap-3 rounded-3xl bg-white/75 p-4">
            <Mascot mood="think" size={64} className="shrink-0" />
            <p className="text-[15px]">
              Kẻ gian dùng máy đoán <b>hàng tỉ</b> mật khẩu mỗi giây. Thử xem mật khẩu nào trụ được lâu nhất! Mẹo: ghép <b>4 từ</b> thành một câu chuyện nhỏ, như <b>Meo-An-Kem-Tren-Mai</b>.
            </p>
          </div>
          <div className="space-y-2 rounded-3xl bg-white/75 p-4">
            <div className="font-display text-lg font-extrabold">Nhiệm vụ</div>
            {MISSIONS.map((m) => {
              const ok = done.includes(m.id);
              return (
                <motion.div key={m.id} animate={ok ? { scale: [1, 1.04, 1] } : {}} className={`flex items-start gap-2 rounded-2xl px-3 py-2 ${ok ? "bg-mint-soft font-bold" : "bg-white/70"}`}>
                  <span>{ok ? "✅" : "🎯"}</span>
                  <span>{m.text}</span>
                  <span className="ml-auto shrink-0 text-sm text-ink-soft">+10 XP</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
