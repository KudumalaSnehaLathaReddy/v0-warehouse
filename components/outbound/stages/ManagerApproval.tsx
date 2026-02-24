'use client';

import { useState, useEffect } from 'react';
import { Check, X, FileText, Copy } from 'lucide-react';
import { OutboundRequest, PickingList, PickingLineItem } from '@/types/outbound';
import { StatusBadge } from '@/components/inbound/shared/StatusBadge';
import { DataTable } from '@/components/inbound/shared/DataTable';
import { ActionButton } from '@/components/inbound/shared/ActionButton';

interface ManagerApprovalProps {
  request: OutboundRequest;
  onApprove: (pickingList: PickingList) => void;
  onReject: () => void;
}

export function ManagerApproval({ request, onApprove, onReject }: ManagerApprovalProps) {
  const [pickingList, setPickingList] = useState<PickingList | null>(null);
  const [drnCopied, setDrnCopied] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState('');

  // Auto-generate picking list and dispatch reference number
  useEffect(() => {
    const dispatchRefNumber = `DRN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    const pickingListId = `PL-${Date.now()}`;

    const lineItems: PickingLineItem[] = request.items.map((item) => ({
      lineItemId: `LI-${item.itemId}`,
      sku: item.sku,
      productName: item.productName,
      requestedQty: item.quantity,
      pickedQty: 0,
      status: 'pending' as const,
      batchNumber: item.batchNumber,
      discrepancies: [],
    }));

    const newPickingList: PickingList = {
      pickingListId,
      dispatchRefNumber,
      requestId: request.requestId,
      createdDate: new Date().toISOString(),
      suggestedStrategy: 'fifo',
      items: lineItems,
      totalLines: lineItems.length,
    };

    setPickingList(newPickingList);
  }, [request]);

  const handleCopyDRN = () => {
    if (pickingList) {
      navigator.clipboard.writeText(pickingList.dispatchRefNumber);
      setDrnCopied(true);
      setTimeout(() => setDrnCopied(false), 2000);
    }
  };

  const handleApprove = () => {
    if (pickingList) {
      onApprove(pickingList);
    }
  };

  if (!pickingList) {
    return <div className="text-center py-8">Generating picking list...</div>;
  }

  const columns = [
    { id: 'sku' as const, label: 'SKU', width: '15%' },
    { id: 'productName' as const, label: 'Product Name', width: '30%' },
    { id: 'requestedQty' as const, label: 'Requested Qty', width: '15%' },
    { id: 'pickedQty' as const, label: 'Picked Qty', width: '15%' },
    {
      id: 'status' as const,
      label: 'Status',
      width: '15%',
      render: (value: any) => (
        <StatusBadge
          status={value === 'pending' ? 'pending' : 'completed'}
          label={value === 'pending' ? 'Pending' : 'Completed'}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Manager Approval</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve the outbound request. System has auto-generated a picking list.
        </p>
      </div>

      {/* Request Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Order Number</p>
          <p className="text-lg font-semibold text-foreground">{request.orderNumber}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Customer</p>
          <p className="text-lg font-semibold text-foreground">{request.customerName}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <StatusBadge status="pending" label="Pending Approval" />
        </div>
      </div>

      {/* Auto-Generated References */}
      <div className="bg-accent/10 rounded-lg p-6 border border-accent/20 space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Auto-Generated Documents
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Dispatch Reference Number</p>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xl font-bold text-accent">{pickingList.dispatchRefNumber}</p>
              <button
                onClick={handleCopyDRN}
                className="p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            {drnCopied && <p className="text-xs text-status-success mt-2">Copied!</p>}
          </div>

          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-xs text-muted-foreground mb-1">Picking List ID</p>
            <p className="text-xl font-bold text-foreground mt-2">
              {pickingList.pickingListId}
            </p>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-2">Suggested Rotation Strategy</p>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium">
              {pickingList.suggestedStrategy.toUpperCase()}
            </span>
            <p className="text-sm text-muted-foreground">
              {pickingList.suggestedStrategy === 'fifo'
                ? 'First In, First Out - Oldest items picked first'
                : pickingList.suggestedStrategy === 'fefo'
                  ? 'First Expire, First Out - Items with nearest expiry first'
                  : 'Last In, First Out - Newest items picked first'}
            </p>
          </div>
        </div>
      </div>

      {/* Picking List Items */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Picking List Items</h3>
        <div className="overflow-x-auto">
          <DataTable
            data={pickingList.items}
            columns={columns}
            keyExtractor={(row, index) => `${row.sku}-${index}`}
            searchableFields={['sku', 'productName']}
          />
        </div>
      </div>

      {/* Approval Notes */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <label className="block text-sm font-semibold text-foreground">
          Manager Review Notes (Optional)
        </label>
        <textarea
          value={approvalNotes}
          onChange={(e) => setApprovalNotes(e.target.value)}
          placeholder="Add any comments or notes for the operations team"
          rows={4}
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          onClick={onReject}
          label="Reject Request"
          variant="secondary"
          icon={X}
        />
        <ActionButton
          onClick={handleApprove}
          label="Approve & Generate Picking List"
          variant="primary"
          icon={Check}
        />
      </div>
    </div>
  );
}
