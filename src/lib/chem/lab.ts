import { CHEMS, chem } from "./chemicals";

/**
 * Bộ máy phòng thí nghiệm ảo: trạng thái từng dụng cụ và các phản ứng.
 * Mỗi thao tác của bé (thả chất, khuấy, đun, đưa que đóm) trả về trạng thái mới + các sự kiện
 * để giao diện phát âm thanh, hiệu ứng. `log` ghi lại những gì đã xảy ra để chấm mục tiêu bài.
 */

export type Shape = "beaker" | "erlen" | "flask" | "tube" | "cyl" | "jar";

export interface VesselSpec {
  id: string;
  shape: Shape;
  /** nhãn dưới dụng cụ, vd. "A" */
  label?: string;
  /** chất có sẵn: [id chất, số liều] */
  contents?: [string, number][];
  /** số viên đá lạnh có sẵn */
  ice?: number;
  /** có nắp/đĩa lạnh đậy trên (để thấy hơi nước đọng lại) */
  lid?: boolean;
  /** sức chứa (liều). Mặc định theo dụng cụ */
  cap?: number;
  temp?: number;
  /** cốc lọc: bấm Lọc thì chất lỏng chảy qua giấy lọc sang cốc này */
  into?: string;
}

export interface Vessel {
  id: string;
  shape: Shape;
  label?: string;
  cap: number;
  /** chất lỏng và chất đã tan: id -> số liều */
  liquid: Record<string, number>;
  /** chất rắn chưa tan (hạt còn thấy được) */
  grains: Record<string, number>;
  objects: string[];
  temp: number;
  ice: number;
  /** màu kết tủa (nếu có) */
  ppt: string | null;
  /** độ cao bọt trên mặt nước (liều) */
  foam: number;
  /** 0..1 cường độ sủi bọt */
  bubbles: number;
  gas: { id: "CO2" | "H2" | "O2"; amt: number } | null;
  heating: boolean;
  /** hơi nước đọng trên nắp (0..1) */
  condense: number;
  lid: boolean;
  /** còn bao lâu đang khuấy (giây) */
  swirl: number;
  /** tia lửa xèo xèo (giây) */
  sparks: number;
  spilled: boolean;
  into?: string;
}

export type LabEventType =
  | "drop"
  | "pour"
  | "solid"
  | "object"
  | "fizz"
  | "sizzle"
  | "stir"
  | "overflow"
  | "danger"
  | "boom"
  | "stopped"
  | "splint-out"
  | "splint-relight"
  | "splint-pop"
  | "splint-none"
  | "boil"
  | "heat"
  | "color";

export interface LabEvent {
  type: LabEventType;
  vessel?: string;
  amt?: number;
}

export interface LabState {
  vessels: Vessel[];
  t: number;
  log: string[];
  events: LabEvent[];
  /** natri mẩu to: còn ít giây để bấm Dừng lại trước khi nổ */
  danger: { vessel: string; at: number } | null;
}

const CAP: Record<Shape, number> = { beaker: 8, erlen: 7, flask: 7, tube: 4, cyl: 5, jar: 7 };
export const ROOM = 25;

export function initLab(specs: VesselSpec[]): LabState {
  const vessels = specs.map((s): Vessel => {
    const v: Vessel = {
      id: s.id,
      shape: s.shape,
      label: s.label,
      cap: s.cap ?? CAP[s.shape],
      liquid: {},
      grains: {},
      objects: [],
      temp: s.temp ?? (s.ice ? 0 : ROOM),
      ice: s.ice ?? 0,
      ppt: null,
      foam: 0,
      bubbles: 0,
      gas: null,
      heating: false,
      condense: 0,
      lid: !!s.lid,
      swirl: 0,
      sparks: 0,
      spilled: false,
      into: s.into,
    };
    for (const [id, n] of s.contents ?? []) put(v, id, n, true);
    return v;
  });
  return { vessels, t: 0, log: [], events: [], danger: null };
}

/* ───────── số liệu suy ra ───────── */

export const volume = (v: Vessel) => Object.entries(v.liquid).reduce((a, [id, n]) => a + (chem(id)?.kind === "solid" ? 0 : n), 0);
/** mực nước 0..1 so với miệng dụng cụ */
export const level = (v: Vessel) => Math.min(1, (volume(v) + v.ice * 0.6) / v.cap) * 0.92;

export function ph(v: Vessel): number {
  const vol = volume(v);
  if (vol <= 0) return 7;
  let H = 0;
  let OH = 0;
  let minA = 7;
  let maxB = 7;
  for (const [id, n] of Object.entries(v.liquid)) {
    const c = chem(id);
    if (!c) continue;
    if (c.acid) {
      H += c.acid * n;
      minA = Math.min(minA, c.ph ?? 3);
    }
    if (c.base) {
      OH += c.base * n;
      maxB = Math.max(maxB, c.ph ?? 11);
    }
  }
  const net = (H - OH) / vol;
  if (Math.abs(net) < 0.015) return 7;
  return net > 0 ? 7 - (7 - minA) * (1 - Math.exp(-6 * net)) : 7 + (maxB - 7) * (1 - Math.exp(6 * net));
}

/** khối lượng riêng của dung dịch (muối, đường tan làm nước nặng hơn) */
export const density = (v: Vessel) => 1 + 0.03 * (v.liquid.muoi ?? 0) + 0.02 * (v.liquid.duong ?? 0);
export const floats = (v: Vessel, objId: string) => (chem(objId)?.density ?? 1) < density(v);

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [n >> 16, (n >> 8) & 255, n & 255];
};
const toHex = (c: number[]) => "#" + c.map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, "0")).join("");
export const mix = (a: string, b: string, k: number) => {
  const A = hex(a);
  const B = hex(b);
  return toHex(A.map((x, i) => x + (B[i] - x) * k));
};

/** thang màu nước bắp cải tím theo pH */
const CABBAGE: [number, string][] = [
  [1, "#ff2d55"],
  [3, "#ff4f8a"],
  [5, "#d45fd0"],
  [7, "#8a4fd0"],
  [8.5, "#4f6fe0"],
  [10, "#2fb38a"],
  [12, "#c9d83a"],
];
function scale(stops: [number, string][], x: number) {
  if (x <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    const [p1, c1] = stops[i];
    const [p0, c0] = stops[i - 1];
    if (x <= p1) return mix(c0, c1, (x - p0) / (p1 - p0));
  }
  return stops[stops.length - 1][1];
}

/** màu dung dịch đang thấy (null = cốc rỗng) */
export function liquidColor(v: Vessel): string | null {
  const vol = volume(v);
  if (vol <= 0) return null;
  let col: number[] = [0, 0, 0];
  let w = 0;
  for (const [id, n] of Object.entries(v.liquid)) {
    const c = chem(id);
    if (!c || c.kind === "solid" || c.kind === "indicator" || c.oil) continue;
    const k = id === "nuoc" ? 0.6 : 1.4;
    col = col.map((x, i) => x + hex(c.color)[i] * n * k);
    w += n * k;
  }
  let base = w ? toHex(col.map((x) => x / w)) : "#bfe0ff";
  const p = ph(v);
  if (v.liquid["bap-cai"]) base = mix(base, scale(CABBAGE, p), Math.min(0.95, 0.55 + v.liquid["bap-cai"] / vol));
  if (v.liquid.phenol && p >= 8.2) base = mix(base, "#ff4fa8", Math.min(0.9, 0.35 + (p - 8.2) / 3));
  return base;
}

/** tên màu để ghi sổ quan sát */
export function colorName(v: Vessel): string {
  const c = liquidColor(v);
  if (!c) return "rỗng";
  if (v.liquid["bap-cai"]) {
    const p = ph(v);
    return p < 4 ? "đỏ hồng" : p < 6.3 ? "hồng tím" : p < 7.6 ? "tím" : p < 9.2 ? "xanh dương" : p < 11.5 ? "xanh lá" : "vàng";
  }
  if (v.liquid.phenol) return ph(v) >= 8.2 ? "hồng" : "không màu";
  return "trong";
}

/* ───────── thao tác ───────── */

function put(v: Vessel, id: string, n: number, silent = false, ev?: LabEvent[]) {
  const c = chem(id);
  if (!c) return;
  if (c.kind === "object") {
    if (!v.objects.includes(id)) v.objects.push(id);
    return;
  }
  if (c.kind === "solid") {
    v.grains[id] = (v.grains[id] ?? 0) + n;
    return;
  }
  if (c.kind === "metal") return;
  v.liquid[id] = (v.liquid[id] ?? 0) + n;
  if (!silent && ev && (c.kind === "indicator" || c.acid || c.base)) ev.push({ type: "color", vessel: v.id });
}

const clone = (s: LabState): LabState => ({ ...structuredClone({ ...s, events: [] }) });

function addLog(s: LabState, k: string) {
  if (!s.log.includes(k)) s.log.push(k);
}

/** phản ứng giữa các chất đang có trong cốc (gọi sau mỗi thao tác) */
function react(s: LabState, v: Vessel) {
  // axit + muối cacbonat → CO₂ sủi bọt
  const carbIds = Object.keys(CHEMS).filter((id) => CHEMS[id].carbonate);
  const carb = carbIds.reduce((a, id) => a + (v.grains[id] ?? 0) + (v.liquid[id] ?? 0), 0);
  const acidEq = Object.entries(v.liquid).reduce((a, [id, n]) => a + (chem(id)?.acid ?? 0) * n, 0);
  const r = Math.min(carb, acidEq);
  if (r > 0.02) {
    let left = r;
    for (const id of carbIds) {
      for (const bag of [v.grains, v.liquid]) {
        const take = Math.min(bag[id] ?? 0, left);
        if (take > 0) {
          bag[id] -= take;
          left -= take;
        }
      }
    }
    for (const [id, n] of Object.entries(v.liquid)) {
      const a = chem(id)?.acid;
      if (a) v.liquid[id] = Math.max(0, n - (r * (a * n)) / acidEq / a);
    }
    v.liquid.nuoc = (v.liquid.nuoc ?? 0) + r * 0.3;
    v.gas = { id: "CO2", amt: (v.gas?.id === "CO2" ? v.gas.amt : 0) + r };
    v.foam += r * 2.2;
    v.bubbles = 1;
    v.temp -= r * 1.4;
    s.events.push({ type: "fizz", vessel: v.id, amt: r });
    addLog(s, "fizz");
    addLog(s, `fizz:${v.id}`);
    checkFoam(s, v);
  }
  metals(s, v);
  watchPh(s, v);
}

const acidOf = (v: Vessel) => Object.entries(v.liquid).reduce((a, [id, n]) => a + (chem(id)?.acid ?? 0) * n, 0);

/** kim loại gặp axit (sinh H₂) và kim loại đẩy kim loại khỏi muối */
function metals(s: LabState, v: Vessel) {
  const acid = acidOf(v);
  for (const m of ["zn", "fe"]) {
    if (!v.objects.includes(m)) continue;
    if (acid > 0.05 && !s.log.includes(`h2:${v.id}:${m}`)) {
      const amt = Math.min(1.4, acid * 0.5);
      for (const [id, n] of Object.entries(v.liquid)) if (chem(id)?.acid) v.liquid[id] = n * 0.75;
      v.gas = { id: "H2", amt: (v.gas?.id === "H2" ? v.gas.amt : 0) + amt };
      v.bubbles = 1;
      v.foam += amt * 0.8;
      s.events.push({ type: "fizz", vessel: v.id, amt });
      addLog(s, `h2:${v.id}:${m}`);
      addLog(s, `h2:${m}`);
      checkFoam(s, v);
    }
    const cu = v.liquid.cuso4 ?? 0;
    if (cu > 0.05 && !s.log.includes(`displace:${v.id}:${m}`)) {
      v.liquid.cuso4 = cu * 0.3;
      const salt = m === "fe" ? "feso4" : "znso4";
      v.liquid[salt] = (v.liquid[salt] ?? 0) + cu * 0.7;
      v.ppt = "#c8642c";
      s.events.push({ type: "color", vessel: v.id });
      addLog(s, `displace:${v.id}:${m}`);
      addLog(s, `displace:${m}`);
    }
  }
  if (v.objects.includes("cu") && acid > 0.05) addLog(s, "nogas:cu");
}

/** ghi lại các mốc pH (trung hoà, kiềm) để chấm bài */
function watchPh(s: LabState, v: Vessel) {
  if (volume(v) <= 0) return;
  const p = ph(v);
  if (v.liquid.naoh && Math.abs(p - 7) < 0.05) addLog(s, `neutral:${v.id}`);
  if (p > 8.2) addLog(s, `alkaline:${v.id}`);
  if (p > 8.2 && v.liquid.phenol) addLog(s, `pink:${v.id}`);
}

function checkFoam(s: LabState, v: Vessel) {
  const top = level(v) + v.foam / v.cap;
  if (top > 1.02 && !v.spilled) {
    v.spilled = true;
    s.events.push({ type: "overflow", vessel: v.id });
    addLog(s, "overflow");
  } else if (top > 0.7) addLog(s, `foam-high:${v.id}`);
}

function settle(s: LabState, v: Vessel) {
  for (const o of v.objects) addLog(s, `${volume(v) > 0 && floats(v, o) ? "float" : "sink"}:${o}`);
}

export function addChem(state: LabState, vesselId: string, id: string): LabState {
  const s = clone(state);
  const v = s.vessels.find((x) => x.id === vesselId);
  const c = chem(id);
  if (!v || !c) return state;
  if (c.kind !== "object" && c.kind !== "metal" && c.kind !== "solid" && volume(v) + 1 > v.cap + 0.5) {
    // rót quá đầy: tràn
    if (!v.spilled) s.events.push({ type: "overflow", vessel: v.id });
    v.spilled = true;
    addLog(s, "overflow");
    return s;
  }
  if (c.kind === "metal") {
    if (volume(v) <= 0) return state;
    if (id === "natri-to") {
      s.danger = { vessel: v.id, at: s.t + 1.6 };
      v.bubbles = 1;
      v.sparks = 2;
      v.temp += 40;
      s.events.push({ type: "danger", vessel: v.id });
      addLog(s, "danger");
      return s;
    }
    v.liquid.naoh = (v.liquid.naoh ?? 0) + 0.8;
    v.gas = { id: "H2", amt: 1 };
    v.bubbles = 1;
    v.sparks = 2.5;
    v.temp += 12;
    s.events.push({ type: "sizzle", vessel: v.id });
    addLog(s, "natri");
    return s;
  }
  put(v, id, 1, false, s.events);
  s.events.push({ type: c.kind === "object" ? "object" : c.kind === "solid" ? "solid" : c.kind === "indicator" ? "drop" : "pour", vessel: v.id });
  addLog(s, `add:${id}`);
  addLog(s, `add:${v.id}:${id}`);
  if (c.oil) addLog(s, "oil-layer");
  react(s, v);
  // rót thêm khi bọt còn cao cũng làm bọt tràn
  if (v.foam > 0.05 && (c.kind === "liquid" || c.kind === "indicator")) checkFoam(s, v);
  if (c.kind === "object" || c.kind === "solid") settle(s, v);
  return s;
}

/** hoà tan chất rắn vào nước, tối đa tới độ tan (nóng thì tan được nhiều hơn) */
function dissolve(s: LabState, v: Vessel, id: string) {
  const c = chem(id);
  const n = v.grains[id] ?? 0;
  if (!c || n <= 0) return;
  const water = Object.entries(v.liquid).reduce((a, [k, x]) => a + (chem(k)?.kind === "liquid" && !chem(k)?.oil ? x : 0), 0);
  const cap = c.solub === undefined ? Infinity : c.solub * Math.max(0, water) * Math.max(0.2, 1 + (c.solubT ?? 0) * (v.temp - 25));
  const take = Math.max(0, Math.min(n, cap - (v.liquid[id] ?? 0)));
  if (take > 0.001) {
    v.grains[id] = n - take;
    v.liquid[id] = (v.liquid[id] ?? 0) + take;
    addLog(s, `dissolve:${id}`);
    if (v.temp > 28) addLog(s, `dissolve-hot:${id}`);
  }
  if ((v.grains[id] ?? 0) > 0.02) addLog(s, `saturated:${id}`);
  else v.grains[id] = 0;
}

/** lọc: chất lỏng (và chất đã tan) chảy sang cốc đích, cặn rắn ở lại trên giấy lọc */
export function filterPour(state: LabState, vesselId: string): LabState {
  const s = clone(state);
  const v = s.vessels.find((x) => x.id === vesselId);
  const t = s.vessels.find((x) => x.id === v?.into);
  if (!v || !t || volume(v) <= 0) return state;
  const room = Math.max(0, t.cap - volume(t));
  let moved = 0;
  for (const [id, n] of Object.entries(v.liquid)) {
    const take = Math.min(n, Math.max(0, room - moved));
    if (take <= 0) continue;
    v.liquid[id] = n - take;
    t.liquid[id] = (t.liquid[id] ?? 0) + take;
    moved += take;
  }
  for (const [id, n] of Object.entries(v.liquid)) if (n <= 0.001) delete v.liquid[id];
  s.events.push({ type: "pour", vessel: t.id });
  addLog(s, `filter:${v.id}`);
  const residue = Object.entries(v.grains).filter(([, n]) => n > 0.001);
  for (const [id] of residue) addLog(s, `residue:${id}`);
  if (Object.values(t.grains).every((n) => !n)) addLog(s, `clear:${t.id}`);
  for (const id of Object.keys(t.liquid)) if (chem(id)?.kind === "solid") addLog(s, `passed:${id}`);
  return s;
}

export function stir(state: LabState, vesselId: string): LabState {
  const s = clone(state);
  const v = s.vessels.find((x) => x.id === vesselId);
  if (!v || volume(v) <= 0) return state;
  v.swirl = 1.4;
  s.events.push({ type: "stir", vessel: v.id });
  for (const [id, n] of Object.entries(v.grains)) {
    if (n <= 0) continue;
    if (chem(id)?.soluble) dissolve(s, v, id);
    else addLog(s, `nodissolve:${id}`);
  }
  if (v.liquid["dau-an"]) addLog(s, "nodissolve:dau-an");
  react(s, v);
  settle(s, v);
  return s;
}

export function toggleHeat(state: LabState, vesselId: string): LabState {
  const s = clone(state);
  const v = s.vessels.find((x) => x.id === vesselId);
  if (!v) return state;
  v.heating = !v.heating;
  s.events.push({ type: "heat", vessel: v.id });
  if (v.heating) addLog(s, "heat");
  return s;
}

/** đưa que đóm còn tàn đỏ / đang cháy vào miệng dụng cụ */
export function splint(state: LabState, vesselId: string): LabState {
  const s = clone(state);
  const v = s.vessels.find((x) => x.id === vesselId);
  if (!v) return state;
  const g = v.gas && v.gas.amt > 0.15 ? v.gas.id : null;
  const type: LabEventType = g === "CO2" ? "splint-out" : g === "O2" ? "splint-relight" : g === "H2" ? "splint-pop" : "splint-none";
  s.events.push({ type, vessel: v.id });
  addLog(s, type);
  return s;
}

/** bấm "Dừng lại!" kịp lúc: gắp mẩu natri ra */
export function stopDanger(state: LabState): LabState {
  if (!state.danger) return state;
  const s = clone(state);
  const v = s.vessels.find((x) => x.id === s.danger!.vessel);
  if (v) {
    v.sparks = 0;
    v.bubbles = 0.3;
    v.temp = Math.min(v.temp, 40);
  }
  s.danger = null;
  s.events.push({ type: "stopped" });
  addLog(s, "stopped");
  return s;
}

/** sau khi nổ hoặc trào: dọn bàn, đặt lại dụng cụ */
export function cleanVessel(state: LabState, vesselId: string, spec: VesselSpec): LabState {
  const fresh = initLab([spec]).vessels[0];
  const s = clone(state);
  s.vessels = s.vessels.map((v) => (v.id === vesselId ? fresh : v));
  s.danger = null;
  return s;
}

/** chạy thời gian: đun nóng, nguội dần, bọt xẹp, khí bay đi */
export function tick(state: LabState, dt: number): LabState {
  const busy = state.danger || state.vessels.some((v) => v.heating || v.bubbles > 0.01 || v.foam > 0.01 || v.swirl > 0 || v.sparks > 0 || Math.abs(v.temp - ROOM) > 0.3 || v.ice > 0 || v.condense > 0);
  if (!busy) return state;
  const s = clone(state);
  s.t += dt;
  if (s.danger && s.t >= s.danger.at) {
    const v = s.vessels.find((x) => x.id === s.danger!.vessel);
    if (v) {
      v.liquid = {};
      v.grains = {};
      v.spilled = true;
      v.sparks = 0;
      v.bubbles = 0;
      v.foam = 0;
    }
    s.events.push({ type: "boom", vessel: s.danger.vessel });
    addLog(s, "boom");
    s.danger = null;
  }
  for (const v of s.vessels) {
    v.swirl = Math.max(0, v.swirl - dt);
    v.sparks = Math.max(0, v.sparks - dt);
    v.foam = Math.max(0, v.foam - dt * 0.28);
    v.bubbles = v.temp >= 99.5 && volume(v) > 0 ? 0.8 : Math.max(0, v.bubbles - dt * (v.sparks > 0 ? 0.05 : 0.22));
    if (v.gas) {
      v.gas.amt -= dt * 0.03;
      if (v.gas.amt <= 0) v.gas = null;
    }
    const water = volume(v) > 0 || v.ice > 0;
    if (v.heating && water) {
      for (const id of Object.keys(v.grains)) if (chem(id)?.soluble && (v.grains[id] ?? 0) > 0) dissolve(s, v, id);
      if (v.ice > 0) {
        v.temp = Math.min(v.temp + dt * 6, 0);
        if (v.temp >= 0) {
          const m = Math.min(v.ice, dt * 0.45);
          v.ice -= m;
          v.liquid.nuoc = (v.liquid.nuoc ?? 0) + m;
          if (v.ice <= 0.001) {
            v.ice = 0;
            addLog(s, "melt");
          }
        }
      } else {
        const before = v.temp;
        v.temp = Math.min(100, v.temp + dt * 14);
        if (v.temp >= 100) {
          if (before < 100) {
            s.events.push({ type: "boil", vessel: v.id });
            addLog(s, "boil");
          }
          const dissolved = Object.keys(v.liquid).filter((id) => chem(id)?.kind === "solid" && (v.liquid[id] ?? 0) > 0.001);
          if (dissolved.length) {
            // nước muối/đường: nước bay hơi hết thì chất tan kết tinh lại
            v.liquid.nuoc = Math.max(0, (v.liquid.nuoc ?? 0) - dt * 0.15);
            v.bubbles = 0.6;
            if (v.liquid.nuoc <= 0.05) {
              v.liquid.nuoc = 0;
              for (const id of dissolved) {
                v.grains[id] = (v.grains[id] ?? 0) + (v.liquid[id] ?? 0);
                v.liquid[id] = 0;
                addLog(s, `crystal:${id}`);
              }
              v.heating = false;
              s.events.push({ type: "heat", vessel: v.id });
            }
          } else v.liquid.nuoc = Math.max(0.6, (v.liquid.nuoc ?? 0) - dt * 0.04);
          if (v.lid) {
            v.condense = Math.min(1, v.condense + dt * 0.25);
            if (v.condense > 0.6) addLog(s, "condense");
          }
        }
      }
    } else {
      if (v.ice > 0 && v.temp >= 0) {
        // để ngoài trời: đá tan chậm
        const m = Math.min(v.ice, dt * 0.04);
        v.ice -= m;
        v.liquid.nuoc = (v.liquid.nuoc ?? 0) + m;
        if (v.ice <= 0.001) {
          v.ice = 0;
          addLog(s, "melt");
        }
      } else v.temp += (ROOM - v.temp) * Math.min(1, dt * 0.25);
      if (Math.abs(v.temp - ROOM) < 0.3) v.temp = ROOM;
      v.condense = Math.max(0, v.condense - dt * 0.05);
    }
  }
  return s;
}

/** mô tả ngắn để hiện nhãn trên bàn (màu, chất khí…) */
export function vesselTags(v: Vessel): string[] {
  const out: string[] = [];
  if (v.bubbles > 0.5 && v.gas) out.push(v.gas.id === "CO2" ? "Sủi bọt khí!" : v.gas.id === "H2" ? "Xèo xèo, có khí!" : "Có khí");
  if (v.temp >= 99.5 && volume(v) > 0) out.push("Sôi rồi!");
  if (v.ppt === "#c8642c") out.push("Có lớp đồng đỏ bám vào!");
  return out;
}
