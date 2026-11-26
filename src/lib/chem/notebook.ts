/**
 * Sổ tay thí nghiệm của bé (lưu trên máy): thí nghiệm đã làm, sự cố đã gặp, bài đã bỏ qua bằng kiểm tra.
 * Sao và tiến trình bài vẫn lưu trong store chung (đồng bộ tài khoản); sổ tay chỉ để ôn và trang trí.
 */

export interface Notebook {
  /** id thí nghiệm -> lần làm gần nhất */
  exps: Record<string, { at: string; lesson: string; times: number }>;
  /** id sự cố -> số lần gặp */
  incidents: Record<string, { at: string; times: number }>;
  /** bài đã qua bằng "Biết rồi? Thử 3 câu" hoặc bài xếp lớp */
  skipped: Record<string, string>;
  /** đã làm bài xếp lớp */
  placed?: string;
}

const KEY = "hocvui:hh-notes";
const EMPTY: Notebook = { exps: {}, incidents: {}, skipped: {} };

export function loadNotes(): Notebook {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : { ...EMPTY };
  } catch {
    return { ...EMPTY };
  }
}

function save(n: Notebook) {
  try {
    localStorage.setItem(KEY, JSON.stringify(n));
  } catch {
    /* bỏ qua */
  }
}

const today = () => new Date().toISOString().slice(0, 10);

export function noteExperiment(id: string, lesson: string) {
  const n = loadNotes();
  n.exps[id] = { at: today(), lesson, times: (n.exps[id]?.times ?? 0) + 1 };
  save(n);
}

export function noteIncident(id: string) {
  const n = loadNotes();
  n.incidents[id] = { at: today(), times: (n.incidents[id]?.times ?? 0) + 1 };
  save(n);
}

export function noteSkipped(lessons: string[]) {
  const n = loadNotes();
  for (const l of lessons) n.skipped[l] = today();
  save(n);
}

export function notePlaced() {
  const n = loadNotes();
  n.placed = today();
  save(n);
}

/** thẻ đến hạn ôn: làm từ 3 ngày trước trở lên, hoặc bài đã bỏ qua mà chưa làm */
export function due(at: string, days = 3) {
  return (Date.now() - new Date(at).getTime()) / 864e5 >= days;
}
