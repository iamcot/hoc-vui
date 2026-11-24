"use client";
import Link from "next/link";
import { IconClose } from "@/components/Icons";
import { Scene } from "@/components/Scene";

export function QuizHeader({ closeHref, done, total, right, wide }: { closeHref: string; done: number; total: number; right?: React.ReactNode; wide?: boolean }) {
  return (
    <>
    <Scene image="bg-lesson" variant="desk" dim />
    <header className="sticky top-0 z-20 bg-white/60 backdrop-blur">
      <div className={`mx-auto flex ${wide ? "max-w-6xl" : "max-w-3xl"} items-center gap-3 px-4 py-3 sm:px-6`}>
        <Link href={closeHref} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm" aria-label="Thoát">
          <IconClose className="h-5 w-5" />
        </Link>
        <div className="h-3 flex-1 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-mint transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
        </div>
        <span className="min-w-12 text-right font-bold text-ink-soft">
          {Math.min(done + 1, total)}/{total}
        </span>
        {right}
      </div>
    </header>
    </>
  );
}
