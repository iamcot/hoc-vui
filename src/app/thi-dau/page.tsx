"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { SUBJECTS } from "@/content/subjects";
import { cleanCode, createRoom, ROOM_QUESTIONS, ROOM_SECONDS } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { Scene } from "@/components/Scene";
import Link from "next/link";

export default function ArenaPage() {
  return (
    <Suspense>
      <Arena />
    </Suspense>
  );
}

function Arena() {
  const router = useRouter();
  const params = useSearchParams();
  const ready = SUBJECTS.filter((s) => s.ready);
  const [subject, setSubject] = useState(params.get("mon") ?? ready[0].id);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const { session, online } = useProgress();

  async function create() {
    setBusy(true);
    setErr("");
    try {
      const room = await createRoom(subject);
      router.push(`/thi-dau/${room.code}?mon=${subject}`);
    } catch (e) {
      setErr("Chưa tạo được phòng, thử lại sau nhé.");
      console.error(e);
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Scene image="bg-arena" variant="arena" />
      <header className="space-y-3 pt-4 sm:pt-10">
        <h1 className="ribbon text-3xl sm:text-4xl" style={{ ["--ribbon" as string]: "var(--color-peach)" }}>
          ⚡ Đấu trường
        </h1>
        <p className="max-w-xl text-lg font-bold text-ink text-outline">
          {ROOM_QUESTIONS} câu, {ROOM_SECONDS / 60} phút. Cả phòng làm cùng một đề, ai đúng nhiều và nhanh hơn thì thắng.
        </p>
      </header>

      {!session && (
        <div className="card p-4 text-sm">
          {online ? (
            <>
              <b>Mẹo:</b>{" "}
              <Link href="/toi" className="font-bold text-sky underline">
                Đăng nhập
              </Link>{" "}
              để thấy điểm của bạn bè trong phòng và lên bảng xếp hạng. Chưa đăng nhập vẫn chơi được: cùng mã phòng thì cùng đề.
            </>
          ) : (
            <>Đang chạy chế độ khách: cùng mã phòng thì cùng đề, mỗi máy tự xem điểm của mình.</>
          )}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl font-extrabold">🏁 Tạo phòng mới</h2>
          <label className="block text-sm font-bold text-ink-soft">
            Môn
            <select value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-base font-bold text-ink">
              {ready.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.emoji} {s.name} · Lớp {s.grade}
                </option>
              ))}
            </select>
          </label>
          <button className="btn btn-primary w-full" onClick={create} disabled={busy}>
            {busy ? "Đang tạo..." : "Tạo phòng và lấy mã"}
          </button>
          {err && <p className="text-sm text-berry">{err}</p>}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card space-y-4 p-6">
          <h2 className="font-display text-2xl font-extrabold">🎟️ Vào phòng của bạn</h2>
          <input
            value={code}
            onChange={(e) => setCode(cleanCode(e.target.value))}
            placeholder="Nhập mã 6 ký tự"
            className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3 text-center font-mono text-3xl font-bold tracking-[0.3em] uppercase outline-none placeholder:font-sans placeholder:text-lg placeholder:normal-case placeholder:tracking-normal focus:border-sky"
          />
          <button className="btn btn-mint w-full" disabled={code.length !== 6} onClick={() => router.push(`/thi-dau/${code}?mon=${subject}`)}>
            Vào phòng ▶
          </button>
        </motion.div>
      </div>
    </div>
  );
}
