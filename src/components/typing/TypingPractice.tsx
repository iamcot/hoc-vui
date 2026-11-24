"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { SharkGame, type GameResult } from "./SharkGame";
import { GameResultPanel } from "./GameResult";
import { Kbd } from "./Kbd";
import { useHotkeys } from "./useKeyInput";
import { useRouter } from "next/navigation";

/** Luyện tập môn Gõ phím: một lượt lặn bắn cá; sao tính theo số cá hạ được và độ chính xác */
export function TypingPractice({ subjectId, lessonId }: { subjectId: string; lessonId: string }) {
  const { subject, tier, lesson, next } = getLesson(subjectId, lessonId)!;
  const { recordPractice, setLast } = useProgress();
  useEffect(() => setLast(subject.id, lesson.id), [subject.id, lesson.id, setLast]);
  const [round, setRound] = useState(0);
  const [res, setRes] = useState<{ r: GameResult; stars: number; xp: number } | null>(null);

  function done(r: GameResult) {
    // chính xác dưới 85% thì giảm điểm: tập gõ đúng trước, nhanh sau
    const eff = Math.round(r.kills * Math.min(1, r.acc / 85));
    const { stars, xp } = recordPractice(subject.id, lesson.id, eff, Math.max(r.total, 1));
    setRes({ r, stars, xp });
  }

  const back = `/hoc/${subject.id}`;
  const router = useRouter();
  const replay = () => {
    setRes(null);
    setRound((x) => x + 1);
  };
  const forward = res && (res.stars < 2 ? `/hoc/${subject.id}/${lesson.id}` : next ? `/hoc/${subject.id}/${next.id}` : `/hoc/${subject.id}/kiem-tra/${tier.id}`);
  // phím tắt chung: Space chơi lại, Enter đi tiếp, Esc về bản đồ
  useHotkeys({ " ": replay, Enter: () => forward && router.push(forward), Escape: () => router.push(back) }, !!res);
  return (
    <>
      <SharkGame key={round} spec={lesson.typing!} onFinish={done} exitHref={back} title={lesson.title} />
      {res && (
        <GameResultPanel r={res.r} stars={res.stars} xp={res.xp}>
          <button className="btn btn-primary" onClick={replay}>
            🔁 Lặn lại <Kbd k=" " />
          </button>
          <Link href={forward!} className={res.stars < 2 ? "btn btn-ghost" : "btn btn-mint"}>
            {res.stars < 2 ? "Xem lại bài" : next ? "Bài tiếp ▶" : "Kiểm tra trình độ"} <Kbd k="Enter" />
          </Link>
          <Link href={back} className="btn btn-ghost">
            Bản đồ <Kbd k="Escape" />
          </Link>
        </GameResultPanel>
      )}
    </>
  );
}
