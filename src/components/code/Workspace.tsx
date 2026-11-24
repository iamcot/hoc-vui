"use client";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type * as BlocklyT from "blockly/core";
import type { Cond, Stmt } from "@/lib/code/program";
import type { BlockKind } from "@/lib/code/world";

/**
 * Bàn ghép khối (Blockly). Chỉ hiện các khối màn này cho dùng, đọc chương trình
 * ra cây lệnh (Stmt[]) gắn dưới khối "Khi bấm Chạy". Khối thả rời bị làm mờ, không chạy.
 */

export interface WorkspaceHandle {
  highlight(id: string | null): void;
  setLocked(locked: boolean): void;
}

type B = typeof BlocklyT;

const TYPE: Record<BlockKind, string> = { forward: "lt_forward", left: "lt_left", right: "lt_right", repeat: "lt_repeat", if: "lt_if", until: "lt_until" };

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
  ]);
}

function theme(Blockly: B) {
  return Blockly.Theme.defineTheme("hocvui-neon", {
    name: "hocvui-neon",
    base: Blockly.Themes.Classic,
    blockStyles: {
      lt_event: { colourPrimary: "#ffb020", colourSecondary: "#ffd27a", colourTertiary: "#ffe6a8" },
      lt_move: { colourPrimary: "#1a8cff", colourSecondary: "#5fb2ff", colourTertiary: "#2fd3ff" },
      lt_turn: { colourPrimary: "#7c4dff", colourSecondary: "#a587ff", colourTertiary: "#c9b5ff" },
      lt_loop: { colourPrimary: "#00c08b", colourSecondary: "#43e0b0", colourTertiary: "#7dffd9" },
      lt_logic: { colourPrimary: "#ff3d8f", colourSecondary: "#ff7ab2", colourTertiary: "#ffb3d3" },
    },
    categoryStyles: {},
    componentStyles: {
      workspaceBackgroundColour: "#060d2e",
      flyoutBackgroundColour: "#0b1648",
      flyoutOpacity: 1,
      scrollbarColour: "#2fd3ff",
      scrollbarOpacity: 0.35,
      insertionMarkerColour: "#2fd3ff",
      insertionMarkerOpacity: 0.5,
    },
    fontStyle: { family: "var(--font-nunito), ui-rounded, system-ui, sans-serif", weight: "800", size: 14 },
    startHats: true,
  });
}

/** cây lệnh → JSON khối của Blockly (để nạp chương trình có sẵn) */
function toJson(list: Stmt[]): { block: object } | undefined {
  return list.reduceRight<{ block: object } | undefined>((next, s) => {
    const block: Record<string, unknown> = { type: TYPE[s.op] };
    if (s.op === "repeat") block.fields = { N: s.n };
    if (s.op === "if") block.fields = { C: s.cond };
    if ("body" in s) {
      const body = toJson(s.body);
      if (body) block.inputs = { DO: body };
    }
    if (next) block.next = next;
    return { block };
  }, undefined);
}

/** đọc chuỗi khối từ khối bắt đầu ra cây lệnh */
function read(b: BlocklyT.Block | null): Stmt[] {
  const out: Stmt[] = [];
  for (let c = b; c; c = c.getNextBlock()) {
    if (c.type === "lt_forward") out.push({ op: "forward", id: c.id });
    else if (c.type === "lt_left") out.push({ op: "left", id: c.id });
    else if (c.type === "lt_right") out.push({ op: "right", id: c.id });
    else if (c.type === "lt_repeat") out.push({ op: "repeat", n: Number(c.getFieldValue("N")) || 1, body: read(c.getInputTargetBlock("DO")), id: c.id });
    else if (c.type === "lt_until") out.push({ op: "until", cond: "G", body: read(c.getInputTargetBlock("DO")), id: c.id });
    else if (c.type === "lt_if") out.push({ op: "if", cond: c.getFieldValue("C") as Cond, body: read(c.getInputTargetBlock("DO")), id: c.id });
  }
  return out;
}

export const Workspace = forwardRef<WorkspaceHandle, { blocks: BlockKind[]; preset: Stmt[]; onChange: (p: Stmt[]) => void }>(function Workspace({ blocks, preset, onChange }, ref) {
  const host = useRef<HTMLDivElement>(null);
  const ws = useRef<BlocklyT.WorkspaceSvg | null>(null);
  const cb = useRef(onChange);
  cb.current = onChange;

  useImperativeHandle(ref, () => ({
    highlight: (id) => ws.current?.highlightBlock(id),
    setLocked: (locked) => ws.current?.setIsReadOnly(locked),
  }));

  useEffect(() => {
    let alive = true;
    let ro: ResizeObserver | null = null;
    (async () => {
      const Blockly = await import("blockly/core");
      const vi = await import("blockly/msg/vi");
      if (!alive || !host.current) return;
      Blockly.setLocale(vi as unknown as { [key: string]: string });
      define(Blockly);
      const big = window.innerWidth >= 1100;
      const w = Blockly.inject(host.current, {
        toolbox: { kind: "flyoutToolbox", contents: blocks.map((k) => ({ kind: "block", type: TYPE[k] })) },
        renderer: "zelos",
        theme: theme(Blockly),
        media: "/blockly/",
        sounds: false,
        trashcan: false,
        move: { scrollbars: true, drag: true, wheel: true },
        zoom: { controls: false, wheel: false, startScale: big ? 0.9 : 0.78, pinch: true },
        maxInstances: { lt_start: 1 },
      });
      ws.current = w;
      const root: Record<string, unknown> = { type: "lt_start", x: 24, y: 24, deletable: false };
      const chain = toJson(preset);
      if (chain) root.next = chain;
      Blockly.serialization.workspaces.load({ blocks: { languageVersion: 0, blocks: [root] } }, w);
      w.addChangeListener(Blockly.Events.disableOrphans);
      const emit = () => {
        const s = w.getTopBlocks(false).find((b) => b.type === "lt_start");
        cb.current(read(s?.getNextBlock() ?? null));
      };
      w.addChangeListener((e) => {
        if (!e.isUiEvent) emit();
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
    // màn mới thì component được dựng lại (key), không cần theo dõi blocks/preset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={host} className="h-full w-full" />;
});
