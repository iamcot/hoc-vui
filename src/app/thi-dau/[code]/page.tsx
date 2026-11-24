"use client";
import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { SUBJECTS, getSubject, getTier, tierLessons } from "@/content/subjects";
import type { Question } from "@/content/types";
import { mixedSet } from "@/lib/quiz";
import { cleanCode, findRoom, isHost, roomBoard, roomHref, roomStarted, scoreOf, startRoom, submitEntry, type Entry, type Room } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { FREE_ROOM, canJoin, rankInfo, rankLessonIds, rankName } from "@/lib/ranks";
import { QuestionCard, type AnswerResult } from "@/components/quiz/QuestionCard";
import { QuizHeader } from "@/components/quiz/QuizHeader";
import { CalcLayout, CalcToggle, useCalcDock } from "@/components/calc/CalcDock";
import { Avatar } from "@/components/Avatar";
import { Mascot } from "@/components/Mascot";
import { Confetti } from "@/components/Confetti";
import { IconClose } from "@/components/Icons";
import { play } from "@/lib/sound";
import { Scene } from "@/components/Scene";
import { Art } from "@/components/Art";
import { TypingRace } from "@/components/typing/TypingRace";
import { Ico, type IcoId } from "@/components/Ico";

export default function RoomPage() {
  return (
    <Suspense>
      <RoomView />
    </Suspense>
  );
}

function RoomView() {
  const code = cleanCode(String(useParams().code ?? ""));
  const sp = useSearchParams();
  const fallback = sp.get("mon") ?? SUBJECTS.find((s) => s.ready)!.id;
  const fb = { subject: fallback, tier: sp.get("cap"), rank: sp.get("hang"), mode: sp.get("kieu") };
  const { data, addXp, awardStars, session, lesson } = useProgress();
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
  const dock = useCalcDock(getSubject(room?.subject_id ?? fallback)?.device);
  // phòng có hạng: bé chỉ vào phòng cùng hạng hoặc thấp hơn; phòng tự do ai cũng vào
  const rs = getSubject(room?.subject_id ?? fallback);
  const myRank = rs ? rankInfo(rs, lesson, data.unlocks) : null;
  const blocked = !!room && !!myRank && !canJoin(room.rank, myRank.index);
  const roomRankName = `${room?.is_public ? "Phòng công khai" : "Phòng riêng tư"} · ${rankName(room?.rank)}`;
  // phòng công khai: chủ phòng bấm bắt đầu thì cả phòng cùng làm; đã bắt đầu thì bạn mới không vào được nữa
  const [host, setHost] = useState(false);
  const [closed, setClosed] = useState(false);

  const refresh = useCallback(() => roomBoard(code).then(setBoard), [code]);

  useEffect(() => {
    let live = true;
    findRoom(code, fb).then(async (r) => {
      const h = await isHost(r);
      if (!live) return;
      setHost(h);
      setClosed(!!r.is_public && !!r.started_at && !h);
      setRoom(r);
    });
    refresh();
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // phòng hạng mới tính sao tuần: 1 sao khi đúng từ 60%, 2 từ 80%, 3 từ 90% (phòng tự do không tính)
      if (room.rank && room.rank !== FREE_ROOM) {
        const pct = correct / room.question_count;
        awardStars(room.subject_id, pct >= 0.9 ? 3 : pct >= 0.8 ? 2 : pct >= 0.6 ? 1 : 0, `arena:${room.code}`);
      }
      try {
        await submitEntry(room, e, { name: data.profile.name, avatar: data.profile.avatar });
      } finally {
        refresh();
      }
    },
    [room, addXp, awardStars, data.profile, refresh],
  );

  useEffect(() => {
    if (phase === "run" && left <= 0 && startAt.current) finish(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const begin = useCallback(() => {
    if (!room) return;
    const subject = getSubject(room.subject_id) ?? SUBJECTS[0];
    const tier = room.tier_id ? getTier(subject, room.tier_id) : undefined;
    // phòng cũ chọn trình độ thì ra đề trình độ đó; phòng mới theo cấp: đề lấy từ đoạn lộ trình của cấp
    const ids = tier ? tierLessons(tier).map((l) => l.id) : rankLessonIds(subject, room.rank);
    setQs(mixedSet(subject, room.code, room.question_count, ids));
    setAnswers([]);
    setI(0);
    startAt.current = Date.now();
    setLeft(room.seconds);
    setPhase("run");
  }, [room]);

  // phòng công khai, không phải chủ phòng: chờ chủ phòng bấm bắt đầu rồi tự vào
  const waiting = !!room?.is_public && !host && !closed && !blocked && phase === "lobby" && room.subject_id !== "go-phim";
  useEffect(() => {
    if (!waiting || !room) return;
    const t = setInterval(() => {
      roomStarted(room.code).then((on) => on && begin());
    }, 1500);
    return () => clearInterval(t);
  }, [waiting, room, begin]);

  if (!room) return null;
  if (closed) return <ClosedRoom name={roomRankName} />;
  // môn Gõ phím: phòng thi là đường đua xe
  if (room.subject_id === "go-phim") return <TypingRace room={room} host={host} />;
  const subject = getSubject(room.subject_id) ?? SUBJECTS[0];
  const tier = room.tier_id ? getTier(subject, room.tier_id) : undefined;
  const link = typeof window !== "undefined" ? `${location.origin}${roomHref(room)}` : "";

  function start() {
    // chủ phòng bắt đầu: phòng công khai đóng cửa, các bạn đang chờ cùng vào làm
    if (host) void startRoom(room!);
    begin();
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
          wide={dock.open}
          right={<><span className={`chip font-mono ${left <= 10 ? "bg-berry-soft text-berry" : "bg-white"}`}>⏱ {Math.max(0, left)}s</span><CalcToggle dock={dock} /></>}
        />
        <CalcLayout dock={dock}>
          <div className="card p-5 sm:p-8">{qs[i] && <QuestionCard q={qs[i]} mode="race" onNext={onNext} device={subject.device} />}</div>
        </CalcLayout>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <Scene image="bg-arena" variant="arena" dim />
      {phase === "done" && mine && mine.correct >= room.question_count * 0.6 && <Confetti />}
      <header className="mx-auto flex max-w-4xl items-center gap-3 px-4 pt-4 sm:px-6">
        <Link href="/thi-dau" className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
          <IconClose className="h-5 w-5" />
        </Link>
        <span className="ribbon flex items-center gap-2 text-lg">
          <Art id={subject.device === "fx580" ? "xixi" : subject.cover} emoji={subject.emoji} rounded={subject.device === "fx580" ? "" : "rounded-full"} contain={subject.device === "fx580"} className="h-7 w-7 shrink-0" />
          {subject.name}{tier ? ` · ${tier.name}` : ""}
        </span>
      </header>

      <main className="mx-auto grid max-w-4xl gap-6 px-4 py-6 sm:px-6 md:grid-cols-[1fr_1fr]">
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card space-y-5 p-6 text-center">
          {phase === "lobby" && blocked ? (
            <>
              <Mascot mood="think" size={120} className="floaty mx-auto" />
              <p className="font-display text-2xl font-extrabold">{roomRankName}</p>
              <p className="text-ink-soft">
                Em đang ở {myRank?.rank.name}, phòng này dành cho cấp cao hơn. Học thêm vài bài trong lộ trình để lên cấp, hoặc vào một phòng tự do nhé.
              </p>
              <Link href="/thi-dau" className="btn btn-primary">
                Về Đấu trường
              </Link>
            </>
          ) : phase === "lobby" ? (
            <>
              <Mascot mood="wow" size={120} className="floaty mx-auto" />
              <div>
                <p className="text-sm font-bold text-ink-soft">Mã phòng</p>
                <p className="font-mono text-5xl font-extrabold tracking-[0.2em] text-sky">{room.code}</p>
                <p className="mt-1 text-sm font-extrabold text-ink-soft">{roomRankName}</p>
              </div>
              <p className="text-ink-soft">
                {room.question_count} câu trong {room.seconds / 60} phút.{" "}
                {room.is_public ? (host ? "Các bạn vào từ danh sách phòng công khai. Em bấm Bắt đầu thì cả phòng cùng làm và phòng đóng cửa." : "Chờ chủ phòng bấm Bắt đầu, cả phòng sẽ cùng làm.") : "Gửi mã cho bạn để cùng làm một đề."}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="btn btn-ghost" onClick={share}>
                  {copied ? "Đã chép link ✓" : <><Ico n="invite" /> Mời bạn</>}
                </button>
                {waiting ? (
                  <span className="btn btn-ghost pointer-events-none animate-pulse">Đang chờ chủ phòng…</span>
                ) : (
                  <button className="btn btn-primary" onClick={start}>
                    Bắt đầu ▶
                  </button>
                )}
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
                    {copied ? "Đã chép link ✓" : <><Ico n="invite" /> Rủ thêm bạn</>}
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
          <h2 className="mb-4 font-display text-xl font-extrabold"><Ico n="trophy" /> Bảng điểm phòng</h2>
          {board.length === 0 ? (
            <p className="text-ink-soft">Chưa ai nộp bài. Em là người đầu tiên nhé!</p>
          ) : (
            <ol className="space-y-2">
              {board.map((e, k) => (
                <li key={e.user_id} className={`flex items-center gap-3 rounded-2xl p-2.5 ${e.me ? "bg-sky-soft" : "bg-cream"}`}>
                  <span className="w-7 text-center font-display text-lg font-extrabold">{k < 3 ? <Ico n={`medal-${k + 1}` as IcoId} /> : k + 1}</span>
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

/** phòng công khai chủ phòng đã bắt đầu: bạn mới không vào được nữa */
function ClosedRoom({ name }: { name: string }) {
  return (
    <div className="min-h-dvh">
      <Scene image="bg-arena" variant="arena" dim />
      <main className="mx-auto max-w-md px-4 py-16">
        <div className="card space-y-4 p-6 text-center">
          <Mascot mood="oops" size={120} className="floaty mx-auto" />
          <p className="font-display text-2xl font-extrabold">Phòng đã bắt đầu</p>
          <p className="text-ink-soft">{name}: chủ phòng đã bấm bắt đầu nên không vào thêm được. Em chọn phòng công khai khác hoặc tự tạo một phòng nhé.</p>
          <Link href="/thi-dau" className="btn btn-primary">
            Về Đấu trường
          </Link>
        </div>
      </main>
    </div>
  );
}
