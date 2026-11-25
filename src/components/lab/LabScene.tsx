"use client";
import { Patrick_Hand } from "next/font/google";
import { imageById, resolveFile } from "@/content/assets";
import { LAB_THEMES, type LabThemeId } from "@/lib/chem/themes";
import { SCENE_HTML } from "./scenes";
import "./lab.css";

const hand = Patrick_Hand({ subsets: ["latin", "vietnamese"], weight: "400", variable: "--font-hand", display: "swap" });

/**
 * Nền phòng thí nghiệm theo giao diện. Có ảnh `bg-hh-<id>` (vẽ sẵn, đã chừa mặt bàn) thì dùng ảnh,
 * chưa có thì dùng cảnh vẽ bằng SVG + mặt bàn CSS.
 */
export function LabScene({ theme }: { theme: LabThemeId }) {
  const asset = imageById(`bg-hh-${theme}`);
  const src = asset ? resolveFile(asset.file) : undefined;
  if (src)
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" />
      </div>
    );
  return <div className="lab-scene absolute inset-0 overflow-hidden" aria-hidden dangerouslySetInnerHTML={{ __html: SCENE_HTML[theme] }} />;
}

/** lớp bọc đặt biến màu của giao diện cho các thẻ, nút bên trong */
export function LabShell({ theme, calm, className = "", children }: { theme: LabThemeId; calm?: boolean; className?: string; children: React.ReactNode }) {
  const t = LAB_THEMES[theme];
  const style = {
    "--lab-panel": t.vars.panel,
    "--lab-text": t.vars.text,
    "--lab-soft": t.vars.soft,
    "--lab-line": t.vars.line,
    "--lab-accent": t.vars.accent,
    "--lab-accent-ink": t.vars.accentInk,
    "--lab-chip": t.vars.chip,
  } as React.CSSProperties;
  return (
    <div className={`${hand.variable} ${t.dark ? "lab-dark" : ""} ${calm ? "lab-calm" : ""} ${className}`} style={style} data-lab-theme={theme}>
      {children}
    </div>
  );
}
