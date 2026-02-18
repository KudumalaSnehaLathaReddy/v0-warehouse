"use client";

import { memo, useState } from "react";
import {
  type NodeProps,
  NodeResizer,
  NodeToolbar,
  Position,
} from "@xyflow/react";
import type { Node } from "@xyflow/react";
import { Copy, Trash2, Pencil, X } from "lucide-react";
import type { StructureData, Partition } from "../types";
import { PartitionForm } from "../forms/partition-form";

type StructureNodeProps = NodeProps<Node<StructureData>>;

function StructureNodeComponent({ id, data, selected }: StructureNodeProps) {
  const { levels } = data;
  const [selectedPartition, setSelectedPartition] = useState<{ partition: Partition; levelId: string } | null>(null);

  const getCapacityColor = (fillPercentage: number): string => {
    if (fillPercentage < 40) return "#10b981"; // green
    if (fillPercentage < 70) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const handlePartitionClick = (partition: Partition, levelId: string) => {
    setSelectedPartition({ partition, levelId });
  };

  const handlePartitionSave = (updatedPartition: Partition) => {
    if (!selectedPartition) return;
    
    // Dispatch custom event to notify warehouse-canvas of partition update
    const event = new CustomEvent("partition-updated", {
      detail: {
        structureId: id,
        levelId: selectedPartition.levelId,
        partition: updatedPartition,
      },
    });
    window.dispatchEvent(event);
    
    setSelectedPartition(null);
  };

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

      {/* Partition Detail Modal */}
      {selectedPartition && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50"
          onClick={() => setSelectedPartition(null)}
        >
          <div 
            className="relative bg-card rounded-lg shadow-xl border border-border w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card px-4 py-3 rounded-t-lg">
              <h2 className="text-sm font-semibold text-foreground">Partition Details</h2>
              <button
                onClick={() => setSelectedPartition(null)}
                className="p-1 rounded hover:bg-accent transition-colors"
              >
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <PartitionForm
                partition={selectedPartition.partition}
                onSubmit={handlePartitionSave}
                onClose={() => setSelectedPartition(null)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export const StructureNode = memo(StructureNodeComponent);
