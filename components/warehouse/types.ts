export type WarehouseNodeType =
  | "warehouse"
  | "wall"
  | "gutter"
  | "walkway"
  | "gate"
  | "zone"
  | "structure"
  | "rack"
  | "shelf"
  | "bin"
  | "floor";

export type ZoneType =
  | "cold-storage"
  | "raw-materials"
  | "finished-goods"
  | "packing-area"
  | "dispatch-area";

export type StructureType = "warehouse" | "section" | "block";

export type BinSize = "small" | "medium" | "large";

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
  length: number;
  color: string;
  zoneType: ZoneType;
  temperatureMin?: number;
  temperatureMax?: number;
}

export interface StructureData {
  label: string;
  width: number;
  height: number;
  color: string;
  structureType: StructureType;
  levels: number;
  partitions: number;
}

export interface StorageData {
  label: string;
  width: number;
  height: number;
  depth: number;
  color: string;
  storageType: "rack" | "shelf" | "bin" | "floor";
  parentZoneId: string;
  // Shelf capacity
  shelfCount?: number;
  shelfCapacity?: number;
  // Bin capacity
  binCapacity?: number;
  binSize?: BinSize;
  usedCapacity?: number;
}

export const ZONE_COLORS: Record<ZoneType, string> = {
  "cold-storage": "#DBEAFE",
  "raw-materials": "#FEF3C7",
  "finished-goods": "#D1FAE5",
  "packing-area": "#FCE7F3",
  "dispatch-area": "#E0E7FF",
};

export const ZONE_LABELS: Record<ZoneType, string> = {
  "cold-storage": "Cold Storage",
  "raw-materials": "Raw Materials",
  "finished-goods": "Finished Goods",
  "packing-area": "Packing Area",
  "dispatch-area": "Dispatch Area",
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
  floor: "#FDE68A",
};

export const STRUCTURE_COLORS: Record<StructureType, string> = {
  warehouse: "#F1F5F9",
  section: "#E8F0FE",
  block: "#FFF7ED",
};

export const BIN_CAPACITIES: Record<BinSize, number> = {
  small: 10,
  medium: 50,
  large: 100,
};

export const GRID_SIZE = 10;
