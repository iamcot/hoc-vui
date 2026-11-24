"use client";
import { useCallback, useMemo, useState } from "react";
import { getSubject } from "@/content/subjects";
import { VERDICTS } from "@/content/subjects/ky-nang-so";
import { currentTierIndex } from "@/lib/tiers";
import { useProgress } from "@/lib/store";
import { TrueFalseGame, TrueFalseResult, type TFResult } from "@/components/digital/TrueFalseGame";

const EXIT = "/hoc/ky-nang-so";

/** Thật hay giả: tin lấy từ các bài em đã học; chưa học nhiều thì thêm tin của trình độ đang học và các trình độ trước */
export default function TrueFalsePage() {
  const s = getSubject("ky-nang-so")!;
  const { lesson, data, ready, addXp } = useProgress();
  const [round, setRound] = useState(0);
  const [res, setRes] = useState<{ r: TFResult; xp: number } | null>(null);

  const pool = useMemo(() => {
    const learned = VERDICTS.filter((x) => lesson(s.id, x.lessonId).stars > 0 || lesson(s.id, x.lessonId).read);
    const upTo = currentTierIndex(s, lesson, data.unlocks);
    const more = VERDICTS.filter((x) => x.tier <= upTo);
    return (learned.length >= 16 ? learned : more).map((x) => x.v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, round]);

  const done = useCallback(
    (r: TFResult) => {
      const xp = Math.min(40, r.correct * 2);
      addXp(s.id, xp, `that-hay-gia:${Date.now()}`);
      setRes({ r, xp });
    },
    [addXp, s.id],
  );

  if (!ready) return null;
  return (
    <>
      <TrueFalseGame key={round} pool={pool} onFinish={done} exitHref={EXIT} />
      {res && (
        <TrueFalseResult
          r={res.r}
          xp={res.xp}
          exitHref={EXIT}
          onReplay={() => {
            setRes(null);
            setRound((x) => x + 1);
          }}
        />
      )}
    </>
  );
}
