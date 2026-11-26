"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { useProgress } from "@/lib/store";
import { type BoardId, type StarRow, BOARDS } from "@/lib/arena";
import { Avatar } from "@/components/Avatar";
import { Mascot } from "@/components/Mascot";
import { Ico, type IcoId } from "@/components/Ico";

/** số ngày còn lại tới 0 giờ thứ Hai (giờ Việt Nam) */
export function daysToReset() {
  const vn = new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60000);
  const dow = (vn.getDay() + 6) % 7; // thứ Hai = 0
  return 7 - dow;
}

export const periodSlug = (p: "week" | "all") => (p === "week" ? "tuan" : "tong");

/** một dòng xếp hạng: hạng (huy chương cho top 3), ảnh, tên, giá trị */
export function RankRow({ e, board, big = false }: { e: StarRow; board: BoardId; big?: boolean }) {
  const b = BOARDS.find((x) => x.id === board)!;
  return (
    <li className={`flex items-center rounded-2xl ${big ? "gap-3 px-3 py-1.5" : "gap-2 px-2 py-1.5 lg:gap-3 lg:px-3"} ${e.me ? "bg-sky-soft ring-2 ring-sky" : "bg-cream"}`}>
      <span className={`shrink-0 text-center font-display font-extrabold text-ink-soft ${big ? "w-8 text-lg" : "w-6 text-base lg:w-8"}`}>{e.pos <= 3 ? <Ico n={`medal-${e.pos}` as IcoId} /> : e.pos}</span>
      <Avatar id={e.avatar} size={big ? 36 : 30} />
      <span className="min-w-0 flex-1 truncate font-bold">
        {e.display_name}
        {e.me && <span className="ml-1 text-xs font-extrabold text-sky">(em)</span>}
      </span>
      <span className={`shrink-0 font-display font-extrabold ${big ? "text-lg" : "text-base lg:text-lg"}`}>
        {e.stars.toLocaleString("vi-VN")}
        {b.id === "sao" ? (
          <>
            {" "}
            <Ico n="star" />
          </>
        ) : (
          <span className={`ml-1 text-xs font-bold text-ink-soft ${big ? "" : "hidden xl:inline"}`}>{b.unit}</span>
        )}
      </span>
    </li>
  );
}

/** khối top 3 của một bảng, kèm dòng của em nếu ngoài top, và link xem top 100 */
export function TopBlock({ board, period, rows, delay = 0 }: { board: BoardId; period: "week" | "all"; rows: StarRow[] | undefined; delay?: number }) {
  const b = BOARDS.find((x) => x.id === board)!;
  const top = rows?.filter((r) => r.pos <= 3).slice(0, 3) ?? [];
  const me = rows?.find((r) => r.me && !top.includes(r));
  return (
    <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card space-y-3 p-3 lg:p-4">
      <div className="flex items-start gap-2">
        <span className="text-2xl leading-none">
          <Ico n={b.icon} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-extrabold leading-tight">{b.name}</h3>
          <p className="text-xs font-semibold text-ink-soft">{b.hint}</p>
        </div>
      </div>
      {!rows ? (
        <div className="h-28 animate-pulse rounded-2xl bg-cream" />
      ) : top.length === 0 ? (
        <p className="rounded-2xl bg-cream p-3 text-sm text-ink-soft">Chưa có ai. Em lên bảng đầu tiên nhé!</p>
      ) : (
        <ol className="space-y-1.5">
          {top.map((e) => (
            <RankRow key={e.user_id} e={e} board={board} />
          ))}
          {me && (
            <>
              <li className="text-center text-xs font-bold text-ink-soft" aria-hidden>
                ⋯
              </li>
              <RankRow e={me} board={board} />
            </>
          )}
        </ol>
      )}
      <Link href={`/xep-hang/${board}?ky=${periodSlug(period)}`} className="flex items-center justify-center gap-1 rounded-2xl bg-sky/10 py-2 text-sm font-extrabold text-sky transition hover:bg-sky/20">
        Xem top 100 ▶
      </Link>
    </motion.section>
  );
}

/** chưa đăng nhập / chưa có máy chủ */
export function NeedLogin() {
  const { online, data } = useProgress();
  return (
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
  );
}
