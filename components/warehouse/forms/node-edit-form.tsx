"use client";

import { useState, useEffect } from "react";
import type { Node } from "@xyflow/react";

interface NodeEditFormProps {
  node: Node;
  onUpdate: (id: string, data: Record<string, unknown>) => void;
  onClose: () => void;
}

export function NodeEditForm({ node, onUpdate, onClose }: NodeEditFormProps) {
  const [label, setLabel] = useState((node.data as Record<string, unknown>).label as string || "");
  const [color, setColor] = useState((node.data as Record<string, unknown>).color as string || "#CBD5E1");
  const [width, setWidth] = useState((node.data as Record<string, unknown>).width as number || 100);
  const [height, setHeight] = useState((node.data as Record<string, unknown>).height as number || 50);

  useEffect(() => {
    const d = node.data as Record<string, unknown>;
    setLabel((d.label as string) || "");
    setColor((d.color as string) || "#CBD5E1");
    setWidth((d.width as number) || 100);
    setHeight((d.height as number) || 50);
  }, [node]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(node.id, { label, color, width, height });
    onClose();
  };

  const nodeType = node.type || "unknown";
  const typeLabel =
    nodeType === "element"
      ? ((node.data as Record<string, unknown>).elementType as string || "Element")
      : nodeType === "zone"
        ? ((node.data as Record<string, unknown>).zoneType as string || "Zone")
        : nodeType;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold capitalize text-foreground">
          Edit {typeLabel}
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
          Label
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Width
          </label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            min={20}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Height
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            min={20}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
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
        Update
      </button>
    </form>
  );
}
