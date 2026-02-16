import { nanoid } from "nanoid";
import type { Node } from "@xyflow/react";
import {
  ELEMENT_COLORS,
  GRID_SIZE,
  STORAGE_COLORS,
  ZONE_COLORS,
  type ElementData,
  type StorageData,
  type WarehouseData,
  type ZoneData,
  type ZoneType,
} from "./types";

export function createWarehouseNode(data: {
  name: string;
  width: number;
  height: number;
  length: number;
}): Node<WarehouseData> {
  return {
    id: "warehouse",
    type: "warehouse",
    position: { x: 50, y: 50 },
    data: {
      label: data.name,
      width: data.width,
      height: data.height,
      length: data.length,
      color: "#F8FAFC",
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
  parentPosition: { x: number; y: number },
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
  parentSize: { width: number; height: number }
): Node<ZoneData> {
  const id = `zone-${nanoid(6)}`;
  const w = 250;
  const h = 200;

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
      label:
        zoneType === "cold-storage"
          ? "Cold Storage"
          : zoneType === "raw-materials"
            ? "Raw Materials"
            : "Finished Goods",
      width: w,
      height: h,
      color: ZONE_COLORS[zoneType],
      zoneType,
    },
    parentId: "warehouse",
    extent: "parent" as const,
    style: { width: w, height: h },
  };
}

export function createStorageNode(
  storageType: StorageData["storageType"],
  parentZoneId: string,
  parentSize: { width: number; height: number }
): Node<StorageData> {
  const id = `${storageType}-${nanoid(6)}`;
  const w = storageType === "rack" ? 100 : storageType === "shelf" ? 80 : 50;
  const h = storageType === "rack" ? 60 : storageType === "shelf" ? 40 : 40;

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
      label: storageType.charAt(0).toUpperCase() + storageType.slice(1),
      width: w,
      height: h,
      color: STORAGE_COLORS[storageType],
      storageType,
      parentZoneId,
    },
    parentId: parentZoneId,
    extent: "parent" as const,
    style: { width: w, height: h },
  };
}

export function snapToGrid(value: number): number {
  return Math.round(value / GRID_SIZE) * GRID_SIZE;
}
