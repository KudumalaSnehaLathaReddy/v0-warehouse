'use client';

import React, { useState, useEffect } from 'react';
import { RequestData, GRNData } from '@/types/inbound';
import { StatusBadge } from '../shared/StatusBadge';
import { ActionButton } from '../shared/ActionButton';
import { ArrowRight, FileCheck, X } from 'lucide-react';

interface ManagerApprovalProps {
  requestData: RequestData;
  onApprove: (grnData: GRNData) => void;
  onReject: (reason: string) => void;
  loading?: boolean;
}

const generateGRNNumber = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(2, 10).replace(/-/g, '');
  const seq = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `GRN-${dateStr}-${seq}`;
};

export const ManagerApproval: React.FC<ManagerApprovalProps> = ({
  requestData,
  onApprove,
  onReject,
  loading = false,
}) => {
  const [grnData, setGrnData] = useState<GRNData | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionErrors, setRejectionErrors] = useState<string>('');

  // Generate GRN on mount
  useEffect(() => {
    const grn = generateGRNNumber();
    setGrnData({
      grnNumber: grn,
      requestId: requestData.requestId,
      consolidatedDetails: {
        supplierId: requestData.supplierId,
        supplierName: requestData.supplierName,
        purchaseOrderNumber: requestData.purchaseOrderNumber,
        expectedQuantity: requestData.expectedQuantity,
        unitOfMeasure: requestData.unitOfMeasure,
      },
      generatedAt: new Date().toISOString(),
    });
  }, [requestData]);

  const handleApprove = () => {
    if (!grnData) return;

    const approvedGRN: GRNData = {
      ...grnData,
      approvedAt: new Date().toISOString(),
      approvedBy: 'Current Manager', // In a real app, this would be the logged-in user
    };

    onApprove(approvedGRN);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      setRejectionErrors('Please provide a rejection reason');
      return;
    }

    onReject(rejectionReason);
  };

  if (isRejecting) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Reject Request</h2>
          <p className="text-muted-foreground">
            Please provide a reason for rejecting this inbound request
          </p>
        </div>

        {/* Rejection Form */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="p-4 bg-status-error/10 border border-status-error/30 rounded-lg">
            <p className="text-sm font-medium text-status-error">Request will be rejected</p>
            <p className="text-sm text-foreground mt-1">Request ID: {requestData.requestId}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rejection Reason <span className="text-status-error">*</span>
            </label>
            <textarea
              placeholder="Explain why this request is being rejected..."
              value={rejectionReason}
              onChange={(e) => {
                setRejectionReason(e.target.value);
                setRejectionErrors('');
              }}
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-foreground bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            {rejectionErrors && <p className="text-xs text-status-error mt-1">{rejectionErrors}</p>}
          </div>

          <div className="flex gap-3">
            <ActionButton
              variant="outline"
              onClick={() => setIsRejecting(false)}
              fullWidth
            >
              Cancel
            </ActionButton>
            <ActionButton
              variant="destructive"
              onClick={handleRejectSubmit}
              loading={loading}
              fullWidth
            >
              Confirm Rejection
            </ActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Manager Approval</h2>
        <p className="text-muted-foreground">
          Review the inbound request and make an approval decision
        </p>
      </div>

      {/* Request Details */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Request Details</h3>
          <StatusBadge status="in-progress" size="sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Request ID</p>
            <p className="text-sm font-mono text-foreground mt-1">{requestData.requestId}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Supplier</p>
            <p className="text-sm text-foreground mt-1">{requestData.supplierName}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">PO Number</p>
            <p className="text-sm font-mono text-foreground mt-1">{requestData.purchaseOrderNumber}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Expected Arrival</p>
            <p className="text-sm text-foreground mt-1">
              {new Date(requestData.arrivalDateTime).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">Expected Quantity</p>
            <p className="text-sm text-foreground mt-1">
              {requestData.expectedQuantity} {requestData.unitOfMeasure}
            </p>
          </div>

          {requestData.specialInstructions && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase">Special Instructions</p>
              <p className="text-sm text-foreground mt-1">{requestData.specialInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Auto-Generated GRN */}
      {grnData && (
        <div className="bg-status-success/10 border border-status-success/30 rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-status-success" />
            <h3 className="font-semibold text-foreground">Generated GRN (Goods Received Note)</h3>
          </div>

          <div className="bg-card rounded-lg border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase">GRN Number</span>
              <span className="text-lg font-bold text-foreground font-mono">{grnData.grnNumber}</span>
            </div>

            <div className="h-px bg-border" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Request ID</p>
                <p className="text-foreground font-mono mt-0.5">{grnData.requestId}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium">Supplier</p>
                <p className="text-foreground mt-0.5">{grnData.consolidatedDetails.supplierName}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium">PO Number</p>
                <p className="text-foreground font-mono mt-0.5">{grnData.consolidatedDetails.purchaseOrderNumber}</p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground font-medium">Expected Qty</p>
                <p className="text-foreground mt-0.5">
                  {grnData.consolidatedDetails.expectedQuantity} {grnData.consolidatedDetails.unitOfMeasure}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-muted-foreground font-medium">Generated</p>
                <p className="text-foreground font-mono text-xs mt-0.5">
                  {new Date(grnData.generatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            This GRN consolidates all request details and will be attached to the inbound shipment record.
          </p>
        </div>
      )}

      {/* Approval Decision */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Your Decision</p>
        <div className="flex flex-col gap-3 md:flex-row">
          <ActionButton
            variant="primary"
            onClick={handleApprove}
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            fullWidth
          >
            Approve & Continue
          </ActionButton>

          <ActionButton
            variant="destructive"
            onClick={() => setIsRejecting(true)}
            disabled={loading}
            icon={X}
            fullWidth
          >
            Reject Request
          </ActionButton>
        </div>
      </div>
    </div>
  );
};
