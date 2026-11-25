"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import Link from "next/link";
import { getSubject } from "@/content/subjects";
import { ARENA_SUBJECTS, RACE_MODES, ROOM_QUESTIONS, ROOM_SECONDS, cleanCode, createRoom, openRooms, roomHref, type OpenRoom, type RaceMode } from "@/lib/arena";
import { useProgress } from "@/lib/store";
import { FREE_ROOM, RANKS, rankInfo, rankName } from "@/lib/ranks";
import type { Subject } from "@/content/types";
import { Scene } from "@/components/Scene";
import { Art } from "@/components/Art";
import { Avatar } from "@/components/Avatar";
import { Ico } from "@/components/Ico";
import { IconLock } from "@/components/Icons";

export default function ArenaPage() {
  return (
    <Suspense>
      <Arena />
    </Suspense>
  );
}

const subjectLabel = (s: Subject) => (s.id === "go-phim" ? "Đua xe gõ phím" : s.name);
const modeName = (m: RaceMode | null | undefined) => RACE_MODES.find((x) => x.id === (m ?? "vi"))!.name;

function SubjectBadge({ s, className = "h-10 w-10" }: { s: Subject; className?: string }) {
  return <Art id={s.device === "fx580" ? "xixi" : s.id === "go-phim" ? "gp-mode-race" : s.cover} emoji={s.id === "go-phim" ? "🏎️" : s.emoji} rounded={s.device === "fx580" ? "" : "rounded-xl"} contain className={`${className} shrink-0`} />;
}

/**
 * Đấu trường: chỉ mở cho Máy tính Casio và Đua xe gõ phím.
 * Tạo phòng theo cấp (Sơ, Trung, Cao cấp theo % lộ trình đã học) hoặc tự do; phòng riêng tư vào bằng mã,
 * phòng công khai hiện ở danh sách bên dưới, ai cũng vào được khi chủ phòng chưa bắt đầu.
 */
function Arena() {
  const router = useRouter();
  const params = useSearchParams();
  const subjects = ARENA_SUBJECTS.map((id) => getSubject(id)).filter((s): s is Subject => !!s && s.ready);
  const [subjectId, setSubjectId] = useState(subjects.find((s) => s.id === params.get("mon"))?.id ?? subjects[0].id);
  const subject = subjects.find((s) => s.id === subjectId) ?? subjects[0];
  const { session, online, lesson, data, ready } = useProgress();
  const mine = rankInfo(subject, lesson, data.unlocks);
  const [level, setLevel] = useState<string | null>(null);
  const pickLevel = level === FREE_ROOM || (level && RANKS.findIndex((r) => r.id === level) <= mine.index) ? level : mine.rank.id;
  const [mode, setMode] = useState<RaceMode>("vi");
  const [isPublic, setPublic] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [rooms, setRooms] = useState<OpenRoom[] | null>(null);

  // danh sách phòng công khai, tải lại mỗi 5 giây
  useEffect(() => {
    if (!session) return;
    let live = true;
    const load = () => openRooms().then((r) => live && setRooms(r));
    load();
    const t = setInterval(load, 5000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, [session]);

  async function create() {
    setBusy(true);
    setErr("");
    try {
      const race = subject.id === "go-phim";
      const room = await createRoom({ subject: subject.id, rank: pickLevel, isPublic: !!session && isPublic, mode: race ? mode : null });
      router.push(roomHref(room));
    } catch (e) {
      setErr("Chưa tạo được phòng, thử lại sau nhé.");
      console.error(e);
      setBusy(false);
    }
  }

  const levels = [...RANKS.map((r, i) => ({ id: r.id as string, name: r.name, locked: i > mine.index, hint: `Từ ${Math.round(r.from * 100)}% lộ trình` })), { id: FREE_ROOM, name: "Tự do", locked: false, hint: "Không tính sao" }];

  return (
    <div className="space-y-6">
      <Scene image="bg-arena" variant="arena" />
      <header className="space-y-3 pt-4 sm:pt-10">
        <h1 className="ribbon text-3xl sm:text-4xl" style={{ ["--ribbon" as string]: "var(--color-peach)" }}>
          <Ico n="bolt" /> Đấu trường
        </h1>
        <p className="w-fit max-w-xl rounded-2xl bg-white/85 px-4 py-2 font-bold text-ink shadow-[var(--shadow-pop)]">
          {subject.id === "go-phim"
            ? "Đua xe gõ phím: cả phòng gõ cùng một đoạn, gõ nhanh và chính xác thì xe về trước."
            : `${ROOM_QUESTIONS} câu, ${ROOM_SECONDS / 60} phút. Cả phòng làm cùng một đề, ai đúng nhiều và nhanh hơn thì thắng.`}
        </p>
      </header>

      {!session && (
        <div className="card p-4 text-sm">
          {online ? (
            <>
              <b>Mẹo:</b>{" "}
              <Link href="/toi" className="font-bold text-sky underline">
                Đăng nhập
              </Link>{" "}
              để mở phòng công khai, thấy điểm của bạn bè trong phòng và lên bảng xếp hạng. Chưa đăng nhập vẫn chơi được: cùng mã phòng thì cùng đề.
            </>
          ) : (
            <>Đang chạy chế độ khách: cùng mã phòng thì cùng đề, mỗi máy tự xem điểm của mình.</>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card flex flex-col gap-4 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-extrabold">
            <Ico n="flag" /> Tạo phòng mới
          </h2>

          <fieldset className="space-y-2">
            <legend className="text-sm font-bold text-ink-soft">Môn thi</legend>
            <div className="grid grid-cols-2 gap-2">
              {subjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubjectId(s.id)}
                  aria-pressed={s.id === subject.id}
                  className={`flex items-center gap-2 rounded-2xl border-2 p-2.5 text-left font-display text-base font-extrabold sm:text-lg ${s.id === subject.id ? "border-sky bg-sky/10" : "border-line bg-white"}`}
                >
                  <SubjectBadge s={s} />
                  <span className="min-w-0 leading-tight">{subjectLabel(s)}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-sm font-bold text-ink-soft">
              Cấp độ{ready && <> · em đang ở <b className="text-ink">{mine.rank.name}</b> ({mine.done}/{mine.total} bài lộ trình)</>}
            </legend>
            <div className="grid grid-cols-4 gap-2">
              {levels.map((l) => (
                <button
                  key={l.id}
                  disabled={l.locked}
                  onClick={() => setLevel(l.id)}
                  aria-pressed={l.id === pickLevel}
                  title={l.hint}
                  className={`flex h-12 items-center justify-center gap-1 rounded-2xl border-2 px-1 font-display text-sm font-extrabold whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-50 sm:text-base ${l.id === pickLevel ? "border-sky bg-sky/10" : "border-line bg-white"}`}
                >
                  {l.name}
                  {l.locked && <IconLock className="h-4 w-4 shrink-0 text-ink-soft" />}
                </button>
              ))}
            </div>
            <p className="text-xs font-semibold text-ink-soft">
              {pickLevel === FREE_ROOM
                ? "Tự do: đề trộn cả môn, ai cũng vào được, không tính sao."
                : `${rankName(pickLevel)}: đề lấy từ đoạn lộ trình của cấp này, tính sao tuần, bạn cùng cấp hoặc cao hơn vào được.`}
              {mine.next ? ` Còn ${mine.next.left} bài nữa em lên ${mine.next.name} (từ ${Math.round((RANKS[mine.index + 1]?.from ?? 0) * 100)}% lộ trình).` : ""}
            </p>
          </fieldset>

          {subject.id === "go-phim" && (
            <fieldset className="space-y-2">
              <legend className="text-sm font-bold text-ink-soft">Chế độ đua</legend>
              <div className="grid grid-cols-3 gap-2">
                {RACE_MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    aria-pressed={m.id === mode}
                    className={`flex min-h-12 items-center justify-center rounded-2xl border-2 px-2 py-1 text-center font-display text-sm font-extrabold leading-tight sm:text-base ${m.id === mode ? "border-sky bg-sky/10" : "border-line bg-white"}`}
                  >
                    {m.short}
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-ink-soft">{RACE_MODES.find((m) => m.id === mode)!.hint}.</p>
            </fieldset>
          )}

          <label className={`flex items-start gap-3 rounded-2xl border-2 border-line bg-white px-3 py-2.5 ${session ? "cursor-pointer" : "opacity-60"}`}>
            <input type="checkbox" className="mt-1 h-5 w-5 accent-[var(--color-sky)]" checked={!!session && isPublic} disabled={!session} onChange={(e) => setPublic(e.target.checked)} />
            <span>
              <span className="block font-display text-base font-extrabold">Phòng công khai</span>
              <span className="block text-xs font-semibold text-ink-soft">
                {session ? "Ai cũng thấy và vào được khi em chưa bấm bắt đầu. Không chọn: phòng riêng tư, bạn vào bằng mã." : "Cần đăng nhập để mở phòng công khai. Phòng riêng tư thì bạn vào bằng mã."}
              </span>
            </span>
          </label>

          <button className="btn btn-primary mt-auto w-full" onClick={create} disabled={busy}>
            {busy ? "Đang tạo..." : session && isPublic ? "Tạo phòng công khai" : "Tạo phòng và lấy mã"}
          </button>
          {err && <p className="text-sm text-berry">{err}</p>}
        </motion.div>

        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card flex flex-col gap-4 p-5 sm:p-6">
            <h2 className="font-display text-2xl font-extrabold">
              <Ico n="ticket" /> Vào phòng riêng tư
            </h2>
            <label className="block text-sm font-bold text-ink-soft">
              Mã phòng bạn gửi
              <input
                value={code}
                onChange={(e) => setCode(cleanCode(e.target.value))}
                onKeyDown={(e) => e.key === "Enter" && code.length === 6 && router.push(roomHref({ code, subject_id: subject.id }))}
                placeholder="Nhập mã 6 ký tự"
                className="mt-1 block h-14 w-full rounded-2xl border-2 border-line bg-white px-4 text-center font-mono text-2xl font-bold uppercase tracking-[0.3em] text-ink outline-none placeholder:font-sans placeholder:text-lg placeholder:normal-case placeholder:tracking-normal focus:border-sky"
              />
            </label>
            <button className="btn btn-mint w-full" disabled={code.length !== 6} onClick={() => router.push(roomHref({ code, subject_id: subject.id }))}>
              Vào phòng ▶
            </button>
          </motion.div>

          <section className="space-y-3">
            <h2 className="ribbon text-xl" style={{ ["--ribbon" as string]: "var(--color-mint)" }}>
              Phòng công khai
            </h2>
            {!session ? (
              <p className="card p-4 text-sm text-ink-soft">Đăng nhập để thấy và vào các phòng công khai của các bạn.</p>
            ) : !rooms ? (
              <div className="card h-24 animate-pulse" />
            ) : rooms.length === 0 ? (
              <p className="card p-4 text-sm text-ink-soft">Chưa có phòng công khai nào đang chờ. Em tạo một phòng và chọn “Phòng công khai” nhé!</p>
            ) : (
              <div className="grid gap-3">
                {rooms.map((r, i) => (
                  <PublicRoomCard key={r.code} r={r} delay={0.03 * i} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function PublicRoomCard({ r, delay }: { r: OpenRoom; delay: number }) {
  const s = getSubject(r.subject_id);
  const { lesson, data } = useProgress();
  if (!s) return null;
  const my = rankInfo(s, lesson, data.unlocks);
  const need = RANKS.findIndex((x) => x.id === r.rank);
  const locked = need > my.index;
  const mins = Math.max(0, Math.round((Date.now() - new Date(r.created_at).getTime()) / 60000));
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="card flex items-center gap-3 p-3">
      <SubjectBadge s={s} className="h-12 w-12" />
      <div className="min-w-0 flex-1">
        <div className="truncate font-display text-base font-extrabold">
          {subjectLabel(s)} · {rankName(r.rank)}
        </div>
        <div className="flex items-center gap-1.5 truncate text-xs font-semibold text-ink-soft">
          <Avatar id={r.host_avatar} size={18} />
          <span className="truncate">
            {r.mine ? "Phòng của em" : r.host_name}
            {s.id === "go-phim" ? ` · ${modeName(r.mode)}` : ""} · {mins ? `${mins} phút trước` : "vừa tạo"}
          </span>
        </div>
      </div>
      {locked ? (
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-cream px-3 py-2 text-xs font-bold text-ink-soft">
          <IconLock className="h-4 w-4" /> {rankName(r.rank)}
        </span>
      ) : (
        <Link href={roomHref({ code: r.code, subject_id: r.subject_id, rank: r.rank, mode: r.mode })} className="btn btn-mint shrink-0 px-4 py-2 text-base">
          Vào ▶
        </Link>
      )}
    </motion.div>
  );
}
