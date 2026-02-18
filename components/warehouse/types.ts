export type WarehouseNodeType =
  | "warehouse"
  | "wall"
  | "gutter"
  | "walkway"
  | "gate"
  | "zone"
  | "structure";

export type ZoneType =
  | "cold-storage"
  | "raw-materials"
  | "finished-goods"
  | "packing-area"
  | "dispatch-area";

export type StructureType = "warehouse" | "section" | "block";

export type WarehouseStatus = "active" | "inactive" | "maintenance" | "planned";

export interface WarehouseData {
  label: string;
  code: string;
  width: number;
  height: number;
  length: number;
  color: string;
  address: string;
  managerName: string;
  managerEmail: string;
  managerPhone: string;
  status: WarehouseStatus;
  maxCapacity: number;
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

export interface Partition {
  id: string;
  name: string;
  code: string;
  width: number;
  max_capacity: number;
  used_capacity: number;
  product_name?: string;
  product_type?: string;
  product_value?: number;
  product_uom?: string;
}

export interface Level {
  id: string;
  name: string;
  code: string;
  height: number;
  partitions: Partition[];
}

export interface StructureData {
  label: string;
  code: string;
  width: number;
  height: number;
  color: string;
  structureType: StructureType;
  levels: Level[];
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

export const STRUCTURE_COLORS: Record<StructureType, string> = {
  warehouse: "#F1F5F9",
  section: "#E8F0FE",
  block: "#FFF7ED",
};

export const GRID_SIZE = 10;
