"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconArena, IconLearn, IconMe, IconRank } from "./Icons";
import { useProgress } from "@/lib/store";
import { Avatar } from "./Avatar";
import { MusicDirector, MusicToggle } from "./Music";
import { Ico } from "./Ico";
import { hasFile, resolveFile } from "@/content/assets";

const TABS = [
  { href: "/", id: "hoc", label: "Học", Icon: IconLearn, match: (p: string) => p === "/" || p.startsWith("/hoc") },
  { href: "/thi-dau", id: "thi-dau", label: "Thi đấu", Icon: IconArena, match: (p: string) => p.startsWith("/thi-dau") },
  { href: "/xep-hang", id: "xep-hang", label: "Xếp hạng", Icon: IconRank, match: (p: string) => p.startsWith("/xep-hang") },
  { href: "/toi", id: "toi", label: "Của tôi", Icon: IconMe, match: (p: string) => p.startsWith("/toi") },
];

/** Màn hình tập trung (bài học, làm bài, phòng thi) ẩn thanh điều hướng */
const isFocus = (p: string) => /^\/hoc\/[^/]+\/.+/.test(p) || /^\/thi-dau\/[^/]+/.test(p);

const floatingMusic = (p: string) => p.startsWith("/go-phim/") || p.startsWith("/thi-dau/") || /^\/hoc\/go-phim\/[^/]+\/luyen-tap/.test(p);

export function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { data, streak } = useProgress();
  // các trang môn Gõ phím có nền biển tối
  const dark = /^\/(hoc\/)?go-phim/.test(path);
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
      {/* Thanh bên: mỗi mục là một cọc biển chỉ đường cắm trên cảnh nền */}
      <aside className={`sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-1 bg-gradient-to-r ${dark ? "from-[#030a24]/50 via-[#030a24]/20" : "from-white/45 via-white/20"} to-transparent p-4 md:flex lg:w-64`}>
        <Link href="/" className="mb-4 flex items-center gap-2 px-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo.webp" alt="" className="h-12 w-auto drop-shadow-sm" />
          <span className={`font-display text-2xl font-extrabold tracking-tight ${dark ? "text-white drop-shadow" : ""}`}>Học Vui</span>
        </Link>
        <nav className="flex flex-col">
          {TABS.map(({ href, id, label, Icon, match }, k) => (
            <NavSign key={href} href={href} id={id} label={label} Icon={Icon} on={match(path)} k={k} />
          ))}
        </nav>
        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-white/70 p-3">
          <Avatar id={data.profile.avatar} size={40} />
          <div className="min-w-0 text-sm">
            <div className="truncate font-bold">{data.profile.name || "Bạn nhỏ"}</div>
            <div className="text-ink-soft">
              <Ico n="star" /> {data.xp} XP · <Ico n="fire" /> {streak}
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

/**
 * Một cọc biển chỉ đường: có ảnh nav-<id>.webp (tấm ván mũi tên trên cọc, vẽ sẵn icon bên trái) thì chữ đè lên phần ván trống;
 * chưa có ảnh thì vẽ tấm ván gỗ bằng CSS. Mục đang mở: biển nhấc lên, nghiêng nhẹ, phát sáng.
 */
function NavSign({ href, id, label, Icon, on, k }: { href: string; id: string; label: string; Icon: (p: { className?: string }) => React.ReactNode; on: boolean; k: number }) {
  const file = `/assets/img/nav-${id}.webp`;
  const img = hasFile(file);
  const tilt = k % 2 ? 2 : -2;
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`group relative block transition duration-300 ${k % 2 ? "ml-5 mr-0" : "ml-0 mr-5"} ${on ? "-translate-y-1" : "hover:-translate-y-0.5"}`}
      style={{ transform: `rotate(${on ? tilt * 1.5 : tilt * 0.5}deg)` }}
    >
      {img ? (
        <div className={`relative aspect-[3/2] w-full ${on ? "drop-shadow-[0_0_14px_rgba(255,214,102,0.95)]" : "drop-shadow-md"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveFile(file)} alt="" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
          <span className="absolute left-[36%] right-[14%] top-[17%] flex h-[34%] items-center font-display text-xl font-extrabold text-[#5a3418] lg:text-2xl">{label}</span>
        </div>
      ) : (
        <div className="relative h-[92px]">
          {/* cọc gỗ */}
          <span className="absolute bottom-0 left-[22%] top-6 w-3 rounded-b-sm bg-gradient-to-r from-[#8a5a2b] via-[#b07a43] to-[#7a4c22] shadow-[inset_0_0_0_1px_rgba(70,40,15,0.5)]" />
          <span className="absolute bottom-0 left-[14%] h-3 w-12 rounded-full bg-[#6cc47f]/80 blur-[1px]" />
          {/* tấm ván mũi tên */}
          <span
            className={`absolute left-0 right-0 top-1 flex h-[52px] items-center gap-2.5 pl-4 pr-8 font-display text-lg font-extrabold text-[#5a3418] ${on ? "drop-shadow-[0_0_12px_rgba(255,214,102,0.95)]" : "drop-shadow-[0_4px_4px_rgba(60,35,10,0.35)]"}`}
          >
            <span
              className="absolute inset-0 -z-0"
              style={{
                clipPath: "polygon(0 8%, 84% 0, 100% 50%, 84% 100%, 0 92%)",
                background: on ? "linear-gradient(180deg,#ffe2a8,#f2b866 55%,#d9933f)" : "linear-gradient(180deg,#f3cf98,#dca869 55%,#c48a4c)",
              }}
            />
            <span className="absolute inset-x-2 top-[46%] -z-0 h-px bg-[#a86f35]/40" />
            <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fff5e2] text-[#c0622f] shadow-[inset_0_0_0_2px_#a86f35]">
              <Icon className="h-5 w-5" />
            </span>
            <span className="relative">{label}</span>
          </span>
        </div>
      )}
    </Link>
  );
}
