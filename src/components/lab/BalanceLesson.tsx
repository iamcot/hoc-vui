"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { firstWrong, isBalanced, parseEquation, solve, tally } from "@/lib/chem/balance";
import { sfx } from "@/lib/chem/sfx";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { LabScene, LabShell } from "./LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "./LabChrome";
import { Guide, LAB_RATE, Say, Tag, plain } from "./Guide";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const gcdAll = (a: number[]) => a.reduce(gcd, 0);

/**
 * Bài cân bằng phương trình: chỉnh hệ số từng chất, bảng đếm nguyên tử hai vế báo ngay vế nào còn lệch.
 * Hai vế bằng nhau và hệ số đã tối giản thì qua vòng. Dùng gợi ý thì vòng đó không tính "tự làm được".
 */
export function BalanceLesson({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const info = getLesson(subjectId, lessonId)!;
  const { subject, tier, lesson, next } = info;
  const spec = lesson.balance!;
  const { markRead, recordPractice, setLast, data } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const prefs = useLabPrefs(subject, tier.id);
  const who = tier.mascot ?? subject.mascot ?? "mochi";

  const eqs = useMemo(() => spec.rounds.map((r) => parseEquation(r.eq)), [spec]);
  const [ri, setRi] = useState(-1); // -1: mở đầu, rounds.length: xong
  const [coefs, setCoefs] = useState<number[]>([]);
  const [hinted, setHinted] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);
  const [okCount, setOkCount] = useState(0);
  const [picker, setPicker] = useState(false);

  const n = spec.rounds.length;
  const round = ri >= 0 && ri < n ? spec.rounds[ri] : null;
  const eq = round ? eqs[ri] : null;
  const rows = eq ? tally(eq, coefs) : [];
  const balanced = !!eq && isBalanced(eq, coefs);
  const minimal = balanced && gcdAll(coefs) === 1;

  const start = (i: number) => {
    setRi(i);
    setCoefs(i < n ? eqs[i].left.concat(eqs[i].right).map(() => 1) : []);
    setHinted(false);
    setHintText(null);
    setSolved(false);
  };

  // đúng rồi: chờ chút cho bé ngắm rồi hiện lời giải thích
  useEffect(() => {
    if (!minimal || solved) return;
    const t = window.setTimeout(() => {
      sfx("chime");
      setSolved(true);
      if (!hinted) setOkCount((c) => c + 1);
    }, 900);
    return () => window.clearTimeout(t);
  }, [minimal, solved, hinted]);

  const finished = ri === n;
  useEffect(() => {
    if (!finished) return;
    recordPractice(subject.id, lesson.id, okCount, n);
    markRead(subject.id, lesson.id);
  }, [finished]); // eslint-disable-line react-hooks/exhaustive-deps

  const change = (i: number, d: number) => {
    if (solved) return;
    sfx("pop");
    setHintText(null);
    setCoefs((c) => c.map((v, j) => (j === i ? Math.min(12, Math.max(1, v + d)) : v)));
  };

  const hint = () => {
    if (!eq || !round) return;
    setHinted(true);
    const e = firstWrong(eq, coefs);
    const t = rows.find((r) => r.element === e);
    setHintText(
      e && t
        ? `Đếm nguyên tử **${e}**: bên trái có ${t.left}, bên phải có ${t.right}. ${t.left < t.right ? "Tăng hệ số chất bên trái có " + e : "Tăng hệ số chất bên phải có " + e} nhé!${round.hint ? " " + round.hint : ""}`
        : (round.hint ?? "Thử tăng hệ số của chất có nhiều nguyên tử nhất."),
    );
  };
  const showAnswer = () => {
    if (!eq) return;
    const s = solve(eq);
    if (s) {
      setHinted(true);
      setCoefs(s);
    }
  };

  const say =
    ri < 0
      ? spec.intro
      : finished
        ? `Xong bài ${lesson.title}!`
        : solved
          ? round!.why
          : balanced && !minimal
            ? "Hai vế bằng nhau rồi, nhưng còn **rút gọn** được nữa. Chia đều các hệ số nhé!"
            : (hintText ?? `Chỉnh **hệ số** để số nguyên tử mỗi nguyên tố hai vế **bằng nhau**.`);

  useEffect(() => {
    if (!data.sound || !say) return;
    const t = window.setTimeout(() => void speak(plain(say), { rate: LAB_RATE, fileOnly: true }), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [say, data.sound]);

  const mood = finished || solved ? "cheer" : hintText ? "think" : ri < 0 ? "happy" : "think";
  const parts = eq ? eq.left.concat(eq.right) : [];

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="fixed inset-0 overflow-hidden">
      <LabScene theme={prefs.theme} />
      <LabTopBar href={`/hoc/${subject.id}`} title={round ? `⚖️ ${round.name}` : `${lesson.emoji} ${lesson.title}`} progress={ri < 0 ? 0 : Math.min(1, (ri + (solved ? 1 : 0)) / n)} onTheme={() => setPicker(true)} />

      <div className="pointer-events-none absolute left-3 top-[4.4rem] z-20 flex flex-col">
        {ri < 0 ? (
          <Guide who={who} mood={mood} wide>
            <Tag>{tier.name.toUpperCase()}</Tag>
            <Say text={say} />
            <div className="mt-3 text-[0.75em]">
              <button className="lab-btn lab-btn-main" onClick={() => start(0)} autoFocus>
                Bắt đầu ▶
              </button>
            </div>
          </Guide>
        ) : !finished ? (
          <Guide key={`${ri}-${solved}-${balanced}-${hintText}`} who={who} mood={mood} wide={solved}>
            <Tag dots={spec.rounds.map((_, i) => (i < ri || (i === ri && solved) ? "ok" : i === ri ? "on" : ""))} color={balanced && !minimal ? "#e08a00" : undefined}>
              ⚖️ VÒNG {ri + 1}/{n}
            </Tag>
            <Say text={say} />
            {solved && (
              <div className="mt-3 text-[0.75em]">
                <button className="lab-btn lab-btn-main" onClick={() => start(ri + 1)} autoFocus>
                  {ri + 1 < n ? "Vòng tiếp ▶" : "Xong ▶"}
                </button>
              </div>
            )}
          </Guide>
        ) : null}
      </div>

      {round && eq && (
        <div className="absolute inset-x-0 bottom-0 top-[40%] z-10 flex flex-col items-center justify-center gap-3 px-3 pb-3">
          <div className={`lab-panel flex max-w-full flex-wrap items-end justify-center gap-x-1 gap-y-3 rounded-3xl px-4 py-4 sm:px-6 ${solved ? "ring-4 ring-[#22b98c]" : ""}`}>
            {parts.map((f, i) => (
              <div key={i} className="flex items-end gap-1">
                {i > 0 && <span className="lab-soft w-6 text-center font-display text-3xl font-extrabold leading-[2.5rem]">{i === eq.left.length ? "→" : "+"}</span>}
                <div className="flex flex-col items-center gap-1">
                  <button aria-label={`Tăng hệ số ${f}`} disabled={solved} onClick={() => change(i, 1)} className="lab-chip h-10 w-14 rounded-xl text-2xl font-extrabold active:scale-95">
                    ▲
                  </button>
                  <div className="lab-mono grid h-14 min-w-14 place-items-center rounded-xl text-4xl font-extrabold" style={{ background: "var(--lab-accent)", color: "var(--lab-accent-ink)" }}>
                    {coefs[i]}
                  </div>
                  <button aria-label={`Giảm hệ số ${f}`} disabled={solved} onClick={() => change(i, -1)} className="lab-chip h-10 w-14 rounded-xl text-2xl font-extrabold active:scale-95">
                    ▼
                  </button>
                  <div className="lab-mono mt-1 text-3xl font-extrabold leading-[2.5rem] sm:text-4xl">{f}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {rows.map((t) => (
              <span key={t.element} className="lab-mono rounded-full px-4 py-1.5 text-lg font-extrabold sm:text-xl" style={{ background: t.ok ? "#22b98c" : "var(--lab-chip)", color: t.ok ? "#fff" : "var(--lab-text)", boxShadow: t.ok ? undefined : "0 0 0 2px #ff4f7b" }}>
                {t.element}: {t.left} {t.ok ? "=" : "≠"} {t.right}
              </span>
            ))}
          </div>

          {!solved && (
            <div className="flex gap-2">
              <button className="lab-btn lab-btn-ghost text-base sm:text-lg" onClick={hint}>
                💡 Gợi ý
              </button>
              {hinted && (
                <button className="lab-btn lab-btn-ghost text-base sm:text-lg" onClick={showAnswer}>
                  Xem đáp án
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {finished && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-3 pt-16">
          <div className="lab-sheet lab-pop-in flex max-h-full w-full max-w-xl flex-col gap-3 overflow-y-auto rounded-3xl p-5 sm:p-6">
            <Confetti />
            <div className="flex flex-col items-center gap-2 text-center">
              <Mascot who={who} mood="cheer" size={110} />
              <h2 className="font-display text-3xl font-extrabold">Xong bài {lesson.title}!</h2>
              <p className="text-base opacity-80">
                Tự cân bằng đúng <b>{okCount}/{n}</b> phương trình.
              </p>
            </div>
            <div className="rounded-2xl bg-[#fff6d8] px-3 py-2 text-base text-[#4a3500]">
              ⚖️ <b>{spec.remember}</b>
            </div>
            <Link href={`/hoc/${subject.id}/${lesson.id}/luyen-tap`} className="lab-btn lab-btn-main text-lg">
              🎯 Luyện tập
            </Link>
            <div className="flex gap-2">
              {next && (
                <Link href={`/hoc/${subject.id}/${next.id}`} className="lab-btn lab-btn-ghost flex-1 text-sm">
                  Bài tiếp ▶
                </Link>
              )}
              <Link href={`/hoc/${subject.id}`} className="lab-btn lab-btn-ghost flex-1 text-sm">
                Về bản đồ
              </Link>
            </div>
          </div>
        </div>
      )}
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}
