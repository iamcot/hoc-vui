"use client";
import { useState } from "react";
import { hasFile, resolveFile } from "@/content/assets";

export const AVATARS: { id: string; emoji: string; bg: string }[] = [
  { id: "fox", emoji: "🦊", bg: "#fff0e8" },
  { id: "bunny", emoji: "🐰", bg: "#ffe8ee" },
  { id: "panda", emoji: "🐼", bg: "#e2f7f0" },
  { id: "owl", emoji: "🦉", bg: "#f0e9ff" },
  { id: "bear", emoji: "🐻", bg: "#fff6dc" },
  { id: "penguin", emoji: "🐧", bg: "#e6ecff" },
];

export function Avatar({ id, size = 48 }: { id: string; size?: number }) {
  const a = AVATARS.find((x) => x.id === id) ?? AVATARS[0];
  const [failed, setFailed] = useState(false);
  return (
    <span className="relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full ring-2 ring-white" style={{ width: size, height: size, background: a.bg }}>
      {!failed && hasFile(`/assets/img/avatar-${a.id}.webp`) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={resolveFile(`/assets/img/avatar-${a.id}.webp`)} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span style={{ fontSize: size * 0.55 }}>{a.emoji}</span>
      )}
    </span>
  );
}
