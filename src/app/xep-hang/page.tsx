"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SUBJECTS } from "@/content/subjects";
import { leaderboard, type Entry } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { Scene } from "@/components/Scene";
import { Mascot } from "@/components/Mascot";

export default function RankPage() {
  const { session, online, data } = useProgress();
  const [days, setDays] = useState<number | null>(7);
  const [subject, setSubject] = useState<string | null>(null);
  const [rows, setRows] = useState<Entry[] | null>(null);

  useEffect(() => {
    if (!session) return;
    leaderboard(subject, days).then(setRows);
  }, [session, subject, days]);

  const top = rows?.slice(0, 3) ?? [];
  const rest = rows?.slice(3) ?? [];

  return (
    <div className="space-y-6">
      <Scene image="bg-leaderboard" variant="night" />
      <header className="space-y-3 pt-4 sm:pt-10">
        <h1 className="ribbon text-3xl sm:text-4xl" style={{ ["--ribbon" as string]: "var(--color-sun)" }}>
          🏆 Bảng xếp hạng
        </h1>
        <p className="max-w-xl text-lg font-bold text-white drop-shadow">Điểm XP từ học bài, luyện tập, kiểm tra và thi đấu.</p>
      </header>

      {!session ? (
        <div className="card flex flex-col items-center gap-4 p-8 text-center">
          <Mascot mood="think" size={120} />
          <p className="max-w-md text-lg">
            Em đang có <b>{data.xp} XP</b>. {online ? "Đăng nhập để lên bảng xếp hạng cùng các bạn nhé!" : "Bảng xếp hạng cần kết nối máy chủ (Supabase), sẽ bật khi app được cài đặt đầy đủ."}
          </p>
          {online && (
            <Link href="/toi" className="btn btn-primary">
              Đăng nhập
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {[
              [7, "Tuần này"],
              [null, "Mọi lúc"],
            ].map(([d, label]) => (
              <button key={String(d)} onClick={() => setDays(d as number | null)} className={`chip px-4 py-2 ${days === d ? "bg-sky text-white" : "bg-white"}`}>
                {label}
              </button>
            ))}
            <span className="mx-1 w-px bg-line" />
            <button onClick={() => setSubject(null)} className={`chip px-4 py-2 ${subject === null ? "bg-mint text-white" : "bg-white"}`}>
              Tất cả môn
            </button>
            {SUBJECTS.filter((s) => s.ready).map((s) => (
              <button key={s.id} onClick={() => setSubject(s.id)} className={`chip px-4 py-2 ${subject === s.id ? "bg-mint text-white" : "bg-white"}`}>
                {s.emoji} {s.name}
              </button>
            ))}
          </div>

          {rows && rows.length === 0 && <p className="text-ink-soft">Chưa có ai trong khoảng thời gian này. Học một bài để mở màn nhé!</p>}

          {top.length > 0 && (
            <div className="grid grid-cols-3 items-end gap-3">
              {[top[1], top[0], top[2]].map((e, k) =>
                e ? (
                  <motion.div
                    key={e.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * k }}
                    className={`card flex flex-col items-center gap-2 p-4 text-center ${k === 1 ? "pb-8 pt-6" : ""} ${e.me ? "ring-2 ring-sky" : ""}`}
                  >
                    <span className="text-3xl">{["🥈", "🥇", "🥉"][k]}</span>
                    <Avatar id={e.avatar} size={k === 1 ? 72 : 56} />
                    <span className="w-full truncate font-bold">{e.display_name}</span>
                    <span className="font-display text-xl font-extrabold text-sky">{e.score} XP</span>
                  </motion.div>
                ) : (
                  <div key={k} />
                ),
              )}
            </div>
          )}

          {rest.length > 0 && (
            <ol className="card divide-y divide-line">
              {rest.map((e, k) => (
                <li key={e.user_id} className={`flex items-center gap-3 p-3 ${e.me ? "bg-sky-soft" : ""}`}>
                  <span className="w-8 text-center font-bold text-ink-soft">{k + 4}</span>
                  <Avatar id={e.avatar} size={40} />
                  <span className="flex-1 truncate font-bold">{e.display_name}</span>
                  <span className="font-display font-extrabold">{e.score} XP</span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  );
}
