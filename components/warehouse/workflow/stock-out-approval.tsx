'use client';

import React, { useState } from 'react';
import { useWorkflow } from '@/context/workflow-context';
import { StockOutRequest } from '@/components/warehouse/types';

export const StockOutApproval: React.FC = () => {
  const {
    stockOutRequests,
    approveStockOutRequest,
    rejectStockOutRequest,
    selectStockOutRequest,
    selectedStockOutRequest,
  } = useWorkflow();

  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approverName, setApproverName] = useState('Manager');

  const pendingRequests = stockOutRequests.filter((r) => r.status === 'pending');
  const processedRequests = stockOutRequests.filter((r) => r.status !== 'pending');

  const handleApprove = (requestId: string) => {
    approveStockOutRequest(requestId, approverName);
    // Keep the request selected so user can proceed to removal interface
  };

  const handleReject = (requestId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    rejectStockOutRequest(requestId, rejectionReason);
    setRejectionReason('');
    setShowRejectForm(false);
    selectStockOutRequest(null);
  };

  const handleSelectRequest = (request: StockOutRequest) => {
    selectStockOutRequest(request.id);
  };

  const getReasonLabel = (reason: string) => {
    const reasons: Record<string, string> = {
      sale: 'Sale',
      return: 'Return',
      damage: 'Damage',
      relocation: 'Relocation',
    };
    return reasons[reason] || reason;
  };

  return (
    <div className="w-full space-y-6">
      {/* Pending Requests */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pending stock out requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleSelectRequest(request)}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedStockOutRequest?.id === request.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{request.productName}</p>
                    <p className="text-sm text-gray-600">SKU: {request.productSKU}</p>
                    <p className="text-sm text-gray-600">Quantity: {request.quantity} units</p>
                    <p className="text-sm text-gray-600">Destination: {request.destination}</p>
                    <p className="text-sm text-gray-600">Reason: {getReasonLabel(request.reason)}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded">
                      Pending
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approval Success Message */}
      {selectedStockOutRequest && selectedStockOutRequest.status === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✓ Request Approved</h3>
          <p className="text-green-700">
            Scroll down to the <strong>Stock Out Removal</strong> section to select the storage locations where you want to remove inventory from.
          </p>
        </div>
      )}

      {/* Approval Details */}
      {selectedStockOutRequest && selectedStockOutRequest.status === 'pending' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Details</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Product Name</p>
              <p className="font-semibold text-gray-900">{selectedStockOutRequest.productName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Product SKU</p>
              <p className="font-semibold text-gray-900">{selectedStockOutRequest.productSKU}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-semibold text-gray-900">{selectedStockOutRequest.quantity} units</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Reason</p>
              <p className="font-semibold text-gray-900">{getReasonLabel(selectedStockOutRequest.reason)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Destination</p>
              <p className="font-semibold text-gray-900">{selectedStockOutRequest.destination}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Approver Name</label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => handleApprove(selectedStockOutRequest.id)}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
            >
              Approve & Proceed to Slotting
            </button>

            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>

          {showRejectForm && (
            <div className="mt-4 p-4 bg-red-100 border border-red-300 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this request is being rejected"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleReject(selectedStockOutRequest.id)}
                  className="px-3 py-1 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="px-3 py-1 bg-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Processed Requests</h3>

          <div className="space-y-3">
            {processedRequests.map((request) => (
              <div key={request.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900">{request.productName}</p>
                    <p className="text-sm text-gray-600">SKU: {request.productSKU}</p>
                    <p className="text-sm text-gray-600">Qty: {request.quantity} | Destination: {request.destination}</p>
                  </div>
                  <div className="text-right">
                    {request.status === 'approved' && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                        Approved
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <>
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded mb-2">
                          Rejected
                        </span>
                        {request.rejectionReason && (
                          <p className="text-sm text-red-600">{request.rejectionReason}</p>
                        )}
                      </>
                    )}
                    {request.status === 'completed' && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
