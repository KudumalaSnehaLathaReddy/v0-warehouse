"use client";

import { memo } from "react";
import {
  type NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { Copy, Trash2, Pencil, Thermometer } from "lucide-react";
import { ZONE_LABELS, type ZoneData } from "../types";

type ZoneNodeProps = NodeProps<Node<ZoneData>>;

function ZoneNodeComponent({ id, data, selected }: ZoneNodeProps) {
  const isColdStorage = data.zoneType === "cold-storage";

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
        className="flex h-full w-full flex-col overflow-hidden rounded-md border-2 border-dashed"
        style={{
          backgroundColor: data.color,
          borderColor: selected ? "#2563EB" : "rgba(0,0,0,0.12)",
        }}
      >
        <div className="flex items-center justify-between border-b px-2 py-1" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="text-[11px] font-semibold text-foreground">
            {data.label}
          </span>
          <span className="rounded bg-foreground/5 px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
            {ZONE_LABELS[data.zoneType]}
          </span>
        </div>
        <div className="flex flex-1 items-end justify-between p-1.5">
          {isColdStorage && data.temperatureMin != null && data.temperatureMax != null && (
            <span className="flex items-center gap-0.5 text-[9px] text-blue-600">
              <Thermometer size={9} />
              {data.temperatureMin}~{data.temperatureMax}C
            </span>
          )}
          <span className="ml-auto text-[9px] text-muted-foreground">
            {data.width}x{data.height}
            {data.length ? `x${data.length}` : ""}
          </span>
        </div>
      </div>
    </>
  );
}

export const ZoneNode = memo(ZoneNodeComponent);
