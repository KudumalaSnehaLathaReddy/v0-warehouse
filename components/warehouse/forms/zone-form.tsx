"use client";

import { useState, useEffect } from "react";
import { ZONE_COLORS, ZONE_LABELS, type ZoneData, type ZoneType } from "../types";

interface ZoneFormProps {
  initialData?: ZoneData | null;
  onSubmit: (data: {
    zoneType: ZoneType;
    name: string;
    width: number;
    height: number;
    length: number;
    color: string;
    temperatureMin?: number;
    temperatureMax?: number;
  }) => void;
  onClose: () => void;
  isEdit?: boolean;
}

const ZONE_TYPES: ZoneType[] = [
  "cold-storage",
  "raw-materials",
  "finished-goods",
  "packing-area",
  "dispatch-area",
];

export function ZoneForm({ initialData, onSubmit, onClose, isEdit }: ZoneFormProps) {
  const [zoneType, setZoneType] = useState<ZoneType>(
    initialData?.zoneType || "cold-storage"
  );
  const [name, setName] = useState(initialData?.label || "");
  const [width, setWidth] = useState(initialData?.width || 250);
  const [height, setHeight] = useState(initialData?.height || 200);
  const [length, setLength] = useState(initialData?.length || 100);
  const [color, setColor] = useState(
    initialData?.color || ZONE_COLORS["cold-storage"]
  );
  const [tempMin, setTempMin] = useState(initialData?.temperatureMin ?? -20);
  const [tempMax, setTempMax] = useState(initialData?.temperatureMax ?? 5);

  useEffect(() => {
    if (initialData) {
      setZoneType(initialData.zoneType);
      setName(initialData.label);
      setWidth(initialData.width);
      setHeight(initialData.height);
      setLength(initialData.length || 100);
      setColor(initialData.color);
      setTempMin(initialData.temperatureMin ?? -20);
      setTempMax(initialData.temperatureMax ?? 5);
    }
  }, [initialData]);

  useEffect(() => {
    if (!isEdit) {
      setColor(ZONE_COLORS[zoneType]);
      setName(ZONE_LABELS[zoneType]);
    }
  }, [zoneType, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      zoneType,
      name,
      width,
      height,
      length,
      color,
      temperatureMin: zoneType === "cold-storage" ? tempMin : undefined,
      temperatureMax: zoneType === "cold-storage" ? tempMax : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {isEdit ? "Edit Zone" : "Create Zone"}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Zone Type
        </label>
        <select
          value={zoneType}
          onChange={(e) => setZoneType(e.target.value as ZoneType)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          disabled={isEdit}
        >
          {ZONE_TYPES.map((t) => (
            <option key={t} value={t}>
              {ZONE_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Zone Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      {zoneType === "cold-storage" && (
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Min Temp (C)
            </label>
            <input
              type="number"
              value={tempMin}
              onChange={(e) => setTempMin(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">
              Max Temp (C)
            </label>
            <input
              type="number"
              value={tempMax}
              onChange={(e) => setTempMax(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">W</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={100}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">H</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={80}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">L</label>
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            min={1}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Color
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-input"
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {isEdit ? "Update Zone" : "Create Zone"}
      </button>
    </form>
  );
}
