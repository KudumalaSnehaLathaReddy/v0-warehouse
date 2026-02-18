"use client";

import { useState, useEffect } from "react";
import { STRUCTURE_COLORS, type StructureData, type StructureType } from "../types";

interface StructureFormProps {
  initialData?: StructureData | null;
  onSubmit: (data: {
    structureType: StructureType;
    name: string;
    code: string;
    width: number;
    height: number;
    levelConfigs: Array<{ name: string; code: string; height: number; partitionCount: number }>;
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
  const [code, setCode] = useState(initialData?.code || "");
  const [width, setWidth] = useState(initialData?.width || 200);
  const [height, setHeight] = useState(initialData?.height || 150);
  const [levelConfigs, setLevelConfigs] = useState<Array<{ name: string; code: string; height: number; partitionCount: number }>>(
    initialData?.levels.map((l) => ({
      name: l.name,
      code: l.code,
      height: l.height,
      partitionCount: l.partitions.length,
    })) || [{ name: "Level 1", code: "L1", height: 50, partitionCount: 3 }]
  );
  const [color, setColor] = useState(
    initialData?.color || STRUCTURE_COLORS["section"]
  );

  useEffect(() => {
    if (initialData) {
      setStructureType(initialData.structureType);
      setName(initialData.label);
      setCode(initialData.code);
      setWidth(initialData.width);
      setHeight(initialData.height);
      setLevelConfigs(
        initialData.levels.map((l) => ({
          name: l.name,
          code: l.code,
          height: l.height,
          partitionCount: l.partitions.length,
        }))
      );
      setColor(initialData.color);
    }
  }, [initialData]);

  useEffect(() => {
    if (!isEdit) {
      setColor(STRUCTURE_COLORS[structureType]);
      setName(structureType.charAt(0).toUpperCase() + structureType.slice(1));
      if (!code) {
        setCode(`STR-${structureType.slice(0, 3).toUpperCase()}`);
      }
    }
  }, [structureType, isEdit, code]);

  const handleAddLevel = () => {
    setLevelConfigs([
      ...levelConfigs,
      {
        name: `Level ${levelConfigs.length + 1}`,
        code: `L${levelConfigs.length + 1}`,
        height: 50,
        partitionCount: 3,
      },
    ]);
  };

  const handleRemoveLevel = (index: number) => {
    if (levelConfigs.length > 1) {
      setLevelConfigs(levelConfigs.filter((_, i) => i !== index));
    }
  };

  const handleUpdateLevel = (index: number, field: string, value: unknown) => {
    const updated = [...levelConfigs];
    updated[index] = { ...updated[index], [field]: value };
    setLevelConfigs(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ structureType, name, code, width, height, levelConfigs, color });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-h-96 overflow-y-auto">
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

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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

      {/* Levels Configuration */}
      <div className="flex flex-col gap-2 border-t pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-muted-foreground">Levels</label>
          <button
            type="button"
            onClick={handleAddLevel}
            className="rounded px-2 py-1 text-[10px] bg-primary/20 text-primary hover:bg-primary/30 font-medium"
          >
            + Add Level
          </button>
        </div>
        {levelConfigs.map((level, idx) => (
          <div key={idx} className="flex flex-col gap-1.5 p-2 rounded border border-dashed border-border/50 bg-muted/20">
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Level name"
                value={level.name}
                onChange={(e) => handleUpdateLevel(idx, "name", e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                type="text"
                placeholder="Code"
                value={level.code}
                onChange={(e) => handleUpdateLevel(idx, "code", e.target.value)}
                className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Height</label>
                <input
                  type="number"
                  value={level.height}
                  onChange={(e) => handleUpdateLevel(idx, "height", Math.max(20, Number(e.target.value)))}
                  min={20}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-muted-foreground">Partitions</label>
                <input
                  type="number"
                  value={level.partitionCount}
                  onChange={(e) => handleUpdateLevel(idx, "partitionCount", Math.max(1, Number(e.target.value)))}
                  min={1}
                  max={12}
                  className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            {levelConfigs.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveLevel(idx)}
                className="rounded px-2 py-1 text-[10px] bg-destructive/10 text-destructive hover:bg-destructive/20 font-medium"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 border-t pt-2">
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
