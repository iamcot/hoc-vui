"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BOARDS, board, type BoardId, type Period, type StarRow } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { Scene } from "@/components/Scene";
import { Ico } from "@/components/Ico";
import { IconBack } from "@/components/Icons";
import { NeedLogin, RankRow, daysToReset, periodSlug } from "../Rows";

export default function BoardPage() {
  return (
    <Suspense>
      <BoardView />
    </Suspense>
  );
}

/** Top 100 của một bảng (sao / sinh tồn / WPM), đổi qua lại tuần này và tổng */
function BoardView() {
  const id = String(useParams().bang ?? "") as BoardId;
  const b = BOARDS.find((x) => x.id === id) ?? BOARDS[0];
  const sp = useSearchParams();
  const router = useRouter();
  const period: Period = sp.get("ky") === "tong" ? "all" : "week";
  const { session } = useProgress();
  const [rows, setRows] = useState<StarRow[] | null>(null);

  useEffect(() => {
    if (!session) return;
    let live = true;
    setRows(null);
    board(b.id, period, 100).then((r) => live && setRows(r ?? []));
    return () => {
      live = false;
    };
  }, [session, b.id, period]);

  return (
    <div className="space-y-6">
      <Scene image="bg-leaderboard" variant="night" />
      <header className="flex flex-wrap items-center gap-3 pt-4 sm:pt-10">
        <Link href="/xep-hang" className="grid h-12 w-12 place-items-center rounded-full bg-white/90 shadow-[var(--shadow-pop)]" aria-label="Quay lại">
          <IconBack className="h-6 w-6" />
        </Link>
        <h1 className="ribbon text-2xl sm:text-3xl" style={{ ["--ribbon" as string]: "var(--color-sun)" }}>
          <Ico n={b.icon} /> {b.name}
        </h1>
      </header>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-white/90 p-1 shadow-[var(--shadow-pop)]" role="tablist">
          {(["week", "all"] as const).map((p) => (
            <button
              key={p}
              role="tab"
              aria-selected={p === period}
              onClick={() => router.replace(`/xep-hang/${b.id}?ky=${periodSlug(p)}`)}
              className={`rounded-full px-5 py-2 font-display text-base font-extrabold ${p === period ? "bg-sky text-white" : "text-ink"}`}
            >
              {p === "week" ? "Tuần này" : "Tổng"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {BOARDS.filter((x) => x.id !== b.id).map((x) => (
            <Link key={x.id} href={`/xep-hang/${x.id}?ky=${periodSlug(period)}`} className="rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-ink shadow-[var(--shadow-pop)] hover:bg-white">
              <Ico n={x.icon} /> {x.short}
            </Link>
          ))}
        </div>
      </div>
      <p className="w-fit rounded-2xl bg-white/85 px-4 py-2 text-sm font-bold text-ink-soft">
        {b.hint}. {period === "week" ? `Bảng tuần chốt lúc 0 giờ thứ Hai, còn ${daysToReset()} ngày nữa.` : "Tính từ trước tới nay."}
      </p>

      {!session ? (
        <NeedLogin />
      ) : !rows ? (
        <div className="card h-64 animate-pulse" />
      ) : rows.length === 0 ? (
        <p className="card p-6 text-ink-soft">Chưa có ai trong bảng này. Em lên bảng đầu tiên nhé!</p>
      ) : (
        <ol className="card space-y-1.5 p-3 sm:p-4">
          {rows.map((e) => (
            <RankRow key={e.user_id} e={e} board={b.id} big />
          ))}
        </ol>
      )}
    </div>
  );
}
