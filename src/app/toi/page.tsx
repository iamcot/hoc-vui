"use client";
import Link from "next/link";
import { useState } from "react";
import { SUBJECTS, tierLessons } from "@/content/subjects";
import { tierUnlocked } from "@/lib/tiers";
import { LEVELS } from "@/lib/quiz";
import { useProgress } from "@/lib/store";
import { emailToLogin, loginToEmail, normalizeUsername, usernameError } from "@/lib/username";
import { getSupabase } from "@/lib/supabase";
import { Avatar, AVATARS } from "@/components/Avatar";
import { Mascot } from "@/components/Mascot";
import { IconSound } from "@/components/Icons";
import { Scene } from "@/components/Scene";
import { Ico } from "@/components/Ico";
import { Art } from "@/components/Art";
import { GradeChips, ThemeCards } from "@/components/ThemePicker";

export default function MePage() {
  const { data, session, online, setProfile, setSound, setCalcMode, signOut, streak, lesson } = useProgress();
  const started = SUBJECTS.filter((s) => s.ready && s.tiers.some((t) => tierLessons(t).some((l) => lesson(s.id, l.id).read || lesson(s.id, l.id).stars > 0)));
  const [name, setName] = useState("");
  const [saved, setSaved] = useState<"" | "ok" | "fail">("");
  const save = async (p: Parameters<typeof setProfile>[0]) => {
    const ok = await setProfile(p);
    setSaved(ok ? "ok" : "fail");
    setTimeout(() => setSaved(""), 2500);
  };
  const editingName = name !== "" ? name : data.profile.name;

  return (
    <div className="space-y-6">
      <Scene variant="meadow" dim />
      <h1 className="ribbon text-3xl">Của tôi</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card space-y-5 p-6">
          <div className="flex items-center gap-4">
            <Avatar id={data.profile.avatar} size={72} />
            <div>
              <div className="font-display text-2xl font-extrabold">{data.profile.name || "Bạn nhỏ"}</div>
              <div className="text-ink-soft">
                <Ico n="star" /> {data.xp} XP · <Ico n="fire" /> {streak} ngày liên tiếp
              </div>
            </div>
          </div>
          <label className="block text-sm font-bold text-ink-soft">
            Tên hiển thị
            <div className="mt-1 flex gap-2">
              <input
                value={editingName}
                maxLength={40}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên của em"
                className="min-w-0 flex-1 rounded-2xl border-2 border-line bg-white px-4 py-2.5 text-base font-bold text-ink outline-none focus:border-sky"
              />
              <button
                className="btn btn-primary"
                disabled={!name.trim() || name === data.profile.name}
                onClick={() => {
                  void save({ name: name.trim() });
                  setName("");
                }}
              >
                Lưu
              </button>
            </div>
            {saved && <span className={`mt-1 block text-sm ${saved === "ok" ? "text-mint" : "text-rose-500"}`}>{saved === "ok" ? "✓ Đã lưu" : "Đã lưu trên máy, chưa lưu lên mạng được. Thử lại sau nhé."}</span>}
          </label>
          <div>
            <div className="mb-2 text-sm font-bold text-ink-soft">Ảnh đại diện</div>
            <div className="flex flex-wrap gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => void save({ avatar: a.id })}
                  className={`rounded-full p-1 transition ${data.profile.avatar === a.id ? "bg-sky" : "hover:bg-line"}`}
                  aria-label={a.id}
                >
                  <Avatar id={a.id} size={52} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-ink-soft">Em học lớp mấy?</p>
            <GradeChips />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-bold text-ink-soft">Giao diện</p>
            <div className="max-w-sm">
              <ThemeCards />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-ghost" onClick={() => setSound(!data.sound)}>
              <IconSound off={!data.sound} className="h-5 w-5" /> {data.sound ? "Âm thanh: bật" : "Âm thanh: tắt"}
            </button>
            <button className="btn btn-ghost" onClick={() => setCalcMode(data.calcMode === "virtual" ? "physical" : "virtual")}>
              <Ico n="calc" /> {data.calcMode === "virtual" ? "Dùng máy ảo" : "Dùng máy thật"}
            </button>
          </div>
        </section>

        <section className="card space-y-4 p-6">{online ? session ? <SignedIn email={emailToLogin(session.user.email ?? "")} onOut={signOut} /> : <AuthForm /> : <Offline />}</section>
      </div>

      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-extrabold">Tiến trình các môn</h2>
        {/* chỉ hiện môn bé đã bắt đầu học (đã đọc hoặc có sao ở ít nhất một bài) */}
        {started.length === 0 && <p className="text-ink-soft">Em chưa học môn nào. Chọn một môn ở trang chủ để bắt đầu nhé!</p>}
        {started.map((s) => {
          const tiers = s.tiers.filter((t) => t.units.length > 0);
          const all = tiers.flatMap((t) => tierLessons(t));
          const done = all.filter((l) => lesson(s.id, l.id).stars > 0).length;
          const stars = all.reduce((a, l) => a + lesson(s.id, l.id).stars, 0);
          return (
            <div key={s.id} className="space-y-2 rounded-2xl bg-white/60 p-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-2 font-display text-lg font-extrabold">
                  <Art id={s.device === "fx580" ? "xixi" : s.cover} emoji={s.emoji} rounded={s.device === "fx580" ? "" : "rounded-full"} contain={s.device === "fx580"} className="h-9 w-9 shrink-0" />
                  {s.name}
                </span>
                <span className="text-sm text-ink-soft">
                  {done}/{all.length} bài · <Ico n="star" /> {stars}/{all.length * 3}
                </span>
                <Link href={`/hoc/${s.id}`} className="ml-auto text-sm font-bold text-sky hover:underline">
                  Xem lộ trình →
                </Link>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-line">
                <div className="h-full rounded-full bg-mint transition-all" style={{ width: `${all.length ? (done / all.length) * 100 : 0}%` }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {tiers.map((tier) => {
                  const ls = tierLessons(tier);
                  const n = ls.filter((l) => lesson(s.id, l.id).stars > 0).length;
                  const t = data.tests[`${s.id}:${tier.id}`];
                  const lv = t && LEVELS.find((l) => l.id === t.level);
                  const open = tierUnlocked(s, s.tiers.indexOf(tier), lesson, data.unlocks);
                  return (
                    <span key={tier.id} className={`chip ${!open ? "bg-line/60 text-ink-soft" : n === ls.length ? "bg-mint-soft" : n > 0 ? "bg-sun-soft" : "bg-cream"}`}>
                      {open ? "" : <><Ico n="lock" />{" "}</>}
                      {tier.name}: {n}/{ls.length}
                      {lv ? ` · ${lv.emoji} ${lv.name}` : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function Offline() {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Mascot mood="think" size={100} />
      <h2 className="font-display text-xl font-extrabold">Chế độ khách</h2>
      <p className="text-ink-soft">Tiến trình đang lưu trên máy này. Khi app được nối với máy chủ, em có thể đăng nhập để lưu lên mạng và thi đấu với bạn bè.</p>
    </div>
  );
}

function SignedIn({ email, onOut }: { email: string; onOut: () => Promise<void> }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center">
      <Mascot mood="happy" size={100} />
      <h2 className="font-display text-xl font-extrabold">Đã đăng nhập</h2>
      <p className="text-ink-soft">{email}</p>
      <p className="text-sm text-ink-soft">Tiến trình được lưu lên mạng, học trên iPad hay laptop đều tiếp tục được.</p>
      <button className="btn btn-ghost" onClick={onOut}>
        Đăng xuất
      </button>
    </div>
  );
}

function AuthForm() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [login, setLogin] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const { data } = useProgress();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    if (mode === "up" && !login.includes("@")) {
      const err = usernameError(normalizeUsername(login));
      if (err) return setMsg({ ok: false, text: err });
    }
    const email = loginToEmail(login);
    setBusy(true);
    setMsg(null);
    const res =
      mode === "in"
        ? await sb.auth.signInWithPassword({ email, password: pw })
        : await sb.auth.signUp({ email, password: pw, options: { data: { username: emailToLogin(email), display_name: name || data.profile.name || "Bạn nhỏ", avatar: data.profile.avatar } } });
    setBusy(false);
    if (res.error) {
      setMsg({ ok: false, text: res.error.message.includes("Invalid login")
          ? "Sai tên đăng nhập hoặc mật khẩu."
          : /already registered|already exists/i.test(res.error.message)
            ? "Tên đăng nhập này đã có bạn dùng, chọn tên khác nhé."
            : res.error.message });
    } else if (mode === "up" && !res.data.session) {
      setMsg({ ok: true, text: "Đã tạo tài khoản nhưng máy chủ đang bật xác nhận email. Bố mẹ tắt Confirm email trong Supabase (xem README) rồi đăng nhập lại nhé." });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-3">
        <Mascot mood="happy" size={64} />
        <div>
          <h2 className="font-display text-xl font-extrabold">{mode === "in" ? "Đăng nhập" : "Tạo tài khoản"}</h2>
          <p className="text-sm text-ink-soft">Chỉ cần tên đăng nhập và mật khẩu, không cần email.</p>
        </div>
      </div>
      {mode === "up" && (
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của con (hiện trên bảng xếp hạng)" className="w-full rounded-2xl border-2 border-line bg-white px-4 py-2.5 outline-none focus:border-sky" />
      )}
      <input required value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Tên đăng nhập (vd. bena2015)" autoComplete="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} className="w-full rounded-2xl border-2 border-line bg-white px-4 py-2.5 outline-none focus:border-sky" />
      <input
        type="password"
        required
        minLength={6}
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        placeholder="Mật khẩu (ít nhất 6 ký tự)"
        autoComplete={mode === "in" ? "current-password" : "new-password"}
        className="w-full rounded-2xl border-2 border-line bg-white px-4 py-2.5 outline-none focus:border-sky"
      />
      {msg && <p className={`text-sm ${msg.ok ? "text-mint" : "text-berry"}`}>{msg.text}</p>}
      <button className="btn btn-primary w-full" disabled={busy}>
        {busy ? "Đang xử lý..." : mode === "in" ? "Đăng nhập" : "Tạo tài khoản"}
      </button>
      <button type="button" className="w-full text-sm font-bold text-sky" onClick={() => setMode(mode === "in" ? "up" : "in")}>
        {mode === "in" ? "Chưa có tài khoản? Tạo mới" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </form>
  );
}
