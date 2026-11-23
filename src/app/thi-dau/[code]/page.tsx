"use client";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { SUBJECTS, getSubject } from "@/content/subjects";
import type { Question } from "@/content/types";
import { mixedSet } from "@/lib/quiz";
import { cleanCode, findRoom, roomBoard, scoreOf, submitEntry, type Entry, type Room } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { QuestionCard, type AnswerResult } from "@/components/quiz/QuestionCard";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { Avatar } from "@/components/Avatar";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconClose } from "@/components/Icons";
import { play } from "@/lib/sound";

export default function RoomPage() {
  return (
    <Suspense>
      <RoomView />
    </Suspense>
  );
}

function RoomView() {
  const code = cleanCode(String(useParams().code ?? ""));
  const fallback = useSearchParams().get("mon") ?? SUBJECTS.find((s) => s.ready)!.id;
  const { data, addXp, session } = useProgress();
  const [room, setRoom] = useState<Room | null>(null);
  const [phase, setPhase] = useState<"lobby" | "run" | "done">("lobby");
  const [qs, setQs] = useState<Question[]>([]);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<AnswerResult[]>([]);
  const [board, setBoard] = useState<Entry[]>([]);
  const [left, setLeft] = useState(0);
  const [mine, setMine] = useState<{ score: number; correct: number; time_ms: number } | null>(null);
  const [copied, setCopied] = useState(false);
  const startAt = useRef(0);

  const refresh = useCallback(() => roomBoard(code).then(setBoard), [code]);

  useEffect(() => {
    findRoom(code, fallback).then(setRoom);
    refresh();
  }, [code, fallback, refresh, session]);

  // Cập nhật bảng điểm phòng mỗi 5 giây khi đang ở sảnh hoặc xem kết quả
  useEffect(() => {
    if (phase === "run") return;
    const t = setInterval(refresh, 5000);
    return () => clearInterval(t);
  }, [phase, refresh]);

  useEffect(() => {
    if (phase !== "run") return;
    const t = setInterval(() => {
      const l = Math.ceil((room!.seconds * 1000 - (Date.now() - startAt.current)) / 1000);
      setLeft(l);
      if (l <= 3 && l > 0) play("tick", 0.4);
    }, 250);
    return () => clearInterval(t);
  }, [phase, room]);

  const finish = useCallback(
    async (all: AnswerResult[]) => {
      if (!room) return;
      const used = Math.min(Date.now() - startAt.current, room.seconds * 1000);
      const correct = all.filter((a) => a.correct).length;
      const e = { score: scoreOf(correct, room.question_count, used, room.seconds), correct, time_ms: used };
      setMine(e);
      setPhase("done");
      play(correct >= room.question_count * 0.6 ? "levelup" : "complete");
      addXp(room.subject_id, correct * 6, `thi:${room.code}`);
      try {
        await submitEntry(room, e, { name: data.profile.name, avatar: data.profile.avatar });
      } finally {
        refresh();
      }
    },
    [room, addXp, data.profile, refresh],
  );

  useEffect(() => {
    if (phase === "run" && left <= 0 && startAt.current) finish(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  if (!room) return null;
  const subject = getSubject(room.subject_id) ?? SUBJECTS[0];
  const link = typeof window !== "undefined" ? `${location.origin}/thi-dau/${room.code}?mon=${room.subject_id}` : "";

  function start() {
    setQs(mixedSet(subject, room!.code, room!.question_count));
    setAnswers([]);
    setI(0);
    startAt.current = Date.now();
    setLeft(room!.seconds);
    setPhase("run");
  }

  function onNext(r: AnswerResult) {
    const all = [...answers, r];
    setAnswers(all);
    if (i + 1 >= qs.length) finish(all);
    else setI(i + 1);
  }

  async function share() {
    const text = `Vào Học Vui thi ${subject.name} với tớ! Mã phòng: ${room!.code}`;
    try {
      if (navigator.share) await navigator.share({ title: "Học Vui", text, url: link });
      else {
        await navigator.clipboard.writeText(`${text}\n${link}`);
        setCopied(true);
      }
    } catch {
      /* người dùng huỷ */
    }
  }

  if (phase === "run") {
    return (
      <div className="min-h-dvh">
        <QuizHeader
          closeHref="/thi-dau"
          done={answers.length}
          total={qs.length}
          right={<span className={`chip font-mono ${left <= 10 ? "bg-berry-soft text-berry" : "bg-white"}`}>⏱ {Math.max(0, left)}s</span>}
        />
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
          <div className="card p-5 sm:p-8">{qs[i] && <QuestionCard q={qs[i]} mode="race" onNext={onNext} device={subject.device} />}</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      {phase === "done" && mine && mine.correct >= room.question_count * 0.6 && <Confetti />}
      <header className="mx-auto flex max-w-4xl items-center gap-3 px-4 pt-4 sm:px-6">
        <Link href="/thi-dau" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
          <IconClose className="h-5 w-5" />
        </Link>
        <span className="font-display text-lg font-extrabold">
          {subject.emoji} {subject.name} · Lớp {subject.grade}
        </span>
      </header>

      <main className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[1fr_1fr]">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 p-6 text-center">
          {phase === "lobby" ? (
            <>
              <Mascot mood="wow" size={120} className="floaty mx-auto" />
              <div>
                <p className="text-sm font-bold text-ink-soft">Mã phòng</p>
                <p className="font-mono text-5xl font-extrabold tracking-[0.2em] text-sky">{room.code}</p>
              </div>
              <p className="text-ink-soft">
                {room.question_count} câu trong {room.seconds / 60} phút. Gửi mã cho bạn để cùng làm một đề.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="btn btn-ghost" onClick={share}>
                  {copied ? "Đã chép link ✓" : "📨 Mời bạn"}
                </button>
                <button className="btn btn-primary" onClick={start}>
                  Bắt đầu ▶
                </button>
              </div>
            </>
          ) : (
            mine && (
              <>
                <Mascot mood={mine.correct >= room.question_count * 0.6 ? "cheer" : "oops"} size={120} className="floaty mx-auto" />
                <p className="text-sm font-bold text-ink-soft">Điểm của em</p>
                <p className="font-display text-6xl font-extrabold text-sky">{mine.score}</p>
                <p className="text-ink-soft">
                  Đúng {mine.correct}/{room.question_count} câu trong {Math.round(mine.time_ms / 1000)} giây
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <button className="btn btn-ghost" onClick={share}>
                    {copied ? "Đã chép link ✓" : "📨 Rủ thêm bạn"}
                  </button>
                  <Link href="/thi-dau" className="btn btn-primary">
                    Phòng mới
                  </Link>
                </div>
              </>
            )
          )}
        </motion.section>

        <section className="card p-6">
          <h2 className="mb-4 font-display text-xl font-extrabold">🏆 Bảng điểm phòng</h2>
          {board.length === 0 ? (
            <p className="text-ink-soft">Chưa ai nộp bài. Em là người đầu tiên nhé!</p>
          ) : (
            <ol className="space-y-2">
              {board.map((e, k) => (
                <li key={e.user_id} className={`flex items-center gap-3 rounded-2xl p-2.5 ${e.me ? "bg-sky-soft" : "bg-cream"}`}>
                  <span className="w-7 text-center font-display text-lg font-extrabold">{["🥇", "🥈", "🥉"][k] ?? k + 1}</span>
                  <Avatar id={e.avatar} size={36} />
                  <span className="flex-1 truncate font-bold">{e.display_name}</span>
                  <span className="text-sm text-ink-soft">{e.correct} đúng</span>
                  <span className="font-display text-lg font-extrabold">{e.score}</span>
                </li>
              ))}
            </ol>
          )}
          {!session && <p className="mt-4 text-xs text-ink-soft">Chưa đăng nhập nên bảng chỉ có điểm trên máy này.</p>}
        </section>
      </main>
    </div>
  );
}
