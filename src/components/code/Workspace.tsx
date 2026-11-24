"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type * as BlocklyT from "blockly/core";
import { countBlocks, LIST_CONDS, type Cond, type Key, type Stmt } from "@/lib/code/program";
import type { BlockKind } from "@/lib/code/world";
import type { Skin } from "@/lib/code/skins";

/**
 * Bàn ghép khối (Blockly). Chỉ hiện các khối màn này cho dùng, đọc chương trình
 * ra cây lệnh (Stmt[]) gắn dưới khối "Khi bấm Chạy". Khối thả rời bị làm mờ, không chạy.
 */

export interface WorkspaceHandle {
  highlight(id: string | null): void;
  setLocked(locked: boolean): void;
}

type B = typeof BlocklyT;

const TYPE: Record<BlockKind, string> = {
  forward: "lt_forward",
  left: "lt_left",
  right: "lt_right",
  repeat: "lt_repeat",
  if: "lt_if",
  until: "lt_until",
  set: "lt_set",
  add: "lt_add",
  repeatn: "lt_repeatn",
  def: "lt_def",
  call: "lt_call",
  calln: "lt_calln",
  ifelse: "lt_ifelse",
  key: "lt_key",
  next: "lt_next",
  first: "lt_first",
  swap: "lt_swap",
  mem: "lt_mem",
  lif: "lt_lif",
  lifelse: "lt_lifelse",
  luntil: "lt_luntil",
};

const GRID_CONDS: [string, Cond][] = [
  ["tường phía trước", "W"],
  ["đường bên trái", "A"],
  ["đường bên phải", "D"],
  ["đường phía trước", "P"],
];
const LIST_COND_OPTS: [string, Cond][] = [
  ["ở hộp cuối", "E"],
  ["hộp này là số cần tìm", "X"],
  ["hộp này > số đã nhớ", "M"],
  ["hộp này < số đã nhớ", "N"],
  ["hộp này > hộp kế", "S"],
];
const KEYS: [string, Key][] = [
  ["⬆️ lên", "u"],
  ["⬅️ trái", "l"],
  ["➡️ phải", "r"],
  ["␣ cách", "s"],
];
/** khối kiểu "cây lệnh" ứng với khối Blockly */
const stmtType = (s: Stmt): string => {
  if (s.op === "repeat") return s.n === "n" ? "lt_repeatn" : "lt_repeat";
  if (s.op === "if") return LIST_CONDS.includes(s.cond) ? (s.else ? "lt_lifelse" : "lt_lif") : s.else ? "lt_ifelse" : "lt_if";
  if (s.op === "until") return LIST_CONDS.includes(s.cond) ? "lt_luntil" : "lt_until";
  if (s.op === "call") return s.arg === undefined ? "lt_call" : "lt_calln";
  return `lt_${s.op}`;
};

/** điều kiện được hiện trong khối Nếu/Lặp tới khi của kho hàng (theo màn đang chơi) */
let listConds: Cond[] = LIST_CONDS;
/** tên hàm chưa có */
const NO_FN = "?";

let defined = false;
function define(Blockly: B) {
  if (defined) return;
  defined = true;
  Blockly.common.defineBlocksWithJsonArray([
    { type: "lt_start", message0: "▶  Khi bấm Chạy", nextStatement: null, style: "lt_event", tooltip: "Chương trình bắt đầu từ đây" },
    { type: "lt_forward", message0: "👣  Đi tới", previousStatement: null, nextStatement: null, style: "lt_move", tooltip: "Bước 1 ô về phía trước" },
    { type: "lt_left", message0: "↺  Rẽ trái", previousStatement: null, nextStatement: null, style: "lt_turn", tooltip: "Quay người sang trái (không bước)" },
    { type: "lt_right", message0: "↻  Rẽ phải", previousStatement: null, nextStatement: null, style: "lt_turn", tooltip: "Quay người sang phải (không bước)" },
    {
      type: "lt_repeat",
      message0: "🔁  Lặp lại %1 lần",
      args0: [{ type: "field_number", name: "N", value: 3, min: 1, max: 20, precision: 1 }],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_loop",
      tooltip: "Làm các khối bên trong nhiều lần",
    },
    {
      type: "lt_until",
      message0: "🔁  Lặp cho tới khi tới cờ",
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_loop",
      tooltip: "Làm đi làm lại các khối bên trong, tới cờ thì dừng",
    },
    {
      type: "lt_if",
      message0: "❓  Nếu có %1 thì",
      args0: [
        {
          type: "field_dropdown",
          name: "C",
          options: [
            ["tường phía trước", "W"],
            ["đường bên trái", "A"],
            ["đường bên phải", "D"],
          ],
        },
      ],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_logic",
      tooltip: "Chỉ làm các khối bên trong khi điều kiện đúng",
    },
    {
      type: "lt_ifelse",
      message0: "❓  Nếu có %1 thì",
      args0: [{ type: "field_dropdown", name: "C", options: GRID_CONDS }],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      message2: "không thì",
      message3: "%1",
      args3: [{ type: "input_statement", name: "ELSE" }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_logic",
      tooltip: "Điều kiện đúng thì làm nhánh trên, sai thì làm nhánh dưới",
    },
    {
      type: "lt_set",
      message0: "📦  n = %1",
      args0: [{ type: "field_number", name: "N", value: 1, min: -20, max: 20, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_data",
      tooltip: "Đặt biến n bằng một số",
    },
    {
      type: "lt_add",
      message0: "📦  n tăng thêm %1",
      args0: [{ type: "field_number", name: "N", value: 1, min: -9, max: 9, precision: 1 }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_data",
      tooltip: "Cộng thêm vào biến n (số âm là bớt đi)",
    },
    {
      type: "lt_repeatn",
      message0: "🔁  Lặp lại n lần",
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      previousStatement: null,
      nextStatement: null,
      style: "lt_loop",
      tooltip: "Số lần lặp là giá trị của biến n lúc bắt đầu lặp",
    },
    {
      type: "lt_def",
      message0: "🧩  Hàm %1",
      args0: [{ type: "field_input", name: "NAME", text: "nhảy" }],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      style: "lt_func",
      tooltip: "Đặt tên cho một nhóm khối. Gọi tên hàm là chạy cả nhóm",
    },
    {
      type: "lt_key",
      message0: "⌨️  Khi bấm phím %1",
      args0: [{ type: "field_dropdown", name: "K", options: KEYS }],
      message1: "%1",
      args1: [{ type: "input_statement", name: "DO" }],
      style: "lt_event",
      tooltip: "Mỗi lần bấm phím này thì chạy các khối bên trong",
    },
    { type: "lt_next", message0: "➡️  Sang hộp kế", previousStatement: null, nextStatement: null, style: "lt_move", tooltip: "Robot bước sang hộp bên phải" },
    { type: "lt_first", message0: "⏮  Về hộp đầu", previousStatement: null, nextStatement: null, style: "lt_move", tooltip: "Robot quay về hộp đầu hàng" },
    { type: "lt_swap", message0: "🔀  Đổi chỗ với hộp kế", previousStatement: null, nextStatement: null, style: "lt_turn", tooltip: "Đổi chỗ hộp đang đứng với hộp bên phải" },
    { type: "lt_mem", message0: "🧠  Nhớ hộp này", previousStatement: null, nextStatement: null, style: "lt_data", tooltip: "Ghi nhớ hộp đang đứng (và số trên hộp)" },
  ]);

  const condField = () => new Blockly.FieldDropdown(() => LIST_COND_OPTS.filter(([, c]) => listConds.includes(c)));
  const stmtBlock = (type: string, label: string, style: string, tooltip: string, withElse = false) => {
    Blockly.Blocks[type] = {
      init(this: BlocklyT.Block) {
        this.appendDummyInput()
          .appendField(label)
          .appendField(condField(), "C")
          .appendField(type === "lt_luntil" ? "" : "thì");
        this.appendStatementInput("DO");
        if (withElse) {
          this.appendDummyInput().appendField("không thì");
          this.appendStatementInput("ELSE");
        }
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle(style);
        this.setTooltip(tooltip);
      },
    };
  };
  stmtBlock("lt_lif", "❓  Nếu", "lt_logic", "Chỉ làm các khối bên trong khi điều kiện đúng");
  stmtBlock("lt_lifelse", "❓  Nếu", "lt_logic", "Đúng thì làm nhánh trên, sai thì làm nhánh dưới", true);
  stmtBlock("lt_luntil", "🔁  Lặp cho tới khi", "lt_loop", "Làm đi làm lại các khối bên trong, điều kiện đúng thì dừng");

  /** tên các hàm đang có trên bàn khối (khối trong cột khối lấy theo bàn chính) */
  const fnOptions = (field: BlocklyT.FieldDropdown): [string, string][] => {
    const b = field.getSourceBlock();
    const ws = b?.workspace as BlocklyT.WorkspaceSvg | undefined;
    const main = ws?.isFlyout ? ws.targetWorkspace : ws;
    const names = [...new Set((main?.getBlocksByType("lt_def", false) ?? []).map((d) => String(d.getFieldValue("NAME"))))];
    const cur = field.getValue();
    if (cur && cur !== NO_FN && !names.includes(cur)) names.push(cur);
    return names.length ? names.map((n) => [n, n]) : [["(chưa có hàm)", NO_FN]];
  };
  const callBlock = (type: string, withArg: boolean) => {
    Blockly.Blocks[type] = {
      init(this: BlocklyT.Block) {
        const input = this.appendDummyInput()
          .appendField("⚡  Gọi")
          .appendField(
            new Blockly.FieldDropdown(function (this: BlocklyT.FieldDropdown) {
              return fnOptions(this);
            }),
            "NAME",
          );
        if (withArg) input.appendField("với n =").appendField(new Blockly.FieldNumber(3, 0, 20, 1), "N");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle("lt_func");
        this.setTooltip(withArg ? "Chạy hàm, trong hàm biến n bằng số này" : "Chạy các khối trong hàm có tên này");
      },
    };
  };
  callBlock("lt_call", false);
  callBlock("lt_calln", true);
}

/** chủ đề Blockly theo giao diện; `family` là tên font đã đổi từ biến CSS ra tên thật để đo chữ đúng */
function theme(Blockly: B, skin: Skin, family: string) {
  const k = skin.blockly;
  const st = (c: [string, string, string]) => ({ colourPrimary: c[0], colourSecondary: c[1], colourTertiary: c[2] });
  return Blockly.Theme.defineTheme(`hocvui-${skin.id}`, {
    name: `hocvui-${skin.id}`,
    base: Blockly.Themes.Classic,
    blockStyles: {
      lt_event: st(k.styles.event),
      lt_move: st(k.styles.move),
      lt_turn: st(k.styles.turn),
      lt_loop: st(k.styles.loop),
      lt_logic: st(k.styles.logic),
      lt_func: st(k.styles.func),
      lt_data: st(k.styles.data),
    },
    categoryStyles: {},
    componentStyles: {
      workspaceBackgroundColour: k.bg,
      flyoutBackgroundColour: k.flyout,
      flyoutOpacity: k.flyoutOpacity,
      scrollbarColour: k.accent,
      scrollbarOpacity: 0.35,
      insertionMarkerColour: k.accent,
      insertionMarkerOpacity: 0.5,
    },
    fontStyle: { family, weight: k.font.weight, size: k.font.size },
    startHats: true,
  });
}

/** cây lệnh → JSON khối của Blockly (để nạp chương trình có sẵn) */
function toJson(list: Stmt[]): { block: object } | undefined {
  return list.reduceRight<{ block: object } | undefined>((next, s) => {
    const block = blockJson(s);
    if (next) block.next = next;
    return { block };
  }, undefined);
}

function blockJson(s: Stmt): Record<string, unknown> {
  const block: Record<string, unknown> = { type: stmtType(s) };
  if (s.op === "repeat" && s.n !== "n") block.fields = { N: s.n };
  if (s.op === "if" || (s.op === "until" && s.cond !== "G")) block.fields = { C: s.cond };
  if (s.op === "set" || s.op === "add") block.fields = { N: s.n };
  if (s.op === "def") block.fields = { NAME: s.name };
  if (s.op === "key") block.fields = { K: s.key };
  if (s.op === "call") block.fields = s.arg === undefined ? { NAME: s.name } : { NAME: s.name, N: s.arg };
  const inputs: Record<string, unknown> = {};
  if ("body" in s) {
    const body = toJson(s.body);
    if (body) inputs.DO = body;
  }
  if (s.op === "if" && s.else) {
    const el = toJson(s.else);
    if (el) inputs.ELSE = el;
  }
  if (Object.keys(inputs).length) block.inputs = inputs;
  return block;
}

/** đọc chuỗi khối từ khối bắt đầu ra cây lệnh */
function read(b: BlocklyT.Block | null): Stmt[] {
  const out: Stmt[] = [];
  const body = (c: BlocklyT.Block, name = "DO") => read(c.getInputTargetBlock(name));
  for (let c = b; c; c = c.getNextBlock()) {
    if (!c.isEnabled()) continue;
    const id = c.id;
    const num = () => Number(c.getFieldValue("N")) || 0;
    switch (c.type) {
      case "lt_forward":
      case "lt_left":
      case "lt_right":
        out.push({ op: c.type.slice(3) as "forward", id });
        break;
      case "lt_next":
      case "lt_first":
      case "lt_swap":
      case "lt_mem":
        out.push({ op: c.type.slice(3) as "next", id });
        break;
      case "lt_repeat":
        out.push({ op: "repeat", n: num() || 1, body: body(c), id });
        break;
      case "lt_repeatn":
        out.push({ op: "repeat", n: "n", body: body(c), id });
        break;
      case "lt_until":
        out.push({ op: "until", cond: "G", body: body(c), id });
        break;
      case "lt_luntil":
        out.push({ op: "until", cond: c.getFieldValue("C") as Cond, body: body(c), id });
        break;
      case "lt_if":
      case "lt_lif":
        out.push({ op: "if", cond: c.getFieldValue("C") as Cond, body: body(c), id });
        break;
      case "lt_ifelse":
      case "lt_lifelse":
        out.push({ op: "if", cond: c.getFieldValue("C") as Cond, body: body(c), else: body(c, "ELSE"), id });
        break;
      case "lt_set":
      case "lt_add":
        out.push({ op: c.type === "lt_set" ? "set" : "add", n: num(), id });
        break;
      case "lt_call":
        out.push({ op: "call", name: String(c.getFieldValue("NAME")), id });
        break;
      case "lt_calln":
        out.push({ op: "call", name: String(c.getFieldValue("NAME")), arg: num(), id });
        break;
    }
  }
  return out;
}

/** cả chương trình: các khối Hàm, Khi bấm phím (đặt rời trên bàn) rồi tới chuỗi dưới "Khi bấm Chạy" */
function readAll(w: BlocklyT.WorkspaceSvg): Stmt[] {
  const tops = w.getTopBlocks(true);
  const heads: Stmt[] = [];
  for (const t of tops) {
    if (t.type === "lt_def") heads.push({ op: "def", name: String(t.getFieldValue("NAME")).trim(), body: read(t.getInputTargetBlock("DO")), id: t.id });
    if (t.type === "lt_key") heads.push({ op: "key", key: t.getFieldValue("K") as Key, body: read(t.getInputTargetBlock("DO")), id: t.id });
  }
  const s = tops.find((b) => b.type === "lt_start");
  return [...heads, ...read(s?.getNextBlock() ?? null)];
}

/** đổi tên hàm thì các khối Gọi theo tên mới; khối Gọi chưa chọn hàm thì tự chọn hàm đầu tiên */
function syncCalls(Blockly: B, w: BlocklyT.WorkspaceSvg, e: BlocklyT.Events.Abstract) {
  const calls = [...w.getBlocksByType("lt_call", false), ...w.getBlocksByType("lt_calln", false)];
  if (!calls.length) return;
  if (e.type === Blockly.Events.BLOCK_CHANGE) {
    const ch = e as BlocklyT.Events.BlockChange;
    const src = w.getBlockById(ch.blockId ?? "");
    if (src?.type === "lt_def" && ch.name === "NAME") {
      for (const c of calls) if (c.getFieldValue("NAME") === ch.oldValue) c.setFieldValue(String(ch.newValue), "NAME");
      return;
    }
  }
  const names = w.getBlocksByType("lt_def", false).map((d) => String(d.getFieldValue("NAME")));
  if (!names.length) return;
  for (const c of calls) if (!names.includes(String(c.getFieldValue("NAME")))) c.setFieldValue(names[0], "NAME");
}

export const Workspace = forwardRef<WorkspaceHandle, { blocks: BlockKind[]; preset: Stmt[]; skin: Skin; conds?: Cond[]; onChange: (p: Stmt[]) => void }>(function Workspace(
  { blocks, preset, skin, conds, onChange },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const ws = useRef<BlocklyT.WorkspaceSvg | null>(null);
  const cb = useRef(onChange);
  cb.current = onChange;

  useImperativeHandle(ref, () => ({ highlight: (id) => ws.current?.highlightBlock(id), setLocked: (locked) => ws.current?.setIsReadOnly(locked) }));

  useEffect(() => {
    let alive = true;
    let ro: ResizeObserver | null = null;
    (async () => {
      const Blockly = await import("blockly/core");
      const vi = await import("blockly/msg/vi");
      if (!alive || !host.current) return;
      Blockly.setLocale(vi as unknown as { [key: string]: string });
      define(Blockly);
      listConds = conds?.length ? conds : LIST_CONDS;
      const cs = getComputedStyle(host.current);
      const family = skin.blockly.font.family.replace(/var\((--[\w-]+)\)/g, (_, v: string) => cs.getPropertyValue(v).trim() || "sans-serif");
      try {
        await document.fonts.load(`${skin.blockly.font.weight} ${skin.blockly.font.size}px ${family}`, "Đi tới");
      } catch {
        /* font chưa tải được thì Blockly vẫn vẽ bằng font dự phòng */
      }
      if (!alive || !host.current) return;
      const big = window.innerWidth >= 1100;
      const w = Blockly.inject(host.current, {
        toolbox: { kind: "flyoutToolbox", contents: blocks.map((k) => ({ kind: "block", type: TYPE[k] })) },
        renderer: skin.blockly.renderer,
        theme: theme(Blockly, skin, family),
        media: "/blockly/",
        sounds: false,
        trashcan: false,
        move: { scrollbars: true, drag: true, wheel: true },
        zoom: { controls: false, wheel: false, startScale: big ? 0.9 : 0.78, pinch: true },
        maxInstances: { lt_start: 1 },
        // khối hàm/phím đặt rời trên bàn, không gắn dưới khối nào
      });
      ws.current = w;
      // màn chỉ có phím (mini game) thì vẫn giữ khối Khi bấm Chạy để đặt lệnh chuẩn bị
      const heads = preset.filter((s) => s.op === "def" || s.op === "key");
      const root: Record<string, unknown> = { type: "lt_start", x: 24, y: 24, deletable: false };
      const chain = toJson(preset.filter((s) => s.op !== "def" && s.op !== "key"));
      if (chain) root.next = chain;
      // khối Hàm, Khi bấm phím nạp trước (để khối Gọi nạp sau tìm thấy tên hàm)
      // khối Hàm, Khi bấm phím xếp dưới chương trình chính (bàn hẹp cũng thấy)
      let y = 24 + 80 + 58 * countBlocks(preset.filter((s) => s.op !== "def" && s.op !== "key")) + 20;
      const tops = heads.map((h) => {
        const b = { ...blockJson(h), x: 24, y };
        y += 58 * (countBlocks([h]) + 1) + 30;
        return b;
      });
      Blockly.serialization.workspaces.load({ blocks: { languageVersion: 0, blocks: [...tops, root] } }, w);
      w.addChangeListener(Blockly.Events.disableOrphans);
      const emit = () => cb.current(readAll(w));
      w.addChangeListener((e) => {
        if (e.isUiEvent) return;
        syncCalls(Blockly, w, e);
        emit();
      });
      emit();
      ro = new ResizeObserver(() => Blockly.svgResize(w));
      ro.observe(host.current);
    })();
    return () => {
      alive = false;
      ro?.disconnect();
      ws.current?.dispose();
      ws.current = null;
    };
    // màn mới hoặc đổi giao diện thì component được dựng lại (key), không cần theo dõi blocks/preset/skin
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className="h-full w-full" />;
});
