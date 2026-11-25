"use client";
import { useEffect, useMemo, useState } from "react";
import { getSubject } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { makeRng, randomSeed } from "@/lib/rng";
import { CATS, ELEMENTS, HUNTABLE, element, type Cat, type Element } from "@/lib/chem/elements";
import { THINGS, type Thing } from "@/lib/chem/around";
import { sfx } from "@/lib/chem/sfx";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { LabScene, LabShell } from "@/components/lab/LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "@/components/lab/LabChrome";
import { Siblings } from "@/components/lab/Siblings";
import { LAB_RATE, Say, plain } from "@/components/lab/Guide";

const ROUNDS = 8;
const CAT_ORDER = Object.keys(CATS) as Cat[];

type Mode = "bang" | "quanh" | "san" | "doquanh";
/** một câu đố: bé chạm đúng ô trên bảng */
interface Q {
  start: string;
  hint1: string;
  hint2: string;
  ok: string;
  ans: number[];
}

const huntQ = (e: Element): Q => ({
  start: `**Ai đây?** ${e.fact}`,
  hint1: `Chưa đúng, thử lại nhé! ${e.fact}`,
  hint2: `Mình thuộc nhóm **${CATS[e.cat].name}**. ${e.fact}`,
  ok: `Đúng rồi, là **${e.name} (${e.sym})**! ${CATS[e.cat].name}.`,
  ans: [e.z],
});
const thingQ = (t: Thing): Q => ({
  start: `${t.emoji} **${t.name}** làm từ nguyên tố nào? Chạm vào bảng nhé!`,
  hint1: `Chưa đúng, thử lại! ${t.hint}`,
  hint2: `Gợi ý: nhóm **${CATS[element(t.els[0]).cat].name}**. ${t.hint}`,
  ok: t.say,
  ans: t.els,
});

/**
 * Bảng tuần hoàn có "tính cách", học bằng bốn cách: Khám phá (chạm ô, chạm nhóm), Quanh ta (đồ vật làm từ nguyên tố nào),
 * Anh em cùng cột (so sánh nguyên tố trong một cột, đoán nguyên tố kế tiếp), Đi săn (Bit tả, bé tìm đúng ô).
 */
export default function PeriodicPage() {
  const subject = getSubject("hoa-hoc")!;
  const prefs = useLabPrefs(subject, "thcs");
  const { data } = useProgress();
  const [picker, setPicker] = useState(false);
  const [sel, setSel] = useState<Element | null>(null);
  const [cat, setCat] = useState<Cat | null>(null);
  const [colHi, setColHi] = useState<number | null>(null);
  const [thing, setThing] = useState<Thing | null>(null);
  const [mode, setMode] = useState<Mode>("bang");
  const [sib, setSib] = useState(false);

  const [game, setGame] = useState<null | { qs: Q[]; i: number; ok: number; wrong: number; found: boolean; shake: number | null }>(null);
  const startGame = (kind: "san" | "doquanh") => {
    const rng = makeRng(randomSeed());
    const qs = kind === "san" ? rng.shuffle(HUNTABLE).slice(0, ROUNDS).map(huntQ) : rng.shuffle(THINGS).slice(0, ROUNDS).map(thingQ);
    setSel(null);
    setCat(null);
    setColHi(null);
    setThing(null);
    setMode(kind);
    setGame({ qs, i: 0, ok: 0, wrong: 0, found: false, shake: null });
  };
  const stopGame = (m: Mode = "bang") => {
    setGame(null);
    setMode(m);
  };
  const cur = game && game.i < game.qs.length ? game.qs[game.i] : null;
  const gameDone = !!game && game.i >= game.qs.length;

  const tap = (e: Element) => {
    if (game) {
      if (!cur || game.found) return;
      if (cur.ans.includes(e.z)) {
        sfx("chime");
        setGame({ ...game, found: true, ok: game.ok + (game.wrong === 0 ? 1 : 0), shake: null });
        window.setTimeout(() => setGame((g) => (g ? { ...g, i: g.i + 1, wrong: 0, found: false } : g)), 2600);
      } else {
        sfx("warn");
        setGame({ ...game, wrong: game.wrong + 1, shake: e.z });
        window.setTimeout(() => setGame((g) => (g && g.shake === e.z ? { ...g, shake: null } : g)), 600);
      }
      return;
    }
    sfx("pop");
    setSel(e);
    setCat(null);
    setColHi(null);
    setThing(null);
  };

  const hintRow = (e: Element) => (e.row >= 8 ? (e.row === 8 ? "hàng lantan (dưới cùng, hàng trên)" : "hàng actini (dưới cùng)") : `hàng ${e.row}, cột ${e.col}`);
  const say = game
    ? gameDone
      ? `Xong rồi! Con tìm đúng ngay lần đầu **${game.ok}/${ROUNDS}** câu.`
      : game.found
        ? cur!.ok
        : game.wrong >= 3
          ? `Gợi ý: ô đang **nhấp nháy** trên bảng, thử chạm vào đó nhé.`
          : game.wrong === 2
            ? cur!.hint2
            : game.wrong === 1
              ? cur!.hint1
              : cur!.start
    : thing
      ? `${thing.emoji} **${thing.name}**: ${thing.say}`
      : sel
        ? `Mình là **${sel.name} (${sel.sym})**, số ${sel.z}, nhóm ${CATS[sel.cat].name}. ${sel.fact ?? CATS[sel.cat].trait}`
        : colHi
          ? colHi === 1
            ? "**Cột 1** là các kim loại kiềm: Li, Na, K… Đi xuống càng dữ, thả nước là nổ!"
            : "**Cột 17** là halogen: F, Cl, Br, I. Đi xuống màu đậm dần, khí thành lỏng rồi rắn."
          : cat
            ? `**${CATS[cat].name}**. ${CATS[cat].trait}`
            : mode === "quanh"
              ? "Chọn một **đồ vật** bên dưới, mình chỉ cho con nó làm từ nguyên tố nào!"
              : "Chạm vào một ô để nghe **câu chuyện** của nguyên tố. Mỗi nhóm màu có một **tính cách** riêng!";

  useEffect(() => {
    if (!data.sound || sib) return;
    const t = window.setTimeout(() => void speak(plain(say), { rate: LAB_RATE }), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [say, data.sound, sib]);

  const lit = useMemo(() => {
    if (game) return null;
    if (thing) return new Set(thing.els);
    if (colHi) return new Set(ELEMENTS.filter((e) => e.col === colHi && e.row <= 7).map((e) => e.z));
    if (cat) return new Set(ELEMENTS.filter((e) => e.cat === cat).map((e) => e.z));
    return null;
  }, [game, thing, colHi, cat]);

  const tabs: [string, string, () => void, boolean][] = [
    ["🔎", "Khám phá", () => { stopGame("bang"); setThing(null); setColHi(null); }, mode === "bang" && !game],
    ["🏠", "Quanh ta", () => { stopGame("quanh"); setSel(null); setCat(null); setColHi(null); setThing(null); }, mode === "quanh" && !game],
    ["👪", "Anh em", () => setSib(true), sib],
    ["🎯", "Đi săn", () => startGame("san"), mode === "san"],
  ];
  const gameLabel = mode === "doquanh" ? "Đố đồ vật" : "Đi săn";

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="fixed inset-0 overflow-hidden">
      <LabScene theme={prefs.theme} />
      <LabTopBar href="/hoa-hoc" title="🧩 Bảng tuần hoàn" onTheme={() => setPicker(true)}>
        <div className="ml-auto flex shrink-0 gap-1">
          {tabs.map(([emoji, name, fn, on]) => (
            <button key={name} onClick={fn} className={`whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-extrabold sm:px-3.5 sm:text-base ${on ? "lab-accent" : "lab-chip"}`}>
              {emoji}
              <span className="hidden sm:inline"> {name}</span>
            </button>
          ))}
        </div>
      </LabTopBar>

      <div className="absolute inset-x-0 bottom-[3.6rem] top-14 flex items-center justify-center px-2">
        <div className="relative grid" style={{ width: "min(100%, calc((100dvh - 8.4rem) * 1.9))", gridTemplateColumns: "repeat(18, 1fr)", gridTemplateRows: "repeat(7, 1fr) 0.35fr repeat(2, 1fr)", aspectRatio: "18 / 9.35", gap: "2px" }}>
          <div className="z-20 flex items-start gap-2" style={{ gridColumn: "3 / 13", gridRow: "1 / 4" }}>
            <Mascot who="bit" mood={gameDone || (game?.found ?? false) ? "cheer" : game ? "think" : "happy"} size={120} className="!h-[clamp(3rem,13vh,6rem)] !w-[clamp(3rem,13vh,6rem)] shrink-0" />
            <div key={say} className="lab-say lab-pop-in min-w-0 flex-1 px-3 py-2 font-display text-[clamp(0.85rem,1.5vh+0.5rem,1.5rem)] font-extrabold leading-snug">
              <Say text={say} />
              {gameDone && (
                <div className="mt-1">
                  <Confetti />
                  <button className="lab-btn lab-btn-main !py-1 text-[0.8em]" onClick={() => startGame(mode as "san" | "doquanh")}>
                    Chơi lại
                  </button>
                </div>
              )}
            </div>
          </div>
          {game && cur && !game.found && (
            <div className="lab-chip z-10 self-start justify-self-start rounded-full px-3 py-0.5 text-sm font-extrabold sm:text-base" style={{ gridColumn: "13 / 18", gridRow: "1" }}>
              Câu {game.i + 1}/{ROUNDS}
            </div>
          )}

          {ELEMENTS.map((e) => {
            const dim = lit ? !lit.has(e.z) : false;
            const on = sel?.z === e.z || (!!lit && lit.has(e.z) && !!(thing || colHi));
            const target = !!game && !!cur && game.wrong >= 3 && cur.ans.includes(e.z) && !game.found;
            const right = !!game && game.found && !!cur && cur.ans.includes(e.z);
            return (
              <button
                key={e.z}
                onClick={() => tap(e)}
                aria-label={`${e.name} (${e.sym})`}
                className={`relative grid place-items-center rounded-md font-display font-extrabold leading-none text-[#1b1740] transition ${on || right ? "z-10 scale-110 shadow-[0_0_18px_6px_rgba(255,255,255,0.8)]" : ""} ${target ? "lab-hint z-10" : ""} ${game?.shake === e.z ? "lab-shake" : ""}`}
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
        {!game && mode === "bang" &&
          CAT_ORDER.map((c) => (
            <button
              key={c}
              onClick={() => {
                setSel(null);
                setColHi(null);
                setCat(cat === c ? null : c);
              }}
              className="rounded-full px-2.5 py-1 text-[clamp(0.7rem,1.7vh,1rem)] font-extrabold text-[#1b1740] transition active:scale-95"
              style={{ background: CATS[c].bg, boxShadow: cat === c ? "0 0 0 3px #fff, 0 0 12px #fff" : undefined, opacity: cat && cat !== c ? 0.55 : 1 }}
            >
              {CATS[c].name}
            </button>
          ))}
        {!game && mode === "quanh" && (
          <>
            {THINGS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  sfx("pop");
                  setThing(thing?.id === t.id ? null : t);
                }}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[clamp(0.8rem,1.9vh,1.1rem)] font-extrabold ${thing?.id === t.id ? "lab-accent" : "lab-chip"}`}
              >
                {t.emoji} {t.name}
              </button>
            ))}
            <button onClick={() => startGame("doquanh")} className="lab-btn lab-btn-main !px-4 !py-1 text-[clamp(0.8rem,1.9vh,1.1rem)]">
              🎯 Đố mình
            </button>
          </>
        )}
        {game && (
          <button onClick={() => stopGame(mode === "doquanh" ? "quanh" : "bang")} className="lab-btn lab-btn-ghost !px-4 !py-1 text-[clamp(0.8rem,1.9vh,1.1rem)]">
            ← Thoát {gameLabel.toLowerCase()}
          </button>
        )}
      </div>

      {sib && (
        <Siblings
          who="bit"
          onClose={() => setSib(false)}
          onShowColumn={(c) => {
            setSib(false);
            stopGame("bang");
            setSel(null);
            setCat(null);
            setThing(null);
            setColHi(c);
          }}
        />
      )}
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}
