'use client';

import { useState } from 'react';
import { Check, AlertTriangle, Search } from 'lucide-react';
import { PickingList, PickingLineItem, PickingDiscrepancy } from '@/types/outbound';
import { StatusBadge } from '@/components/inbound/shared/StatusBadge';
import { ActionButton } from '@/components/inbound/shared/ActionButton';
import { DataTable } from '@/components/inbound/shared/DataTable';

interface PickingPackingProps {
  pickingList: PickingList;
  onPickingComplete: () => void;
}

export function PickingPacking({ pickingList, onPickingComplete }: PickingPackingProps) {
  const [items, setItems] = useState<PickingLineItem[]>(pickingList.items);
  const [searchTerm, setSearchTerm] = useState('');
  const [discrepancyModals, setDiscrepancyModals] = useState<Record<string, boolean>>({});
  const [discrepancyForms, setDiscrepancyForms] = useState<
    Record<string, { type: string; severity: string; description: string }>
  >({});

  const filteredItems = items.filter(
    (item) =>
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePickedQtyChange = (lineItemId: string, qty: number) => {
    setItems(
      items.map((item) =>
        item.lineItemId === lineItemId
          ? {
              ...item,
              pickedQty: qty,
              status: qty === item.requestedQty ? 'verified' : 'picked',
            }
          : item
      )
    );
  };

  const handleBatchNumberChange = (lineItemId: string, batch: string) => {
    setItems(
      items.map((item) =>
        item.lineItemId === lineItemId ? { ...item, batchNumber: batch } : item
      )
    );
  };

  const openDiscrepancyModal = (lineItemId: string) => {
    setDiscrepancyModals({ ...discrepancyModals, [lineItemId]: true });
    if (!discrepancyForms[lineItemId]) {
      setDiscrepancyForms({
        ...discrepancyForms,
        [lineItemId]: { type: 'quantity-mismatch', severity: 'medium', description: '' },
      });
    }
  };

  const closeDiscrepancyModal = (lineItemId: string) => {
    setDiscrepancyModals({ ...discrepancyModals, [lineItemId]: false });
  };

  const handleReportDiscrepancy = (lineItemId: string) => {
    const form = discrepancyForms[lineItemId];
    if (!form || !form.description.trim()) {
      return;
    }

    const newDiscrepancy: PickingDiscrepancy = {
      discrepancyId: `DISC-${Date.now()}`,
      type: form.type as any,
      severity: form.severity as any,
      description: form.description,
      reportedDate: new Date().toISOString(),
    };

    setItems(
      items.map((item) =>
        item.lineItemId === lineItemId
          ? {
              ...item,
              discrepancies: [...item.discrepancies, newDiscrepancy],
              status: 'discrepancy',
            }
          : item
      )
    );

    closeDiscrepancyModal(lineItemId);
    setDiscrepancyForms({
      ...discrepancyForms,
      [lineItemId]: { type: 'quantity-mismatch', severity: 'medium', description: '' },
    });
  };

  const allPickingComplete = items.every(
    (item) => item.pickedQty === item.requestedQty && item.status !== 'discrepancy'
  );

  const completionPercentage = Math.round(
    (items.filter((item) => item.pickedQty > 0).length / items.length) * 100
  );

  const columns = [
    { key: 'sku', label: 'SKU', width: '12%' },
    { key: 'productName', label: 'Product Name', width: '25%' },
    { key: 'requestedQty', label: 'Requested', width: '10%' },
    {
      key: 'pickedQty',
      label: 'Picked Qty',
      width: '15%',
      render: (value: any, item: any) => (
        <input
          type="number"
          value={item.pickedQty}
          onChange={(e) =>
            handlePickedQtyChange(item.lineItemId, parseInt(e.target.value) || 0)
          }
          className="w-full px-2 py-1 rounded border border-border text-center"
        />
      ),
    },
    {
      key: 'batchNumber',
      label: 'Batch #',
      width: '15%',
      render: (value: any, item: any) => (
        <input
          type="text"
          value={item.batchNumber || ''}
          onChange={(e) => handleBatchNumberChange(item.lineItemId, e.target.value)}
          placeholder="Scan batch"
          className="w-full px-2 py-1 rounded border border-border text-sm"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      width: '10%',
      render: (value: any, item: any) => (
        <StatusBadge
          status={
            value === 'verified'
              ? 'completed'
              : value === 'discrepancy'
                ? 'error'
                : 'pending'
          }
          label={
            value === 'verified'
              ? 'Complete'
              : value === 'discrepancy'
                ? 'Discrepancy'
                : 'Picking'
          }
        />
      ),
    },
    {
      key: 'discrepancy',
      label: 'Actions',
      width: '13%',
      render: (value: any, item: any) => (
        <button
          onClick={() => openDiscrepancyModal(item.lineItemId)}
          className="px-3 py-1 rounded bg-accent/20 text-accent hover:bg-accent/30 text-sm font-medium transition-colors"
        >
          Report Issue
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Picking & Packing</h2>
        <p className="text-sm text-muted-foreground mt-1">
          DRN: <span className="font-semibold">{pickingList.dispatchRefNumber}</span>
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Items</p>
          <p className="text-2xl font-bold text-foreground">{items.length}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Picked</p>
          <p className="text-2xl font-bold text-accent">
            {items.filter((item) => item.pickedQty > 0).length}
          </p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Completion</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-bold text-foreground">{completionPercentage}%</p>
          </div>
          <div className="h-1.5 bg-secondary rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-accent transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Discrepancies</p>
          <p className="text-2xl font-bold text-status-warning">
            {items.reduce((sum, item) => sum + item.discrepancies.length, 0)}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by SKU or product name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Items Table */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Picking List</h3>
        <div className="overflow-x-auto">
          <DataTable data={filteredItems} columns={columns} searchKey="sku" />
        </div>
      </div>

      {/* Discrepancy Modals */}
      {Object.entries(discrepancyModals).map(([lineItemId, isOpen]) =>
        isOpen ? (
          <div
            key={lineItemId}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-card rounded-lg p-6 border border-border max-w-md w-full space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Report Discrepancy</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Discrepancy Type
                </label>
                <select
                  value={discrepancyForms[lineItemId]?.type || 'quantity-mismatch'}
                  onChange={(e) =>
                    setDiscrepancyForms({
                      ...discrepancyForms,
                      [lineItemId]: {
                        ...discrepancyForms[lineItemId],
                        type: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                >
                  <option value="quantity-mismatch">Quantity Mismatch</option>
                  <option value="damaged">Damaged Items</option>
                  <option value="missing">Missing Items</option>
                  <option value="wrong-batch">Wrong Batch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Severity
                </label>
                <select
                  value={discrepancyForms[lineItemId]?.severity || 'medium'}
                  onChange={(e) =>
                    setDiscrepancyForms({
                      ...discrepancyForms,
                      [lineItemId]: {
                        ...discrepancyForms[lineItemId],
                        severity: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <textarea
                  value={discrepancyForms[lineItemId]?.description || ''}
                  onChange={(e) =>
                    setDiscrepancyForms({
                      ...discrepancyForms,
                      [lineItemId]: {
                        ...discrepancyForms[lineItemId],
                        description: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe the issue"
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => closeDiscrepancyModal(lineItemId)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReportDiscrepancy(lineItemId)}
                  className="px-4 py-2 rounded-lg bg-accent text-accent-foreground hover:bg-accent-secondary transition-colors"
                >
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        ) : null
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          onClick={onPickingComplete}
          label="Complete Picking & Proceed to Dock"
          variant="primary"
          icon={Check}
          disabled={!allPickingComplete}
        />
      </div>
    </div>
  );
}
