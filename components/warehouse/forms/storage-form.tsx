"use client";

import { useState, useEffect } from "react";
import {
  BIN_CAPACITIES,
  STORAGE_COLORS,
  type BinSize,
  type StorageData,
} from "../types";

interface StorageFormProps {
  initialData?: StorageData | null;
  onSubmit: (data: {
    storageType: StorageData["storageType"];
    name: string;
    width: number;
    height: number;
    depth: number;
    color: string;
    shelfCount?: number;
    shelfCapacity?: number;
    binCapacity?: number;
    binSize?: BinSize;
    usedCapacity?: number;
  }) => void;
  onClose: () => void;
  isEdit?: boolean;
}

const STORAGE_TYPES: StorageData["storageType"][] = [
  "rack",
  "shelf",
  "bin",
  "floor",
];

const BIN_SIZES: BinSize[] = ["small", "medium", "large"];

export function StorageForm({
  initialData,
  onSubmit,
  onClose,
  isEdit,
}: StorageFormProps) {
  const [storageType, setStorageType] = useState<StorageData["storageType"]>(
    initialData?.storageType || "rack"
  );
  const [name, setName] = useState(initialData?.label || "");
  const [width, setWidth] = useState(initialData?.width || 100);
  const [height, setHeight] = useState(initialData?.height || 60);
  const [depth, setDepth] = useState(initialData?.depth || 50);
  const [color, setColor] = useState(
    initialData?.color || STORAGE_COLORS["rack"]
  );
  const [shelfCount, setShelfCount] = useState(initialData?.shelfCount || 4);
  const [shelfCapacity, setShelfCapacity] = useState(
    initialData?.shelfCapacity || 100
  );
  const [binSize, setBinSize] = useState<BinSize>(
    initialData?.binSize || "medium"
  );
  const [binCapacity, setBinCapacity] = useState(
    initialData?.binCapacity || BIN_CAPACITIES["medium"]
  );
  const [usedCapacity, setUsedCapacity] = useState(
    initialData?.usedCapacity || 0
  );

  useEffect(() => {
    if (initialData) {
      setStorageType(initialData.storageType);
      setName(initialData.label);
      setWidth(initialData.width);
      setHeight(initialData.height);
      setDepth(initialData.depth);
      setColor(initialData.color);
      setShelfCount(initialData.shelfCount || 4);
      setShelfCapacity(initialData.shelfCapacity || 100);
      setBinSize(initialData.binSize || "medium");
      setBinCapacity(initialData.binCapacity || BIN_CAPACITIES["medium"]);
      setUsedCapacity(initialData.usedCapacity || 0);
    }
  }, [initialData]);

  useEffect(() => {
    if (!isEdit) {
      setColor(STORAGE_COLORS[storageType]);
      setName(storageType.charAt(0).toUpperCase() + storageType.slice(1));
    }
  }, [storageType, isEdit]);

  useEffect(() => {
    setBinCapacity(BIN_CAPACITIES[binSize]);
  }, [binSize]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      storageType,
      name,
      width,
      height,
      depth,
      color,
      shelfCount: storageType === "shelf" ? shelfCount : undefined,
      shelfCapacity: storageType === "shelf" ? shelfCapacity : undefined,
      binCapacity: storageType === "bin" ? binCapacity : undefined,
      binSize: storageType === "bin" ? binSize : undefined,
      usedCapacity,
    });
  };

  const totalShelfCapacity = shelfCount * shelfCapacity;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {isEdit ? "Edit Storage" : "Create Storage"}
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
        <label className="text-xs font-medium text-muted-foreground">Type</label>
        <select
          value={storageType}
          onChange={(e) =>
            setStorageType(e.target.value as StorageData["storageType"])
          }
          className="rounded-md border border-input bg-background px-3 py-2 text-sm capitalize text-foreground outline-none focus:ring-2 focus:ring-ring"
          disabled={isEdit}
        >
          {STORAGE_TYPES.map((t) => (
            <option key={t} value={t}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          required
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">W</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={20}
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
            min={20}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">D</label>
          <input
            type="number"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            min={1}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      {storageType === "shelf" && (
        <div className="rounded-md border border-input bg-accent/30 p-3">
          <h4 className="mb-2 text-xs font-semibold text-foreground">
            Shelf Capacity
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Shelves
              </label>
              <input
                type="number"
                value={shelfCount}
                onChange={(e) => setShelfCount(Math.max(1, Number(e.target.value)))}
                min={1}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Per Shelf
              </label>
              <input
                type="number"
                value={shelfCapacity}
                onChange={(e) =>
                  setShelfCapacity(Math.max(1, Number(e.target.value)))
                }
                min={1}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="mt-2 text-[11px] text-muted-foreground">
            Total capacity:{" "}
            <span className="font-semibold text-foreground">
              {totalShelfCapacity} units
            </span>
          </div>
        </div>
      )}

      {storageType === "bin" && (
        <div className="rounded-md border border-input bg-accent/30 p-3">
          <h4 className="mb-2 text-xs font-semibold text-foreground">
            Bin Capacity
          </h4>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Bin Size
              </label>
              <select
                value={binSize}
                onChange={(e) => setBinSize(e.target.value as BinSize)}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm capitalize text-foreground outline-none focus:ring-2 focus:ring-ring"
              >
                {BIN_SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)} (
                    {BIN_CAPACITIES[s]} units)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Capacity
              </label>
              <input
                type="number"
                value={binCapacity}
                onChange={(e) =>
                  setBinCapacity(Math.max(1, Number(e.target.value)))
                }
                min={1}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-medium text-muted-foreground">
                Used
              </label>
              <input
                type="number"
                value={usedCapacity}
                onChange={(e) =>
                  setUsedCapacity(Math.max(0, Number(e.target.value)))
                }
                min={0}
                max={binCapacity}
                className="rounded-md border border-input bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="text-[11px] text-muted-foreground">
              Available:{" "}
              <span className="font-semibold text-foreground">
                {binCapacity - usedCapacity} / {binCapacity} units
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Color</label>
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
        {isEdit ? "Update" : "Create"}
      </button>
    </form>
  );
}
