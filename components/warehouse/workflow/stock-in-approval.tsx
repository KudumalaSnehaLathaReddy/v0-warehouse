'use client';

import React, { useState } from 'react';
import { useWorkflow } from '@/context/workflow-context';
import { StockInRequest } from '@/components/warehouse/types';

export const StockInApproval: React.FC = () => {
  const { stockInRequests, approveStockInRequest, rejectStockInRequest, selectStockInRequest, selectedStockInRequest } =
    useWorkflow();
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [approverName, setApproverName] = useState('Manager');

  const pendingRequests = stockInRequests.filter((r) => r.status === 'pending');
  const processedRequests = stockInRequests.filter((r) => r.status !== 'pending');

  const handleApprove = (requestId: string) => {
    approveStockInRequest(requestId, approverName);
    // Keep the request selected so user can proceed to visual slotting
  };

  const handleReject = (requestId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    rejectStockInRequest(requestId, rejectionReason);
    setRejectionReason('');
    setShowRejectForm(false);
    selectStockInRequest(null);
  };

  const handleSelectRequest = (request: StockInRequest) => {
    selectStockInRequest(request.id);
  };

  return (
    <div className="w-full space-y-6">
      {/* Pending Requests */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Approvals</h2>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => handleSelectRequest(request)}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedStockInRequest?.id === request.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{request.productName}</p>
                    <p className="text-sm text-gray-600">SKU: {request.productSKU}</p>
                    <p className="text-sm text-gray-600">Quantity: {request.quantity} units</p>
                    <p className="text-sm text-gray-600">From: {request.receivedFrom}</p>
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
      {selectedStockInRequest && selectedStockInRequest.status === 'approved' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">✓ Request Approved</h3>
          <p className="text-green-700 mb-4">
            GRN <span className="font-mono font-semibold">{selectedStockInRequest.grn?.number}</span> has been generated.
          </p>
          <p className="text-green-700">
            Scroll down to the <strong>Visual Slotting</strong> section to assign storage locations using your preferred rotation strategy (FIFO, FEFO, or LIFO).
          </p>
        </div>
      )}

      {/* Approval Details */}
      {selectedStockInRequest && selectedStockInRequest.status === 'pending' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval Details</h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600">Product Name</p>
              <p className="font-semibold text-gray-900">{selectedStockInRequest.productName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Product SKU</p>
              <p className="font-semibold text-gray-900">{selectedStockInRequest.productSKU}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Quantity</p>
              <p className="font-semibold text-gray-900">{selectedStockInRequest.quantity} units</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Received From</p>
              <p className="font-semibold text-gray-900">{selectedStockInRequest.receivedFrom}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Approver Name</label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 items-center">
            <button
              onClick={() => handleApprove(selectedStockInRequest.id)}
              className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
            >
              Approve & Generate GRN
            </button>

            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
            >
              Reject
            </button>
          </div>

          {showRejectForm && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
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
                  onClick={() => handleReject(selectedStockInRequest.id)}
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

      {/* Approved Requests */}
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
                    {request.grn && (
                      <p className="text-sm text-gray-600">
                        GRN: <span className="font-mono font-semibold">{request.grn.number}</span>
                      </p>
                    )}
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
