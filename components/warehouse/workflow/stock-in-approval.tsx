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
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg border-2 border-amber-300 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">⏳</span>
          <h2 className="text-lg font-bold text-gray-900">Waiting to Review</h2>
          {pendingRequests.length > 0 && (
            <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {pendingRequests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">✓</p>
            <p className="text-lg font-semibold text-green-700">All done! No pending requests</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <button
                key={request.id}
                onClick={() => handleSelectRequest(request)}
                className={`w-full text-left p-4 border-2 rounded-lg cursor-pointer transition transform hover:scale-102 ${
                  selectedStockInRequest?.id === request.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 hover:border-blue-400 bg-white'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base">{request.productName}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">📦 Code: {request.productSKU}</p>
                      <p className="text-sm text-gray-600">📊 Quantity: <span className="font-semibold">{request.quantity} units</span></p>
                      <p className="text-sm text-gray-600">🚚 From: {request.receivedFrom}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-amber-500 rounded-full">
                      PENDING
                    </span>
                  </div>
                </div>
              </button>
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
        <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Review This Request
          </h3>

          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Product Name</p>
                <p className="text-base font-bold text-gray-900 mt-1">{selectedStockInRequest.productName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Product Code</p>
                <p className="text-base font-bold text-gray-900 mt-1">{selectedStockInRequest.productSKU}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Quantity</p>
                <p className="text-base font-bold text-blue-600 mt-1">{selectedStockInRequest.quantity} units</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Received From</p>
                <p className="text-base font-bold text-gray-900 mt-1">{selectedStockInRequest.receivedFrom}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-800 mb-2">Who is approving this?</label>
            <input
              type="text"
              value={approverName}
              onChange={(e) => setApproverName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-base"
            />
          </div>

          <div className="flex gap-3 items-stretch">
            <button
              onClick={() => handleApprove(selectedStockInRequest.id)}
              className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-sm text-base flex items-center justify-center gap-2"
            >
              <span>✓</span> Approve & Create Receipt
            </button>

            <button
              onClick={() => setShowRejectForm(!showRejectForm)}
              className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-sm text-base flex items-center justify-center gap-2"
            >
              <span>✕</span> Reject
            </button>
          </div>

          {showRejectForm && (
            <div className="mt-4 p-5 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-sm font-semibold text-red-900 mb-3">Why are you rejecting this?</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Tell us the reason (damage, wrong quantity, quality issue, etc.)"
                className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition text-base"
                rows={3}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleReject(selectedStockInRequest.id)}
                  className="flex-1 px-3 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition text-sm"
                >
                  Confirm Rejection
                </button>
                <button
                  onClick={() => setShowRejectForm(false)}
                  className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition text-sm"
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
        <div className="bg-white rounded-lg border-2 border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            History
          </h3>

          <div className="space-y-3">
            {processedRequests.map((request) => (
              <div
                key={request.id}
                className={`p-4 border-2 rounded-lg transition ${
                  request.status === 'approved'
                    ? 'border-green-300 bg-green-50'
                    : request.status === 'rejected'
                      ? 'border-red-300 bg-red-50'
                      : 'border-blue-300 bg-blue-50'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-base">{request.productName}</p>
                    <p className="text-sm text-gray-600 mt-1">📦 Code: {request.productSKU}</p>
                    {request.grn && (
                      <p className="text-sm font-semibold text-green-700 mt-2">
                        ✓ Receipt: {request.grn.number}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    {request.status === 'approved' && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-green-600 rounded-full">
                        ✓ APPROVED
                      </span>
                    )}
                    {request.status === 'rejected' && (
                      <div>
                        <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-red-600 rounded-full mb-2">
                          ✕ REJECTED
                        </span>
                        {request.rejectionReason && (
                          <p className="text-xs text-red-700 mt-2 font-medium">{request.rejectionReason}</p>
                        )}
                      </div>
                    )}
                    {request.status === 'completed' && (
                      <span className="inline-block px-3 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                        ✓ STORED
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
