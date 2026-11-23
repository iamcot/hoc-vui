"use client";
import Link from "next/link";
import { useState } from "react";
import { SUBJECTS, allLessons } from "@/content/subjects";
import { LEVELS } from "@/lib/quiz";
import { useProgress } from "@/lib/store";
import { getSupabase } from "@/lib/supabase";
import { Avatar, AVATARS } from "@/components/Avatar";
import { Mascot } from "@/components/Mascot";
import { IconSound } from "@/components/Icons";
import { Scene } from "@/components/Scene";

export default function MePage() {
  const { data, session, online, setProfile, setSound, setCalcMode, signOut, streak, lesson } = useProgress();
  const [name, setName] = useState("");
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
                ⭐ {data.xp} XP · 🔥 {streak} ngày liên tiếp
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
                  setProfile({ name: name.trim() });
                  setName("");
                }}
              >
                Lưu
              </button>
            </div>
          </label>
          <div>
            <div className="mb-2 text-sm font-bold text-ink-soft">Ảnh đại diện</div>
            <div className="flex flex-wrap gap-3">
              {AVATARS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setProfile({ avatar: a.id })}
                  className={`rounded-full p-1 transition ${data.profile.avatar === a.id ? "bg-sky" : "hover:bg-line"}`}
                  aria-label={a.id}
                >
                  <Avatar id={a.id} size={52} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-ghost" onClick={() => setSound(!data.sound)}>
              <IconSound off={!data.sound} className="h-5 w-5" /> {data.sound ? "Âm thanh: bật" : "Âm thanh: tắt"}
            </button>
            <button className="btn btn-ghost" onClick={() => setCalcMode(data.calcMode === "virtual" ? "physical" : "virtual")}>
              🧮 {data.calcMode === "virtual" ? "Dùng máy ảo" : "Dùng máy thật"}
            </button>
          </div>
        </section>

        <section className="card space-y-4 p-6">{online ? session ? <SignedIn email={session.user.email ?? ""} onOut={signOut} /> : <AuthForm /> : <Offline />}</section>
      </div>

      <section className="card space-y-4 p-6">
        <h2 className="font-display text-xl font-extrabold">Tiến trình</h2>
        {SUBJECTS.filter((s) => s.ready).map((s) => {
          const ls = allLessons(s);
          const stars = ls.reduce((a, l) => a + lesson(s.id, l.id).stars, 0);
          const t = data.tests[s.id];
          const lv = t && LEVELS.find((l) => l.id === t.level);
          return (
            <div key={s.id} className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-lg font-extrabold">
                  {s.emoji} {s.name} · Lớp {s.grade}
                </span>
                <span className="chip bg-sun-soft">
                  ⭐ {stars}/{ls.length * 3} sao
                </span>
                {lv && (
                  <span className="chip bg-mint-soft">
                    {lv.emoji} {lv.name} ({t!.pct}%)
                  </span>
                )}
              </div>
              <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                {ls.map((l) => {
                  const st = lesson(s.id, l.id);
                  return (
                    <Link
                      key={l.id}
                      href={`/hoc/${s.id}/${l.id}`}
                      title={l.title}
                      className={`grid aspect-square place-items-center rounded-2xl text-2xl ${st.stars === 3 ? "bg-mint-soft" : st.stars > 0 ? "bg-sun-soft" : st.read ? "bg-sky-soft" : "bg-cream"}`}
                    >
                      {l.emoji}
                    </Link>
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
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const { data } = useProgress();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setBusy(true);
    setMsg(null);
    const res =
      mode === "in"
        ? await sb.auth.signInWithPassword({ email, password: pw })
        : await sb.auth.signUp({ email, password: pw, options: { data: { display_name: name || data.profile.name || "Bạn nhỏ", avatar: data.profile.avatar } } });
    setBusy(false);
    if (res.error) {
      setMsg({ ok: false, text: res.error.message.includes("Invalid login") ? "Sai email hoặc mật khẩu." : res.error.message });
    } else if (mode === "up" && !res.data.session) {
      setMsg({ ok: true, text: "Đã tạo tài khoản. Kiểm tra email để xác nhận rồi đăng nhập nhé." });
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="flex items-center gap-3">
        <Mascot mood="happy" size={64} />
        <div>
          <h2 className="font-display text-xl font-extrabold">{mode === "in" ? "Đăng nhập" : "Tạo tài khoản"}</h2>
          <p className="text-sm text-ink-soft">Bố mẹ giúp con tạo tài khoản bằng email nhé.</p>
        </div>
      </div>
      {mode === "up" && (
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tên của con (hiện trên bảng xếp hạng)" className="w-full rounded-2xl border-2 border-line bg-white px-4 py-2.5 outline-none focus:border-sky" />
      )}
      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" autoComplete="email" className="w-full rounded-2xl border-2 border-line bg-white px-4 py-2.5 outline-none focus:border-sky" />
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
