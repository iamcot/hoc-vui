"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getLesson } from "@/content/subjects";
import type { Mood, Question } from "@/content/types";
import { INCIDENTS } from "@/content/subjects/hoa-hoc/incidents";
import { useProgress } from "@/lib/store";
import { practiceSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { initLab, level, type LabEvent, type LabState } from "@/lib/chem/lab";
import { loadNotes, noteExperiment, noteIncident, noteSkipped } from "@/lib/chem/notebook";
import { sfx } from "@/lib/chem/sfx";
import { DEPTHS, type Depth, type Experiment, type Incident, type Tool } from "@/lib/chem/types";
import { speak, stopSpeak } from "@/lib/speech/tts";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Bench } from "./Bench";
import { BoomFx, Equation, IncidentCard, SplatFx } from "./Fx";
import { LabShell } from "./LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "./LabChrome";
import { Guide, Say, Tag, plain } from "./Guide";

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
  const [hintOn, setHint] = useState(false);
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

  // ---------- Mochi nói gì, chỉ vào đâu ----------
  const steps = exp.goal.steps ?? [];
  const si = steps.findIndex((x) => !x.done(state.log, state));
  const cur = si >= 0 ? steps[si] : undefined;
  const [praise, setPraise] = useState(false);
  const prevSi = useRef(0);
  useEffect(() => {
    if (phase !== "do") {
      prevSi.current = 0;
      return;
    }
    const at = si < 0 ? steps.length : si;
    if (at > prevSi.current && si >= 0) {
      setPraise(true);
      const t = window.setTimeout(() => setPraise(false), 2600);
      prevSi.current = at;
      return () => window.clearTimeout(t);
    }
    prevSi.current = at;
  }, [si, phase, steps.length]);

  const foamy = state.vessels.some((v) => !v.spilled && v.foam > 0.05 && level(v) + v.foam / v.cap > 0.85);
  let say = exp.goal.text;
  let mood: Mood = "happy";
  let hint: { chem?: string; vessel?: string; tool?: Tool } | undefined;
  let warn = false;
  if (phase === "do") {
    if (state.danger) {
      say = "Nóng lên quá nhanh! Bấm **✋ Dừng lại** ngay!";
      mood = "oops";
      warn = true;
    } else if (won) {
      say = "Thành công rồi! 🎉 Giỏi quá!";
      mood = "cheer";
    } else if (foamy) {
      say = "Bọt lên cao rồi! **Dừng tay**, đợi bọt xẹp bớt nhé.";
      mood = "oops";
      warn = true;
    } else if (cur) {
      const added = cur.chem ? state.log.some((k) => k === `add:${cur.vessel}:${cur.chem}` || (!cur.vessel && k === `add:${cur.chem}`)) : true;
      if (!added) {
        say = cur.say ?? cur.text;
        hint = { chem: cur.chem, vessel: cur.vessel };
      } else {
        say = cur.chem ? (cur.then ?? cur.say ?? cur.text) : (cur.say ?? cur.text);
        hint = { chem: cur.thenChem, vessel: cur.vessel, tool: cur.tool };
      }
      if (praise) {
        say = `Giỏi lắm! ${say}`;
        mood = "wow";
      }
    }
  }
  const depthNow: Depth = exp.explain[depthOf(tier.id)] ? depthOf(tier.id) : (DEPTHS.find((d) => exp.explain[d.id])?.id ?? "nhi");
  const guessLine = exp.predict && guess !== null ? (guess === exp.predict.answer ? "Con đoán **đúng** rồi! 🎯 " : `Kết quả là **${exp.predict.choices[exp.predict.answer].label.toLowerCase()}** nhé. `) : "";
  const speech =
    phase === "intro"
      ? `Chào con! Hôm nay mình làm ${lesson.title}.`
      : phase === "predict"
        ? (exp.predict?.q ?? "")
        : phase === "do"
          ? say
          : phase === "explain"
            ? guessLine + (exp.explain[depthNow] ?? "")
            : phase === "done"
              ? `Xong bài ${lesson.title}!`
              : "";
  const { data } = useProgress();
  useEffect(() => {
    if (!data.sound || !speech) return;
    const t = window.setTimeout(() => void speak(plain(speech)), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [speech, data.sound]);

  const [deep, setDeep] = useState(false);
  const step = phase === "predict" ? 0 : phase === "do" ? 1 : phase === "explain" ? 2 : -1;
  const progress = phase === "intro" || phase === "skip" ? 0 : phase === "done" ? 1 : (ei + (step + 1) / 3) / exps.length;
  const locked = phase !== "do" || !!inc || !!fx;
  const depths = DEPTHS.filter((d) => exp.explain[d.id]);
  const shownDepth = exp.explain[depth] ? depth : (depths[depths.length - 1]?.id ?? "nhi");
  const long = (t: string) => plain(t).length > 130;
  const tagSteps = (k: number) => ["Đoán", "Làm", "Hiểu"].map((_, i) => (i < k ? "ok" : i === k ? "on" : "")) as ("ok" | "on" | "")[];

  const guide =
    phase === "intro" ? (
      <Guide who={who} mood="happy" wide>
        <Tag>{tier.name.toUpperCase()}</Tag>
        Chào con! Hôm nay mình làm <b>{lesson.title}</b>.
        <div className="mt-2 flex flex-col gap-1 text-[0.62em]">
          {exps.map((x, i) => (
            <span key={x.id}>
              {x.emoji} Thí nghiệm {i + 1}: {x.title}
              {x.safety && !x.safety.home && <span className="ml-1 text-[#ff4f7b]">· chỉ ở phòng lab</span>}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[0.75em]">
          <button className="lab-btn lab-btn-main" onClick={() => begin(0)} autoFocus>
            Bắt đầu ▶
          </button>
          {lesson.practice.length > 0 && (
            <button className="lab-opt rounded-2xl px-4 py-2 text-[0.8em] font-extrabold" onClick={startSkip}>
              Biết rồi? Thử 3 câu
            </button>
          )}
        </div>
      </Guide>
    ) : phase === "predict" && exp.predict ? (
      <Guide who={who} mood="think" wide>
        <Tag dots={tagSteps(0)}>
          🤔 ĐOÁN TRƯỚC · THÍ NGHIỆM {ei + 1}/{exps.length}
        </Tag>
        <p className="lab-soft mb-1 text-[0.6em] font-bold leading-snug">{exp.intro}</p>
        {exp.predict.q}
        <div className="mt-3 flex flex-wrap gap-2 text-[0.8em]">
          {exp.predict.choices.map((c, i) => (
            <button
              key={c.label}
              className="lab-opt flex items-center gap-2 rounded-2xl px-4 py-2 font-extrabold transition active:scale-95"
              onClick={() => {
                setGuess(i);
                setPhase("do");
              }}
            >
              {c.color && <span className="h-7 w-7 shrink-0 rounded-full" style={{ background: c.color, boxShadow: "inset 0 -3px 6px #0003, 0 0 0 2px #fff" }} />}
              {c.emoji && <span>{c.emoji}</span>}
              {c.label}
            </button>
          ))}
        </div>
      </Guide>
    ) : phase === "do" ? (
      <Guide key={`${ei}-${si}-${warn}`} who={who} mood={mood}>
        <Tag dots={steps.length > 1 ? steps.map((x, i) => (i < si || si < 0 ? "ok" : i === si ? "on" : "")) : undefined} color={warn ? "#ff4f7b" : undefined}>
          {warn ? "⚠ CẨN THẬN" : steps.length > 1 && si >= 0 ? `🧪 BƯỚC ${si + 1}/${steps.length}` : "🧪 LÀM THÍ NGHIỆM"}
        </Tag>
        <Say text={say} />
        {hintOn && exp.goal.hint && !won && !warn && <div className="mt-2 rounded-xl bg-[#ffefc4] px-3 py-1.5 text-[0.6em] font-bold text-[#6b4a00]">💡 {exp.goal.hint}</div>}
      </Guide>
    ) : phase === "explain" ? (
      <Guide who={who} mood="cheer" wide>
        <Tag dots={tagSteps(2)}>💡 VÌ SAO?</Tag>
        <div className={long(exp.explain[depthNow] ?? "") ? "text-[0.8em]" : ""}>
          <Say text={guessLine} />
          {exp.explain[depthNow]}
        </div>
      </Guide>
    ) : null;

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="fixed inset-0 overflow-hidden">
      <Bench
        key={`${ei}`}
        state={state}
        setState={setState}
        shelf={exp.shelf}
        tools={exp.tools}
        theme={prefs.theme}
        formulas={formulas}
        onEvent={onEvent}
        locked={locked}
        onReset={phase === "do" ? () => reset(exp) : undefined}
        hint={hint}
        guide={guide}
        dim={phase === "intro" || phase === "predict" || phase === "done" || phase === "skip"}
      />
      {toast && <div className="lab-pop-in absolute left-1/2 top-[45%] z-40 -translate-x-1/2 rounded-full bg-[#22b98c] px-5 py-2 font-display text-lg font-extrabold text-white shadow-lg">{toast}</div>}

      <LabTopBar href={`/hoc/${subject.id}`} title={phase === "intro" || phase === "done" || phase === "skip" ? `${lesson.emoji} ${lesson.title}` : `${exp.emoji} ${exp.title}`} progress={progress} onTheme={() => setPicker(true)}>
        {phase === "do" && steps.length > 0 && (
          <div className="flex shrink-0 items-center gap-1">
            {steps.map((x, i) => {
              const ok = i < si || si < 0;
              return (
                <span key={x.text} className={`whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-extrabold ${ok ? "bg-[#22b98c] text-white" : i === si ? "lab-accent" : "lab-soft"}`} style={ok || i === si ? undefined : { boxShadow: "0 0 0 1px var(--lab-line)" }}>
                  {ok ? "✓ " : ""}
                  {x.text}
                </span>
              );
            })}
          </div>
        )}
      </LabTopBar>

      {/* xem kết quả: ghi nhớ + đi tiếp */}
      {phase === "explain" && (
        <div className="lab-sheet lab-pop-in absolute inset-x-3 bottom-3 z-30 mx-auto flex max-w-3xl flex-wrap items-center gap-3 rounded-3xl p-4 sm:p-5">
          <div className="min-w-[15rem] flex-1">
            <div className="rounded-2xl bg-[#fff6d8] px-4 py-2.5 text-[#4a3500]">
              <div className="text-xs font-extrabold">📓 GHI NHỚ · đã cất vào Sổ tay</div>
              <p className="font-display text-base font-extrabold leading-snug sm:text-lg">{exp.remember}</p>
            </div>
            {exp.equation && formulas && (
              <div className="mt-2">
                <Equation parts={exp.equation} />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button className="lab-btn lab-btn-main text-lg" onClick={() => (ei + 1 < exps.length ? begin(ei + 1) : setPhase("done"))} autoFocus>
              {ei + 1 < exps.length ? "Thí nghiệm tiếp ▶" : "Xong bài ▶"}
            </button>
            <div className="flex gap-2">
              <button className="lab-btn lab-btn-ghost flex-1 px-3 text-xs" onClick={() => setDeep(true)}>
                🔬 Giải thích sâu
              </button>
              <button className="lab-btn lab-btn-ghost px-3 text-xs" onClick={() => begin(ei)}>
                ↺ Làm lại
              </button>
            </div>
          </div>
        </div>
      )}

      {/* giải thích sâu: những gì quan sát được + các cấp giải thích */}
      {deep && phase === "explain" && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-3" onClick={() => setDeep(false)}>
          <div className="lab-sheet lab-pop-in flex max-h-[94dvh] w-full max-w-2xl flex-col gap-3 overflow-y-auto rounded-3xl p-5 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-2xl font-extrabold">
              {exp.emoji} {exp.title}
            </h2>
            <div>
              <div className="text-xs font-extrabold opacity-60">CON ĐÃ THẤY</div>
              <ul className="mt-1 flex flex-col gap-1">
                {exp.observe.map((o) => (
                  <li key={o} className="flex gap-2 text-base">
                    <span>👀</span>
                    {o}
                  </li>
                ))}
              </ul>
            </div>
            {depths.length > 1 && (
              <div className="flex flex-wrap gap-1">
                {depths.map((d) => (
                  <button key={d.id} onClick={() => setDepth(d.id)} className={`rounded-xl px-3 py-1 text-sm font-extrabold ${shownDepth === d.id ? "lab-accent" : "lab-chip"}`}>
                    {d.emoji} {d.name}
                  </button>
                ))}
              </div>
            )}
            <p className="text-lg leading-relaxed">{exp.explain[shownDepth]}</p>
            {exp.equation && (shownDepth === "thcs" || shownDepth === "thpt") && <Equation parts={exp.equation} />}
            {exp.safety && <div className={`rounded-2xl px-3 py-2 text-sm font-bold ${exp.safety.home ? "bg-[#22b98c22]" : "bg-[#ff4f7b22]"}`}>🦺 {exp.safety.text}</div>}
            <button className="lab-btn lab-btn-main self-end" onClick={() => setDeep(false)}>
              Đã hiểu ✓
            </button>
          </div>
        </div>
      )}

      {(phase === "done" || (phase === "skip" && quiz)) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-3 pt-16">
          <div className="lab-sheet lab-pop-in flex max-h-full w-full max-w-xl flex-col gap-3 overflow-y-auto rounded-3xl p-5 sm:p-6">
            {phase === "done" && (
              <>
                <Confetti />
                <div className="flex flex-col items-center gap-2 text-center">
                  <Mascot who={who} mood="cheer" size={110} />
                  <h2 className="font-display text-3xl font-extrabold">Xong bài {lesson.title}!</h2>
                  <p className="text-sm opacity-70">Con đã làm {exps.length} thí nghiệm. Ghi nhớ đã cất vào Sổ tay.</p>
                </div>
                <ul className="flex flex-col gap-2">
                  {exps.map((x) => (
                    <li key={x.id} className="rounded-2xl bg-[#fff6d8] px-3 py-2 text-sm text-[#4a3500]">
                      {x.emoji} <b>{x.remember}</b>
                    </li>
                  ))}
                </ul>
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
                    <div className="text-xs font-extrabold tracking-wider opacity-60">
                      THỬ NHANH · CÂU {quiz.i + 1}/{quiz.qs.length} · đúng 2 câu là qua bài
                    </div>
                    <div className="rounded-2xl bg-white p-1 text-ink">
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
          </div>
        </div>
      )}

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
