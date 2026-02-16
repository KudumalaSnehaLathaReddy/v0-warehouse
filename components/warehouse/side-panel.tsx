"use client";

import type { Node } from "@xyflow/react";
import {
  Warehouse,
  MapPin,
  Building2,
  Archive,
  Settings,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Layers,
} from "lucide-react";
import { useState } from "react";
import { WarehouseForm } from "./forms/warehouse-form";
import { ZoneForm } from "./forms/zone-form";
import { StructureForm } from "./forms/structure-form";
import { StorageForm } from "./forms/storage-form";
import { NodeEditForm } from "./forms/node-edit-form";
import type {
  WarehouseData,
  ElementData,
  ZoneType,
  StructureType,
  StorageData,
  ZoneData,
  StructureData,
  BinSize,
} from "./types";

type SidebarSection = "elements" | "zones" | "structures" | "storage" | "settings" | null;

interface SidePanelProps {
  isOpen: boolean;
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
  onAddElement: (type: ElementData["elementType"]) => void;
  onAddZone: (
    type: ZoneType,
    formData?: {
      name?: string;
      width?: number;
      height?: number;
      length?: number;
      color?: string;
      temperatureMin?: number;
      temperatureMax?: number;
    }
  ) => void;
  onAddStructure: (
    type: StructureType,
    formData?: {
      name?: string;
      width?: number;
      height?: number;
      levels?: number;
      partitions?: number;
      color?: string;
    }
  ) => void;
  onAddStorage: (
    type: StorageData["storageType"],
    zoneId: string,
    formData?: {
      name?: string;
      width?: number;
      height?: number;
      depth?: number;
      color?: string;
      shelfCount?: number;
      shelfCapacity?: number;
      binCapacity?: number;
      binSize?: BinSize;
    }
  ) => void;
  onCloseEdit: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  zones: Node[];
}

export function SidePanel({
  isOpen,
  warehouseExists,
  warehouseData,
  selectedNode,
  isEditingWarehouse,
  onCreateWarehouse,
  onUpdateNode,
  onAddElement,
  onAddZone,
  onAddStructure,
  onAddStorage,
  onCloseEdit,
  onExportJSON,
  onImportJSON,
  zones,
}: SidePanelProps) {
  const [openSection, setOpenSection] = useState<SidebarSection>(null);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [showStorageForm, setShowStorageForm] = useState(false);
  const [storageTargetZone, setStorageTargetZone] = useState<string>("");

  const toggleSection = (section: SidebarSection) => {
    setOpenSection((prev) => (prev === section ? null : section));
    setShowZoneForm(false);
    setShowStructureForm(false);
    setShowStorageForm(false);
  };

  const isEditing =
    isEditingWarehouse ||
    (selectedNode && selectedNode.type !== "warehouse");

  const selectedNodeData = selectedNode?.data as Record<string, unknown> | undefined;
  const isZoneEdit = selectedNode?.type === "zone";
  const isStructureEdit = selectedNode?.type === "structure";
  const isStorageEdit = selectedNode?.type === "storage";

  return (
    <aside
      className={`flex h-full flex-shrink-0 flex-col border-r border-border bg-card transition-all duration-300 ${
        isOpen ? "w-80" : "w-0 overflow-hidden border-r-0"
      }`}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Warehouse size={18} className="text-primary" />
        <h2 className="text-sm font-bold text-card-foreground">
          Layout Designer
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Warehouse create / edit */}
        {!warehouseExists && !isEditing && (
          <div className="p-4">
            <WarehouseForm onSubmit={onCreateWarehouse} />
          </div>
        )}

        {isEditingWarehouse && warehouseData && (
          <div className="p-4">
            <WarehouseForm
              initialData={warehouseData}
              onSubmit={onCreateWarehouse}
              isEdit
            />
          </div>
        )}

        {/* Node-specific edit forms */}
        {isZoneEdit && selectedNode && (
          <div className="p-4">
            <ZoneForm
              initialData={selectedNodeData as unknown as ZoneData}
              onSubmit={(d) => {
                onUpdateNode(selectedNode.id, {
                  label: d.name,
                  width: d.width,
                  height: d.height,
                  length: d.length,
                  color: d.color,
                  zoneType: d.zoneType,
                  temperatureMin: d.temperatureMin,
                  temperatureMax: d.temperatureMax,
                });
                onCloseEdit();
              }}
              onClose={onCloseEdit}
              isEdit
            />
          </div>
        )}

        {isStructureEdit && selectedNode && (
          <div className="p-4">
            <StructureForm
              initialData={selectedNodeData as unknown as StructureData}
              onSubmit={(d) => {
                onUpdateNode(selectedNode.id, {
                  label: d.name,
                  width: d.width,
                  height: d.height,
                  color: d.color,
                  structureType: d.structureType,
                  levels: d.levels,
                  partitions: d.partitions,
                });
                onCloseEdit();
              }}
              onClose={onCloseEdit}
              isEdit
            />
          </div>
        )}

        {isStorageEdit && selectedNode && (
          <div className="p-4">
            <StorageForm
              initialData={selectedNodeData as unknown as StorageData}
              onSubmit={(d) => {
                onUpdateNode(selectedNode.id, {
                  label: d.name,
                  width: d.width,
                  height: d.height,
                  depth: d.depth,
                  color: d.color,
                  storageType: d.storageType,
                  shelfCount: d.shelfCount,
                  shelfCapacity: d.shelfCapacity,
                  binCapacity: d.binCapacity,
                  binSize: d.binSize,
                  usedCapacity: d.usedCapacity,
                });
                onCloseEdit();
              }}
              onClose={onCloseEdit}
              isEdit
            />
          </div>
        )}

        {/* Element editing -- basic node edit form */}
        {selectedNode &&
          selectedNode.type === "element" &&
          !isEditingWarehouse && (
            <div className="p-4">
              <NodeEditForm
                node={selectedNode}
                onUpdate={onUpdateNode}
                onClose={onCloseEdit}
              />
            </div>
          )}

        {/* Main menu sections -- when warehouse exists and not editing */}
        {warehouseExists && !isEditing && (
          <div className="flex flex-col">
            {/* Warehouse info card */}
            <div className="border-b border-border p-4">
              <div className="rounded-lg border border-border bg-accent/30 p-3">
                <div className="mb-1 text-xs font-semibold text-foreground">
                  {warehouseData?.label}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {warehouseData?.width} x {warehouseData?.height} x{" "}
                  {warehouseData?.length}
                </div>
                <button
                  onClick={onCloseEdit}
                  className="mt-2 text-xs font-medium text-primary hover:underline"
                >
                  Edit Warehouse
                </button>
              </div>
            </div>

            {/* Accordion sections */}
            <div className="flex flex-col">
              {/* Elements (Wall, Gutter, Walkway, Gate) */}
              <button
                onClick={() => toggleSection("elements")}
                className="flex items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <Layers size={16} className="text-slate-600" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  Elements
                </span>
                {openSection === "elements" ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
              </button>
              {openSection === "elements" && (
                <div className="border-b border-border bg-accent/20 p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        { type: "wall", label: "Wall", color: "#94A3B8" },
                        { type: "gutter", label: "Gutter", color: "#CBD5E1" },
                        { type: "walkway", label: "Walkway", color: "#E2E8F0" },
                        { type: "gate", label: "Gate", color: "#FCA5A5" },
                      ] as const
                    ).map((el) => (
                      <button
                        key={el.type}
                        onClick={() => onAddElement(el.type)}
                        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                      >
                        <span
                          className="inline-block h-3 w-3 rounded-sm"
                          style={{ backgroundColor: el.color }}
                        />
                        {el.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Zone */}
              <button
                onClick={() => toggleSection("zones")}
                className="flex items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <MapPin size={16} className="text-emerald-600" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  Create Zone
                </span>
                {openSection === "zones" ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
              </button>
              {openSection === "zones" && (
                <div className="border-b border-border bg-accent/20 p-4">
                  {showZoneForm ? (
                    <ZoneForm
                      onSubmit={(d) => {
                        onAddZone(d.zoneType, {
                          name: d.name,
                          width: d.width,
                          height: d.height,
                          length: d.length,
                          color: d.color,
                          temperatureMin: d.temperatureMin,
                          temperatureMax: d.temperatureMax,
                        });
                        setShowZoneForm(false);
                      }}
                      onClose={() => setShowZoneForm(false)}
                    />
                  ) : (
                    <button
                      onClick={() => setShowZoneForm(true)}
                      className="w-full rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      + New Zone
                    </button>
                  )}
                </div>
              )}

              {/* Create Structure */}
              <button
                onClick={() => toggleSection("structures")}
                className="flex items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <Building2 size={16} className="text-blue-600" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  Create Structure
                </span>
                {openSection === "structures" ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
              </button>
              {openSection === "structures" && (
                <div className="border-b border-border bg-accent/20 p-4">
                  {showStructureForm ? (
                    <StructureForm
                      onSubmit={(d) => {
                        onAddStructure(d.structureType, {
                          name: d.name,
                          width: d.width,
                          height: d.height,
                          levels: d.levels,
                          partitions: d.partitions,
                          color: d.color,
                        });
                        setShowStructureForm(false);
                      }}
                      onClose={() => setShowStructureForm(false)}
                    />
                  ) : (
                    <button
                      onClick={() => setShowStructureForm(true)}
                      className="w-full rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      + New Structure
                    </button>
                  )}
                </div>
              )}

              {/* Create Storage */}
              <button
                onClick={() => toggleSection("storage")}
                className="flex items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <Archive size={16} className="text-amber-600" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  Racks / Shelves / Bins
                </span>
                {openSection === "storage" ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
              </button>
              {openSection === "storage" && (
                <div className="border-b border-border bg-accent/20 p-4">
                  {zones.length === 0 ? (
                    <p className="text-xs text-muted-foreground">
                      Create a zone first to add storage items.
                    </p>
                  ) : showStorageForm && storageTargetZone ? (
                    <StorageForm
                      onSubmit={(d) => {
                        onAddStorage(d.storageType, storageTargetZone, {
                          name: d.name,
                          width: d.width,
                          height: d.height,
                          depth: d.depth,
                          color: d.color,
                          shelfCount: d.shelfCount,
                          shelfCapacity: d.shelfCapacity,
                          binCapacity: d.binCapacity,
                          binSize: d.binSize,
                        });
                        setShowStorageForm(false);
                        setStorageTargetZone("");
                      }}
                      onClose={() => {
                        setShowStorageForm(false);
                        setStorageTargetZone("");
                      }}
                    />
                  ) : (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-muted-foreground">
                        Target Zone
                      </label>
                      <select
                        value={storageTargetZone}
                        onChange={(e) => setStorageTargetZone(e.target.value)}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select a zone...</option>
                        {zones.map((z) => (
                          <option key={z.id} value={z.id}>
                            {(z.data as Record<string, unknown>).label as string}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => setShowStorageForm(true)}
                        disabled={!storageTargetZone}
                        className="rounded-md border border-dashed border-input bg-background px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        + New Storage Item
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Settings */}
              <button
                onClick={() => toggleSection("settings")}
                className="flex items-center gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent/50"
              >
                <Settings size={16} className="text-muted-foreground" />
                <span className="flex-1 text-sm font-medium text-foreground">
                  Settings
                </span>
                {openSection === "settings" ? (
                  <ChevronDown size={14} className="text-muted-foreground" />
                ) : (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
              </button>
              {openSection === "settings" && (
                <div className="border-b border-border bg-accent/20 p-4">
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={onExportJSON}
                      className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                    >
                      <Download size={14} />
                      Export Layout as JSON
                    </button>
                    <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent">
                      <Upload size={14} />
                      Import Layout from JSON
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) onImportJSON(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
