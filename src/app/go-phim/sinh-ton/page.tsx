"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getSubject, allLessons } from "@/content/subjects";
import type { TypingSpec } from "@/content/types";
import { useProgress } from "@/lib/store";
import { SharkGame, type GameResult } from "@/components/typing/SharkGame";
import { GameResultPanel } from "@/components/typing/GameResult";
import { Kbd } from "@/components/typing/Kbd";
import { useHotkeys } from "@/components/typing/useKeyInput";
import { useRouter } from "next/navigation";

const BEST_KEY = "hocvui:gp-survival-best";

/**
 * Sinh tồn: cá đến mãi, nhanh dần theo đợt, 3 mạng. Chữ trên cá lấy từ những bài em đã học
 * (đã có sao); chưa học bài nào thì dùng hàng phím nhà.
 */
export default function SurvivalPage() {
  const s = getSubject("go-phim")!;
  const { lesson, ready, addXp } = useProgress();
  const [round, setRound] = useState(0);
  const [res, setRes] = useState<{ r: GameResult; xp: number; best: number } | null>(null);

  const spec = useMemo<TypingSpec>(() => {
    const learned = allLessons(s).filter((l) => l.typing && lesson(s.id, l.id).stars > 0);
    const words = learned.flatMap((l) => (l.typing!.unit === "word" ? (l.typing!.words ?? []).filter((w) => w.length <= 12) : []));
    const keys = [...new Set(learned.flatMap((l) => [...(l.typing!.unit === "key" ? l.typing!.keys : "")]))].join("") || "asdfjkl;";
    // đã học bài gõ từ thì cá mang từ, không thì cá mang cụm phím
    return words.length >= 8 ? { keys, unit: "word", words, speed: 0.9 } : { keys, unit: "key", speed: 1 };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function done(r: GameResult) {
    let best = 0;
    try {
      best = Number(localStorage.getItem(BEST_KEY) ?? 0);
      if (r.score > best) localStorage.setItem(BEST_KEY, String(r.score));
    } catch {
      /* chế độ riêng tư */
    }
    const xp = Math.min(60, Math.round(r.kills * 1.5));
    addXp(s.id, xp, `sinh-ton:${Date.now()}`);
    setRes({ r, xp, best });
  }

  const router = useRouter();
  const replay = () => {
    setRes(null);
    setRound((x) => x + 1);
  };
  useHotkeys({ " ": replay, Enter: replay, Escape: () => router.push("/hoc/go-phim") }, !!res);

  if (!ready) return null;
  return (
    <>
      <SharkGame key={round} spec={spec} mode="survival" onFinish={done} exitHref="/hoc/go-phim" title="Sinh tồn" />
      {res && (
        <GameResultPanel r={res.r} xp={res.xp} best={res.best}>
          <button className="btn btn-primary" onClick={replay}>
            🔁 Chơi lại <Kbd k=" " />
          </button>
          <Link href="/hoc/go-phim" className="btn btn-ghost">
            Bản đồ <Kbd k="Escape" />
          </Link>
        </GameResultPanel>
      )}
    </>
  );
}
