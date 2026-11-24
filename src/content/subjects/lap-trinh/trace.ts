import { parseProgram, type Stmt } from "@/lib/code/program";
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
      if (s.op === "repeat") for (let k = 0; k < s.n; k++) walk(s.body);
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
