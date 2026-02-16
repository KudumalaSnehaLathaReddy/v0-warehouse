"use client";

import { memo } from "react";
import {
  type NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { Copy, Trash2, Pencil, Plus } from "lucide-react";
import { ZONE_LABELS, type ZoneData } from "../types";

type ZoneNodeProps = NodeProps<Node<ZoneData>>;

function ZoneNodeComponent({ id, data, selected }: ZoneNodeProps) {
  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={150}
        minHeight={100}
        lineStyle={{ borderColor: "#2563EB" }}
        handleStyle={{
          width: 7,
          height: 7,
          backgroundColor: "#2563EB",
          borderRadius: 2,
        }}
      />
      <NodeToolbar
        isVisible={!!selected}
        position={Position.Top}
        align="center"
        className="flex items-center gap-1 rounded-md border border-slate-200 bg-white p-1 shadow-lg"
      >
        <button
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          title="Edit"
          data-action="edit"
          data-node-id={id}
        >
          <Pencil size={13} />
        </button>
        <button
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          title="Duplicate"
          data-action="duplicate"
          data-node-id={id}
        >
          <Copy size={13} />
        </button>
        <button
          className="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Delete"
          data-action="delete"
          data-node-id={id}
        >
          <Trash2 size={13} />
        </button>
        <div className="mx-1 h-4 w-px bg-slate-200" />
        <button
          className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
          title="Add Rack"
          data-action="add-rack"
          data-node-id={id}
        >
          <Plus size={11} /> Rack
        </button>
        <button
          className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
          title="Add Shelf"
          data-action="add-shelf"
          data-node-id={id}
        >
          <Plus size={11} /> Shelf
        </button>
        <button
          className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] font-medium text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-600"
          title="Add Bin"
          data-action="add-bin"
          data-node-id={id}
        >
          <Plus size={11} /> Bin
        </button>
      </NodeToolbar>
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-md border-2 border-dashed"
        style={{
          backgroundColor: data.color,
          borderColor: selected ? "#2563EB" : "rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex items-center justify-between border-b border-slate-200/50 px-2 py-1">
          <span className="text-[11px] font-semibold text-slate-700">
            {data.label}
          </span>
          <span className="rounded bg-slate-800/5 px-1.5 py-0.5 text-[9px] font-medium text-slate-500">
            {ZONE_LABELS[data.zoneType]}
          </span>
        </div>
        <div className="flex flex-1 items-end justify-end p-1">
          <span className="text-[9px] text-slate-400">
            {data.width}x{data.height}
          </span>
        </div>
      </div>
    </>
  );
}

export const ZoneNode = memo(ZoneNodeComponent);
