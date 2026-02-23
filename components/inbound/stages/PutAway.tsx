'use client';

import React, { useState } from 'react';
import { InventoryItem, PutAwayItem } from '@/types/inbound';
import { ActionButton } from '../shared/ActionButton';
import { StatusBadge } from '../shared/StatusBadge';
import { Check, CheckCircle, Loader2 } from 'lucide-react';

interface PutAwayProps {
  items: InventoryItem[];
  assignedLocation: string;
  rotationStrategy: string;
  onComplete: () => void;
  loading?: boolean;
}

const generateBinLocations = (itemCount: number, location: string): string[] => {
  return Array.from({ length: itemCount }, (_, i) => {
    const shelf = String.fromCharCode(65 + (i % 4)); // A, B, C, D
    const row = Math.floor(i / 4) + 1;
    return `${location}-${shelf}${row}`;
  });
};

export const PutAway: React.FC<PutAwayProps> = ({
  items,
  assignedLocation,
  rotationStrategy,
  onComplete,
  loading = false,
}) => {
  const putAwayItems: PutAwayItem[] = items.map((item, index) => ({
    itemId: item.itemId,
    description: item.description,
    quantity: item.receivedQuantity || 0,
    assignedBinLocation: generateBinLocations(items.length, assignedLocation)[index],
    confirmationStatus: 'pending',
  }));

  const [confirmedItems, setConfirmedItems] = useState<Set<string>>(new Set());
  const [completionTime, setCompletionTime] = useState<string | null>(null);

  const handleConfirmItem = (itemId: string) => {
    const newConfirmed = new Set(confirmedItems);
    if (newConfirmed.has(itemId)) {
      newConfirmed.delete(itemId);
    } else {
      newConfirmed.add(itemId);
    }
    setConfirmedItems(newConfirmed);
  };

  const handleConfirmAll = () => {
    const allItemIds = new Set(putAwayItems.map((item) => item.itemId));
    setConfirmedItems(allItemIds);
  };

  const handleComplete = () => {
    setCompletionTime(new Date().toLocaleString());
    setTimeout(() => {
      onComplete();
    }, 1500);
  };

  const allConfirmed = confirmedItems.size === putAwayItems.length;
  const completionPercent = (confirmedItems.size / putAwayItems.length) * 100;

  if (completionTime) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Completion Screen */}
        <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
          <div className="w-20 h-20 rounded-full bg-status-success/20 flex items-center justify-center animate-pulse">
            <CheckCircle className="w-10 h-10 text-status-success" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Put-Away Complete</h2>
            <p className="text-muted-foreground">All items have been successfully placed in their designated bins</p>
          </div>

          <div className="w-full max-w-md space-y-4 p-6 bg-card rounded-lg border border-border">
            <div className="text-center space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase">Completion Time</p>
              <p className="text-lg font-mono text-foreground">{completionTime}</p>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Items</p>
                <p className="text-lg font-bold text-foreground">{putAwayItems.length}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-lg font-bold text-foreground font-mono truncate">{assignedLocation}</p>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Strategy</p>
                <p className="text-lg font-bold text-foreground">{rotationStrategy}</p>
              </div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground pt-4">Workflow will finalize...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Put-Away Confirmation</h2>
        <p className="text-muted-foreground">
          Confirm final bin placement for each item in the warehouse
        </p>
      </div>

      {/* Assignment Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Assigned Location</p>
          <p className="text-lg font-mono font-bold text-foreground mt-2">{assignedLocation}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Rotation Strategy</p>
          <p className="text-lg font-bold text-foreground mt-2">{rotationStrategy}</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Total Items</p>
          <p className="text-lg font-bold text-foreground mt-2">{putAwayItems.length}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Confirmation Progress</p>
          <span className="text-sm font-medium text-accent">
            {confirmedItems.size} / {putAwayItems.length} confirmed
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-300"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Items Confirmation Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground/80">
                  <input
                    type="checkbox"
                    checked={allConfirmed}
                    onChange={allConfirmed ? () => setConfirmedItems(new Set()) : handleConfirmAll}
                    className="w-4 h-4 rounded accent-accent"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/80">Item Description</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/80">Quantity</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground/80">Bin Location</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/80">Status</th>
              </tr>
            </thead>
            <tbody>
              {putAwayItems.map((item) => {
                const isConfirmed = confirmedItems.has(item.itemId);
                return (
                  <tr
                    key={item.itemId}
                    className={`border-b border-border transition-colors ${isConfirmed ? 'bg-status-success/5' : 'hover:bg-muted/50'}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={isConfirmed}
                        onChange={() => handleConfirmItem(item.itemId)}
                        className="w-4 h-4 rounded accent-accent"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">ID: {item.itemId}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-foreground font-medium">{item.quantity}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground font-mono text-sm">{item.assignedBinLocation}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isConfirmed ? (
                        <StatusBadge status="completed" size="sm" />
                      ) : (
                        <StatusBadge status="pending" size="sm" />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-status-success/10 border border-status-success/30 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-status-success">Put-Away Summary</p>
        <div className="text-sm text-foreground space-y-1">
          <p>
            <span className="font-medium">Total Units to Store:</span>{' '}
            {putAwayItems.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
          <p>
            <span className="font-medium">Assigned Bins:</span> {putAwayItems.length}
          </p>
          <p>
            <span className="font-medium">Items Confirmed:</span> {confirmedItems.size}/{putAwayItems.length}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4">
        {!allConfirmed ? (
          <>
            <ActionButton
              variant="outline"
              onClick={handleConfirmAll}
              fullWidth
            >
              Confirm All Items
            </ActionButton>
            <ActionButton
              variant="primary"
              disabled={true}
              fullWidth
            >
              Select all to proceed
            </ActionButton>
          </>
        ) : (
          <ActionButton
            onClick={handleComplete}
            variant="primary"
            loading={loading}
            icon={Check}
            iconPosition="right"
            fullWidth
          >
            Complete Put-Away & Finalize
          </ActionButton>
        )}
      </div>
    </div>
  );
};
