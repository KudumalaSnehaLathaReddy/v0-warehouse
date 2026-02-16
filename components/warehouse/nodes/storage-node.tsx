"use client";

import { memo } from "react";
import {
  type NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { Copy, Trash2, Pencil } from "lucide-react";
import type { StorageData } from "../types";

type StorageNodeProps = NodeProps<Node<StorageData>>;

const STORAGE_ICONS: Record<string, string> = {
  rack: "RK",
  shelf: "SH",
  bin: "BN",
};

function StorageNodeComponent({ id, data, selected }: StorageNodeProps) {
  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={30}
        minHeight={25}
        lineStyle={{ borderColor: "#2563EB" }}
        handleStyle={{
          width: 5,
          height: 5,
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
          <Pencil size={12} />
        </button>
        <button
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          title="Duplicate"
          data-action="duplicate"
          data-node-id={id}
        >
          <Copy size={12} />
        </button>
        <button
          className="rounded p-1 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
          title="Delete"
          data-action="delete"
          data-node-id={id}
        >
          <Trash2 size={12} />
        </button>
      </NodeToolbar>
      <div
        className="flex h-full w-full items-center justify-center rounded border"
        style={{
          backgroundColor: data.color,
          borderColor: selected ? "#2563EB" : "rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] font-bold text-slate-600">
            {STORAGE_ICONS[data.storageType]}
          </span>
          <span className="max-w-full truncate text-[8px] text-slate-500">
            {data.label}
          </span>
        </div>
      </div>
    </>
  );
}

export const StorageNode = memo(StorageNodeComponent);
