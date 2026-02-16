"use client";

import {
  Fence,
  Droplets,
  Footprints,
  DoorOpen,
  Snowflake,
  Package,
  PackageCheck,
} from "lucide-react";
import type { ZoneType } from "./types";

interface ToolbarProps {
  onAddElement: (type: "wall" | "gutter" | "walkway" | "gate") => void;
  onAddZone: (type: ZoneType) => void;
  warehouseExists: boolean;
}

export function Toolbar({
  onAddElement,
  onAddZone,
  warehouseExists,
}: ToolbarProps) {
  if (!warehouseExists) return null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Elements
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => onAddElement("wall")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Fence size={14} className="text-slate-500" />
            Wall
          </button>
          <button
            onClick={() => onAddElement("gutter")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Droplets size={14} className="text-slate-500" />
            Gutter
          </button>
          <button
            onClick={() => onAddElement("walkway")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Footprints size={14} className="text-slate-500" />
            Walkway
          </button>
          <button
            onClick={() => onAddElement("gate")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
          >
            <DoorOpen size={14} className="text-slate-500" />
            Gate
          </button>
        </div>
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Zones
        </h3>
        <div className="flex flex-col gap-1.5">
          <button
            onClick={() => onAddZone("cold-storage")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-blue-50"
          >
            <Snowflake size={14} className="text-blue-400" />
            Cold Storage
          </button>
          <button
            onClick={() => onAddZone("raw-materials")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-amber-50"
          >
            <Package size={14} className="text-amber-500" />
            Raw Materials
          </button>
          <button
            onClick={() => onAddZone("finished-goods")}
            className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-emerald-50"
          >
            <PackageCheck size={14} className="text-emerald-500" />
            Finished Goods
          </button>
        </div>
      </div>
    </div>
  );
}
