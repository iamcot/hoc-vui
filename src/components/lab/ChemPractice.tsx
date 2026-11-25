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
import { Guide, LAB_RATE, Say, Tag, plain } from "./Guide";
import { speak, stopSpeak } from "@/lib/speech/tts";
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
  const [openPick, setOpenPick] = useState<string | null>(null);
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
  const ids = idn ? Object.keys(idn.answers) : [];
  const all = ids.every((v) => picks[v]);
  const say =
    phase === "checked"
      ? `Nhiệm vụ được **${score}/${MAX_MISSION} điểm**!${score === MAX_MISSION ? " Xuất sắc! 🎉" : ""}`
      : won
        ? "Đạt rồi! ✨"
        : idn
          ? all
            ? "Chọn xong rồi! Bấm **Nộp kết quả** nhé."
            : mission.brief + " Rồi **chọn tên** dưới mỗi cốc."
          : `${mission.brief} ${mission.goal?.text ?? ""}`;
  const { data } = useProgress();
  useEffect(() => {
    if (!data.sound || phase === "quiz" || phase === "result") return;
    const t = window.setTimeout(() => void speak(plain(say), { rate: LAB_RATE }), 250);
    return () => {
      window.clearTimeout(t);
      stopSpeak();
    };
  }, [say, data.sound, phase]);

  const guide =
    phase === "mission" || phase === "checked" ? (
      <Guide who={who} mood={phase === "checked" ? (score >= 2 ? "cheer" : "think") : won ? "cheer" : "happy"} wide>
        <Tag>
          🎯 NHIỆM VỤ · {mission.title.toUpperCase()}
        </Tag>
        <div className={plain(say).length > 120 ? "text-[0.82em]" : ""}>
          <Say text={say} />
        </div>
        {slips > 0 && phase === "mission" && <div className="mt-1 text-[0.65em] font-bold text-[#ff4f7b]">Sự cố: {slips} (mỗi lần trừ 1 điểm)</div>}
        {phase === "mission" && idn && all && (
          <button className="lab-btn lab-btn-main mt-3 text-[0.75em]" onClick={submit}>
            Nộp kết quả ✓
          </button>
        )}
        {phase === "checked" && (
          <button className="lab-btn lab-btn-main mt-3 text-[0.75em]" onClick={() => setPhase("quiz")} autoFocus>
            Sang {QUIZ} câu hỏi ▶
          </button>
        )}
      </Guide>
    ) : null;

  return (
    <LabShell theme={prefs.theme} calm={prefs.calm} className="fixed inset-0 overflow-hidden">
      <Bench
        state={state}
        setState={setState}
        shelf={mission.shelf}
        tools={mission.tools}
        theme={prefs.theme}
        formulas={formulas}
        onEvent={onEvent}
        locked={phase !== "mission" || !!fx || !!inc}
        onReset={phase === "mission" ? reset : undefined}
        guide={guide}
        dim={phase === "quiz" || phase === "result"}
        under={
          idn
            ? (v) => {
                const right = phase === "checked" ? picks[v] === idn.answers[v] : null;
                const open = openPick === v;
                return (
                  <div className="relative z-20 mt-2 flex flex-col items-center">
                    <button
                      disabled={phase !== "mission"}
                      onClick={() => setOpenPick(open ? null : v)}
                      className={`whitespace-nowrap rounded-2xl px-4 py-2 text-base font-extrabold sm:text-lg ${right === false ? "bg-[#ff4f7b] text-white" : right ? "bg-[#22b98c] text-white" : picks[v] ? "lab-accent" : state.log.some((k) => k.startsWith(`add:${v}:`)) ? "lab-chip lab-hint" : "lab-chip"}`}
                    >
                      {picks[v] ?? "Chọn tên ▾"}
                    </button>
                    {right === false && <span className="mt-1 whitespace-nowrap text-sm font-extrabold text-[#22b98c] sm:text-base">✓ {idn.answers[v]}</span>}
                  </div>
                );
              }
            : undefined
        }
      />
      {idn && openPick && phase === "mission" && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/35 p-3" onClick={() => setOpenPick(null)}>
          <div className="lab-sheet lab-pop-in flex w-full max-w-sm flex-col gap-2 rounded-3xl p-5" onClick={(e) => e.stopPropagation()}>
            <div className="font-display text-2xl font-extrabold">Cốc {openPick} là…</div>
            {idn.options.map((o) => (
              <button
                key={o}
                autoFocus={picks[openPick] === o}
                onClick={() => {
                  setPicks((p) => ({ ...p, [openPick]: o }));
                  setOpenPick(null);
                }}
                className={`rounded-2xl px-4 py-3 text-left font-display text-xl font-extrabold ${picks[openPick] === o ? "lab-accent" : "lab-chip"}`}
              >
                {o}
              </button>
            ))}
          </div>
        </div>
      )}
      <LabTopBar href={`/hoc/${subject.id}`} title={`🎯 Thực hành · ${lesson.title}`} progress={progress} onTheme={() => setPicker(true)} />

      {(phase === "quiz" || phase === "result") && (
        <div className="absolute inset-0 z-30 flex items-center justify-center p-3 pt-16">
          <div className="lab-sheet lab-pop-in flex max-h-full w-full max-w-xl flex-col gap-3 overflow-y-auto rounded-3xl p-5 sm:p-6">
            {phase === "quiz" && qs[qi] && (
              <>
                <div className="text-xs font-extrabold tracking-wider opacity-60">
                  CÂU {qi + 1}/{QUIZ} · nhiệm vụ đã được {score}/{MAX_MISSION} điểm
                </div>
                <div className="rounded-2xl bg-white p-1 text-ink">
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
                <Mascot who={who} mood={res.stars >= 2 ? "cheer" : "think"} size={110} />
                <div className="flex gap-1">
                  {[1, 2, 3].map((i) => (
                    <IconStar key={i} className={`h-10 w-10 ${i <= res.stars ? "text-sun" : "opacity-25"}`} />
                  ))}
                </div>
                <h2 className="font-display text-3xl font-extrabold">
                  {score + ok}/{MAX_MISSION + QUIZ} điểm
                </h2>
                <p className="text-sm opacity-70">
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
            reset();
          }}
        />
      )}
      {picker && <LabThemePicker prefs={prefs} onClose={() => setPicker(false)} />}
    </LabShell>
  );
}
