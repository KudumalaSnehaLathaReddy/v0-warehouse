'use client';

import React from 'react';
import { useWorkflow } from '@/context/workflow-context';

export const OperationsSummary: React.FC = () => {
  const { stockInRequests, stockOutRequests } = useWorkflow();

  const stockInStats = {
    total: stockInRequests.length,
    pending: stockInRequests.filter((r) => r.status === 'pending').length,
    approved: stockInRequests.filter((r) => r.status === 'approved').length,
    completed: stockInRequests.filter((r) => r.status === 'completed').length,
    rejected: stockInRequests.filter((r) => r.status === 'rejected').length,
  };

  const stockOutStats = {
    total: stockOutRequests.length,
    pending: stockOutRequests.filter((r) => r.status === 'pending').length,
    approved: stockOutRequests.filter((r) => r.status === 'approved').length,
    completed: stockOutRequests.filter((r) => r.status === 'completed').length,
    rejected: stockOutRequests.filter((r) => r.status === 'rejected').length,
  };

  const totalQuantityIn = stockInRequests.reduce((sum, r) => sum + r.quantity, 0);
  const totalQuantityOut = stockOutRequests.reduce((sum, r) => sum + r.quantity, 0);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Operations Summary</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Stock In Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Stock In Operations
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Total Requests</p>
              <span className="text-lg font-bold text-gray-900">{stockInStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Pending</p>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded">
                {stockInStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Approved</p>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                {stockInStats.approved}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Completed</p>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                {stockInStats.completed}
              </span>
            </div>
            {stockInStats.rejected > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Rejected</p>
                <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                  {stockInStats.rejected}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-sm text-gray-600">Total Quantity In</p>
              <p className="text-xl font-bold text-gray-900">{totalQuantityIn.toLocaleString()} units</p>
            </div>
          </div>
        </div>

        {/* Stock Out Summary */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
            <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"></span>
            Stock Out Operations
          </h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Total Requests</p>
              <span className="text-lg font-bold text-gray-900">{stockOutStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Pending</p>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-yellow-700 bg-yellow-100 rounded">
                {stockOutStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Approved</p>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                {stockOutStats.approved}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">Completed</p>
              <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded">
                {stockOutStats.completed}
              </span>
            </div>
            {stockOutStats.rejected > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">Rejected</p>
                <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 rounded">
                  {stockOutStats.rejected}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <p className="text-sm text-gray-600">Total Quantity Out</p>
              <p className="text-xl font-bold text-gray-900">{totalQuantityOut.toLocaleString()} units</p>
            </div>
          </div>
        </div>
      </div>

      {/* Net Change */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-700 mb-2">Net Inventory Change</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600">In - Out</p>
            <p className="text-2xl font-bold text-gray-900">{(totalQuantityIn - totalQuantityOut).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-semibold ${totalQuantityIn > totalQuantityOut ? 'text-green-600' : 'text-red-600'}`}>
              {totalQuantityIn > totalQuantityOut ? '↑ Increasing' : '↓ Decreasing'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {Math.abs(totalQuantityIn - totalQuantityOut).toLocaleString()} units
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
