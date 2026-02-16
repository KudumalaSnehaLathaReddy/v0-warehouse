"use client";

import { useState, useEffect } from "react";
import type { WarehouseData } from "../types";

interface WarehouseFormProps {
  initialData?: WarehouseData | null;
  onSubmit: (data: {
    name: string;
    width: number;
    height: number;
    length: number;
  }) => void;
  isEdit?: boolean;
}

export function WarehouseForm({
  initialData,
  onSubmit,
  isEdit,
}: WarehouseFormProps) {
  const [name, setName] = useState(initialData?.label || "My Warehouse");
  const [width, setWidth] = useState(initialData?.width || 800);
  const [height, setHeight] = useState(initialData?.height || 600);
  const [length, setLength] = useState(initialData?.length || 100);

  useEffect(() => {
    if (initialData) {
      setName(initialData.label);
      setWidth(initialData.width);
      setHeight(initialData.height);
      setLength(initialData.length);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, width, height, length });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-foreground">
        {isEdit ? "Edit Warehouse" : "Create Warehouse"}
      </h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Name
        </label>
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
          <label className="text-xs font-medium text-muted-foreground">
            Width (px)
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={200}
            max={2000}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Height (px)
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={200}
            max={2000}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Length
          </label>
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
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        {isEdit ? "Update Warehouse" : "Create Warehouse"}
      </button>
    </form>
  );
}
