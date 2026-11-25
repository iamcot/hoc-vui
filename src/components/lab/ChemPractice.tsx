"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getLesson } from "@/content/subjects";
import type { Question } from "@/content/types";
import { INCIDENTS } from "@/content/subjects/hoa-hoc/incidents";
import { useProgress } from "@/lib/store";
import { practiceSet } from "@/lib/quiz";
import { makeRng, randomSeed } from "@/lib/rng";
import { initLab, type LabEvent, type LabState } from "@/lib/chem/lab";
import { loadNotes, noteIncident } from "@/lib/chem/notebook";
import { sfx } from "@/lib/chem/sfx";
import type { Incident, Mission } from "@/lib/chem/types";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconStar } from "@/components/Icons";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Bench } from "./Bench";
import { BoomFx, IncidentCard, SplatFx } from "./Fx";
import { LabShell } from "./LabScene";
import { LabThemePicker, LabTopBar, useLabPrefs } from "./LabChrome";
import { depthOf } from "./ChemLesson";

const QUIZ = 5;
const MAX_MISSION = 3;

/**
 * Thực hành: 1 nhiệm vụ ngẫu nhiên trên bàn thí nghiệm (nhận biết chất hoặc đạt mục tiêu, tối đa 3 điểm)
 * rồi 5 câu hỏi. Sao tính trên 8 điểm.
 */
export function ChemPractice({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const [seed, setSeed] = useState<string | null>(null);
  useEffect(() => setSeed(randomSeed()), []);
  if (!seed) return null;
  return <Run key={seed} subjectId={subjectId} lessonId={lessonId} seed={seed} again={() => setSeed(randomSeed())} />;
}

function Run({ subjectId, lessonId, seed, again }: { subjectId: string; lessonId: string; seed: string; again: () => void }) {
  const info = getLesson(subjectId, lessonId)!;
  const { subject, tier, lesson, next } = info;
  const { recordPractice, setLast } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const prefs = useLabPrefs(subject, tier.id);
  const who = tier.mascot ?? subject.mascot ?? "mochi";
  const formulas = tier.id === "thcs" || tier.id === "thpt";

  const mission: Mission = useMemo(() => {
    const rng = makeRng(seed);
    return rng.pick(lesson.lab!.missions)(rng);
  }, [seed, lesson]);
  const qs: Question[] = useMemo(() => practiceSet(subject, lesson.id, seed, QUIZ), [subject, lesson.id, seed]);

  const [state, setState] = useState<LabState>(() => initLab(mission.vessels));
  const [phase, setPhase] = useState<"mission" | "checked" | "quiz" | "result">("mission");
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [slips, setSlips] = useState(0);
  const [fx, setFx] = useState<null | "boom" | "splat">(null);
  const [inc, setInc] = useState<{ inc: Incident; count: string } | null>(null);
  const [picker, setPicker] = useState(false);
  const [qi, setQi] = useState(0);
  const [ok, setOk] = useState(0);
  const [res, setRes] = useState<{ stars: number; xp: number } | null>(null);
  const failed = useRef(false);

  const reset = () => {
    failed.current = false;
    setState(initLab(mission.vessels));
  };

  const onEvent = (e: LabEvent) => {
    if (phase !== "mission" || failed.current) return;
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
    const id = fx === "boom" ? (mission.incidents?.boom ?? "natri-to") : (mission.incidents?.overflow ?? "tran-coc");
    const x = INCIDENTS[id];
    if (x) {
      noteIncident(id);
      setInc({ inc: x, count: `${Object.keys(loadNotes().incidents).length} sự cố` });
    }
    setSlips((n) => n + 1);
    setFx(null);
  }, [fx, mission]);

  // nhiệm vụ có mục tiêu: đạt là xong
  const won = phase === "mission" && !!mission.goal && !fx && !inc && !failed.current && mission.goal.done(state.log, state);
  useEffect(() => {
    if (!won) return;
    const t = window.setTimeout(() => {
      sfx("chime");
      setScore(Math.max(1, MAX_MISSION - slips));
      setPhase("checked");
    }, 1200);
    return () => window.clearTimeout(t);
  }, [won, slips]);

  const idn = mission.identify;
  const submit = () => {
    if (!idn) return;
    const ids = Object.keys(idn.answers);
    const right = ids.filter((v) => picks[v] === idn.answers[v]).length;
    setScore(Math.max(0, Math.round((right / ids.length) * MAX_MISSION) - slips));
    sfx(right === ids.length ? "chime" : "drop");
    setPhase("checked");
  };

  const finish = (correct: number) => {
    setRes(recordPractice(subject.id, lesson.id, score + correct, MAX_MISSION + QUIZ));
    setPhase("result");
  };

  const progress = phase === "mission" || phase === "checked" ? 0.15 : phase === "quiz" ? 0.3 + (0.7 * qi) / QUIZ : 1;

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="lab-layout fixed inset-0 flex flex-col overflow-hidden md:block">
      <div className="relative h-[56dvh] shrink-0 md:absolute md:inset-0 md:h-auto">
        <Bench
          state={state}
          setState={setState}
          shelf={mission.shelf}
          tools={mission.tools}
          theme={prefs.theme}
          formulas={formulas}
          rightPad="var(--lab-pad)"
          onEvent={onEvent}
          locked={phase !== "mission" || !!fx || !!inc}
          onReset={phase === "mission" ? reset : undefined}
        />
      </div>
      <LabTopBar href={`/hoc/${subject.id}`} title={`🎯 Thực hành · ${lesson.title}`} progress={progress} onTheme={() => setPicker(true)} />

      <aside className="lab-panel relative z-20 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4 md:absolute md:bottom-3 md:right-3 md:top-[4.2rem] md:w-[min(25rem,40vw)] md:rounded-3xl md:p-5">
        {(phase === "mission" || phase === "checked") && (
          <>
            <div>
              <div className="lab-soft text-xs font-extrabold tracking-wider">NHIỆM VỤ · {MAX_MISSION} ĐIỂM</div>
              <h2 className="font-display text-xl font-extrabold leading-tight">{mission.title}</h2>
            </div>
            <p className="text-sm">{mission.brief}</p>
            {mission.goal && (
              <div className="rounded-2xl p-3" style={{ boxShadow: "0 0 0 2px var(--lab-accent)" }}>
                <p className="font-display text-base font-extrabold leading-snug">{mission.goal.text}</p>
                {won && <div className="lab-pop-in mt-1 font-display text-lg font-extrabold">✨ Đạt rồi!</div>}
              </div>
            )}
            {idn && (
              <div className="flex flex-col gap-2">
                {Object.keys(idn.answers).map((v) => {
                  const right = phase === "checked" ? picks[v] === idn.answers[v] : null;
                  return (
                    <div key={v} className="rounded-2xl p-2.5" style={{ boxShadow: `0 0 0 ${right === null ? 1 : 2}px ${right === null ? "var(--lab-line)" : right ? "#22b98c" : "#ff4f7b"}` }}>
                      <div className="mb-1.5 text-sm font-extrabold">
                        Cốc {v}: <span className="lab-soft">{idn.ask}</span>
                        {right === false && <span className="ml-1 text-[#ff4f7b]">→ {idn.answers[v]}</span>}
                        {right && <span className="ml-1 text-[#22b98c]">✓</span>}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {idn.options.map((o) => (
                          <button
                            key={o}
                            disabled={phase !== "mission"}
                            onClick={() => setPicks((p) => ({ ...p, [v]: o }))}
                            className={`rounded-xl px-2.5 py-1 text-xs font-extrabold ${picks[v] === o ? "lab-accent" : "lab-chip"}`}
                          >
                            {o}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {slips > 0 && phase === "mission" && <div className="text-xs font-bold text-[#ff4f7b]">Sự cố: {slips} (mỗi lần trừ 1 điểm)</div>}
            <span className="flex-1" />
            {phase === "mission" && idn && (
              <button className="lab-btn lab-btn-main text-lg" disabled={Object.keys(idn.answers).some((v) => !picks[v])} onClick={submit}>
                Nộp kết quả ✓
              </button>
            )}
            {phase === "checked" && (
              <>
                <div className="text-center font-display text-2xl font-extrabold">
                  Nhiệm vụ: {score}/{MAX_MISSION} điểm
                </div>
                <button className="lab-btn lab-btn-main text-lg" onClick={() => setPhase("quiz")} autoFocus>
                  Sang {QUIZ} câu hỏi ▶
                </button>
              </>
            )}
          </>
        )}

        {phase === "quiz" && qs[qi] && (
          <>
            <div className="lab-soft text-xs font-extrabold tracking-wider">
              CÂU {qi + 1}/{QUIZ}
            </div>
            <div className="rounded-2xl bg-white p-3 text-ink">
              <QuestionCard
                key={qs[qi].id}
                q={qs[qi]}
                onNext={(r) => {
                  const c = ok + (r.correct ? 1 : 0);
                  setOk(c);
                  if (qi + 1 >= qs.length) finish(c);
                  else setQi(qi + 1);
                }}
              />
            </div>
          </>
        )}

        {phase === "result" && res && (
          <div className="flex flex-col items-center gap-3 text-center">
            {res.stars >= 2 && <Confetti />}
            <Mascot who={who} mood={res.stars >= 2 ? "cheer" : "think"} size={96} />
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <IconStar key={i} className={`h-10 w-10 ${i <= res.stars ? "text-sun" : "opacity-25"}`} />
              ))}
            </div>
            <h2 className="font-display text-2xl font-extrabold">
              {score + ok}/{MAX_MISSION + QUIZ} điểm
            </h2>
            <p className="lab-soft text-sm">
              Nhiệm vụ {score}/{MAX_MISSION} · Câu hỏi {ok}/{QUIZ} · +{res.xp} XP
            </p>
            <button className="lab-btn lab-btn-main w-full text-lg" onClick={again}>
              ↺ Nhiệm vụ khác
            </button>
            <div className="flex w-full gap-2">
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
            reset();
          }}
        />
      )}
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}
