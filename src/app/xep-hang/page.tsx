"use client";
import { useEffect, useState } from "react";
import { BOARDS, board, type BoardId, type Period, type StarRow } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { Scene } from "@/components/Scene";
import { Ico } from "@/components/Ico";
import { NeedLogin, TopBlock, daysToReset } from "./Rows";

const PERIODS: { id: Period; name: string }[] = [
  { id: "week", name: "Tuần này" },
  { id: "all", name: "Tổng" },
];

/**
 * Bảng xếp hạng: hai cột (tuần này, tổng). Mỗi cột có top 3 sao, top 3 điểm Sinh tồn, top 3 WPM gõ đoạn văn;
 * mỗi khối có link xem top 100.
 */
export default function RankPage() {
  const { session } = useProgress();
  const [rows, setRows] = useState<Partial<Record<`${Period}:${BoardId}`, StarRow[]>>>({});

  useEffect(() => {
    if (!session) return;
    let live = true;
    for (const p of PERIODS)
      for (const b of BOARDS)
        board(b.id, p.id, 10).then((r) => {
          if (live) setRows((x) => ({ ...x, [`${p.id}:${b.id}`]: r ?? [] }));
        });
    return () => {
      live = false;
    };
  }, [session]);

  return (
    <div className="space-y-6">
      <Scene image="bg-leaderboard" variant="night" />
      <header className="space-y-3 pt-4 sm:pt-10">
        <h1 className="ribbon text-3xl sm:text-4xl" style={{ ["--ribbon" as string]: "var(--color-sun)" }}>
          <Ico n="trophy" /> Bảng xếp hạng
        </h1>
        <p className="w-fit max-w-xl rounded-2xl bg-white/85 px-4 py-2 font-bold text-ink shadow-[var(--shadow-pop)]">
          Có hai loại: <b>sao</b> kiếm được ở mọi môn, và <b>kỷ lục</b> riêng của từng môn. Bảng tuần chốt lúc 0 giờ thứ Hai, còn {daysToReset()} ngày nữa.
        </p>
        <p className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-1.5 text-sm font-extrabold text-ink">
          <Ico n="medal-1" /> Phần thưởng do SuGaMi trao tặng cho các bạn đứng đầu bảng tuần
        </p>
      </header>

      {!session ? (
        <NeedLogin />
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {PERIODS.map((p, pi) => (
            <div key={p.id} className="space-y-4">
              <h2 className="ribbon text-xl" style={{ ["--ribbon" as string]: p.id === "week" ? "var(--color-sky)" : "var(--color-lilac)" }}>
                {p.name}
              </h2>
              {BOARDS.map((b, bi) => (
                <TopBlock key={b.id} board={b.id} period={p.id} rows={rows[`${p.id}:${b.id}`]} delay={0.05 * (pi * 3 + bi)} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
