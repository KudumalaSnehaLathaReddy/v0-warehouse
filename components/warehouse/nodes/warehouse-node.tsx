"use client";

import { memo } from "react";
import { type NodeProps, NodeResizer } from "@xyflow/react";
import type { Node } from "@xyflow/react";
import type { WarehouseData } from "../types";

type WarehouseNodeProps = NodeProps<Node<WarehouseData>>;

function WarehouseNodeComponent({ data, selected }: WarehouseNodeProps) {
  return (
    <>
      <NodeResizer
        isVisible={!!selected}
        minWidth={200}
        minHeight={200}
        lineStyle={{ borderColor: "#2563EB" }}
        handleStyle={{
          width: 8,
          height: 8,
          backgroundColor: "#2563EB",
          borderRadius: 2,
        }}
      />
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded border-2 border-dashed"
        style={{
          backgroundColor: data.color || "#F8FAFC",
          borderColor: selected ? "#2563EB" : "#94A3B8",
        }}
      >
        <div
          className="flex items-center gap-2 border-b px-3 py-1.5"
          style={{ borderColor: selected ? "#2563EB" : "#CBD5E1" }}
        >
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-slate-700">
            {data.label}
          </span>
          <span className="ml-auto text-[10px] text-slate-400">
            {data.width} x {data.height} x {data.length}
          </span>
        </div>
      </div>
    </>
  );
}

export const WarehouseNode = memo(WarehouseNodeComponent);
