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
  floor: "FL",
};

function StorageNodeComponent({ id, data, selected }: StorageNodeProps) {
  const totalCapacity =
    data.storageType === "shelf" && data.shelfCount && data.shelfCapacity
      ? data.shelfCount * data.shelfCapacity
      : data.storageType === "bin" && data.binCapacity
        ? data.binCapacity
        : null;

  const usedPct =
    totalCapacity && data.usedCapacity != null
      ? Math.min(100, Math.round((data.usedCapacity / totalCapacity) * 100))
      : null;

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
        className="flex items-center gap-1 rounded-md border border-border bg-card p-1 shadow-lg"
      >
        <button
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Edit"
          data-action="edit"
          data-node-id={id}
        >
          <Pencil size={12} />
        </button>
        <button
          className="rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          title="Duplicate"
          data-action="duplicate"
          data-node-id={id}
        >
          <Copy size={12} />
        </button>
        <button
          className="rounded p-1 text-destructive/70 transition-colors hover:bg-destructive/10 hover:text-destructive"
          title="Delete"
          data-action="delete"
          data-node-id={id}
        >
          <Trash2 size={12} />
        </button>
      </NodeToolbar>
      <div
        className="flex h-full w-full flex-col items-center justify-center rounded border"
        style={{
          backgroundColor: data.color,
          borderColor: selected ? "#2563EB" : "rgba(0,0,0,0.15)",
        }}
      >
        <div className="flex flex-col items-center gap-0.5">
          <span className="text-[9px] font-bold text-foreground/70">
            {STORAGE_ICONS[data.storageType]}
          </span>
          <span className="max-w-full truncate px-1 text-[8px] text-foreground/60">
            {data.label}
          </span>
          {data.storageType === "bin" && data.binSize && (
            <span className="rounded-sm bg-foreground/5 px-1 text-[7px] font-medium text-muted-foreground">
              {data.binSize}
            </span>
          )}
        </div>
        {totalCapacity != null && (
          <div className="mt-1 flex w-4/5 flex-col items-center gap-0.5">
            <div className="h-1 w-full overflow-hidden rounded-full bg-foreground/10">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${usedPct || 0}%`,
                  backgroundColor:
                    (usedPct || 0) > 80
                      ? "#EF4444"
                      : (usedPct || 0) > 50
                        ? "#F59E0B"
                        : "#22C55E",
                }}
              />
            </div>
            <span className="text-[7px] text-muted-foreground">
              {data.usedCapacity || 0}/{totalCapacity}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

export const StorageNode = memo(StorageNodeComponent);
