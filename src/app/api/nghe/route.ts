import { NextResponse } from "next/server";
import { StartStreamTranscriptionCommand, TranscribeStreamingClient } from "@aws-sdk/client-transcribe-streaming";

/**
 * Nhận dạng giọng bé đọc (môn Tập đọc). Bật bằng biến môi trường (Vercel hoặc server riêng):
 *   STT_PROVIDER=google + GOOGLE_STT_KEY=<API key Google Cloud, bật Speech-to-Text API>
 *   STT_PROVIDER=openai + OPENAI_API_KEY=<key>
 *   STT_PROVIDER=azure + AZURE_SPEECH_KEY, AZURE_SPEECH_REGION (vd. southeastasia)
 *   STT_PROVIDER=aws + AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION (vd. ap-southeast-1)
 *     IAM chỉ cần quyền transcribe:StartStreamTranscription
 * Không đặt gì thì app tự dùng nhận dạng của trình duyệt hoặc chế độ tự chấm.
 * Âm thanh chỉ chuyển thẳng tới dịch vụ để nhận dạng, không lưu lại.
 */
export const runtime = "nodejs";

const provider = () => {
  const p = process.env.STT_PROVIDER;
  if (p === "google" && process.env.GOOGLE_STT_KEY) return "google";
  if (p === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (p === "azure" && process.env.AZURE_SPEECH_KEY) return "azure";
  if (p === "aws" && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) return "aws";
  if (!p && process.env.GOOGLE_STT_KEY) return "google";
  return null;
};

export const dynamic = "force-dynamic";

/** GET /api/nghe: đã bật chưa. GET /api/nghe?test=1: gửi thử 1 giây im lặng tới Azure để biết khóa/vùng có đúng không */
export async function GET(req: Request) {
  const p = provider();
  const base = { enabled: !!p, provider: p, region: p === "azure" ? (process.env.AZURE_SPEECH_REGION ?? "southeastasia (mặc định)") : undefined };
  if (!new URL(req.url).searchParams.has("test") || p !== "azure") return NextResponse.json(base);
  try {
    await azureRecognize(silentWav(1));
    return NextResponse.json({ ...base, test: "ok: khóa và vùng Azure dùng được" });
  } catch (e) {
    return NextResponse.json({ ...base, test: `lỗi: ${(e as Error).message} (401 = sai khóa hoặc sai vùng)` });
  }
}

function silentWav(seconds: number) {
  const n = 16000 * seconds;
  const b = Buffer.alloc(44 + n * 2);
  b.write("RIFF", 0); b.writeUInt32LE(36 + n * 2, 4); b.write("WAVE", 8); b.write("fmt ", 12);
  b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(16000, 24);
  b.writeUInt32LE(32000, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write("data", 36); b.writeUInt32LE(n * 2, 40);
  return b;
}

const MAX_BYTES = 16000 * 2 * 25; // ~25 giây WAV 16 kHz

export async function POST(req: Request) {
  const p = provider();
  if (!p) return NextResponse.json({ error: "chưa cấu hình" }, { status: 503 });
  const buf = Buffer.from(await req.arrayBuffer());
  if (buf.length < 1000 || buf.length > MAX_BYTES) return NextResponse.json({ error: "độ dài không hợp lệ" }, { status: 400 });
  const hint = decodeURIComponent(req.headers.get("x-hint") ?? "").slice(0, 400);

  try {
    if (p === "azure") return NextResponse.json({ alts: await azureRecognize(buf) });
    if (p === "aws") return NextResponse.json({ alts: await awsTranscribe(buf) });
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
  } catch (e) {
    console.error("nghe:", e);
    return NextResponse.json({ error: `không gọi được dịch vụ (${(e as Error).message})` }, { status: 502 });
  }
}

/** AWS Transcribe Streaming, tiếng Việt, PCM 16 kHz (bỏ 44 byte đầu WAV) */
async function awsTranscribe(wav: Buffer): Promise<string[]> {
  const client = new TranscribeStreamingClient({ region: process.env.AWS_REGION ?? "ap-southeast-1" });
  const pcm = wav.subarray(44);
  async function* audio() {
    const CHUNK = 3200; // 100 ms
    for (let i = 0; i < pcm.length; i += CHUNK) yield { AudioEvent: { AudioChunk: pcm.subarray(i, i + CHUNK) } };
  }
  const res = await client.send(
    new StartStreamTranscriptionCommand({ LanguageCode: "vi-VN", MediaEncoding: "pcm", MediaSampleRateHertz: 16000, AudioStream: audio() }),
  );
  const finals: string[][] = [];
  for await (const ev of res.TranscriptResultStream ?? []) {
    for (const r of ev.TranscriptEvent?.Transcript?.Results ?? []) {
      if (r.IsPartial) continue;
      finals.push((r.Alternatives ?? []).map((a) => a.Transcript ?? "").filter(Boolean));
    }
  }
  if (!finals.length) return [];
  const n = Math.max(...finals.map((f) => f.length));
  return Array.from({ length: n }, (_, i) => finals.map((f) => f[i] ?? f[0] ?? "").join(" ").trim()).filter(Boolean);
}

/** Azure Speech, REST cho đoạn ngắn (dưới 60 giây), WAV PCM 16 kHz, lấy 5 kết quả tốt nhất */
async function azureRecognize(wav: Buffer): Promise<string[]> {
  const region = (process.env.AZURE_SPEECH_REGION ?? "southeastasia").trim().toLowerCase().replace(/\s+/g, "");
  const r = await fetch(`https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=vi-VN&format=detailed&profanity=raw`, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": process.env.AZURE_SPEECH_KEY!.trim(),
      "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
      Accept: "application/json",
    },
    body: new Uint8Array(wav),
  });
  if (!r.ok) throw new Error(`azure ${r.status} ${(await r.text()).slice(0, 120)}`);
  const j = (await r.json()) as { RecognitionStatus?: string; DisplayText?: string; NBest?: { Display?: string; Lexical?: string }[] };
  if (j.RecognitionStatus !== "Success") return [];
  const alts = (j.NBest ?? []).flatMap((n) => [n.Display ?? "", n.Lexical ?? ""]);
  return [...new Set([j.DisplayText ?? "", ...alts].filter(Boolean))];
}
