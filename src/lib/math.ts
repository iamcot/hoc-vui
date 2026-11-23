export const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};
export const lcm = (a: number, b: number) => Math.abs(a * b) / gcd(a, b);

export function factorize(n: number): [number, number][] {
  const res: [number, number][] = [];
  let p = 2;
  while (n > 1 && p * p <= n) {
    let e = 0;
    while (n % p === 0) {
      n /= p;
      e++;
    }
    if (e) res.push([p, e]);
    p++;
  }
  if (n > 1) res.push([n, 1]);
  return res;
}

const SUP: Record<string, string> = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
export const sup = (n: number) => String(n).split("").map((c) => SUP[c] ?? c).join("");

export function factorString(f: [number, number][]): string {
  return f.map(([p, e]) => (e > 1 ? `${p}${sup(e)}` : `${p}`)).join(" × ");
}

export const isPrime = (n: number) => n > 1 && factorize(n).length === 1 && factorize(n)[0][1] === 1;

export interface Frac {
  n: number;
  d: number;
}
export function frac(n: number, d: number): Frac {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
}
export const fracStr = (f: Frac) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);

/** Đọc "3/4", "-3/4", "1 1/2", "0,75", "2" thành phân số. null nếu không đọc được. */
export function parseFrac(input: string): Frac | null {
  const s = input.trim().replace(/\s+/g, " ").replace(",", ".").replace("−", "-");
  let m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
  if (m) {
    const sign = m[1] ? -1 : 1;
    const w = +m[2], n = +m[3], d = +m[4];
    if (!d) return null;
    return { n: sign * (w * d + n), d };
  }
  m = s.match(/^(-?\d+)\/(-?\d+)$/);
  if (m) {
    const d = +m[2];
    if (!d) return null;
    return { n: +m[1], d };
  }
  if (/^-?\d+(\.\d+)?$/.test(s)) {
    const dec = s.split(".")[1]?.length ?? 0;
    const d = 10 ** dec;
    return { n: Math.round(parseFloat(s) * d), d };
  }
  return null;
}

/** Đọc số kiểu Việt Nam: "12,5" hoặc "12.5"; bỏ dấu cách. */
export function parseNum(input: string): number | null {
  const s = input.trim().replace(/\s/g, "").replace("−", "-").replace(",", ".");
  if (!/^-?\d*\.?\d+$/.test(s)) return null;
  return parseFloat(s);
}

/** Hiển thị số kiểu Việt Nam: dấu phẩy thập phân */
export const vn = (x: number) => String(+x.toFixed(6)).replace(".", ",");
