import { NextResponse } from "next/server";

/**
 * Nhận dạng giọng bé đọc (môn Tập đọc). Bật bằng biến môi trường trên Vercel:
 *   STT_PROVIDER=google + GOOGLE_STT_KEY=<API key Google Cloud, bật Speech-to-Text API>
 *   STT_PROVIDER=openai + OPENAI_API_KEY=<key>
 * Không đặt gì thì app tự dùng nhận dạng của trình duyệt hoặc chế độ tự chấm.
 * Âm thanh chỉ chuyển thẳng tới dịch vụ để nhận dạng, không lưu lại.
 */
export const runtime = "nodejs";

const provider = () => {
  const p = process.env.STT_PROVIDER;
  if (p === "google" && process.env.GOOGLE_STT_KEY) return "google";
  if (p === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (!p && process.env.GOOGLE_STT_KEY) return "google";
  return null;
};

export function GET() {
  return NextResponse.json({ enabled: !!provider(), provider: provider() });
}

const MAX_BYTES = 16000 * 2 * 25; // ~25 giây WAV 16 kHz

export async function POST(req: Request) {
  const p = provider();
  if (!p) return NextResponse.json({ error: "chưa cấu hình" }, { status: 503 });
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length < 1000 || buf.length > MAX_BYTES) return NextResponse.json({ error: "độ dài không hợp lệ" }, { status: 400 });
  const hint = decodeURIComponent(req.headers.get("x-hint") ?? "").slice(0, 400);

  try {
    if (p === "google") {
      const phrases = [hint, ...hint.split(/[\s.,!?]+/).filter(Boolean)].slice(0, 60);
      const r = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_STT_KEY}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          config: {
            encoding: "LINEAR16",
            sampleRateHertz: 16000,
            languageCode: "vi-VN",
            maxAlternatives: 5,
            speechContexts: [{ phrases, boost: 8 }],
          },
          audio: { content: buf.toString("base64") },
        }),
      });
      const j = (await r.json()) as { results?: { alternatives?: { transcript?: string }[] }[]; error?: { message: string } };
      if (!r.ok) return NextResponse.json({ error: j.error?.message ?? "lỗi dịch vụ" }, { status: 502 });
      const alts = (j.results ?? []).length
        ? (j.results![0].alternatives ?? []).map((_, i) => j.results!.map((res) => res.alternatives?.[i]?.transcript ?? res.alternatives?.[0]?.transcript ?? "").join(" ").trim())
        : [];
      return NextResponse.json({ alts: alts.filter(Boolean) });
    }
    const form = new FormData();
    form.append("file", new Blob([buf], { type: "audio/wav" }), "doc.wav");
    form.append("model", process.env.OPENAI_STT_MODEL ?? "gpt-4o-mini-transcribe");
    form.append("language", "vi");
    // không gửi kèm câu mẫu để máy không "đoán hộ" bé
    form.append("prompt", "Một em bé đang tập đọc to tiếng Việt, đọc chậm từng tiếng.");
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });
    const j = (await r.json()) as { text?: string; error?: { message: string } };
    if (!r.ok) return NextResponse.json({ error: j.error?.message ?? "lỗi dịch vụ" }, { status: 502 });
    return NextResponse.json({ alts: j.text ? [j.text] : [] });
  } catch {
    return NextResponse.json({ error: "không gọi được dịch vụ" }, { status: 502 });
  }
}
