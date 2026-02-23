'use client';

import React, { useState } from 'react';
import { InventoryItem } from '@/types/inbound';
import { StatusBadge } from './StatusBadge';
import { ActionButton } from './ActionButton';
import { AlertCircle, Edit2, Search } from 'lucide-react';

interface InventoryTableProps {
  items: InventoryItem[];
  onMarkDiscrepancy?: (item: InventoryItem) => void;
  editable?: boolean;
  title?: string;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onMarkDiscrepancy,
  editable = false,
  title = 'Inventory Items',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'status' | 'description' | 'quantity'>('status');

  const filteredItems = items.filter((item) =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.itemId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'status') {
      const statusOrder = { ok: 0, pending: 1, damaged: 2, missing: 3 };
      return (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
    }
    if (sortBy === 'description') {
      return a.description.localeCompare(b.description);
    }
    if (sortBy === 'quantity') {
      return (a.receivedQuantity || 0) - (b.receivedQuantity || 0);
    }
    return 0;
  });

  const hasIssues = items.some((item) => item.status !== 'ok' && item.status !== 'pending-inspection');
  const issuedCount = items.filter((item) => item.status !== 'ok').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items.length} items • {hasIssues && <span className="text-status-warning">⚠ {issuedCount} issues</span>}
          </p>
        </div>

        <div className="relative md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 flex-wrap">
        {['status', 'description', 'quantity'].map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort as typeof sortBy)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              sortBy === sort
                ? 'bg-accent text-accent-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            {sort.charAt(0).toUpperCase() + sort.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-foreground/80">Item ID / Description</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/80 min-w-20">Expected</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/80 min-w-20">Received</th>
                <th className="px-4 py-3 text-center font-semibold text-foreground/80 min-w-24">Status</th>
                {editable && onMarkDiscrepancy && (
                  <th className="px-4 py-3 text-center font-semibold text-foreground/80 min-w-20">Action</th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedItems.length === 0 ? (
                <tr>
                  <td colSpan={editable && onMarkDiscrepancy ? 5 : 4} className="px-4 py-8 text-center text-muted-foreground">
                    No items found
                  </td>
                </tr>
              ) : (
                sortedItems.map((item) => (
                  <tr
                    key={item.itemId}
                    className={`border-b border-border transition-colors hover:bg-muted/50 ${
                      item.status !== 'ok' && item.status !== 'pending-inspection' ? 'bg-status-error/5' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">ID: {item.itemId}</p>
                        {item.sku && <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-foreground font-medium">{item.expectedQuantity}</span>
                      <p className="text-xs text-muted-foreground">{item.unitOfMeasure || 'units'}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-foreground font-medium">{item.receivedQuantity || '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                    {editable && onMarkDiscrepancy && (
                      <td className="px-4 py-3 text-center">
                        {item.status !== 'ok' ? (
                          <div className="flex items-center justify-center gap-1 text-status-warning text-xs font-medium">
                            <AlertCircle className="w-4 h-4" />
                            Reported
                          </div>
                        ) : (
                          <ActionButton
                            size="sm"
                            variant="outline"
                            icon={Edit2}
                            onClick={() => onMarkDiscrepancy(item)}
                          >
                            Report
                          </ActionButton>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Total Items</p>
          <p className="text-lg font-bold text-foreground mt-1">{items.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground font-medium">OK</p>
          <p className="text-lg font-bold text-status-success mt-1">
            {items.filter((i) => i.status === 'ok').length}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Damaged</p>
          <p className="text-lg font-bold text-status-error mt-1">
            {items.filter((i) => i.status === 'damaged').length}
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground font-medium">Missing</p>
          <p className="text-lg font-bold text-status-warning mt-1">
            {items.filter((i) => i.status === 'missing').length}
          </p>
        </div>
      </div>
    </div>
  );
};

// Add UOM property to InventoryItem interface locally if needed
declare module '@/types/inbound' {
  interface InventoryItem {
    unitOfMeasure?: string;
  }
}
