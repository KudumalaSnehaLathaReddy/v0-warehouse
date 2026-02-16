export type WarehouseNodeType =
  | "warehouse"
  | "wall"
  | "gutter"
  | "walkway"
  | "gate"
  | "zone"
  | "rack"
  | "shelf"
  | "bin";

export type ZoneType = "cold-storage" | "raw-materials" | "finished-goods";

export interface WarehouseData {
  label: string;
  width: number;
  height: number;
  length: number;
  color: string;
}

export interface ElementData {
  label: string;
  width: number;
  height: number;
  color: string;
  rotation: number;
  elementType: "wall" | "gutter" | "walkway" | "gate";
}

export interface ZoneData {
  label: string;
  width: number;
  height: number;
  color: string;
  zoneType: ZoneType;
}

export interface StorageData {
  label: string;
  width: number;
  height: number;
  color: string;
  storageType: "rack" | "shelf" | "bin";
  parentZoneId: string;
}

export const ZONE_COLORS: Record<ZoneType, string> = {
  "cold-storage": "#DBEAFE",
  "raw-materials": "#FEF3C7",
  "finished-goods": "#D1FAE5",
};

export const ZONE_LABELS: Record<ZoneType, string> = {
  "cold-storage": "Cold Storage",
  "raw-materials": "Raw Materials",
  "finished-goods": "Finished Goods",
};

export const ELEMENT_COLORS: Record<string, string> = {
  wall: "#94A3B8",
  gutter: "#CBD5E1",
  walkway: "#E2E8F0",
  gate: "#FCA5A5",
};

export const STORAGE_COLORS: Record<string, string> = {
  rack: "#C4B5FD",
  shelf: "#A5B4FC",
  bin: "#93C5FD",
};

export const GRID_SIZE = 10;
