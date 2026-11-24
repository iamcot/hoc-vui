/**
 * Môn Lập trình khối lệnh: thế giới lưới của Mochi.
 *
 * Màn chơi là dữ liệu. Bản đồ viết bằng chữ, mỗi dòng một hàng, từ trên xuống:
 *   `.` cỏ (đi được)   `#` tường đá   `~` nước (cũng không đi được)
 *   `S` chỗ xuất phát  `G` cờ đích    `*` ngôi sao cần nhặt
 * Hướng: 0 lên, 1 phải, 2 xuống, 3 trái.
 */

export type Dir = 0 | 1 | 2 | 3;

/** các khối lệnh có trong môn (mỗi màn chỉ mở một phần) */
export type BlockKind = "forward" | "left" | "right" | "repeat" | "if" | "until";

export interface Level {
  id: string;
  map: string[];
  /** hướng Mochi nhìn lúc xuất phát */
  dir: Dir;
  /** khối được dùng ở màn này */
  blocks: BlockKind[];
  /** số khối của lời giải ngắn nhất (để chấm sao). Không đặt thì tự tính bằng tìm đường (chỉ đúng khi không có khối lặp). */
  optimal?: number;
  /** lời dẫn ngắn hiện trên màn */
  hint?: string;
  /** chương trình có sẵn khi vào màn (bài gỡ lỗi), viết kiểu "F F L F" (xem program.ts) */
  preset?: string;
  /** một lời giải đạt số khối tối ưu (bắt buộc khi màn có khối lặp/nếu: kiểm thử dùng để soát `optimal`) */
  solution?: string;
  /** bản đồ ẩn: cùng chương trình phải chạy đúng cả ở đây (bài Nếu, Lặp tới khi) */
  alt?: { map: string[]; dir: Dir }[];
  /** màn bút vẽ: hình mẫu là nét do chương trình này vẽ ra; vẽ đúng y hệt là qua màn */
  draw?: string;
}

export interface Pos {
  x: number;
  y: number;
}

export interface World {
  w: number;
  h: number;
  /** true = không đi được */
  solid: boolean[][];
  water: boolean[][];
  start: Pos;
  dir: Dir;
  goal: Pos | null;
  stars: Pos[];
  /** màn bút vẽ: các nét cần vẽ (khóa cạnh, xem edgeKey) */
  target?: Set<string>;
}

/** khóa của một nét vẽ giữa hai ô kề nhau (không phân biệt chiều) */
export const edgeKey = (ax: number, ay: number, bx: number, by: number) => (ax < bx || (ax === bx && ay < by) ? `${ax},${ay}-${bx},${by}` : `${bx},${by}-${ax},${ay}`);

export const DX = [0, 1, 0, -1] as const;
export const DY = [-1, 0, 1, 0] as const;
export const DIR_NAME = ["lên trên", "sang phải", "xuống dưới", "sang trái"] as const;
export const DIR_ARROW = ["⬆️", "➡️", "⬇️", "⬅️"] as const;

export const turnLeft = (d: Dir): Dir => ((d + 3) % 4) as Dir;
export const turnRight = (d: Dir): Dir => ((d + 1) % 4) as Dir;

export function parseLevel(l: Level): World {
  const h = l.map.length;
  const w = Math.max(...l.map.map((r) => r.length));
  const solid: boolean[][] = [];
  const water: boolean[][] = [];
  let start: Pos | null = null;
  let goal: Pos | null = null;
  const stars: Pos[] = [];
  for (let y = 0; y < h; y++) {
    solid.push([]);
    water.push([]);
    for (let x = 0; x < w; x++) {
      const c = l.map[y][x] ?? "#";
      if (!".#~SG*".includes(c)) throw new Error(`${l.id}: ký tự lạ "${c}"`);
      solid[y].push(c === "#" || c === "~");
      water[y].push(c === "~");
      if (c === "S") start = { x, y };
      if (c === "G") goal = { x, y };
      if (c === "*") stars.push({ x, y });
    }
  }
  if (!start) throw new Error(`${l.id}: thiếu chỗ xuất phát S`);
  if (!goal && !stars.length && !l.draw) throw new Error(`${l.id}: cần cờ G, sao * hoặc hình mẫu`);
  return { w, h, solid, water, start, dir: l.dir, goal, stars };
}

export const isOpen = (w: World, x: number, y: number) => x >= 0 && y >= 0 && x < w.w && y < w.h && !w.solid[y][x];

/** Tìm chuỗi lệnh ngắn nhất (Đi/Rẽ trái/Rẽ phải) nhặt hết sao rồi tới cờ. Không giải được thì null. */
export function solve(w: World): string[] | null {
  const n = w.stars.length;
  const full = (1 << n) - 1;
  const key = (x: number, y: number, d: number, m: number) => ((y * w.w + x) * 4 + d) * (full + 1) + m;
  const starAt = (x: number, y: number) => w.stars.findIndex((s) => s.x === x && s.y === y);
  const done = (x: number, y: number, m: number) => m === full && (!w.goal || (w.goal.x === x && w.goal.y === y));
  const m0 = (() => {
    const i = starAt(w.start.x, w.start.y);
    return i >= 0 ? 1 << i : 0;
  })();
  type Node = { x: number; y: number; d: Dir; m: number; path: string[] };
  const q: Node[] = [{ x: w.start.x, y: w.start.y, d: w.dir, m: m0, path: [] }];
  const seen = new Set([key(w.start.x, w.start.y, w.dir, m0)]);
  if (done(w.start.x, w.start.y, m0)) return [];
  for (let i = 0; i < q.length; i++) {
    const c = q[i];
    const next: [string, number, number, Dir][] = [
      ["F", c.x + DX[c.d], c.y + DY[c.d], c.d],
      ["L", c.x, c.y, turnLeft(c.d)],
      ["R", c.x, c.y, turnRight(c.d)],
    ];
    for (const [op, x, y, d] of next) {
      if (!isOpen(w, x, y)) continue;
      const si = starAt(x, y);
      const m = si >= 0 ? c.m | (1 << si) : c.m;
      const k = key(x, y, d, m);
      if (seen.has(k)) continue;
      seen.add(k);
      const path = [...c.path, op];
      if (done(x, y, m)) return path;
      q.push({ x, y, d, m, path });
    }
  }
  return null;
}
