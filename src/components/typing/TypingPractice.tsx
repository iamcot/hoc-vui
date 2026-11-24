"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLesson } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { SharkGame, type GameResult } from "./SharkGame";
import { GameResultPanel } from "./GameResult";

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
  return (
    <>
      <SharkGame key={round} spec={lesson.typing!} onFinish={done} exitHref={back} title={lesson.title} />
      {res && (
        <GameResultPanel r={res.r} stars={res.stars} xp={res.xp}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setRes(null);
              setRound((x) => x + 1);
            }}
          >
            🔁 Lặn lại
          </button>
          {res.stars < 2 ? (
            <Link href={`/hoc/${subject.id}/${lesson.id}`} className="btn btn-ghost">
              Xem lại bài
            </Link>
          ) : next ? (
            <Link href={`/hoc/${subject.id}/${next.id}`} className="btn btn-mint">
              Bài tiếp ▶
            </Link>
          ) : (
            <Link href={`/hoc/${subject.id}/kiem-tra/${tier.id}`} className="btn btn-mint">
              Kiểm tra trình độ
            </Link>
          )}
          <Link href={back} className="btn btn-ghost">
            Bản đồ
          </Link>
        </GameResultPanel>
      )}
    </>
  );
}
