'use client';

import React, { useState } from 'react';
import { InventoryItem, Discrepancy } from '@/types/inbound';
import { InventoryTable } from '../shared/InventoryTable';
import { DiscrepancyForm, DiscrepancyFormData } from '../shared/DiscrepancyForm';
import { ActionButton } from '../shared/ActionButton';
import { StatusBadge } from '../shared/StatusBadge';
import { ArrowRight, AlertTriangle } from 'lucide-react';

interface UnloadingInspectionProps {
  expectedQuantity: number;
  unitOfMeasure: string;
  onSubmit: (items: InventoryItem[], discrepancies: Discrepancy[]) => void;
  loading?: boolean;
}

// Mock inventory items for unloading/inspection
const generateMockItems = (expectedQuantity: number): InventoryItem[] => {
  return [
    {
      itemId: 'SKU-001',
      description: 'Electronics Control Module',
      expectedQuantity: Math.floor(expectedQuantity * 0.4),
      receivedQuantity: Math.floor(expectedQuantity * 0.4),
      status: 'ok',
      sku: 'ECM-2024-A',
      batchNumber: 'BATCH-2024-001',
      unitOfMeasure: 'units',
    },
    {
      itemId: 'SKU-002',
      description: 'Pressure Sensor Assembly',
      expectedQuantity: Math.floor(expectedQuantity * 0.35),
      receivedQuantity: Math.floor(expectedQuantity * 0.35) - 2,
      status: 'damaged',
      sku: 'PSA-2024-B',
      unitOfMeasure: 'units',
    },
    {
      itemId: 'SKU-003',
      description: 'Connector Kit (50 pack)',
      expectedQuantity: Math.floor(expectedQuantity * 0.25),
      receivedQuantity: Math.floor(expectedQuantity * 0.25),
      status: 'ok',
      sku: 'CK-2024-C',
      batchNumber: 'BATCH-2024-002',
      unitOfMeasure: 'units',
    },
  ];
};

export const UnloadingInspection: React.FC<UnloadingInspectionProps> = ({
  expectedQuantity,
  unitOfMeasure,
  onSubmit,
  loading = false,
}) => {
  const [items, setItems] = useState<InventoryItem[]>(generateMockItems(expectedQuantity));
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([]);
  const [showDiscrepancyForm, setShowDiscrepancyForm] = useState(false);
  const [selectedItemForDiscrepancy, setSelectedItemForDiscrepancy] = useState<InventoryItem | null>(null);

  const totalExpected = items.reduce((sum, item) => sum + item.expectedQuantity, 0);
  const totalReceived = items.reduce((sum, item) => sum + (item.receivedQuantity || 0), 0);
  const hasIssues = items.some((item) => item.status !== 'ok');
  const inspectionComplete = items.every((item) => item.status !== 'pending-inspection');

  const handleMarkDiscrepancy = (item: InventoryItem) => {
    setSelectedItemForDiscrepancy(item);
    setShowDiscrepancyForm(true);
  };

  const handleDiscrepancySubmit = (data: DiscrepancyFormData) => {
    // Add discrepancy record
    const newDiscrepancy: Discrepancy = {
      discrepancyId: `DISC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      itemId: data.itemId,
      type: data.type,
      damageSeverity: data.damageSeverity,
      notes: data.notes,
      photoUrl: data.photoUrl,
      reportedAt: new Date().toISOString(),
    };

    setDiscrepancies((prev) => [...prev, newDiscrepancy]);

    // Update item status
    setItems((prev) =>
      prev.map((item) => {
        if (item.itemId === data.itemId) {
          return {
            ...item,
            status: data.type === 'damaged' ? 'damaged' : data.type === 'missing' ? 'missing' : 'pending-inspection',
          };
        }
        return item;
      })
    );

    setShowDiscrepancyForm(false);
    setSelectedItemForDiscrepancy(null);
  };

  const handleSubmit = () => {
    onSubmit(items, discrepancies);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Unloading & Inspection</h2>
        <p className="text-muted-foreground">
          Verify received items against purchase order and report any discrepancies
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Expected Total</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {totalExpected}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unitOfMeasure}</span>
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Received Total</p>
          <p className="text-3xl font-bold text-foreground mt-2">
            {totalReceived}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unitOfMeasure}</span>
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Variance</p>
          <p className={`text-3xl font-bold mt-2 ${totalExpected === totalReceived ? 'text-status-success' : 'text-status-error'}`}>
            {totalExpected - totalReceived > 0 ? '-' : '+'}
            {Math.abs(totalExpected - totalReceived)}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unitOfMeasure}</span>
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase">Status</p>
          <div className="mt-2">
            {hasIssues ? (
              <StatusBadge status="issues" size="md" />
            ) : (
              <StatusBadge status="ok" size="md" />
            )}
          </div>
        </div>
      </div>

      {/* Alert for Issues */}
      {hasIssues && (
        <div className="bg-status-warning/10 border border-status-warning/30 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-status-warning">Discrepancies Found</p>
            <p className="text-sm text-foreground mt-0.5">
              {discrepancies.length} items reported with issues. Please review before proceeding.
            </p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <InventoryTable
        items={items}
        onMarkDiscrepancy={handleMarkDiscrepancy}
        editable={true}
        title="Received Items"
      />

      {/* Discrepancy Report Section */}
      {discrepancies.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Discrepancy Report</h3>
            <StatusBadge status="issues" size="sm" />
          </div>

          <div className="space-y-3">
            {discrepancies.map((disc) => {
              const item = items.find((i) => i.itemId === disc.itemId);
              return (
                <div key={disc.discrepancyId} className="p-4 rounded-lg border border-border/50 bg-muted/30 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{item?.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">ID: {disc.itemId}</p>
                    </div>
                    <div className="text-right">
                      <div className="capitalize text-xs font-medium bg-status-warning/20 text-status-warning px-2 py-1 rounded-full">
                        {disc.type.replace('-', ' ')}
                      </div>
                    </div>
                  </div>

                  {disc.damageSeverity && (
                    <p className="text-sm">
                      <span className="font-medium text-foreground">Severity: </span>
                      <span className="capitalize text-muted-foreground">{disc.damageSeverity.replace('-', ' ')}</span>
                    </p>
                  )}

                  <p className="text-sm text-foreground">
                    <span className="font-medium">Notes: </span>
                    {disc.notes}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Reported at: {new Date(disc.reportedAt).toLocaleString()}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inspection Status */}
      <div className="bg-status-info/10 border border-status-info/30 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-status-info">Inspection Status</p>
        <div className="text-sm text-foreground space-y-1">
          <p>
            <span className="font-medium">Items Inspected:</span> {items.length}/{items.length}
          </p>
          <p>
            <span className="font-medium">Items OK:</span> {items.filter((i) => i.status === 'ok').length}
          </p>
          <p>
            <span className="font-medium">Items with Issues:</span> {items.filter((i) => i.status !== 'ok').length}
          </p>
          <p>
            <span className="font-medium">Discrepancy Records:</span> {discrepancies.length}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <ActionButton
          onClick={handleSubmit}
          variant="primary"
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
        >
          Inspection Complete - Proceed to Put-Away
        </ActionButton>
      </div>

      {/* Discrepancy Form Modal */}
      {showDiscrepancyForm && selectedItemForDiscrepancy && (
        <DiscrepancyForm
          itemId={selectedItemForDiscrepancy.itemId}
          itemDescription={selectedItemForDiscrepancy.description}
          onSubmit={handleDiscrepancySubmit}
          onCancel={() => {
            setShowDiscrepancyForm(false);
            setSelectedItemForDiscrepancy(null);
          }}
        />
      )}
    </div>
  );
};
