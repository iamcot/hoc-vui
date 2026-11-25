"use client";
import { useEffect, useMemo, useState } from "react";
import { getSubject } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { makeRng, randomSeed } from "@/lib/rng";
import { CATS, ELEMENTS, HUNTABLE, type Cat, type Element } from "@/lib/chem/elements";
import { sfx } from "@/lib/chem/sfx";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { LabScene, LabShell } from "@/components/lab/LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "@/components/lab/LabChrome";
import { LAB_RATE, Say, plain } from "@/components/lab/Guide";

const ROUNDS = 8;
const CAT_ORDER = Object.keys(CATS) as Cat[];

/**
 * Bảng tuần hoàn có "tính cách": mỗi nhóm một màu và một cá tính. Chạm ô để Bit kể chuyện nguyên tố đó;
 * chạm tên nhóm để làm sáng cả nhóm; hoặc chơi "Đi săn": Bit tả một nguyên tố, con tìm đúng ô.
 */
export default function PeriodicPage() {
  const subject = getSubject("hoa-hoc")!;
  const prefs = useLabPrefs(subject, "thcs");
  const { data } = useProgress();
  const [picker, setPicker] = useState(false);
  const [sel, setSel] = useState<Element | null>(null);
  const [cat, setCat] = useState<Cat | null>(null);

  // đi săn
  const [hunt, setHunt] = useState<null | { qs: Element[]; i: number; ok: number; wrong: number; found: boolean; shake: number | null }>(null);
  const startHunt = () => {
    const rng = makeRng(randomSeed());
    setSel(null);
    setCat(null);
    setHunt({ qs: rng.shuffle(HUNTABLE).slice(0, ROUNDS), i: 0, ok: 0, wrong: 0, found: false, shake: null });
  };
  const cur = hunt && hunt.i < hunt.qs.length ? hunt.qs[hunt.i] : null;
  const huntDone = !!hunt && hunt.i >= hunt.qs.length;

  const tap = (e: Element) => {
    if (hunt) {
      if (!cur || hunt.found) return;
      if (e.z === cur.z) {
        sfx("chime");
        setHunt({ ...hunt, found: true, ok: hunt.ok + (hunt.wrong === 0 ? 1 : 0), shake: null });
        window.setTimeout(() => setHunt((h) => (h ? { ...h, i: h.i + 1, wrong: 0, found: false } : h)), 1800);
      } else {
        sfx("warn");
        setHunt({ ...hunt, wrong: hunt.wrong + 1, shake: e.z });
        window.setTimeout(() => setHunt((h) => (h && h.shake === e.z ? { ...h, shake: null } : h)), 600);
      }
      return;
    }
    sfx("pop");
    setSel(e);
    setCat(null);
  };

  const hintRow = (e: Element) => (e.row >= 8 ? (e.row === 8 ? "hàng lantan (dưới cùng, hàng trên)" : "hàng actini (dưới cùng)") : `hàng ${e.row}, cột ${e.col}`);
  const say = hunt
    ? huntDone
      ? `Xong rồi! Con tìm đúng ngay lần đầu **${hunt.ok}/${ROUNDS}** nguyên tố.`
      : hunt.found
        ? `Đúng rồi, là **${cur!.name} (${cur!.sym})**! ${CATS[cur!.cat].name}.`
        : hunt.wrong >= 3
          ? `Gợi ý: mình ở **${hintRow(cur!)}**, ô đang nhấp nháy.`
          : hunt.wrong === 2
            ? `Mình thuộc nhóm **${CATS[cur!.cat].name}**. ${cur!.fact}`
            : hunt.wrong === 1
              ? `Chưa đúng, thử lại nhé! ${cur!.fact}`
              : `**Ai đây?** ${cur!.fact}`
    : sel
      ? `Mình là **${sel.name} (${sel.sym})**, số ${sel.z}, nhóm ${CATS[sel.cat].name}. ${sel.fact ?? CATS[sel.cat].trait}`
      : cat
        ? `**${CATS[cat].name}**. ${CATS[cat].trait}`
        : "Chạm vào một ô để nghe **câu chuyện** của nguyên tố. Mỗi nhóm màu có một **tính cách** riêng!";

  useEffect(() => {
    if (!data.sound) return;
    const t = window.setTimeout(() => void speak(plain(say), { rate: LAB_RATE }), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [say, data.sound]);

  const grid = useMemo(() => ELEMENTS, []);

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="fixed inset-0 overflow-hidden">
      <LabScene theme={prefs.theme} />
      <LabTopBar href="/hoa-hoc" title="🧩 Bảng tuần hoàn" onTheme={() => setPicker(true)} />

      <div className="absolute inset-x-0 bottom-[3.6rem] top-14 flex items-center justify-center px-2">
        <div className="relative grid" style={{ width: "min(100%, calc((100dvh - 8.4rem) * 1.9))", gridTemplateColumns: "repeat(18, 1fr)", gridTemplateRows: "repeat(7, 1fr) 0.35fr repeat(2, 1fr)", aspectRatio: "18 / 9.35", gap: "2px" }}>
          {/* Bit kể chuyện trong khoảng trống phía trên bảng */}
          <div className="z-20 flex items-start gap-2" style={{ gridColumn: "3 / 13", gridRow: "1 / 4" }}>
            <Mascot who="bit" mood={huntDone || (hunt?.found ?? false) ? "cheer" : hunt ? "think" : "happy"} size={120} className="!h-[clamp(3rem,13vh,6rem)] !w-[clamp(3rem,13vh,6rem)] shrink-0" />
            <div key={say} className="lab-say lab-pop-in min-w-0 flex-1 px-3 py-2 font-display text-[clamp(0.85rem,1.5vh+0.5rem,1.5rem)] font-extrabold leading-snug">
              <Say text={say} />
              {huntDone && (
                <div className="mt-1">
                  <Confetti />
                  <button className="lab-btn lab-btn-main !py-1 text-[0.8em]" onClick={startHunt}>
                    Chơi lại
                  </button>
                </div>
              )}
            </div>
          </div>
          {hunt && cur && !hunt.found && (
            <div className="lab-chip z-10 self-start justify-self-start rounded-full px-3 py-0.5 text-sm font-extrabold sm:text-base" style={{ gridColumn: "13 / 18", gridRow: "1" }}>
              Câu {hunt.i + 1}/{ROUNDS}
            </div>
          )}

          {grid.map((e) => {
            const dim = hunt ? false : cat ? e.cat !== cat : false;
            const on = sel?.z === e.z;
            const target = !!hunt && !!cur && hunt.wrong >= 3 && cur.z === e.z && !hunt.found;
            const right = !!hunt && hunt.found && cur?.z === e.z;
            return (
              <button
                key={e.z}
                onClick={() => tap(e)}
                aria-label={`${e.name} (${e.sym})`}
                className={`relative grid place-items-center rounded-md font-display font-extrabold leading-none text-[#1b1740] transition ${on || right ? "z-10 scale-125 shadow-[0_0_18px_6px_rgba(255,255,255,0.8)]" : ""} ${target ? "lab-hint z-10" : ""} ${hunt?.shake === e.z ? "lab-shake" : ""}`}
                style={{ gridRow: e.row >= 8 ? e.row + 1 : e.row, gridColumn: e.col, background: CATS[e.cat].bg, opacity: dim ? 0.22 : 1, fontSize: "clamp(0.7rem, 2.1vh, 1.5rem)" }}
              >
                <span className="absolute left-0.5 top-0 text-[0.5em] font-bold opacity-60">{e.z}</span>
                {e.sym}
              </button>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-1 z-20 flex flex-wrap items-center justify-center gap-1.5 px-2">
        {!hunt && (
          <>
            {CAT_ORDER.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSel(null);
                  setCat(cat === c ? null : c);
                }}
                className="rounded-full px-2.5 py-1 text-[clamp(0.7rem,1.7vh,1rem)] font-extrabold text-[#1b1740] transition active:scale-95"
                style={{ background: CATS[c].bg, boxShadow: cat === c ? "0 0 0 3px #fff, 0 0 12px #fff" : undefined, opacity: cat && cat !== c ? 0.55 : 1 }}
              >
                {CATS[c].name}
              </button>
            ))}
            <button onClick={startHunt} className="lab-btn lab-btn-main !px-4 !py-1 text-[clamp(0.8rem,1.9vh,1.1rem)]">
              🎯 Đi săn nguyên tố
            </button>
          </>
        )}
        {hunt && (
          <button onClick={() => setHunt(null)} className="lab-btn lab-btn-ghost !px-4 !py-1 text-[clamp(0.8rem,1.9vh,1.1rem)]">
            ← Về bảng
          </button>
        )}
      </div>
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}
