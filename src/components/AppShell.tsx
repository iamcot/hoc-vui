"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArena, IconLearn, IconMe, IconRank } from "./Icons";
import { useProgress } from "@/lib/store";
import { Avatar } from "./Avatar";

const TABS = [
  { href: "/", label: "Học", Icon: IconLearn, match: (p: string) => p === "/" || p.startsWith("/hoc") },
  { href: "/thi-dau", label: "Thi đấu", Icon: IconArena, match: (p: string) => p.startsWith("/thi-dau") },
  { href: "/xep-hang", label: "Xếp hạng", Icon: IconRank, match: (p: string) => p.startsWith("/xep-hang") },
  { href: "/toi", label: "Của tôi", Icon: IconMe, match: (p: string) => p.startsWith("/toi") },
];

/** Màn hình tập trung (bài học, làm bài, phòng thi) ẩn thanh điều hướng */
const isFocus = (p: string) => /^\/hoc\/[^/]+\/.+/.test(p) || /^\/thi-dau\/[^/]+/.test(p);

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data, streak } = useProgress();
  if (isFocus(path)) return <div className="min-h-dvh">{children}</div>;

  return (
    <div className="min-h-dvh md:flex">
      {/* Thanh bên cho iPad ngang và laptop */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-2 border-r border-line bg-white/70 p-4 backdrop-blur md:flex lg:w-64">
        <Link href="/" className="mb-4 flex items-center gap-2 px-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-sky text-xl text-white shadow-[var(--shadow-pop)]">✦</span>
          <span className="font-display text-2xl font-extrabold tracking-tight">Học Vui</span>
        </Link>
        {TABS.map(({ href, label, Icon, match }) => {
          const on = match(path);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-2xl px-3 py-3 font-display text-lg font-bold transition ${on ? "bg-sky-soft text-sky" : "text-ink-soft hover:bg-cream"}`}
            >
              <Icon className="h-6 w-6" />
              {label}
            </Link>
          );
        })}
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-cream p-3">
          <Avatar id={data.profile.avatar} size={40} />
          <div className="min-w-0 text-sm">
            <div className="truncate font-bold">{data.profile.name || "Bạn nhỏ"}</div>
            <div className="text-ink-soft">
              ⭐ {data.xp} XP · 🔥 {streak}
            </div>
          </div>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-4 sm:px-6 md:pb-10 md:pt-8 lg:px-10">{children}</main>

      {/* Tab dưới đáy cho màn hẹp */}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4">
          {TABS.map(({ href, label, Icon, match }) => {
            const on = match(path);
            return (
              <Link key={href} href={href} className={`flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold ${on ? "text-sky" : "text-ink-soft"}`}>
                <span className={`grid h-8 w-12 place-items-center rounded-full transition ${on ? "bg-sky-soft" : ""}`}>
                  <Icon className="h-6 w-6" />
                </span>
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
