"use client";

import { useState, useEffect } from "react";
import type { Partition } from "../types";

interface PartitionFormProps {
  partition: Partition;
  onSubmit: (data: Partition) => void;
  onClose: () => void;
}

export function PartitionForm({
  partition,
  onSubmit,
  onClose,
}: PartitionFormProps) {
  const [name, setName] = useState(partition.name);
  const [code, setCode] = useState(partition.code);
  const [maxCapacity, setMaxCapacity] = useState(partition.max_capacity);
  const [usedCapacity, setUsedCapacity] = useState(partition.used_capacity);
  const [productName, setProductName] = useState(partition.product_name || "");
  const [productType, setProductType] = useState(partition.product_type || "");
  const [productValue, setProductValue] = useState(partition.product_value || 0);
  const [productUom, setProductUom] = useState(partition.product_uom || "");

  useEffect(() => {
    setName(partition.name);
    setCode(partition.code);
    setMaxCapacity(partition.max_capacity);
    setUsedCapacity(partition.used_capacity);
    setProductName(partition.product_name || "");
    setProductType(partition.product_type || "");
    setProductValue(partition.product_value || 0);
    setProductUom(partition.product_uom || "");
  }, [partition]);

  const fillPercentage = (usedCapacity / maxCapacity) * 100;
  
  const getCapacityColor = (percentage: number): string => {
    if (percentage < 40) return "#10b981"; // green
    if (percentage < 70) return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  const getCapacityStatus = (percentage: number): string => {
    if (percentage < 40) return "Low";
    if (percentage < 70) return "Medium";
    return "High";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: partition.id,
      name,
      code,
      width: partition.width,
      max_capacity: maxCapacity,
      used_capacity: Math.min(usedCapacity, maxCapacity),
      product_name: productName || undefined,
      product_type: productType || undefined,
      product_value: productValue || undefined,
      product_uom: productUom || undefined,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* Capacity Visualization */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground">Capacity</label>
          <span className="text-xs font-semibold" style={{ color: getCapacityColor(fillPercentage) }}>
            {getCapacityStatus(fillPercentage)}
          </span>
        </div>
        <div className="relative w-full h-12 rounded-md border border-input overflow-hidden bg-muted/20">
          {/* Fill background */}
          <div
            className="absolute inset-y-0 left-0 transition-all duration-300"
            style={{
              width: `${fillPercentage}%`,
              backgroundColor: getCapacityColor(fillPercentage),
              opacity: 0.6,
            }}
          />
          {/* Text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground relative z-10">
              {usedCapacity} / {maxCapacity}
            </span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center">
          {fillPercentage.toFixed(1)}% filled
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      {/* Capacity Fields */}
      <div className="grid grid-cols-2 gap-2 border-t pt-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Max Capacity</label>
          <input
            type="number"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(Math.max(1, Number(e.target.value)))}
            min={1}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Used Capacity</label>
          <input
            type="number"
            value={usedCapacity}
            onChange={(e) => setUsedCapacity(Math.max(0, Number(e.target.value)))}
            min={0}
            max={maxCapacity}
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>
      </div>

      {/* Product Info (Optional) */}
      <div className="flex flex-col gap-2 border-t pt-2">
        <div className="text-xs font-medium text-muted-foreground">Product Info (Optional)</div>
        
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Product Name</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Widget A"
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">Product Type</label>
            <input
              type="text"
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              placeholder="e.g., Electronic"
              className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-muted-foreground">UOM</label>
            <input
              type="text"
              value={productUom}
              onChange={(e) => setProductUom(e.target.value)}
              placeholder="e.g., Boxes"
              className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-muted-foreground">Product Value</label>
          <input
            type="number"
            value={productValue}
            onChange={(e) => setProductValue(Number(e.target.value))}
            placeholder="0"
            step="0.01"
            className="rounded-md border border-input bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 border-t pt-2">
        <button
          type="submit"
          className="flex-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Save Partition
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
