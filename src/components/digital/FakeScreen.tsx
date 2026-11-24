"use client";
import type React from "react";
import { motion } from "motion/react";
import type { FakeScreen as Screen, ScreenLine } from "@/content/types";
import { FLAG_RE, screenFields } from "@/lib/flags";

/**
 * Màn hình giả của môn Kỹ năng số, vẽ hoàn toàn bằng code (không cần ảnh):
 * tin nhắn, SMS, email, trình duyệt, bài đăng mạng xã hội, cuộc gọi đến, cửa sổ game.
 *
 * Đoạn [[chữ|giải thích]] trong chữ là một dấu hiệu đáng ngờ.
 *  - mode "plain": hiện như chữ thường
 *  - mode "spot": chạm để tìm (đã tìm thì tô vàng)
 *  - mode "reveal": tô đỏ mọi dấu hiệu (sau khi bé trả lời)
 * Màu viết cứng bằng mã hex để màn hình giả trông như điện thoại thật ở cả theme Mochi lẫn Neon.
 */

export { flagsOf, plainText, type Flag } from "@/lib/flags";
const RE = FLAG_RE;
const fields = screenFields;

interface Ctx {
  mode: "plain" | "spot" | "reveal";
  found?: Set<number>;
  onFlag?: (i: number) => void;
  /** số thứ tự của dấu hiệu đầu tiên trong từng chuỗi (theo khóa chuỗi) */
  at: Map<string, number>;
}

function T({ s, c, k }: { s: string; c: Ctx; k: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  let idx = (c.at.get(k) ?? 0) - 1;
  for (const m of s.matchAll(RE)) {
    idx++;
    if (m.index! > last) parts.push(s.slice(last, m.index));
    const hit = c.found?.has(idx);
    if (c.mode === "plain") parts.push(m[1]);
    else if (c.mode === "reveal")
      parts.push(
        <mark key={idx} className="rounded bg-[#ffd6de] px-0.5 text-[#b0123f] underline decoration-[#ff4f7b] decoration-wavy underline-offset-2">
          {m[1]}
        </mark>,
      );
    else
      parts.push(
        <span
          key={idx}
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            c.onFlag?.(idx);
          }}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && c.onFlag?.(idx)}
          className={`cursor-pointer rounded px-0.5 transition [box-decoration-break:clone] ${hit ? "bg-[#ffe27a] text-[#5b3b00] ring-2 ring-[#ffb81f]" : "hover:bg-[#eef2ff]"}`}
        >
          {m[1]}
        </span>,
      );
    last = m.index! + m[0].length;
  }
  if (last < s.length) parts.push(s.slice(last));
  return <>{parts}</>;
}

const APP_LABEL: Record<Screen["app"], string> = {
  chat: "Tin nhắn",
  sms: "SMS",
  email: "Hộp thư",
  web: "Trình duyệt",
  post: "Mạng xã hội",
  call: "Cuộc gọi đến",
  game: "Trong game",
};

export function FakeScreenView({
  screen,
  mode = "plain",
  found,
  onFlag,
  className = "",
}: {
  screen: Screen;
  mode?: Ctx["mode"];
  found?: Set<number>;
  onFlag?: (i: number) => void;
  className?: string;
}) {
  const at = new Map<string, number>();
  let n = 0;
  for (const [k, str] of fields(screen)) {
    at.set(k, n);
    n += [...str.matchAll(RE)].length;
  }
  const c: Ctx = { mode, found, onFlag, at };
  const s = screen;
  const dark = s.app === "call" || s.app === "game";
  return (
    <div className={`mx-auto w-full max-w-[320px] select-none ${className}`}>
      {/* khung điện thoại */}
      <div className="rounded-[2.2rem] bg-[#1b1f3b] p-2 shadow-[0_18px_40px_-14px_rgba(20,20,60,0.6)] ring-1 ring-[#3a3f6b]">
        <div className={`relative flex max-h-[min(520px,calc(100dvh-250px))] min-h-[230px] flex-col overflow-hidden rounded-[1.7rem] ${dark ? "bg-[#101530] text-[#eef1ff]" : "bg-[#ffffff] text-[#1f2340]"}`}>
          {/* thanh trạng thái */}
          <div className={`flex items-center justify-between px-5 pt-2 text-[11px] font-bold ${dark ? "text-[#c6cbef]" : "text-[#1f2340]"}`}>
            <span>9:41</span>
            <span className="h-4 w-16 rounded-full bg-[#1b1f3b]" />
            <span>▮▮▮ 🔋</span>
          </div>
          <Body s={s} c={c} />
          <div className="pointer-events-none absolute bottom-1 left-1/2 h-1 w-24 -translate-x-1/2 rounded-full bg-[#1b1f3b]/30" />
        </div>
      </div>
      <div className="mt-1 text-center text-[11px] font-bold uppercase tracking-wider text-ink-soft opacity-70">{APP_LABEL[s.app]} · màn hình giả lập</div>
    </div>
  );
}

function Avatar({ e, size = 36, dark = false }: { e?: string; size?: number; dark?: boolean }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full ${dark ? "bg-[#2a3170]" : "bg-[#e8ecff]"}`} style={{ width: size, height: size, fontSize: size * 0.55 }}>
      {e ?? "👤"}
    </span>
  );
}

const Tick = () => <span className="ml-1 inline-grid h-4 w-4 place-items-center rounded-full bg-[#2f7bff] align-middle text-[9px] text-white">✓</span>;

function Bubble({ l, i, c, me, sms }: { l: ScreenLine; i: number; c: Ctx; me: boolean; sms?: boolean }) {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] space-y-2 rounded-2xl px-3 py-2 text-[14px] leading-snug ${me ? (sms ? "rounded-br-md bg-[#34c759] text-white" : "rounded-br-md bg-[#2f7bff] text-white") : "rounded-bl-md bg-[#eef0f6] text-[#1f2340]"}`}
      >
        {l.pic && <div className="text-center text-5xl leading-tight">{l.pic}</div>}
        <div className="whitespace-pre-line">
          <T k={`t${i}`} s={l.text} c={c} />
        </div>
        {l.button && (
          <div className="rounded-xl bg-[#ffffff] px-3 py-1.5 text-center text-[13px] font-extrabold text-[#2f7bff] shadow-sm">
            <T k={`b${i}`} s={l.button} c={c} />
          </div>
        )}
      </div>
    </motion.div>
  );
}

function Body({ s, c }: { s: Screen; c: Ctx }) {
  switch (s.app) {
    case "chat":
    case "sms": {
      const sms = s.app === "sms";
      return (
        <>
          <div className={`flex items-center gap-2 border-b px-3 py-2 ${sms ? "border-[#e6e8f0] bg-[#f7f7fa]" : "border-[#1f5fd6] bg-[#2f7bff] text-white"}`}>
            <span className="text-lg opacity-80">‹</span>
            <Avatar e={s.avatar} size={34} />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[14px] font-extrabold">
                <T k="title" s={s.title} c={c} />
                {s.verified && <Tick />}
              </div>
              {s.sub && (
                <div className={`truncate text-[11px] ${sms ? "text-[#6b7090]" : "text-white/80"}`}>
                  <T k="sub" s={s.sub} c={c} />
                </div>
              )}
            </div>
          </div>
          {s.heading && (
            <div className="bg-[#fff6d8] px-3 py-1 text-center text-[11px] font-bold text-[#7a5a00]">
              <T k="heading" s={s.heading} c={c} />
            </div>
          )}
          <div className="flex-1 space-y-2 overflow-y-auto px-3 py-3">
            {s.lines.map((l, i) => (
              <Bubble key={i} i={i} l={l} c={c} me={l.from === "me"} sms={sms} />
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-[#e6e8f0] px-3 py-2">
            <span className="flex-1 rounded-full bg-[#eef0f6] px-3 py-1.5 text-[12px] text-[#9a9eb8]">Nhập tin nhắn…</span>
            <span className="text-[#2f7bff]">➤</span>
          </div>
        </>
      );
    }
    case "email":
      return (
        <>
          <div className="flex items-center gap-2 border-b border-[#e6e8f0] px-4 py-2 text-[13px] font-bold text-[#2f7bff]">
            ‹ Hộp thư đến
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {s.heading && (
              <div className="text-[17px] font-extrabold leading-snug">
                <T k="heading" s={s.heading} c={c} />
              </div>
            )}
            <div className="flex items-center gap-2">
              <Avatar e={s.avatar} size={36} />
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[14px] font-bold">
                  <T k="title" s={s.title} c={c} />
                  {s.verified && <Tick />}
                </div>
                {s.sub && (
                  <div className="truncate text-[11px] text-[#6b7090]">
                    <T k="sub" s={s.sub} c={c} />
                  </div>
                )}
              </div>
            </div>
            {s.lines.map((l, i) => (
              <div key={i} className="space-y-2 text-[14px] leading-snug">
                {l.pic && <div className="text-center text-5xl">{l.pic}</div>}
                <p className="whitespace-pre-line">
                  <T k={`t${i}`} s={l.text} c={c} />
                </p>
                {l.button && (
                  <div className="rounded-lg bg-[#2f7bff] px-3 py-2 text-center text-[13px] font-extrabold text-white">
                    <T k={`b${i}`} s={l.button} c={c} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      );
    case "web":
      return (
        <>
          <div className="px-3 pb-2 pt-1">
            <div className="flex items-center gap-1.5 rounded-xl bg-[#eef0f6] px-3 py-1.5 text-[12px]">
              <span>{s.verified ? "🔒" : "⚠️"}</span>
              <span className="truncate font-semibold text-[#3b4060]">
                <T k="sub" s={s.sub ?? ""} c={c} />
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
            <div className="flex items-center gap-2 border-b border-[#e6e8f0] pb-2">
              <Avatar e={s.avatar} size={28} />
              <div className="truncate text-[15px] font-extrabold">
                <T k="title" s={s.title} c={c} />
              </div>
            </div>
            {s.heading && (
              <div className="text-[18px] font-extrabold leading-snug">
                <T k="heading" s={s.heading} c={c} />
              </div>
            )}
            {s.lines.map((l, i) => (
              <div key={i} className="space-y-2 text-[14px] leading-snug">
                {l.pic && <div className="rounded-xl bg-[#f1f4ff] py-3 text-center text-5xl">{l.pic}</div>}
                <p className="whitespace-pre-line">
                  <T k={`t${i}`} s={l.text} c={c} />
                </p>
                {l.button && (
                  <div className="rounded-xl bg-[#ff4f7b] px-3 py-2 text-center text-[14px] font-extrabold text-white shadow">
                    <T k={`b${i}`} s={l.button} c={c} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      );
    case "post":
      return (
        <>
          <div className="border-b border-[#e6e8f0] px-4 py-2 text-[15px] font-extrabold text-[#2f7bff]">Bảng tin</div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            <div className="flex items-center gap-2">
              <Avatar e={s.avatar} size={38} />
              <div className="min-w-0 leading-tight">
                <div className="truncate text-[14px] font-extrabold">
                  <T k="title" s={s.title} c={c} />
                  {s.verified && <Tick />}
                </div>
                <div className="truncate text-[11px] text-[#6b7090]">{s.sub ? <T k="sub" s={s.sub} c={c} /> : "Vừa xong · 🌐"}</div>
              </div>
            </div>
            {s.heading && (
              <div className="text-[16px] font-extrabold leading-snug">
                <T k="heading" s={s.heading} c={c} />
              </div>
            )}
            {s.lines.map((l, i) => (
              <div key={i} className="space-y-2 text-[14px] leading-snug">
                <p className="whitespace-pre-line">
                  <T k={`t${i}`} s={l.text} c={c} />
                </p>
                {l.pic && <div className="rounded-xl bg-[#f1f4ff] py-6 text-center text-6xl">{l.pic}</div>}
                {l.button && (
                  <div className="rounded-lg bg-[#eef0f6] px-3 py-1.5 text-center text-[13px] font-bold text-[#2f7bff]">
                    <T k={`b${i}`} s={l.button} c={c} />
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-between border-t border-[#e6e8f0] pt-2 text-[12px] font-bold text-[#6b7090]">
              <span>👍 Thích</span>
              <span>💬 Bình luận</span>
              <span>↗ Chia sẻ</span>
            </div>
          </div>
        </>
      );
    case "call":
      return (
        <div className="flex flex-1 flex-col items-center gap-3 overflow-y-auto px-4 py-6 text-center">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#9aa3e0]">Cuộc gọi đến…</div>
          <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ repeat: Infinity, duration: 1.4 }}>
            <Avatar e={s.avatar} size={72} dark />
          </motion.div>
          <div className="text-[20px] font-extrabold leading-tight">
            <T k="title" s={s.title} c={c} />
            {s.verified && <Tick />}
          </div>
          {s.sub && (
            <div className="text-[13px] text-[#c6cbef]">
              <T k="sub" s={s.sub} c={c} />
            </div>
          )}
          <div className="w-full flex-1 space-y-2 text-left">
            {s.lines.map((l, i) => (
              <div key={i} className={`rounded-2xl px-3 py-2 text-[14px] leading-snug ${l.from === "me" ? "ml-6 bg-[#2a3170]" : "mr-6 bg-[#1e2552]"}`}>
                <span className="mr-1 text-[11px] font-bold text-[#9aa3e0]">{l.from === "me" ? "Em:" : "🔊"}</span>
                <T k={`t${i}`} s={l.text} c={c} />
              </div>
            ))}
          </div>
          <div className="flex w-full justify-around pt-2">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#ff3b5c] text-xl">✆</span>
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#34c759] text-xl">✆</span>
          </div>
        </div>
      );
    case "game":
      return (
        <div className="flex flex-1 flex-col overflow-hidden bg-[radial-gradient(circle_at_50%_0%,#3b2a8a,#101530_70%)]">
          <div className="flex items-center gap-2 px-3 py-2">
            <Avatar e={s.avatar ?? "🎮"} size={30} dark />
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[14px] font-extrabold text-[#ffd76a]">
                <T k="title" s={s.title} c={c} />
                {s.verified && <Tick />}
              </div>
              {s.sub && (
                <div className="truncate text-[11px] text-[#c6cbef]">
                  <T k="sub" s={s.sub} c={c} />
                </div>
              )}
            </div>
          </div>
          <div className="m-3 flex-1 space-y-2 overflow-y-auto rounded-2xl border-2 border-[#ffd76a]/60 bg-[#151a44]/90 p-3">
            {s.heading && (
              <div className="text-center text-[16px] font-extrabold text-[#ffd76a]">
                <T k="heading" s={s.heading} c={c} />
              </div>
            )}
            {s.lines.map((l, i) => (
              <div key={i} className="space-y-2 text-[14px] leading-snug">
                {l.pic && <div className="text-center text-5xl">{l.pic}</div>}
                <p className="whitespace-pre-line">
                  {l.from === "me" && <b className="text-[#7cf0c8]">Em: </b>}
                  <T k={`t${i}`} s={l.text} c={c} />
                </p>
                {l.button && (
                  <div className="rounded-xl bg-[linear-gradient(90deg,#ffb020,#ff4fa3)] px-3 py-2 text-center text-[14px] font-extrabold text-white shadow">
                    <T k={`b${i}`} s={l.button} c={c} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
  }
}
