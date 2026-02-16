"use client";

import type { Node } from "@xyflow/react";
import { WarehouseForm } from "./forms/warehouse-form";
import { NodeEditForm } from "./forms/node-edit-form";
import { Toolbar } from "./toolbar";
import type { WarehouseData, ZoneType } from "./types";
import { Warehouse } from "lucide-react";

interface SidePanelProps {
  warehouseExists: boolean;
  warehouseData: WarehouseData | null;
  selectedNode: Node | null;
  isEditingWarehouse: boolean;
  onCreateWarehouse: (data: {
    name: string;
    width: number;
    height: number;
    length: number;
  }) => void;
  onUpdateNode: (id: string, data: Record<string, unknown>) => void;
  onAddElement: (type: "wall" | "gutter" | "walkway" | "gate") => void;
  onAddZone: (type: ZoneType) => void;
  onCloseEdit: () => void;
}

export function SidePanel({
  warehouseExists,
  warehouseData,
  selectedNode,
  isEditingWarehouse,
  onCreateWarehouse,
  onUpdateNode,
  onAddElement,
  onAddZone,
  onCloseEdit,
}: SidePanelProps) {
  return (
    <aside className="flex h-full w-72 flex-shrink-0 flex-col border-r border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Warehouse size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-card-foreground">
          Layout Designer
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {!warehouseExists && !isEditingWarehouse && (
          <WarehouseForm onSubmit={onCreateWarehouse} />
        )}

        {isEditingWarehouse && warehouseData && (
          <WarehouseForm
            initialData={warehouseData}
            onSubmit={onCreateWarehouse}
            isEdit
          />
        )}

        {warehouseExists &&
          !isEditingWarehouse &&
          selectedNode &&
          selectedNode.type !== "warehouse" && (
            <NodeEditForm
              node={selectedNode}
              onUpdate={onUpdateNode}
              onClose={onCloseEdit}
            />
          )}

        {warehouseExists &&
          !isEditingWarehouse &&
          (!selectedNode || selectedNode.type === "warehouse") && (
            <>
              <div className="mb-4 rounded-lg border border-border bg-accent/50 p-3">
                <div className="mb-1 text-xs font-semibold text-foreground">
                  {warehouseData?.label}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {warehouseData?.width} x {warehouseData?.height} x{" "}
                  {warehouseData?.length}
                </div>
                <button
                  onClick={() => onCloseEdit()}
                  className="mt-2 text-xs font-medium text-primary hover:underline"
                  data-edit-warehouse
                >
                  Edit Warehouse
                </button>
              </div>
              <Toolbar
                onAddElement={onAddElement}
                onAddZone={onAddZone}
                warehouseExists={warehouseExists}
              />
            </>
          )}
      </div>
    </aside>
  );
}
