"use client";

import { memo } from "react";
import {
  type NodeProps,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { Copy, Trash2, Pencil } from "lucide-react";
import type { StructureData, Partition } from "../types";

type StructureNodeProps = NodeProps<Node<StructureData>>;

function StructureNodeComponent({ id, data, selected }: StructureNodeProps) {
  const { levels } = data;

  const getCapacityColor = (fillPercentage: number): string => {
    if (fillPercentage < 40) return "#10b981"; // green
    if (fillPercentage < 70) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const handlePartitionClick = (partition: Partition, levelId: string) => {
    // Dispatch custom event to notify warehouse-canvas of partition selection
    const event = new CustomEvent("partition-selected", {
      detail: {
        structureId: id,
        levelId,
        partition,
      },
    });
    window.dispatchEvent(event);
  };

  return (
    <>
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
        {/* Visual grid of levels with partitions showing capacity fill */}
        <div className="flex flex-1 flex-col gap-px p-1">
          {levels.slice(0, 6).map((level, levelIdx) => (
            <div key={level.id} className="flex flex-1 gap-px">
              {level.partitions.slice(0, 8).map((partition) => {
                const fillPercentage = (partition.used_capacity / partition.max_capacity) * 100;
                const fillHeight = Math.round((fillPercentage / 100) * 100);

                return (
                  <button
                    key={partition.id}
                    onClick={() => handlePartitionClick(partition, level.id)}
                    className="relative flex flex-1 items-end rounded-sm border border-solid overflow-hidden cursor-pointer transition-all hover:border-blue-400 hover:shadow-md"
                    style={{
                      borderColor: "rgba(0,0,0,0.2)",
                      backgroundColor: "rgba(255,255,255,0.3)",
                    }}
                    title={`Click to edit: ${partition.name}: ${partition.used_capacity}/${partition.max_capacity}`}
                  >
                    {/* Capacity fill indicator - fills from bottom */}
                    <div
                      style={{
                        width: "100%",
                        height: `${fillHeight}%`,
                        backgroundColor: getCapacityColor(fillPercentage),
                        opacity: 0.7,
                        transition: "all 0.2s ease-out",
                      }}
                    />
                    {/* Partition label */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[6px] font-medium text-foreground drop-shadow-sm pointer-events-none">
                        {partition.code}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t px-1.5 py-0.5" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="text-[8px] text-muted-foreground">
            {levels.length}L / {data.used_capacity}/{data.max_capacity}
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
