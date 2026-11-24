/** Nhãn phím tắt gắn ngay trên nút, vd. <Kbd k="Enter" /> */
const LABEL: Record<string, string> = { " ": "Space", Enter: "Enter", Escape: "Esc", "Shift+Enter": "⇧ Enter", ArrowLeft: "←", ArrowRight: "→" };

export function Kbd({ k, className = "" }: { k: string; className?: string }) {
  return (
    <kbd className={`ml-1 inline-flex items-center rounded-md border border-current/40 bg-black/15 px-1.5 py-0.5 font-mono text-[0.7em] font-bold leading-none opacity-80 ${className}`}>
      {LABEL[k] ?? k}
    </kbd>
  );
}
