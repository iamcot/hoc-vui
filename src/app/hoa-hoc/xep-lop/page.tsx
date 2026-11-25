"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getSubject, tierLessons } from "@/content/subjects";
import type { Lesson, Question, Tier } from "@/content/types";
import { useProgress } from "@/lib/store";
import { practiceSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { notePlaced, noteSkipped } from "@/lib/chem/notebook";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconClose } from "@/components/Icons";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { LabScene, LabShell } from "@/components/lab/LabScene";

/** sai 2 câu trong một trình độ thì dừng: con học tiếp từ trình độ đó */
const STOP = 2;

interface Item {
  tier: Tier;
  lesson: Lesson;
  q: Question;
}

/**
 * Xếp lớp môn Hoá: mỗi bài một câu, đi từ trình độ thấp lên.
 * Đúng câu nào thì bài đó được tính là đã qua (1 sao), vượt cả trình độ thì mở trình độ sau.
 */
export default function PlacementPage() {
  const subject = getSubject("hoa-hoc")!;
  const { recordPractice, markRead, unlockTier } = useProgress();
  const [items, setItems] = useState<Item[] | null>(null);
  const [i, setI] = useState(0);
  const [right, setRight] = useState<string[]>([]);
  const [wrong, setWrong] = useState<Record<string, number>>({});
  const [end, setEnd] = useState<{ passed: Tier[]; at: Tier | null; skipped: Lesson[] } | null>(null);

  const tiers = useMemo(() => subject.tiers.filter((t) => tierLessons(t).length > 0), [subject]);

  const start = () => {
    const seed = randomSeed();
    setItems(tiers.flatMap((t) => tierLessons(t).map((l) => ({ tier: t, lesson: l, q: practiceSet(subject, l.id, seed, 1)[0] }))).filter((x) => x.q));
    setI(0);
    setRight([]);
    setWrong({});
    setEnd(null);
  };

  const finish = (ok: string[], bad: Record<string, number>, stopAt: Tier | null) => {
    const all = items ?? [];
    const passed = tiers.filter((t) => (bad[t.id] ?? 0) < STOP && (!stopAt || tiers.indexOf(t) < tiers.indexOf(stopAt)));
    const skipped = all.filter((x) => ok.includes(x.lesson.id)).map((x) => x.lesson);
    for (const l of skipped) {
      recordPractice(subject.id, l.id, 1, 2);
      markRead(subject.id, l.id);
    }
    // vượt trình độ nào thì mở các trình độ phía sau tới trình độ có bài kế tiếp
    for (const t of passed) {
      const k = subject.tiers.findIndex((x) => x.id === t.id);
      for (let j = k + 1; j < subject.tiers.length; j++) {
        unlockTier(subject.id, subject.tiers[j].id);
        if (subject.tiers[j].units.length > 0) break;
      }
    }
    noteSkipped(skipped.map((l) => l.id));
    notePlaced();
    setEnd({ passed, at: stopAt, skipped });
  };

  const answer = (correct: boolean) => {
    const it = items![i];
    const ok = correct ? [...right, it.lesson.id] : right;
    const bad = correct ? wrong : { ...wrong, [it.tier.id]: (wrong[it.tier.id] ?? 0) + 1 };
    setRight(ok);
    setWrong(bad);
    if (!correct && bad[it.tier.id] >= STOP) return finish(ok, bad, it.tier);
    if (i + 1 >= items!.length) return finish(ok, bad, null);
    setI(i + 1);
  };

  const cur = items?.[i];
  return (
    <LabShell theme="nang" className="fixed inset-0 overflow-y-auto">
      <div className="fixed inset-0">
        <LabScene theme="nang" />
      </div>
      <div className="relative mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-3 p-3 sm:p-6">
        <Link href="/hoc/hoa-hoc" className="lab-chip absolute left-3 top-3 grid h-10 w-10 place-items-center rounded-full" aria-label="Đóng">
          <IconClose className="h-5 w-5" />
        </Link>
        <div className="mt-14 rounded-3xl bg-white/95 p-4 text-ink shadow-xl sm:p-6">
          {!items && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Mascot who="bit" mood="happy" size={72} />
                <div>
                  <div className="text-xs font-extrabold tracking-wider text-ink-soft">XẾP LỚP · THÍ NGHIỆM HOÁ HỌC</div>
                  <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">Con biết tới đâu rồi?</h1>
                </div>
              </div>
              <p>
                Mỗi bài một câu hỏi, đi từ dễ tới khó. Câu nào đúng thì bài đó được tính là <b>đã qua</b>, con không phải học lại. Sai {STOP} câu trong một trình độ thì dừng, con học tiếp từ đó.
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {tiers.map((t) => (
                  <li key={t.id} className="rounded-2xl bg-black/[.04] px-3 py-2 text-sm">
                    <b>
                      {t.emoji} {t.name}
                    </b>{" "}
                    · {tierLessons(t).length} bài
                    <div className="text-xs text-ink-soft">{t.short}</div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ink-soft">Mất khoảng {Math.ceil(tiers.reduce((a, t) => a + tierLessons(t).length, 0) * 0.4)} phút. Bé lớp 1–3 thì vào học từ bài đầu là vừa.</p>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary" onClick={start} autoFocus>
                  Bắt đầu xếp lớp ▶
                </button>
                <Link href="/hoc/hoa-hoc" className="btn btn-ghost">
                  Học từ bài đầu
                </Link>
              </div>
            </div>
          )}

          {items && !end && cur && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-ink-soft">
                <span>
                  {cur.tier.emoji} {cur.tier.name.toUpperCase()} · {cur.lesson.title}
                </span>
                <span className="flex-1" />
                <span>
                  {i + 1}/{items.length}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/10">
                <div className="h-full rounded-full bg-lilac transition-all" style={{ width: `${(i / items.length) * 100}%` }} />
              </div>
              <QuestionCard key={cur.q.id + i} q={cur.q} onNext={(r) => answer(r.correct)} />
            </div>
          )}

          {end && (
            <div className="flex flex-col items-center gap-3 text-center">
              {end.skipped.length > 0 && <Confetti />}
              <Mascot who="bit" mood={end.skipped.length > 0 ? "cheer" : "think"} size={96} />
              <h2 className="font-display text-2xl font-extrabold">{end.at ? `Con bắt đầu ở ${end.at.name}` : "Con qua hết rồi! 🎉"}</h2>
              <p className="text-sm">
                Đã qua {end.skipped.length} bài{end.passed.length > 0 ? `, vượt trình độ ${end.passed.map((t) => t.name).join(", ")}` : ""}. Bài đã qua hiện 1 sao trên bản đồ, muốn 3 sao thì vào làm thí nghiệm.
              </p>
              {end.skipped.length > 0 && (
                <div className="flex max-w-full flex-wrap justify-center gap-1.5">
                  {end.skipped.map((l) => (
                    <span key={l.id} className="chip bg-mint-soft text-xs">
                      ✓ {l.emoji} {l.title}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex flex-wrap justify-center gap-2">
                <Link href="/hoc/hoa-hoc" className="btn btn-primary">
                  Vào học ▶
                </Link>
                <button className="btn btn-ghost" onClick={start}>
                  Làm lại
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </LabShell>
  );
}
