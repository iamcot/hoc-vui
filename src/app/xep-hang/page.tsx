"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { SUBJECTS } from "@/content/subjects";
import { starBoard, type StarRow } from "@/lib/arena";
import { RANKS } from "@/lib/ranks";
import { useProgress } from "@/lib/store";
import { Avatar } from "@/components/Avatar";
import { Scene } from "@/components/Scene";
import { Mascot } from "@/components/Mascot";
import { Ico } from "@/components/Ico";
import { Pick } from "@/components/Pick";

type Period = "week" | "month" | "all";

/** số ngày còn lại tới 0 giờ thứ Hai (giờ Việt Nam) */
function daysToReset() {
  const vn = new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000);
  const dow = (vn.getDay() + 6) % 7; // thứ Hai = 0
  return 7 - dow;
}

export default function RankPage() {
  const { session, online, data } = useProgress();
  const [period, setPeriod] = useState<Period>("week");
  const [kind, setKind] = useState<"stars" | "progress">("stars");
  const [subject, setSubject] = useState<string | null>(null);
  const [rank, setRank] = useState<string | null>(null);
  const [rows, setRows] = useState<StarRow[] | null>(null);

  useEffect(() => {
    if (!session) return;
    let live = true;
    starBoard({ period, subject, rank: subject ? rank : null, kind }).then((r) => live && setRows(r));
    return () => {
      live = false;
    };
  }, [session, period, subject, rank, kind]);

  const top = rows?.filter((r) => r.pos <= 3).slice(0, 3) ?? [];
  const rest = rows?.filter((r) => !top.includes(r)) ?? [];
  const unit = kind === "progress" ? "bài" : "";

  return (
    <div className="space-y-6">
      <Scene image="bg-leaderboard" variant="night" />
      <header className="space-y-3 pt-4 sm:pt-10">
        <h1 className="ribbon text-3xl sm:text-4xl" style={{ ["--ribbon" as string]: "var(--color-sun)" }}>
          <Ico n="trophy" /> Bảng xếp hạng
        </h1>
        <p className="max-w-xl text-lg font-bold text-white drop-shadow">Sao có từ học bài, luyện tập, kiểm tra và thi đấu. Bảng tuần chốt lúc 0 giờ thứ Hai, còn {daysToReset()} ngày nữa.</p>
        <p className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-1.5 text-sm font-extrabold text-[#252845]">
          <Ico n="medal-1" /> Phần thưởng do SuGaMi trao tặng cho các bạn đứng đầu bảng tuần và tháng
        </p>
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
          {/* một hàng bộ lọc, mỗi bộ lọc là một dropdown */}
          <div className="flex flex-wrap items-center gap-3">
            <Pick label="Kỳ" value={period} onChange={(v) => setPeriod(v as Period)} options={[["week", "Tuần này"], ["month", "Tháng này"], ["all", "Mọi lúc"]]} />
            <Pick label="Bảng" value={kind} onChange={(v) => setKind(v as "stars" | "progress")} options={[["stars", "Nhiều sao nhất"], ["progress", "Tiến bộ nhiều nhất"]]} />
            <Pick
              label="Môn"
              value={subject ?? ""}
              onChange={(v) => {
                setSubject(v || null);
                setRank(null);
              }}
              options={[["", "Tất cả môn"], ...SUBJECTS.filter((s) => s.ready).map((s) => [s.id, s.name] as [string, string])]}
            />
            {subject && kind === "stars" && <Pick label="Hạng" value={rank ?? ""} onChange={(v) => setRank(v || null)} options={[["", "Mọi hạng"], ...RANKS.map((r) => [r.id, r.name] as [string, string])]} />}
          </div>

          {rows && rows.length === 0 && <p className="text-ink-soft">Chưa có ai trong bảng này. Học một bài để mở màn nhé!</p>}

          {top.length > 0 && (
            <div className="grid grid-cols-3 items-end gap-3">
              {[top.find((r) => r.pos === 2) ?? top[1], top[0], top.find((r) => r.pos === 3) ?? top[2]].map((e, k) =>
                e ? (
                  <motion.div
                    key={e.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * k }}
                    className={`card flex flex-col items-center gap-2 p-4 text-center ${k === 1 ? "pb-8 pt-6" : ""} ${e.me ? "ring-2 ring-sky" : ""}`}
                  >
                    <span className="text-3xl"><Ico n={(["medal-2", "medal-1", "medal-3"] as const)[k]} /></span>
                    <Avatar id={e.avatar} size={k === 1 ? 72 : 56} />
                    <span className="w-full truncate font-bold">{e.display_name}</span>
                    <span className="font-display text-xl font-extrabold text-sky">
                      {e.stars} {unit || <Ico n="star" />}
                    </span>
                  </motion.div>
                ) : (
                  <div key={k} />
                ),
              )}
            </div>
          )}

          {rest.length > 0 && (
            <ol className="card divide-y divide-line">
              {rest.map((e) => (
                <li key={e.user_id} className={`flex items-center gap-3 p-3 ${e.me ? "bg-sky-soft" : ""}`}>
                  <span className="w-10 text-center font-bold text-ink-soft">{e.pos}</span>
                  <Avatar id={e.avatar} size={40} />
                  <span className="flex-1 truncate font-bold">{e.display_name}</span>
                  <span className="font-display font-extrabold">
                    {e.stars} {unit || <Ico n="star" />}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </>
      )}
    </div>
  );
}
