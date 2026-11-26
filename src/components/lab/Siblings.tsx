"use client";
import { useEffect, useState } from "react";
import { CATS, element } from "@/lib/chem/elements";
import { sfx } from "@/lib/chem/sfx";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { useProgress } from "@/lib/store";
import { Mascot } from "@/components/Mascot";
import { LAB_RATE, Say, plain } from "./Guide";
import "./lab.css";

type Col = "kiem" | "halogen";

interface Member {
  z: number;
  line: string;
  /** độ dữ 1–5 */
  fierce: number;
}

const COLS: Record<Col, { title: string; col: number; members: Member[]; rule: string; ask: { q: string; z: number; options: string[]; right: number; why: string } }> = {
  kiem: {
    title: "Nhóm 1: kim loại kiềm",
    col: 1,
    members: [
      { z: 3, line: "Bơi chầm chậm, sủi bọt nhẹ", fierce: 1 },
      { z: 11, line: "Chạy vù vù, xèo xèo", fierce: 3 },
      { z: 19, line: "Chạy cực nhanh, bốc cháy lửa tím!", fierce: 5 },
    ],
    rule: "Cùng một cột thì giống tính nhau, nhưng **đi xuống thì kim loại kiềm càng dữ**.",
    ask: { q: "Rubidi (Rb) nằm dưới Kali. Thả vào nước, Rb sẽ thế nào?", z: 37, options: ["Hiền hơn Kali", "Giống hệt Kali", "Dữ hơn Kali, nổ ngay"], right: 2, why: "Đúng! Rb nằm dưới K nên còn dữ hơn: vừa chạm nước là nổ. Cột này đi xuống là nguy hiểm dần." },
  },
  halogen: {
    title: "Nhóm 17: halogen",
    col: 17,
    members: [
      { z: 9, line: "Khí vàng nhạt, dữ nhất bảng", fierce: 5 },
      { z: 17, line: "Khí vàng lục, độc", fierce: 4 },
      { z: 35, line: "Chất lỏng nâu đỏ, bốc khói", fierce: 3 },
      { z: 53, line: "Chất rắn tím đen, ít dữ nhất", fierce: 2 },
    ],
    rule: "Đi xuống thì **màu đậm dần, từ khí thành lỏng rồi rắn**, và bớt hung dữ.",
    ask: { q: "Astatin (At) nằm dưới Iot. Ở nhiệt độ phòng nó sẽ là…", z: 85, options: ["Chất khí", "Chất lỏng", "Chất rắn sẫm màu"], right: 2, why: "Đúng! Đi xuống thì khí, lỏng, rắn. Astatin hiếm đến mức cả Trái Đất chỉ có vài chục gam." },
  },
};

/** hiệu ứng thả kim loại vào nước: Li hiền, Na xèo xèo, K bốc cháy */
function WaterTile({ z, fierce, line }: { z: number; fierce: number; line: string }) {
  const e = element(z);
  const bubbles = fierce * 2;
  return (
    <div className="lab-panel flex min-w-0 flex-1 flex-col gap-2 rounded-3xl p-3">
      <div className="flex items-center gap-2">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-2xl font-extrabold text-[#1b1740]" style={{ background: CATS[e.cat].bg }}>
          {e.sym}
        </span>
        <b className="font-display text-lg sm:text-xl">{e.name}</b>
      </div>
      <div className="relative min-h-[5.5rem] flex-1 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(#0000 38%, #46b8ff 38%, #1d6fd6)" }}>
        <span className="sib-ball absolute top-[26%] text-2xl sm:text-3xl" style={{ ["--sp" as string]: `${Math.max(0.7, 4.2 - fierce * 0.8)}s` }}>
          ⚪
        </span>
        {fierce >= 5 && (
          <span className="sib-flame absolute top-[2%] text-3xl sm:text-4xl" style={{ left: "28%", filter: "hue-rotate(250deg) saturate(1.6)" }}>
            🔥
          </span>
        )}
        {Array.from({ length: bubbles }, (_, i) => (
          <span key={i} className="lab-bubble absolute h-2 w-2 rounded-full bg-white/80" style={{ left: `${12 + ((i * 53) % 70)}%`, bottom: "6%", ["--rise" as string]: "-60px", animationDelay: `${(i % 5) * 0.25}s` }} />
        ))}
      </div>
      <div className="lab-soft text-[0.95rem] font-bold leading-snug sm:text-base">{line}</div>
      <div className="flex gap-1" aria-label={`Độ dữ ${fierce} trên 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className="h-2.5 flex-1 rounded-full" style={{ background: i < fierce ? "#ff4f7b" : "var(--lab-line)" }} />
        ))}
      </div>
    </div>
  );
}

/** ống nghiệm halogen: khí nhạt, khí lục, lỏng nâu, rắn tím */
function TubeTile({ z, fierce, line }: { z: number; fierce: number; line: string }) {
  const e = element(z);
  const look: Record<number, { fill: string; h: string; state: string; dots?: boolean }> = {
    9: { fill: "rgba(255,240,150,0.55)", h: "100%", state: "Khí" },
    17: { fill: "rgba(170,220,60,0.7)", h: "100%", state: "Khí" },
    35: { fill: "rgba(170,50,20,0.9)", h: "52%", state: "Lỏng" },
    53: { fill: "#3a1668", h: "22%", state: "Rắn", dots: true },
  };
  const l = look[z];
  return (
    <div className="lab-panel flex min-w-0 flex-1 flex-col gap-2 rounded-3xl p-3">
      <div className="flex items-center gap-2">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display text-2xl font-extrabold text-[#1b1740]" style={{ background: CATS[e.cat].bg }}>
          {e.sym}
        </span>
        <b className="font-display text-lg sm:text-xl">{e.name}</b>
        <span className="ml-auto rounded-full px-2 py-0.5 text-sm font-extrabold lab-accent">{l.state}</span>
      </div>
      <div className="relative mx-auto min-h-[5.5rem] max-h-72 w-16 flex-1 overflow-hidden rounded-b-[2rem] rounded-t-lg sm:w-20" style={{ boxShadow: "inset 0 0 0 3px var(--lab-line)", background: "#ffffff14" }}>
        <div className="absolute inset-x-0 bottom-0" style={{ height: l.h, background: l.fill }} />
        {l.dots &&
          Array.from({ length: 6 }, (_, i) => <i key={i} className="absolute h-2.5 w-2.5 rotate-45 bg-[#8b5cf6]" style={{ left: `${14 + i * 12}%`, bottom: `${4 + (i % 2) * 8}%` }} />)}
        {z === 9 || z === 17
          ? Array.from({ length: 4 }, (_, i) => <span key={i} className="lab-steam absolute h-3 w-3 rounded-full bg-white/50" style={{ left: `${20 + i * 18}%`, top: "30%", animationDelay: `${i * 0.4}s` }} />)
          : null}
      </div>
      <div className="lab-soft text-[0.95rem] font-bold leading-snug sm:text-base">{line}</div>
      <div className="flex gap-1" aria-label={`Độ dữ ${fierce} trên 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <i key={i} className="h-2.5 flex-1 rounded-full" style={{ background: i < fierce ? "#ff4f7b" : "var(--lab-line)" }} />
        ))}
      </div>
    </div>
  );
}

/**
 * "Anh em cùng cột": xem các nguyên tố trong một cột hành xử ra sao (từ trên xuống), rồi đoán nguyên tố kế tiếp.
 * Mẹo nhớ bảng: cùng cột thì giống tính nhau, đi xuống thì thay đổi có quy luật.
 */
export function Siblings({ onClose, onShowColumn, who }: { onClose: () => void; onShowColumn: (col: number) => void; who: "mochi" | "bit" }) {
  const { data } = useProgress();
  const [col, setCol] = useState<Col>("kiem");
  const [guess, setGuess] = useState<number | null>(null);
  const [seen, setSeen] = useState(false);
  const c = COLS[col];
  const right = guess === c.ask.right;

  useEffect(() => {
    setGuess(null);
    setSeen(false);
    const t = window.setTimeout(() => setSeen(true), 2600);
    return () => window.clearTimeout(t);
  }, [col]);

  const say =
    guess !== null
      ? right
        ? c.ask.why
        : "Chưa đúng, nhìn lại thứ tự từ trên xuống nhé. Mỗi bước đi xuống, tính chất thay đổi theo một chiều."
      : seen
        ? `${c.rule} ${c.ask.q}`
        : `Xem các **anh em** trong ${c.title.toLowerCase()}, từ trên xuống dưới. Để ý họ thay đổi thế nào!`;

  useEffect(() => {
    if (!data.sound) return;
    const t = window.setTimeout(() => void speak(plain(say), { rate: LAB_RATE, fileOnly: true }), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [say, data.sound]);

  const Tile = col === "kiem" ? WaterTile : TubeTile;
  return (
    <div className="absolute inset-0 z-40 flex flex-col gap-2 bg-black/40 px-3 pb-3 pt-16 backdrop-blur-[2px]">
      <div className="flex items-start gap-2">
        <Mascot who={who} mood={guess !== null && right ? "cheer" : "think"} size={110} className="!h-[clamp(3.2rem,13vh,6rem)] !w-[clamp(3.2rem,13vh,6rem)] shrink-0" />
        <div key={say} className="lab-say lab-pop-in min-w-0 max-w-3xl flex-1 px-4 py-2.5 font-display text-[clamp(0.95rem,1.8vh+0.55rem,1.6rem)] font-extrabold leading-snug">
          <Say text={say} />
          {seen && guess === null && (
            <div className="mt-2 flex flex-wrap gap-2 text-[0.8em]">
              {c.ask.options.map((o, i) => (
                <button
                  key={o}
                  className="lab-opt rounded-2xl px-4 py-1.5 font-extrabold transition active:scale-95"
                  onClick={() => {
                    sfx(i === c.ask.right ? "chime" : "warn");
                    setGuess(i);
                  }}
                >
                  {o}
                </button>
              ))}
            </div>
          )}
          {guess !== null && !right && (
            <button className="lab-opt mt-2 rounded-2xl px-4 py-1.5 text-[0.8em] font-extrabold" onClick={() => setGuess(null)}>
              Thử lại
            </button>
          )}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 items-stretch gap-2 overflow-y-auto">
        {c.members.map((m) => (
          <Tile key={m.z} z={m.z} fierce={m.fierce} line={m.line} />
        ))}
        {guess !== null && right && (
          <div className="lab-panel lab-pop-in flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-3xl border-2 border-dashed p-3 text-center" style={{ borderColor: "var(--lab-accent)" }}>
            <span className="grid h-14 w-14 place-items-center rounded-xl font-display text-3xl font-extrabold text-[#1b1740]" style={{ background: CATS[element(c.ask.z).cat].bg }}>
              {element(c.ask.z).sym}
            </span>
            <b className="font-display text-xl">{element(c.ask.z).name}</b>
            <span className="lab-soft text-base font-bold">{c.ask.options[c.ask.right]}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {(Object.keys(COLS) as Col[]).map((k) => (
          <button key={k} onClick={() => setCol(k)} className={`rounded-full px-4 py-1.5 text-base font-extrabold sm:text-lg ${col === k ? "lab-accent" : "lab-chip"}`}>
            {COLS[k].title}
          </button>
        ))}
        {guess !== null && right && (
          <button className="lab-btn lab-btn-main !py-1.5 text-base sm:text-lg" onClick={() => onShowColumn(c.col)}>
            Xem trên bảng ▶
          </button>
        )}
        <button className="lab-btn lab-btn-ghost !py-1.5 text-base sm:text-lg" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  );
}
