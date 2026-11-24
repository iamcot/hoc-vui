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
  const dark = /^\/(hoc\/)?go-phim/.test(path) || data.theme === "neon";
  const themeCls = data.theme === "neon" ? "theme-cyber" : "";
  if (isFocus(path))
    return (
      <div className={`min-h-dvh ${themeCls}`}>
        <MusicDirector />
        {children}
        {/* bài học và bài tập có nút nhạc trên thanh đầu; game, phòng thi dùng nút nổi */}
        {floatingMusic(path) && <MusicToggle dark className="fixed bottom-3 right-3 z-40 h-9 w-9" />}
      </div>
    );

  return (
    <div className={`min-h-dvh md:flex ${themeCls}`}>
      <MusicDirector />
      <MusicToggle className="fixed right-3 top-3 z-40 md:hidden" />
      {/* Thanh bên: mỗi mục là một cọc biển chỉ đường cắm trên cảnh nền */}
      <aside
        className={`sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-1 bg-gradient-to-r ${dark ? "from-[#030a24]/50 via-[#030a24]/20" : "from-white/45 via-white/20"} to-transparent p-4 md:flex lg:w-64`}
      >
        {/* biển tên treo trên đầu cọc, các biển mục đóng dọc theo cọc; cọc dừng ở biển cuối */}
        <div className="relative">
          <NavPole neon={data.theme === "neon"} />
          <Link href="/" className="relative z-10 mx-auto mb-5 block w-fit">
            <TitleBoard dark={dark} neon={data.theme === "neon"} />
          </Link>
          <nav className="relative z-10 flex flex-col gap-3 pb-6">
            {TABS.filter((t) => t.id !== "toi").map(({ href, id, label, Icon, match }, k) => (
              <NavSign key={href} href={href} id={id} label={label} Icon={Icon} on={match(path)} k={k} neon={data.theme === "neon"} />
            ))}
          </nav>
        </div>
        {/* thẻ của bé thay cho mục "Của tôi" */}
        <div
          className={`relative z-10 mt-auto flex items-center gap-2 rounded-2xl p-2 backdrop-blur transition ${path.startsWith("/toi") ? `${dark ? "bg-[#16225c]" : "bg-white"} shadow-[0_0_0_3px_var(--color-sun)]` : "bg-white/80"}`}
        >
          <Link href="/toi" className="flex min-w-0 flex-1 items-center gap-3 rounded-xl p-1 hover:bg-cream/20" aria-label="Của tôi">
            <Avatar id={data.profile.avatar} size={40} />
            <div className="min-w-0 text-sm">
              <div className="truncate font-bold">{data.profile.name || "Bạn nhỏ"}</div>
              <div className="text-ink-soft">
                <Ico n="star" /> {data.xp} XP · <Ico n="fire" /> {streak}
              </div>
            </div>
          </Link>
          <MusicToggle className="shrink-0" />
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

/** theme Neon dùng bộ biển riêng (<tên>-neon.webp) nếu đã có ảnh, chưa có thì dùng bộ gỗ */
function variant(file: string, neon: boolean) {
  const n = file.replace(/\.webp$/, "-neon.webp");
  return neon && hasFile(n) ? n : file;
}

/** cây cọc gỗ dọc: từ sau biển tên xuống tới dưới biển cuối (ảnh nav-pole lặp dọc); chưa có ảnh thì vẽ bằng CSS */
function NavPole({ neon }: { neon: boolean }) {
  const POLE = variant("/assets/img/nav-pole.webp", neon);
  const img = hasFile(POLE);
  return (
    <div
      className="pointer-events-none absolute bottom-0 left-[3.4rem] top-6 z-0 w-6 rounded-b-full"
      aria-hidden
      style={
        img
          ? { backgroundImage: `url(${resolveFile(POLE)})`, backgroundSize: "100% 100%", backgroundRepeat: "no-repeat" }
          : {
              background: "repeating-linear-gradient(180deg, transparent 0 46px, rgb(90 52 20 / 0.18) 46px 48px), linear-gradient(90deg, #7a4c22, #b98450 35%, #c99560 50%, #a06a35 75%, #6e431d)",
              boxShadow: "inset 0 0 0 1px rgb(70 40 15 / 0.45), 4px 0 10px -4px rgb(40 25 10 / 0.35)",
            }
      }
    />
  );
}

/** biển tên app trên đầu cọc: tấm ván (ảnh nav-title nếu có) với logo và chữ Học Vui */
function TitleBoard({ dark, neon }: { dark: boolean; neon: boolean }) {
  const TITLE = variant("/assets/img/nav-title.webp", neon);
  const neonImg = neon && TITLE.includes("-neon");
  const img = hasFile(TITLE);
  return (
    <div className={`relative flex items-center gap-2 ${neonImg ? "py-3.5 pl-6 pr-10" : img ? "py-3.5 pl-5 pr-7" : "py-2 pl-2 pr-4"} drop-shadow-[0_6px_6px_rgba(60,35,10,0.35)]`}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveFile(TITLE)} alt="" className={`absolute ${neonImg ? "-inset-x-[7%] -inset-y-[20%] h-[140%] w-[114%]" : "inset-0 h-full w-full"}`} />
      ) : (
        <span
          className={`absolute inset-0 rounded-[1.1rem] ${dark ? "bg-[linear-gradient(180deg,#e9c48c,#c9965a)]" : "bg-[linear-gradient(180deg,#f6d6a2,#dca869_60%,#c48a4c)]"} shadow-[inset_0_0_0_2px_rgb(120_75_35/0.55),inset_0_-4px_0_rgb(120_75_35/0.25)]`}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/assets/img/logo.webp" alt="" className="relative h-11 w-auto drop-shadow-sm" />
      <span className={`relative font-display text-2xl font-extrabold tracking-tight ${neonImg ? "text-[#eaf6ff] [text-shadow:0_0_10px_rgb(47_211_255/0.7)]" : "text-[#5a3418]"}`}>Học Vui</span>
    </div>
  );
}

/**
 * Một tấm biển gắn vào cây cọc: có ảnh nav-<id>.webp (tấm ván mũi tên, vẽ sẵn icon bên trái) thì cắt 9 mảnh, chữ nằm ở phần ván giữa;
 * chưa có ảnh thì vẽ tấm ván gỗ bằng CSS. Các biển so le nhẹ; mục đang mở nhấc lên, nghiêng thêm, phát sáng.
 */
function NavSign({ href, id, label, Icon, on, k, neon }: { href: string; id: string; label: string; Icon: (p: { className?: string }) => React.ReactNode; on: boolean; k: number; neon: boolean }) {
  const file = variant(`/assets/img/nav-${id}.webp`, neon);
  const neonImg = file.includes("-neon");
  const img = hasFile(file);
  const tilt = [-0.6, 0.5, -0.4, 0.6][k % 4];
  const shift = ["0.6rem", "1rem", "0.6rem", "1rem"][k % 4];
  const glow = on ? "drop-shadow-[0_0_14px_rgba(255,214,102,0.95)]" : "drop-shadow-[0_5px_5px_rgba(60,35,10,0.35)]";
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={`group relative z-10 block transition duration-300 ${on ? "-translate-y-1" : "hover:-translate-y-0.5"}`}
      style={{ marginLeft: shift, marginRight: `calc(1.4rem - ${shift})`, transform: `rotate(${on ? tilt * 2 : tilt}deg)`, transformOrigin: "3.4rem 50%" }}
    >
      {img ? (
        // 9-slice: giữ nguyên hình tròn (trái) và mũi tên (phải), chỉ kéo dài phần ván giữa -> biển thấp, dài, cân với biển tên
        <span
          className={`relative flex items-center justify-center whitespace-nowrap font-display text-lg font-extrabold ${neonImg ? "h-[86px] text-[#eaf6ff] [text-shadow:0_0_10px_rgb(47_211_255/0.7)]" : "h-[60px] text-[#5a3418] [text-shadow:0_1px_0_rgb(255_235_200/0.7)]"} ${glow}`}
          style={
            neonImg
              ? // ảnh neon có viền trong suốt ~15% quanh tấm biển: phóng to cho phần biển thấy được cao bằng biển gỗ (60px), lề âm bù viền
                {
                  borderStyle: "solid",
                  borderWidth: "0 60px 0 81px",
                  borderImage: `url(${resolveFile(file)}) 0 220 0 300 fill / 0 60px 0 81px stretch`,
                  margin: "-13px -13px -13px -13px",
                  paddingLeft: "0.25rem",
                }
              : { borderStyle: "solid", borderWidth: "0 26px 0 56px", borderImage: `url(${resolveFile(file)}) 0 140 0 300 fill / 0 26px 0 56px stretch`, paddingLeft: "0.25rem" }
          }
        >
          {label}
        </span>
      ) : (
        <span className={`relative flex h-[54px] items-center gap-2.5 pl-3 pr-9 font-display text-lg font-extrabold text-[#5a3418] ${glow}`}>
          <span
            className="absolute inset-0"
            style={{
              clipPath: "polygon(0 6%, 86% 0, 100% 50%, 86% 100%, 0 94%)",
              background: on ? "linear-gradient(180deg,#ffe2a8,#f2b866 55%,#d9933f)" : "linear-gradient(180deg,#f3cf98,#dca869 55%,#c48a4c)",
            }}
          />
          <span className="absolute inset-x-2 top-[48%] h-px bg-[#a86f35]/40" />
          {/* đinh đóng vào cọc */}
          <span className="absolute left-[2.6rem] top-1.5 h-1.5 w-1.5 rounded-full bg-[#5a3418]/70" />
          <span className="absolute bottom-1.5 left-[2.6rem] h-1.5 w-1.5 rounded-full bg-[#5a3418]/70" />
          <span className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#fff5e2] text-[#c0622f] shadow-[inset_0_0_0_2px_#a86f35]">
            <Icon className="h-5 w-5" />
          </span>
          <span className="relative pl-3">{label}</span>
        </span>
      )}
    </Link>
  );
}
