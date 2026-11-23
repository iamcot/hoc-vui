"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { allLessons, getSubject } from "@/content/subjects";
import { useProgress } from "@/lib/store";
import { Art } from "@/components/Art";
import { IconBack, IconStar } from "@/components/Icons";
import { Mascot } from "@/components/Mascot";
import { LEVELS } from "@/lib/quiz";

export function SubjectMap({ subjectId }: { subjectId: string }) {
  const s = getSubject(subjectId)!;
  const { lesson, data } = useProgress();
  const lessons = allLessons(s);
  const currentId = (lessons.find((l) => lesson(s.id, l.id).stars === 0) ?? lessons[lessons.length - 1]).id;
  const test = data.tests[s.id];
  const level = test && LEVELS.find((l) => l.id === test.level);
  let n = 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-[var(--shadow-soft)]" aria-label="Quay lại">
          <IconBack className="h-5 w-5" />
        </Link>
        <div>
          <p className="text-sm text-ink-soft">Lớp {s.grade}</p>
          <h1 className="font-display text-3xl font-extrabold">
            {s.emoji} {s.name}
          </h1>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          {s.units.map((u) => (
            <section key={u.id} className="card p-5 sm:p-7">
              <h2 className="mb-5 font-display text-xl font-extrabold text-ink-soft">{u.title}</h2>
              <ol className="relative space-y-4">
                <span className="absolute bottom-6 left-[2.15rem] top-6 w-1 rounded-full bg-line" aria-hidden />
                {u.lessons.map((l) => {
                  n++;
                  const st = lesson(s.id, l.id);
                  const current = l.id === currentId;
                  return (
                    <motion.li key={l.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                      <Link
                        href={`/hoc/${s.id}/${l.id}`}
                        className={`relative flex items-center gap-4 rounded-3xl p-3 transition hover:bg-cream ${current ? "bg-sky-soft/60" : ""}`}
                      >
                        <span
                          className={`relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full text-2xl shadow-[var(--shadow-pop)] ${
                            st.stars > 0 ? "bg-mint text-white" : current ? "pulse-ring bg-sky text-white" : "bg-white"
                          }`}
                        >
                          {l.emoji}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold uppercase tracking-wide text-ink-soft">Bài {n}</div>
                          <div className="font-display text-lg font-extrabold leading-tight">{l.title}</div>
                          <div className="truncate text-sm text-ink-soft">{l.short}</div>
                        </div>
                        <div className="hidden w-24 shrink-0 sm:block">
                          <Art id={l.cover} emoji={l.emoji} rounded="rounded-2xl" className="aspect-[3/2] w-full" />
                        </div>
                        <div className="flex shrink-0 gap-0.5 text-sun">
                          {[1, 2, 3].map((i) => (
                            <IconStar key={i} filled={st.stars >= i} className={`h-5 w-5 ${st.stars >= i ? "" : "text-line"}`} />
                          ))}
                        </div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 xl:sticky xl:top-8 xl:block xl:self-start xl:space-y-4">
          <div className="card space-y-3 p-5">
            <div className="flex items-center gap-3">
              <Mascot mood="think" size={64} />
              <div>
                <h3 className="font-display text-lg font-extrabold">Kiểm tra trình độ</h3>
                <p className="text-sm text-ink-soft">15 câu trộn các bài, khoảng 10 phút</p>
              </div>
            </div>
            {level && (
              <div className="rounded-2xl bg-mint-soft p-3 text-sm">
                Lần gần nhất: <b>{level.emoji} {level.name}</b> ({test!.pct}%)
              </div>
            )}
            <Link href={`/hoc/${s.id}/kiem-tra`} className="btn btn-peach w-full">
              Làm bài kiểm tra
            </Link>
          </div>
          <div className="card space-y-3 p-5">
            <h3 className="font-display text-lg font-extrabold">⚡ Thi đấu cùng bạn</h3>
            <p className="text-sm text-ink-soft">Tạo phòng, gửi mã cho bạn, cùng làm một đề xem ai nhanh hơn.</p>
            <Link href={`/thi-dau?mon=${s.id}`} className="btn btn-mint w-full">
              Vào đấu trường
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
