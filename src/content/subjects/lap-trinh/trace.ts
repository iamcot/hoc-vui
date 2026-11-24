import { parseProgram, type Stmt } from "@/lib/code/program";
import { makeRng } from "@/lib/rng";
import { DX, DY, turnLeft, turnRight, type Dir } from "@/lib/code/world";

/**
 * Vẽ bản đồ hành lang từ một chương trình mẫu: ô Mochi đi qua là cỏ, còn lại là tường,
 * ô đầu là S, ô cuối là G. `stars` là số thứ tự bước (1 = ô sau bước đầu) đặt sao.
 * Dùng cho các màn có khối lặp/nếu, để bản đồ luôn khớp với lời giải.
 */
export function corridor(program: string, dir: Dir, opts: { stars?: number[]; goal?: boolean; pad?: number } = {}): string[] {
  const cells: [number, number][] = [[0, 0]];
  let x = 0;
  let y = 0;
  let d = dir;
  const walk = (list: Stmt[]) => {
    for (const s of list) {
      if (s.op === "repeat") for (let k = 0; k < (s.n as number); k++) walk(s.body);
      else if (s.op === "left") d = turnLeft(d);
      else if (s.op === "right") d = turnRight(d);
      else if (s.op === "forward") {
        x += DX[d];
        y += DY[d];
        cells.push([x, y]);
      } else throw new Error("corridor: chỉ dùng F, L, R và lặp N lần");
    }
  };
  walk(parseProgram(program));
  const pad = opts.pad ?? 0;
  const minX = Math.min(...cells.map((c) => c[0])) - pad;
  const minY = Math.min(...cells.map((c) => c[1])) - pad;
  const w = Math.max(...cells.map((c) => c[0])) - minX + 1 + pad;
  const h = Math.max(...cells.map((c) => c[1])) - minY + 1 + pad;
  const g = Array.from({ length: h }, () => Array.from({ length: w }, () => "#"));
  cells.forEach(([cx, cy]) => (g[cy - minY][cx - minX] = "."));
  for (const i of opts.stars ?? []) g[cells[i][1] - minY][cells[i][0] - minX] = "*";
  const [ex, ey] = cells[cells.length - 1];
  if (opts.goal !== false) g[ey - minY][ex - minX] = "G";
  g[-minY][-minX] = "S";
  return g.map((r) => r.join(""));
}

/** sân trống cho màn bút vẽ: w × h ô cỏ, Mochi đứng ở (sx, sy) */
export function canvas(w: number, h: number, sx: number, sy: number): string[] {
  return Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => (x === sx && y === sy ? "S" : ".")).join(""));
}

/**
 * Mê cung hoàn hảo (mọi ô đi tới nhau đúng một đường) cw × ch ô, đào bằng tìm theo chiều sâu từ seed cố định.
 * Bản đồ (2cw-1) × (2ch-1) (bỏ viền tường ngoài, vì mép sân đã là tường): S ở góc trên trái, G ở góc dưới phải.
 */
export function maze(cw: number, ch: number, seed: number): string[] {
  const rng = makeRng(seed);
  const W = 2 * cw + 1;
  const H = 2 * ch + 1;
  const g = Array.from({ length: H }, () => Array.from({ length: W }, () => "#"));
  const seen = new Set<string>();
  const stack: [number, number][] = [[0, 0]];
  seen.add("0,0");
  g[1][1] = ".";
  while (stack.length) {
    const [x, y] = stack[stack.length - 1];
    const nb = (
      [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ] as const
    )
      .map(([dx, dy]) => [x + dx, y + dy] as [number, number])
      .filter(([nx, ny]) => nx >= 0 && ny >= 0 && nx < cw && ny < ch && !seen.has(`${nx},${ny}`));
    if (!nb.length) {
      stack.pop();
      continue;
    }
    const [nx, ny] = rng.pick(nb);
    seen.add(`${nx},${ny}`);
    g[2 * ny + 1][2 * nx + 1] = ".";
    g[y + ny + 1][x + nx + 1] = ".";
    stack.push([nx, ny]);
  }
  g[1][1] = "S";
  g[H - 2][W - 2] = "G";
  return g.slice(1, -1).map((r) => r.slice(1, -1).join(""));
}
