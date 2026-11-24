"use client";
import { imageById, resolveFile } from "@/content/assets";
import { useProgress } from "@/lib/store";

type Theme = "mochi" | "neon";

const GRADES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];


/** ảnh xem trước = chính ảnh nền trang chủ của theme đó (Neon: nền Neon riêng nếu đã có, không thì biển tối của Gõ phím) */
const PREVIEW: Record<Theme, string[]> = { mochi: ["bg-home"], neon: ["bg-home-neon", "bg-gp-deep"] };
function previewSrc(t: Theme) {
  for (const id of PREVIEW[t]) {
    const a = imageById(id);
    const src = a && resolveFile(a.file);
    if (src) return src;
  }
  return undefined;
}

/** hai thẻ xem trước để bé bấm chọn; chọn xong giao diện đổi ngay phía sau */
export function ThemeCards() {
  const { data, setLook } = useProgress();
  const cur = data.theme ?? "mochi";
  const items: { id: Theme; name: string; hint: string }[] = [
    { id: "mochi", name: "Mochi", hint: "Sáng, dễ thương" },
    { id: "neon", name: "Neon", hint: "Tối, ngầu, công nghệ" },
  ];
  return (
    <div className="grid max-w-md grid-cols-2 gap-3">
      {items.map((t) => (
        <button
          key={t.id}
          onClick={() => setLook({ theme: t.id })}
          aria-pressed={cur === t.id}
          className={`group overflow-hidden rounded-3xl text-left transition ${cur === t.id ? "ring-4 ring-sun shadow-[0_0_24px_-4px_rgba(255,184,31,0.8)]" : "opacity-85 ring-2 ring-white/40 hover:opacity-100"}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc(t.id)} alt="" className={`aspect-[16/9] w-full object-cover ${t.id === "neon" ? "bg-[#0b1238]" : "bg-sky-soft"}`} draggable={false} />
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
  const on = (g: string) => (data.grade === g ? "bg-sky text-white shadow-[0_0_0_3px_rgba(255,184,31,0.9)]" : "bg-white text-ink ring-2 ring-sky/30 hover:ring-sky");
  return (
    <div className="max-w-md space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {GRADES.map((g) => (
          <button key={g} onClick={() => pick(g)} aria-pressed={data.grade === g} className={`h-14 rounded-2xl font-display text-lg font-extrabold transition ${on(g)}`}>
            Lớp {g}
          </button>
        ))}
      </div>
      <button onClick={() => pick("later")} aria-pressed={data.grade === "later"} className={`h-12 w-full rounded-2xl font-display text-base font-extrabold transition ${on("later")}`}>
        Bố mẹ chọn sau
      </button>
    </div>
  );
}
