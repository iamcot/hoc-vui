"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allLessons, getSubject } from "@/content/subjects";
import type { Lesson, Question } from "@/content/types";
import { INCIDENTS } from "@/content/subjects/hoa-hoc/incidents";
import { useProgress } from "@/lib/store";
import { mixedSet } from "@/lib/quiz";
import { randomSeed } from "@/lib/rng";
import { due, loadNotes, type Notebook } from "@/lib/chem/notebook";
import type { Experiment, Incident } from "@/lib/chem/types";
import { Mascot } from "@/components/Mascot";
import { IconClose } from "@/components/Icons";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { LabScene, LabShell } from "@/components/lab/LabScene";
import { IncidentCard } from "@/components/lab/Fx";

const QUICK = 5;

/** Sổ tay Hoá: thí nghiệm đã làm (câu ghi nhớ), sổ sự cố, ôn nhanh 5 câu từ các bài đã học */
export default function NotebookPage() {
  const subject = getSubject("hoa-hoc")!;
  const { lesson: ls } = useProgress();
  const [notes, setNotes] = useState<Notebook | null>(null);
  useEffect(() => setNotes(loadNotes()), []);
  const [open, setOpen] = useState<Incident | null>(null);
  const [quiz, setQuiz] = useState<{ qs: Question[]; i: number; ok: number } | null>(null);

  const lessons = useMemo(() => allLessons(subject).filter((l) => l.lab), [subject]);
  const exps = useMemo(() => lessons.flatMap((l) => l.lab!.experiments.map((e) => ({ e, l }))), [lessons]);
  const read = lessons.filter((l) => ls(subject.id, l.id).read);

  const quick = () => {
    const ids = (read.length > 0 ? read : lessons.slice(0, 1)).map((l: Lesson) => l.id);
    setQuiz({ qs: mixedSet(subject, randomSeed(), QUICK, ids), i: 0, ok: 0 });
  };

  if (!notes) return null;
  const done = exps.filter(({ e }) => notes.exps[e.id]);
  const todo = exps.filter(({ e }) => !notes.exps[e.id]);
  const incs = Object.values(INCIDENTS);
  const met = incs.filter((x) => notes.incidents[x.id]);

  return (
    <LabShell theme="nang" className="fixed inset-0 overflow-y-auto">
      <div className="fixed inset-0">
        <LabScene theme="nang" />
      </div>
      <div className="relative mx-auto flex max-w-4xl flex-col gap-4 p-3 pb-10 sm:p-6">
        <div className="flex items-center gap-3">
          <Link href="/hoc/hoa-hoc" className="lab-chip grid h-10 w-10 shrink-0 place-items-center rounded-full" aria-label="Đóng">
            <IconClose className="h-5 w-5" />
          </Link>
          <h1 className="lab-panel rounded-full px-4 py-1.5 font-display text-xl font-extrabold">📓 Sổ tay thí nghiệm</h1>
        </div>

        {/* ôn nhanh */}
        <section className="rounded-3xl bg-white/95 p-4 text-ink shadow-xl sm:p-5">
          {!quiz ? (
            <div className="flex flex-wrap items-center gap-3">
              <Mascot who="mochi" mood="think" size={60} />
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-xl font-extrabold">Ôn nhanh 5 phút</h2>
                <p className="text-sm text-ink-soft">{QUICK} câu trộn từ {read.length > 0 ? `${read.length} bài con đã học` : "bài đầu tiên"}. Không tính sao, chỉ để nhớ lâu.</p>
              </div>
              <button className="btn btn-primary" onClick={quick}>
                Ôn ngay ▶
              </button>
            </div>
          ) : quiz.i < quiz.qs.length ? (
            <div className="flex flex-col gap-2">
              <div className="flex text-xs font-extrabold tracking-wider text-ink-soft">
                <span className="flex-1">ÔN NHANH</span>
                <span>
                  {quiz.i + 1}/{quiz.qs.length}
                </span>
              </div>
              <QuestionCard key={quiz.qs[quiz.i].id} q={quiz.qs[quiz.i]} onNext={(r) => setQuiz((z) => (z ? { ...z, i: z.i + 1, ok: z.ok + (r.correct ? 1 : 0) } : z))} />
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <Mascot who="mochi" mood={quiz.ok >= 4 ? "cheer" : "happy"} size={60} />
              <h2 className="flex-1 font-display text-xl font-extrabold">
                Đúng {quiz.ok}/{quiz.qs.length} câu{quiz.ok >= 4 ? ", nhớ bài lắm!" : ". Xem lại ghi nhớ bên dưới nhé."}
              </h2>
              <button className="btn btn-primary" onClick={quick}>
                Ôn lượt nữa
              </button>
              <button className="btn btn-ghost" onClick={() => setQuiz(null)}>
                Xong
              </button>
            </div>
          )}
        </section>

        {/* thí nghiệm đã làm */}
        <section className="rounded-3xl bg-white/95 p-4 text-ink shadow-xl sm:p-5">
          <h2 className="mb-2 font-display text-xl font-extrabold">
            🧪 Thí nghiệm đã làm · {done.length}/{exps.length}
          </h2>
          {done.length === 0 && <p className="text-sm text-ink-soft">Chưa có thí nghiệm nào. Làm xong một thí nghiệm, câu ghi nhớ sẽ được cất vào đây.</p>}
          <div className="grid gap-2 sm:grid-cols-2">
            {done.map(({ e, l }) => (
              <Card key={e.id} e={e} l={l} at={notes.exps[e.id].at} />
            ))}
          </div>
          {todo.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {todo.map(({ e, l }) => (
                <Link key={e.id} href={`/hoc/hoa-hoc/${l.id}`} className="chip bg-black/[.05] text-xs text-ink-soft">
                  🔒 {e.emoji} {e.title}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* sổ sự cố */}
        <section className="rounded-3xl bg-white/95 p-4 text-ink shadow-xl sm:p-5">
          <h2 className="mb-2 font-display text-xl font-extrabold">
            📕 Sổ sự cố · {met.length}/{incs.length}
          </h2>
          <p className="mb-2 text-sm text-ink-soft">Làm sai trong phòng lab ảo thì không sao, miễn là nhớ vì sao. Chạm vào thẻ để xem lại.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {incs.map((x) => {
              const n = notes.incidents[x.id];
              return (
                <button key={x.id} disabled={!n} onClick={() => setOpen(x)} className={`rounded-2xl p-3 text-left ${n ? (x.level === "boom" ? "bg-[#fff1d6] ring-2 ring-sun" : "bg-berry-soft ring-2 ring-berry/50") : "bg-black/[.04] opacity-60"}`}>
                  <div className="text-3xl">{n ? x.emoji : "❔"}</div>
                  <b className="text-sm">{n ? x.title : "Chưa gặp"}</b>
                  {n && <div className="text-xs text-ink-soft">Gặp {n.times} lần · {n.at}</div>}
                </button>
              );
            })}
          </div>
        </section>
      </div>
      {open && <IncidentCard inc={open} depth="khtn" who="mochi" onRetry={() => setOpen(null)} />}
    </LabShell>
  );
}

function Card({ e, l, at }: { e: Experiment; l: Lesson; at: string }) {
  const old = due(at);
  return (
    <Link href={`/hoc/hoa-hoc/${l.id}`} className="flex gap-3 rounded-2xl bg-[#fff6d8] p-3 transition hover:-translate-y-0.5">
      <span className="text-3xl">{e.emoji}</span>
      <div className="min-w-0">
        <b className="text-sm">{e.title}</b>
        <p className="font-display text-sm font-bold leading-snug text-[#4a3500]">{e.remember}</p>
        <div className="mt-1 text-[0.7rem] text-ink-soft">
          {at}
          {old && <span className="ml-1 font-bold text-berry">· nên làm lại</span>}
        </div>
      </div>
    </Link>
  );
}
