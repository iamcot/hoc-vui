"use client";
import { useState } from "react";
import { hasFile, imageById } from "@/content/assets";

const PALETTES = [
  ["#e6ecff", "#fff0e8"],
  ["#e2f7f0", "#e6ecff"],
  ["#fff6dc", "#ffe8ee"],
  ["#f0e9ff", "#e2f7f0"],
];

/**
 * Ảnh theo id trong danh mục. Chưa có file thật thì hiện nền pastel + emoji,
 * để giao diện vẫn đẹp trong lúc chờ ảnh từ ChatGPT.
 */
export function Art({
  id,
  emoji = "✨",
  className = "",
  rounded = "rounded-3xl",
  label,
  contain = false,
}: {
  id: string;
  emoji?: string;
  className?: string;
  rounded?: string;
  label?: string;
  contain?: boolean;
}) {
  const asset = imageById(id);
  const [failed, setFailed] = useState(false);
  const pal = PALETTES[[...id].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTES.length];
  if (!asset || failed || !hasFile(asset.file)) {
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden ${rounded} ${className}`}
        style={{ background: `linear-gradient(135deg, ${pal[0]}, ${pal[1]})` }}
        aria-label={label ?? asset?.usage}
        role="img"
      >
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/50" />
        <div className="absolute -bottom-8 -left-4 h-28 w-28 rounded-full bg-white/40" />
        <span className="floaty relative text-5xl drop-shadow-sm sm:text-6xl">{emoji}</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.file}
      alt={label ?? asset.usage}
      onError={() => setFailed(true)}
      className={`${rounded} ${contain ? "object-contain" : "object-cover"} ${className}`}
      draggable={false}
    />
  );
}
