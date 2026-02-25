import { useState, useMemo } from "react";
import { Check, X } from "lucide-react";
import type { StockInRequest } from "../types";
import { generateGRN } from "../utils";

interface StockInApprovalProps {
  requests: StockInRequest[];
  selectedRequestId?: string;
  onSelectRequest: (id: string) => void;
  onApprove: (id: string, approverName: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function StockInApproval({
  requests,
  selectedRequestId,
  onSelectRequest,
  onApprove,
  onReject,
}: StockInApprovalProps) {
  const [approverName, setApproverName] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const pendingRequests = useMemo(
    () => requests.filter((r) => r.status === "pending"),
    [requests]
  );

  const processedRequests = useMemo(
    () => requests.filter((r) => r.status !== "pending"),
    [requests]
  );

  const selectedRequest = requests.find((r) => r.id === selectedRequestId);

  const handleApprove = () => {
    if (!selectedRequest || !approverName.trim()) {
      alert("Please enter approver name");
      return;
    }
    onApprove(selectedRequest.id, approverName);
    setApproverName("");
    setShowRejectForm(false);
  };

  const handleReject = () => {
    if (!selectedRequest || !rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }
    onReject(selectedRequest.id, rejectionReason);
    setRejectionReason("");
    setShowRejectForm(false);
  };

  return (
    <div className="space-y-4">
      {/* Pending Requests List */}
      <div className="rounded-lg border border-border bg-card p-4">
        <h3 className="text-sm font-semibold text-card-foreground mb-3">
          Pending Approvals {pendingRequests.length > 0 && `(${pendingRequests.length})`}
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-4 text-xs text-muted-foreground">
            No pending requests
          </div>
        ) : (
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => onSelectRequest(request.id)}
                className={`w-full text-left p-3 rounded-md border text-sm transition ${
                  selectedRequestId === request.id
                    ? "border-ring bg-accent"
                    : "border-border hover:border-ring/50 bg-background"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{request.productName}</p>
                    <p className="text-xs text-muted-foreground">SKU: {request.productSKU}</p>
                    <p className="text-xs text-muted-foreground">Qty: {request.productQuantity}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                    PENDING
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Approval Details */}
      {selectedRequest && selectedRequest.status === "pending" && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4">Approve Request</h3>

          <div className="space-y-3 mb-4">
            <div className="p-3 bg-white rounded border border-border">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Product</p>
                  <p className="font-medium text-foreground">{selectedRequest.productName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">SKU</p>
                  <p className="font-medium text-foreground">{selectedRequest.productSKU}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quantity</p>
                  <p className="font-medium text-foreground">{selectedRequest.productQuantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-medium text-foreground">{selectedRequest.receivedFrom}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Approver Name
              </label>
              <input
                type="text"
                value={approverName}
                onChange={(e) => setApproverName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleApprove}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-md hover:bg-green-700 transition"
            >
              <Check size={14} />
              Approve & Generate GRN
            </button>
            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              <X size={14} />
              Reject
            </button>
          </div>

          {showRejectForm && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                rows={2}
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleReject}
                  className="flex-1 px-3 py-1 text-sm font-medium bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 px-3 py-1 text-sm font-medium border border-input rounded hover:bg-accent transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Approved Status */}
      {selectedRequest && selectedRequest.status === "approved" && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <Check className="text-green-600 mt-1" size={18} />
            <div>
              <p className="text-sm font-semibold text-green-900">Request Approved</p>
              <p className="text-xs text-green-700 mt-1">
                GRN: <span className="font-mono">{selectedRequest.grnNumber}</span>
              </p>
              <p className="text-xs text-green-700 mt-2">
                Next: Assign storage location in the Visual Slotting section
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">
            History ({processedRequests.length})
          </h3>
          <div className="space-y-2">
            {processedRequests.map((request) => (
              <div
                key={request.id}
                className={`p-3 rounded-md border text-sm ${
                  request.status === "approved"
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{request.productName}</p>
                    <p className="text-xs text-muted-foreground">{request.productSKU}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      request.status === "approved"
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
