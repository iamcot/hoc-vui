"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArena, IconLearn, IconMe, IconRank } from "./Icons";
import { useProgress } from "@/lib/store";
import { Avatar } from "./Avatar";
import { MusicDirector, MusicToggle } from "./Music";

const TABS = [
  { href: "/", label: "Học", Icon: IconLearn, match: (p: string) => p === "/" || p.startsWith("/hoc") },
  { href: "/thi-dau", label: "Thi đấu", Icon: IconArena, match: (p: string) => p.startsWith("/thi-dau") },
  { href: "/xep-hang", label: "Xếp hạng", Icon: IconRank, match: (p: string) => p.startsWith("/xep-hang") },
  { href: "/toi", label: "Của tôi", Icon: IconMe, match: (p: string) => p.startsWith("/toi") },
];

/** Màn hình tập trung (bài học, làm bài, phòng thi) ẩn thanh điều hướng */
const isFocus = (p: string) => /^\/hoc\/[^/]+\/.+/.test(p) || /^\/thi-dau\/[^/]+/.test(p);

const floatingMusic = (p: string) => p.startsWith("/go-phim/") || p.startsWith("/thi-dau/") || /^\/hoc\/go-phim\/[^/]+\/luyen-tap/.test(p);

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data, streak } = useProgress();
  if (isFocus(path))
    return (
      <div className="min-h-dvh">
        <MusicDirector />
        {children}
        {/* bài học và bài tập có nút nhạc trên thanh đầu; game, phòng thi dùng nút nổi */}
        {floatingMusic(path) && <MusicToggle dark className="fixed bottom-3 right-3 z-40 h-9 w-9" />}
      </div>
    );

  return (
    <div className="min-h-dvh md:flex">
      <MusicDirector />
      <MusicToggle className="fixed right-3 top-3 z-40 md:hidden" />
      {/* Thanh bên cho iPad ngang và laptop */}
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-2 bg-white/65 p-4 shadow-[8px_0_30px_-20px_rgba(40,40,120,0.4)] backdrop-blur-xl md:flex lg:w-64">
        <Link href="/" className="mb-2 block px-2" aria-label="Trang chủ">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo.webp" alt="SuGaMi" className="mx-auto h-auto w-40 drop-shadow-sm transition hover:scale-105 lg:w-44" />
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
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/70 p-3">
          <Avatar id={data.profile.avatar} size={40} />
          <div className="min-w-0 text-sm">
            <div className="truncate font-bold">{data.profile.name || "Bạn nhỏ"}</div>
            <div className="text-ink-soft">
              ⭐ {data.xp} XP · 🔥 {streak}
            </div>
          </div>
          <MusicToggle className="ml-auto shrink-0" />
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-4 sm:px-6 md:pb-10 md:pt-8 lg:px-10">{children}</main>

      {/* Tab dưới đáy cho màn hẹp */}
      <nav className="fixed inset-x-0 bottom-0 z-30 bg-white/85 shadow-[0_-8px_30px_-20px_rgba(40,40,120,0.4)] pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
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
