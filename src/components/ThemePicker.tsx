"use client";
import { useState } from "react";
import { Art } from "@/components/Art";
import { useProgress } from "@/lib/store";

type Theme = "mochi" | "neon";

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** theme mặc định theo lớp: tiểu học dễ thương, từ lớp 6 trở lên ngầu hơn (bé vẫn đổi được) */
export const defaultTheme = (grade?: string): Theme => (grade && grade !== "later" && Number(grade) >= 6 ? "neon" : "mochi");

/** hai thẻ xem trước để bé bấm chọn; chọn xong giao diện đổi ngay phía sau */
export function ThemeCards() {
  const { data, setLook } = useProgress();
  const cur = data.theme ?? defaultTheme(data.grade);
  const items: { id: Theme; name: string; hint: string; emoji: string }[] = [
    { id: "mochi", name: "Mochi", hint: "Sáng, dễ thương", emoji: "🐱" },
    { id: "neon", name: "Neon", hint: "Tối, ngầu, công nghệ", emoji: "🌌" },
  ];
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((t) => (
        <button
          key={t.id}
          onClick={() => setLook({ theme: t.id })}
          aria-pressed={cur === t.id}
          className={`group overflow-hidden rounded-3xl text-left transition ${cur === t.id ? "ring-4 ring-sun shadow-[0_0_24px_-4px_rgba(255,184,31,0.8)]" : "opacity-85 ring-2 ring-white/40 hover:opacity-100"}`}
        >
          <Art id={`theme-pick-${t.id}`} emoji={t.emoji} rounded="" className="aspect-square w-full" />
          <div className={`px-3 py-2 ${t.id === "neon" ? "bg-[#0b1238] text-white" : "bg-white text-ink"}`}>
            <div className="font-display text-lg font-extrabold leading-tight">{t.name}</div>
            <div className={`text-xs font-bold ${t.id === "neon" ? "text-white/70" : "text-ink-soft"}`}>{t.hint}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

export function GradeChips({ onPick }: { onPick?: (g: string) => void }) {
  const { data, setLook } = useProgress();
  const pick = (g: string) => {
    setLook({ grade: g });
    onPick?.(g);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {GRADES.map((g) => (
        <button key={g} onClick={() => pick(g)} className={`chip px-4 py-2 text-base ${data.grade === g ? "bg-sky text-white" : "bg-white text-ink"}`}>
          Lớp {g}
        </button>
      ))}
      <button onClick={() => pick("later")} className={`chip px-4 py-2 text-base ${data.grade === "later" ? "bg-sky text-white" : "bg-white text-ink"}`}>
        Bố mẹ chọn sau
      </button>
    </div>
  );
}

/** Lần mở app đầu tiên: hỏi lớp, rồi cho chọn giao diện (đổi lại được ở trang Của tôi) */
export function FirstRunPrompt() {
  const { data, ready, setLook } = useProgress();
  const [step, setStep] = useState<1 | 2>(1);
  if (!ready || (data.grade !== undefined && step === 1)) return null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="card max-h-[92dvh] w-full max-w-lg space-y-5 overflow-y-auto p-6 text-ink">
        {step === 1 ? (
          <>
            <h2 className="font-display text-2xl font-extrabold">Em học lớp mấy?</h2>
            <p className="text-ink-soft">Mochi sẽ gợi ý môn và giao diện hợp với em.</p>
            <GradeChips
              onPick={(g) => {
                setLook({ theme: defaultTheme(g) });
                setStep(2);
              }}
            />
          </>
        ) : (
          <>
            <h2 className="font-display text-2xl font-extrabold">Em thích giao diện nào?</h2>
            <p className="text-ink-soft">Bấm để xem thử. Sau này em đổi lại ở trang Của tôi được.</p>
            <ThemeCards />
            <button className="btn btn-primary w-full" onClick={() => setStep(1) /* grade đã có nên hộp thoại tự đóng */}>
              Xong
            </button>
          </>
        )}
      </div>
    </div>
  );
}
