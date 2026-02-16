import { nanoid } from "nanoid";
import type { Node } from "@xyflow/react";
import {
  BIN_CAPACITIES,
  ELEMENT_COLORS,
  GRID_SIZE,
  STORAGE_COLORS,
  STRUCTURE_COLORS,
  ZONE_COLORS,
  ZONE_LABELS,
  type BinSize,
  type ElementData,
  type StorageData,
  type StructureData,
  type StructureType,
  type WarehouseData,
  type WarehouseStatus,
  type ZoneData,
  type ZoneType,
} from "./types";

export function createWarehouseNode(data: {
  name: string;
  code: string;
  width: number;
  height: number;
  length: number;
  address: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  status: WarehouseStatus;
  maxCapacity: number;
}): Node<WarehouseData> {
  return {
    id: "warehouse",
    type: "warehouse",
    position: { x: 50, y: 50 },
    data: {
      label: data.name,
      code: data.code,
      width: data.width,
      height: data.height,
      length: data.length,
      color: "#F8FAFC",
      address: data.address,
      managerName: data.managerName,
      managerEmail: data.managerEmail,
      managerPhone: data.managerPhone,
      status: data.status,
      maxCapacity: data.maxCapacity,
    },
    draggable: false,
    style: {
      width: data.width,
      height: data.height,
    },
  };
}

export function createElementNode(
  elementType: ElementData["elementType"],
  _parentPosition: { x: number; y: number },
  parentSize: { width: number; height: number }
): Node<ElementData> {
  const id = `${elementType}-${nanoid(6)}`;
  const w = elementType === "wall" ? 200 : elementType === "gate" ? 80 : 150;
  const h = elementType === "wall" ? 12 : elementType === "gate" ? 60 : 40;

  return {
    id,
    type: "element",
    position: {
      x: Math.min(
        Math.round((parentSize.width / 2 - w / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.width - w
      ),
      y: Math.min(
        Math.round((parentSize.height / 2 - h / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.height - h
      ),
    },
    data: {
      label: elementType.charAt(0).toUpperCase() + elementType.slice(1),
      width: w,
      height: h,
      color: ELEMENT_COLORS[elementType],
      rotation: 0,
      elementType,
    },
    parentId: "warehouse",
    extent: "parent" as const,
    style: { width: w, height: h },
  };
}

export function createZoneNode(
  zoneType: ZoneType,
  parentSize: { width: number; height: number },
  formData?: {
    name?: string;
    width?: number;
    height?: number;
    length?: number;
    color?: string;
    temperatureMin?: number;
    temperatureMax?: number;
  }
): Node<ZoneData> {
  const id = `zone-${nanoid(6)}`;
  const w = formData?.width || 250;
  const h = formData?.height || 200;
  const l = formData?.length || 100;

  return {
    id,
    type: "zone",
    position: {
      x: Math.min(
        Math.round((parentSize.width / 2 - w / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.width - w
      ),
      y: Math.min(
        Math.round((parentSize.height / 2 - h / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.height - h
      ),
    },
    data: {
      label: formData?.name || ZONE_LABELS[zoneType],
      width: w,
      height: h,
      length: l,
      color: formData?.color || ZONE_COLORS[zoneType],
      zoneType,
      temperatureMin: formData?.temperatureMin,
      temperatureMax: formData?.temperatureMax,
    },
    parentId: "warehouse",
    extent: "parent" as const,
    style: { width: w, height: h },
  };
}

export function createStructureNode(
  structureType: StructureType,
  parentSize: { width: number; height: number },
  formData?: {
    name?: string;
    width?: number;
    height?: number;
    levels?: number;
    partitions?: number;
    levelCapacity?: number;
    partitionCapacity?: number;
    color?: string;
  }
): Node<StructureData> {
  const id = `structure-${nanoid(6)}`;
  const w = formData?.width || 200;
  const h = formData?.height || 150;

  return {
    id,
    type: "structure",
    position: {
      x: Math.min(
        Math.round((parentSize.width / 2 - w / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.width - w
      ),
      y: Math.min(
        Math.round((parentSize.height / 2 - h / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.height - h
      ),
    },
    data: {
      label:
        formData?.name ||
        structureType.charAt(0).toUpperCase() + structureType.slice(1),
      width: w,
      height: h,
      color: formData?.color || STRUCTURE_COLORS[structureType],
      structureType,
      levels: formData?.levels || 1,
      partitions: formData?.partitions || 1,
      levelCapacity: formData?.levelCapacity || 100,
      partitionCapacity: formData?.partitionCapacity || 50,
    },
    parentId: "warehouse",
    extent: "parent" as const,
    style: { width: w, height: h },
  };
}

export function createStorageNode(
  storageType: StorageData["storageType"],
  parentZoneId: string,
  parentSize: { width: number; height: number },
  formData?: {
    name?: string;
    width?: number;
    height?: number;
    depth?: number;
    color?: string;
    rackShelves?: number;
    rackCapacityPerShelf?: number;
    shelfCount?: number;
    shelfCapacity?: number;
    binCapacity?: number;
    binSize?: BinSize;
    floorCapacity?: number;
  }
): Node<StorageData> {
  const id = `${storageType}-${nanoid(6)}`;
  const defaults: Record<string, { w: number; h: number }> = {
    rack: { w: 100, h: 60 },
    shelf: { w: 80, h: 40 },
    bin: { w: 50, h: 40 },
    floor: { w: 120, h: 80 },
  };
  const d = defaults[storageType] || { w: 80, h: 50 };
  const w = formData?.width || d.w;
  const h = formData?.height || d.h;

  const binSize = formData?.binSize || "medium";

  return {
    id,
    type: "storage",
    position: {
      x: Math.min(
        Math.round((parentSize.width / 2 - w / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.width - w
      ),
      y: Math.min(
        Math.round((parentSize.height / 2 - h / 2) / GRID_SIZE) * GRID_SIZE,
        parentSize.height - h
      ),
    },
    data: {
      label:
        formData?.name ||
        storageType.charAt(0).toUpperCase() + storageType.slice(1),
      width: w,
      height: h,
      depth: formData?.depth || 50,
      color: formData?.color || STORAGE_COLORS[storageType],
      storageType,
      parentZoneId,
      shelfCount: storageType === "shelf" ? formData?.shelfCount || 4 : undefined,
      shelfCapacity:
        storageType === "shelf" ? formData?.shelfCapacity || 100 : undefined,
      binCapacity:
        storageType === "bin"
          ? formData?.binCapacity || BIN_CAPACITIES[binSize]
          : undefined,
      binSize: storageType === "bin" ? binSize : undefined,
      usedCapacity: 0,
    },
    parentId: parentZoneId,
    extent: "parent" as const,
    style: { width: w, height: h },
  };
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

export function checkOverlap(
  nodeA: { x: number; y: number; width: number; height: number },
  nodeB: { x: number; y: number; width: number; height: number }
): boolean {
  return !(
    nodeA.x + nodeA.width <= nodeB.x ||
    nodeB.x + nodeB.width <= nodeA.x ||
    nodeA.y + nodeA.height <= nodeB.y ||
    nodeB.y + nodeB.height <= nodeA.y
  );
}
