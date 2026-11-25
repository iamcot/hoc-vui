"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLesson } from "@/content/subjects";
import type { Question } from "@/content/types";
import { INCIDENTS } from "@/content/subjects/hoa-hoc/incidents";
import { useProgress } from "@/lib/store";
import { practiceSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { initLab, type LabEvent, type LabState } from "@/lib/chem/lab";
import { loadNotes, noteExperiment, noteIncident, noteSkipped } from "@/lib/chem/notebook";
import { sfx } from "@/lib/chem/sfx";
import { DEPTHS, type Depth, type Experiment, type Incident } from "@/lib/chem/types";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Bench } from "./Bench";
import { BoomFx, Equation, IncidentCard, SplatFx } from "./Fx";
import { LabShell } from "./LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "./LabChrome";

type Phase = "intro" | "predict" | "do" | "explain" | "done" | "skip";

export const depthOf = (tierId: string): Depth => (["nhi", "khtn", "thcs", "thpt"].includes(tierId) ? (tierId as Depth) : "nhi");

/**
 * Bài thí nghiệm: mỗi thí nghiệm đi 4 bước Đoán → Làm → Hiểu → Ghi nhớ.
 * Làm sai (đổ quá tay, mẩu natri to) thì có sự cố: hiệu ứng, thẻ "Vì sao?", rồi làm lại cho đúng.
 */
export function ChemLesson({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const info = getLesson(subjectId, lessonId)!;
  const { subject, tier, lesson, next } = info;
  const lab = lesson.lab!;
  const exps = lab.experiments;
  const { markRead, recordPractice, setLast } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const prefs = useLabPrefs(subject, tier.id);
  const who = tier.mascot ?? subject.mascot ?? "mochi";
  const formulas = tier.id === "thcs" || tier.id === "thpt";

  const [phase, setPhase] = useState<Phase>("intro");
  const [ei, setEi] = useState(0);
  const exp: Experiment = exps[ei];
  const [state, setState] = useState<LabState>(() => initLab(exp.vessels));
  const [guess, setGuess] = useState<number | null>(null);
  const [depth, setDepth] = useState<Depth>(depthOf(tier.id));
  const [fx, setFx] = useState<null | "boom" | "splat">(null);
  const [inc, setInc] = useState<{ inc: Incident; count: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [hint, setHint] = useState(false);
  const [picker, setPicker] = useState(false);
  const failed = useRef(false);

  const reset = useCallback((e: Experiment) => {
    failed.current = false;
    setState(initLab(e.vessels));
    setHint(false);
  }, []);

  const begin = (i: number) => {
    setEi(i);
    reset(exps[i]);
    setGuess(null);
    setPhase(exps[i].predict ? "predict" : "do");
  };

  // làm xong mục tiêu: chờ chút cho bé ngắm rồi sang phần giải thích
  const won = phase === "do" && !inc && !fx && !failed.current && exp.goal.done(state.log, state);
  useEffect(() => {
    if (!won) return;
    const t = window.setTimeout(() => {
      sfx("chime");
      noteExperiment(exp.id, lesson.id);
      setPhase("explain");
    }, 1500);
    return () => window.clearTimeout(t);
  }, [won, exp.id, lesson.id]);

  // loay hoay lâu thì hiện gợi ý
  useEffect(() => {
    if (phase !== "do") return;
    const t = window.setTimeout(() => setHint(true), 25000);
    return () => window.clearTimeout(t);
  }, [phase, ei]);

  const showIncident = (id: string) => {
    const x = INCIDENTS[id];
    if (!x) return;
    noteIncident(id);
    const n = Object.keys(loadNotes().incidents).length;
    setInc({ inc: x, count: `${n} sự cố` });
  };

  const onEvent = (e: LabEvent) => {
    if (phase !== "do") return;
    if (e.type === "stopped") {
      setToast("✋ Phản xạ an toàn! Dừng đúng lúc.");
      window.setTimeout(() => setToast(null), 2600);
    }
    if (failed.current) return;
    if (e.type === "overflow") {
      failed.current = true;
      window.setTimeout(() => setFx("splat"), 500);
    }
    if (e.type === "boom") {
      failed.current = true;
      setFx("boom");
    }
  };

  const fxDone = useCallback(() => {
    if (fx === "boom") showIncident(exp.incidents?.boom ?? "natri-to");
    if (fx === "splat") showIncident(exp.incidents?.overflow ?? "tran-coc");
    setFx(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fx, exp]);

  // xong cả bài
  const readDone = useRef(false);
  useEffect(() => {
    if (phase === "done" && !readDone.current) {
      readDone.current = true;
      markRead(subject.id, lesson.id);
      sfx("chime");
    }
  }, [phase, markRead, subject.id, lesson.id]);

  // "Biết rồi? Thử 3 câu": đúng 2/3 thì cho qua bài (1 sao)
  const [quiz, setQuiz] = useState<{ qs: Question[]; i: number; ok: number } | null>(null);
  const startSkip = () => {
    setQuiz({ qs: practiceSet(subject, lesson.id, randomSeed(), 3), i: 0, ok: 0 });
    setPhase("skip");
  };

  const step = phase === "predict" ? 0 : phase === "do" ? 1 : phase === "explain" ? 2 : -1;
  const progress = phase === "intro" || phase === "skip" ? 0 : phase === "done" ? 1 : (ei + (step + 1) / 3) / exps.length;
  const locked = phase !== "do" || !!inc || !!fx;
  const depths = DEPTHS.filter((d) => exp.explain[d.id]);
  const shownDepth = exp.explain[depth] ? depth : (depths[depths.length - 1]?.id ?? "nhi");

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="lab-layout fixed inset-0 flex flex-col overflow-hidden md:block">
      <div className="relative h-[56dvh] shrink-0 md:absolute md:inset-0 md:h-auto">
        <Bench
          key={`${ei}`}
          state={state}
          setState={setState}
          shelf={exp.shelf}
          tools={exp.tools}
          theme={prefs.theme}
          formulas={formulas}
          rightPad="var(--lab-pad)"
          onEvent={onEvent}
          locked={locked}
          onReset={phase === "do" ? () => reset(exp) : undefined}
        />
        {toast && <div className="lab-pop-in absolute left-1/2 top-[38%] z-40 -translate-x-1/2 rounded-full bg-[#22b98c] px-5 py-2 font-display text-lg font-extrabold text-white shadow-lg md:left-[calc((100%-var(--lab-pad))/2)]">{toast}</div>}
      </div>

      <LabTopBar href={`/hoc/${subject.id}`} title={`${lesson.emoji} ${lesson.title}`} progress={progress} onTheme={() => setPicker(true)}>
        {step >= 0 && (
          <div className="hidden shrink-0 items-center gap-1 lg:flex">
            {["Đoán", "Làm", "Hiểu"].map((x, i) => (
              <span key={x} className={`rounded-full px-2 py-0.5 text-xs font-extrabold ${i === step ? "lab-accent" : i < step ? "lab-soft" : "lab-soft opacity-50"}`}>
                {i < step ? "✓ " : ""}
                {x}
              </span>
            ))}
          </div>
        )}
      </LabTopBar>

      {/* khung chữ: bên phải (iPad, laptop), bên dưới (điện thoại) */}
      <aside className="lab-panel relative z-20 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 md:absolute md:bottom-3 md:right-3 md:top-[4.2rem] md:w-[min(25rem,40vw)] md:rounded-3xl md:p-5">
        {phase === "intro" && (
          <>
            <div className="flex items-center gap-3">
              <Mascot who={who} mood="happy" size={64} className="shrink-0" />
              <div>
                <div className="lab-soft text-xs font-extrabold tracking-wider">{tier.name.toUpperCase()}</div>
                <h1 className="font-display text-2xl font-extrabold leading-tight">{lesson.title}</h1>
              </div>
            </div>
            <p className="lab-soft text-sm">{lesson.short}</p>
            <ol className="flex flex-col gap-2">
              {exps.map((x, i) => (
                <li key={x.id} className="lab-chip flex items-center gap-3 rounded-2xl px-3 py-2">
                  <span className="text-2xl">{x.emoji}</span>
                  <b className="flex-1 text-sm">
                    Thí nghiệm {i + 1}: {x.title}
                  </b>
                  {x.safety && !x.safety.home && <span className="text-xs font-bold text-[#ff4f7b]">⚠ chỉ ở lab</span>}
                </li>
              ))}
            </ol>
            <div className="lab-soft text-xs">Mỗi thí nghiệm: 🤔 Đoán → 🧪 Làm → 💡 Hiểu → 📓 Ghi nhớ</div>
            <span className="flex-1" />
            <button className="lab-btn lab-btn-main text-lg" onClick={() => begin(0)} autoFocus>
              Bắt đầu ▶
            </button>
            {lesson.practice.length > 0 && (
              <button className="lab-btn lab-btn-ghost text-sm" onClick={startSkip}>
                Biết rồi? Thử 3 câu để qua bài
              </button>
            )}
          </>
        )}

        {phase === "predict" && exp.predict && (
          <>
            <Head exp={exp} i={ei} n={exps.length} tag="🤔 ĐOÁN TRƯỚC" />
            <p className="text-sm">{exp.intro}</p>
            <p className="font-display text-lg font-extrabold leading-snug">{exp.predict.q}</p>
            <div className="flex flex-col gap-2">
              {exp.predict.choices.map((c, i) => (
                <button
                  key={c.label}
                  className="lab-chip flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left font-bold"
                  onClick={() => {
                    setGuess(i);
                    setPhase("do");
                  }}
                >
                  {c.color && <span className="h-7 w-7 shrink-0 rounded-full" style={{ background: c.color, boxShadow: "inset 0 -3px 6px #0003, 0 0 0 2px #fff8" }} />}
                  {c.emoji && <span className="text-2xl">{c.emoji}</span>}
                  {c.label}
                </button>
              ))}
            </div>
            <div className="lab-soft text-xs">Đoán sai cũng không sao. Làm xong mình xem kết quả nhé!</div>
          </>
        )}

        {phase === "do" && (
          <>
            <Head exp={exp} i={ei} n={exps.length} tag="🧪 LÀM THÍ NGHIỆM" />
            {!exp.predict && <p className="text-sm">{exp.intro}</p>}
            <div className="rounded-2xl p-3" style={{ boxShadow: "0 0 0 2px var(--lab-accent)" }}>
              <div className="lab-soft text-xs font-extrabold">NHIỆM VỤ</div>
              <p className="font-display text-lg font-extrabold leading-snug">{exp.goal.text}</p>
              {exp.goal.steps && (
                <ul className="mt-2 flex flex-col gap-1">
                  {exp.goal.steps.map((s) => {
                    const ok = s.done(state.log, state);
                    return (
                      <li key={s.text} className={`flex items-center gap-2 text-sm font-bold ${ok ? "" : "lab-soft"}`}>
                        <span className={`grid h-5 w-5 place-items-center rounded-full text-xs ${ok ? "bg-[#22b98c] text-white" : ""}`} style={ok ? undefined : { boxShadow: "0 0 0 1.5px var(--lab-line)" }}>
                          {ok ? "✓" : ""}
                        </span>
                        {s.text}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className="lab-soft text-sm">
              <b>Cách làm:</b> kéo lọ trên kệ thả vào dụng cụ, hoặc chạm lọ rồi chạm dụng cụ.
            </div>
            {hint && exp.goal.hint && <div className="lab-pop-in rounded-2xl bg-[#ffefc4] px-3 py-2 text-sm font-bold text-[#6b4a00]">💡 {exp.goal.hint}</div>}
            {exp.safety && (
              <div className={`rounded-2xl px-3 py-2 text-xs font-bold ${exp.safety.home ? "bg-[#22b98c22]" : "bg-[#ff4f7b22]"}`}>
                🦺 {exp.safety.text}
              </div>
            )}
            {won && <div className="lab-pop-in text-center font-display text-xl font-extrabold">✨ Thành công rồi!</div>}
          </>
        )}

        {phase === "explain" && (
          <>
            <Head exp={exp} i={ei} n={exps.length} tag="💡 VÌ SAO?" />
            {exp.predict && guess !== null && (
              <div className={`rounded-2xl px-3 py-2 text-sm font-bold ${guess === exp.predict.answer ? "bg-[#22b98c22]" : "bg-[#ffb81f22]"}`}>
                {guess === exp.predict.answer ? "🎯 Con đoán đúng: " : "🤔 Con đoán “" + exp.predict.choices[guess].label + "”, kết quả là: "}
                {exp.predict.choices[exp.predict.answer].label}
              </div>
            )}
            <div>
              <div className="lab-soft mb-1 text-xs font-extrabold">CON ĐÃ THẤY</div>
              <ul className="flex flex-col gap-1">
                {exp.observe.map((o) => (
                  <li key={o} className="flex gap-2 text-sm">
                    <span>👀</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            {depths.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {depths.map((d) => (
                  <button key={d.id} onClick={() => setDepth(d.id)} className={`rounded-xl px-2.5 py-1 text-xs font-extrabold ${shownDepth === d.id ? "lab-accent" : "lab-chip"}`}>
                    {d.emoji} {d.name}
                  </button>
                ))}
              </div>
            )}
            <p className="text-base leading-relaxed">{exp.explain[shownDepth]}</p>
            {exp.equation && (shownDepth === "thcs" || shownDepth === "thpt") && <Equation parts={exp.equation} />}
            <div className="rounded-2xl bg-[#fff6d8] p-3 text-[#4a3500]">
              <div className="text-xs font-extrabold">📓 GHI NHỚ · đã cất vào Sổ tay</div>
              <p className="font-display text-base font-extrabold leading-snug">{exp.remember}</p>
            </div>
            <span className="flex-1" />
            <div className="flex gap-2">
              <button className="lab-btn lab-btn-ghost text-sm" onClick={() => begin(ei)}>
                ↺ Làm lại
              </button>
              <button className="lab-btn lab-btn-main flex-1 text-lg" onClick={() => (ei + 1 < exps.length ? begin(ei + 1) : setPhase("done"))} autoFocus>
                {ei + 1 < exps.length ? "Thí nghiệm tiếp ▶" : "Xong bài ▶"}
              </button>
            </div>
          </>
        )}

        {phase === "done" && (
          <>
            <Confetti />
            <div className="flex flex-col items-center gap-2 text-center">
              <Mascot who={who} mood="cheer" size={96} />
              <h2 className="font-display text-2xl font-extrabold">Xong bài {lesson.title}!</h2>
              <p className="lab-soft text-sm">Con đã làm {exps.length} thí nghiệm. Ghi nhớ đã cất vào Sổ tay.</p>
            </div>
            <ul className="flex flex-col gap-2">
              {exps.map((x) => (
                <li key={x.id} className="lab-chip rounded-2xl px-3 py-2 text-sm">
                  {x.emoji} <b>{x.remember}</b>
                </li>
              ))}
            </ul>
            <span className="flex-1" />
            <Link href={`/hoc/${subject.id}/${lesson.id}/luyen-tap`} className="lab-btn lab-btn-main text-lg">
              🎯 Thực hành nhiệm vụ
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
          </>
        )}

        {phase === "skip" && quiz && (
          <>
            {quiz.i < quiz.qs.length ? (
              <>
                <div className="lab-soft text-xs font-extrabold tracking-wider">
                  THỬ NHANH · CÂU {quiz.i + 1}/{quiz.qs.length} · đúng 2 câu là qua bài
                </div>
                <div className="rounded-2xl bg-white p-3 text-ink">
                  <QuestionCard key={quiz.qs[quiz.i].id} q={quiz.qs[quiz.i]} onNext={(r) => setQuiz((z) => (z ? { ...z, i: z.i + 1, ok: z.ok + (r.correct ? 1 : 0) } : z))} />
                </div>
              </>
            ) : (
              <SkipResult
                ok={quiz.ok}
                n={quiz.qs.length}
                who={who}
                onPass={() => {
                  recordPractice(subject.id, lesson.id, 1, 2);
                  markRead(subject.id, lesson.id);
                  noteSkipped([lesson.id]);
                }}
                nextHref={next ? `/hoc/${subject.id}/${next.id}` : `/hoc/${subject.id}`}
                onLearn={() => begin(0)}
              />
            )}
          </>
        )}
      </aside>

      {fx === "boom" && <BoomFx onDone={fxDone} calm={prefs.calm} who={who} />}
      {fx === "splat" && <SplatFx onDone={fxDone} />}
      {inc && (
        <IncidentCard
          inc={inc.inc}
          depth={depthOf(tier.id)}
          who={who}
          count={inc.count}
          onRetry={() => {
            setInc(null);
            reset(exp);
          }}
        />
      )}
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}

function Head({ exp, i, n, tag }: { exp: Experiment; i: number; n: number; tag: string }) {
  return (
    <div>
      <div className="lab-soft text-xs font-extrabold tracking-wider">
        {tag} · THÍ NGHIỆM {i + 1}/{n}
      </div>
      <h2 className="font-display text-xl font-extrabold leading-tight">
        {exp.emoji} {exp.title}
      </h2>
    </div>
  );
}

function SkipResult({ ok, n, who, onPass, nextHref, onLearn }: { ok: number; n: number; who: "mochi" | "bit"; onPass: () => void; nextHref: string; onLearn: () => void }) {
  const pass = ok >= Math.ceil((n * 2) / 3);
  const done = useRef(false);
  useEffect(() => {
    if (pass && !done.current) {
      done.current = true;
      onPass();
    }
  }, [pass, onPass]);
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Mascot who={who} mood={pass ? "cheer" : "think"} size={88} />
      <h2 className="font-display text-2xl font-extrabold">
        Đúng {ok}/{n} câu
      </h2>
      {pass ? (
        <>
          <p className="text-sm">Con nắm bài rồi! Bài này được đánh dấu đã qua (1 sao). Muốn 3 sao thì vào làm thí nghiệm nhé.</p>
          <Link href={nextHref} className="lab-btn lab-btn-main w-full text-lg">
            Sang bài tiếp ▶
          </Link>
          <button className="lab-btn lab-btn-ghost w-full text-sm" onClick={onLearn}>
            Vẫn muốn làm thí nghiệm
          </button>
        </>
      ) : (
        <>
          <p className="text-sm">Chưa đủ 2 câu. Mình làm thí nghiệm cho chắc nhé, nhanh lắm!</p>
          <button className="lab-btn lab-btn-main w-full text-lg" onClick={onLearn} autoFocus>
            Làm thí nghiệm ▶
          </button>
        </>
      )}
    </div>
  );
}
