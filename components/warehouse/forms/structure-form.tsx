"use client";

import { useState, useEffect } from "react";
import { STRUCTURE_COLORS, type StructureData, type StructureType } from "../types";

interface StructureFormProps {
  initialData?: StructureData | null;
  onSubmit: (data: {
    structureType: StructureType;
    name: string;
    width: number;
    height: number;
    levels: number;
    partitions: number;
    color: string;
  }) => void;
  onClose: () => void;
  isEdit?: boolean;
}

const STRUCTURE_TYPES: StructureType[] = ["warehouse", "section", "block"];

export function StructureForm({
  initialData,
  onSubmit,
  onClose,
  isEdit,
}: StructureFormProps) {
  const [structureType, setStructureType] = useState<StructureType>(
    initialData?.structureType || "section"
  );
  const [name, setName] = useState(initialData?.label || "");
  const [width, setWidth] = useState(initialData?.width || 200);
  const [height, setHeight] = useState(initialData?.height || 150);
  const [levels, setLevels] = useState(initialData?.levels || 1);
  const [partitions, setPartitions] = useState(initialData?.partitions || 1);
  const [color, setColor] = useState(
    initialData?.color || STRUCTURE_COLORS["section"]
  );

  useEffect(() => {
    if (initialData) {
      setStructureType(initialData.structureType);
      setName(initialData.label);
      setWidth(initialData.width);
      setHeight(initialData.height);
      setLevels(initialData.levels);
      setPartitions(initialData.partitions);
      setColor(initialData.color);
    }
  }, [initialData]);

  useEffect(() => {
    if (!isEdit) {
      setColor(STRUCTURE_COLORS[structureType]);
      setName(structureType.charAt(0).toUpperCase() + structureType.slice(1));
    }
  }, [structureType, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ structureType, name, width, height, levels, partitions, color });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">
          {isEdit ? "Edit Structure" : "Create Structure"}
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
          Structure Type
        </label>
        <select
          value={structureType}
          onChange={(e) => setStructureType(e.target.value as StructureType)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm capitalize text-foreground outline-none focus:ring-2 focus:ring-ring"
          disabled={isEdit}
        >
          {STRUCTURE_TYPES.map((t) => (
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

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">W</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={80}
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
            min={60}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Levels
          </label>
          <input
            type="number"
            value={levels}
            onChange={(e) => setLevels(Math.max(1, Number(e.target.value)))}
            min={1}
            max={10}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Partitions
          </label>
          <input
            type="number"
            value={partitions}
            onChange={(e) => setPartitions(Math.max(1, Number(e.target.value)))}
            min={1}
            max={12}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

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
        {isEdit ? "Update Structure" : "Create Structure"}
      </button>
    </form>
  );
}
