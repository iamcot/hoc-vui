"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { checkPassword, passphrase } from "@/lib/password";

const COLORS = ["#ff4f7b", "#ff8a5c", "#ffb81f", "#22b98c", "#1d9e78"];

/** Phòng thử mật khẩu: gõ thử, xem máy dò ra trong bao lâu. Chạy trong máy, không lưu. */
export function PasswordLab({ label, onScore }: { label?: string; onScore?: (score: number, pw: string) => void }) {
  const [pw, setPw] = useState("");
  const r = checkPassword(pw);
  return (
    <div className="space-y-3 rounded-3xl bg-white/80 p-4 sm:p-5">
      <div className="font-display text-lg font-extrabold">{label ?? "Phòng thử mật khẩu"}</div>
      <div className="flex flex-wrap gap-2">
        <input
          value={pw}
          onChange={(e) => {
            setPw(e.target.value);
            onScore?.(checkPassword(e.target.value).score, e.target.value);
          }}
          placeholder="Gõ thử một mật khẩu bịa ra"
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 py-3 font-mono text-xl font-bold text-[#1f2340] outline-none focus:border-sky"
        />
        <button
          className="btn btn-ghost"
          onClick={() => {
            const p = passphrase();
            setPw(p);
            onScore?.(checkPassword(p).score, p);
          }}
        >
          🎲 Gợi ý cụm từ
        </button>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span key={i} animate={{ backgroundColor: pw && i <= r.score ? COLORS[r.score] : "#e6dcef" }} className="h-3 rounded-full" />
        ))}
      </div>
      {pw && (
        <div className="flex flex-wrap items-baseline gap-x-3">
          <span className="font-display text-xl font-extrabold" style={{ color: COLORS[r.score] }}>
            {r.label}
          </span>
          <span className="text-ink-soft">
            Máy dò ra trong: <b className="text-ink">{r.crack}</b>
          </span>
        </div>
      )}
      <ul className="grid gap-1 text-[15px] sm:grid-cols-2">
        {r.checks.map((c) => (
          <li key={c.text} className={c.ok ? "font-bold text-mint" : "text-ink-soft"}>
            {c.ok ? "✅" : "▫️"} {c.text}
          </li>
        ))}
      </ul>
      <p className="rounded-2xl bg-sun-soft px-3 py-2 text-[15px]">💡 {r.tip}</p>
      <p className="text-xs text-ink-soft">Mật khẩu em gõ ở đây chỉ nằm trên máy này, không được lưu hay gửi đi đâu cả.</p>
    </div>
  );
}
