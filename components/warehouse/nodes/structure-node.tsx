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
import type { StructureData } from "../types";

type StructureNodeProps = NodeProps<Node<StructureData>>;

function StructureNodeComponent({ id, data, selected }: StructureNodeProps) {
  const { levels, partitions } = data;

  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={100}
        minHeight={80}
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
        className="flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-lg"
      >
        <button
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Edit"
          data-action="edit"
          data-node-id={id}
        >
          <Pencil size={13} />
        </button>
        <button
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Duplicate"
          data-action="duplicate"
          data-node-id={id}
        >
          <Copy size={13} />
        </button>
        <button
          className="rounded p-1 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
          data-action="delete"
          data-node-id={id}
        >
          <Trash2 size={13} />
        </button>
      </NodeToolbar>
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-md border-2"
        style={{
          backgroundColor: data.color,
          borderColor: selected ? "#2563EB" : "rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex items-center justify-between border-b px-2 py-1" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="text-[11px] font-semibold text-foreground">
            {data.label}
          </span>
          <span className="rounded bg-foreground/5 px-1.5 py-0.5 text-[9px] font-medium capitalize text-muted-foreground">
            {data.structureType}
          </span>
        </div>
        {/* Visual grid of levels x partitions */}
        <div className="flex flex-1 flex-col gap-px p-1">
          {Array.from({ length: Math.min(levels, 6) }).map((_, levelIdx) => (
            <div key={levelIdx} className="flex flex-1 gap-px">
              {Array.from({ length: Math.min(partitions, 8) }).map(
                (_, partIdx) => (
                  <div
                    key={partIdx}
                    className="flex flex-1 items-center justify-center rounded-sm border border-dashed"
                    style={{
                      borderColor: "rgba(0,0,0,0.12)",
                      backgroundColor: "rgba(255,255,255,0.5)",
                    }}
                  >
                    <span className="text-[7px] text-muted-foreground">
                      {levelIdx + 1}-{partIdx + 1}
                    </span>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-1.5 py-0.5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="text-[8px] text-muted-foreground">
            L{levels} x P{partitions}
          </span>
          <span className="text-[8px] text-muted-foreground">
            {data.width}x{data.height}
          </span>
        </div>
      </div>
    </>
  );
}

export const StructureNode = memo(StructureNodeComponent);
