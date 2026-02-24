'use client';

import React, { useState, useMemo } from 'react';
import { useWorkflow } from '@/context/workflow-context';
import { RotationStrategy, StructureData, StorageData } from '@/components/warehouse/types';
import { applyRotationStrategy } from '@/components/warehouse/workflow-utils';

interface VisualSlottingProps {
  structures: StructureData[];
  storageMap: Map<string, StorageData>;
}

export const VisualSlotting: React.FC<VisualSlottingProps> = ({ structures, storageMap }) => {
  const { selectedStockInRequest, assignCoordinates, completeStockInRequest } = useWorkflow();
  const [selectedStrategy, setSelectedStrategy] = useState<RotationStrategy>('FIFO');
  const [confirmed, setConfirmed] = useState(false);

  const assignments = useMemo(() => {
    if (!selectedStockInRequest || !selectedStockInRequest.status.includes('approved')) {
      return [];
    }

    return applyRotationStrategy(
      selectedStrategy,
      structures,
      storageMap,
      selectedStockInRequest.quantity
    );
  }, [selectedStockInRequest, selectedStrategy, structures, storageMap]);

  const handleConfirmAssignment = () => {
    if (!selectedStockInRequest) return;

    assignCoordinates(selectedStockInRequest.id, assignments, selectedStrategy);
    setConfirmed(true);

    // Auto-complete after brief delay
    setTimeout(() => {
      completeStockInRequest(selectedStockInRequest.id);
    }, 1500);
  };

  if (!selectedStockInRequest) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500 text-center py-8">Select an approved stock in request to view slotting</p>
      </div>
    );
  }

  if (selectedStockInRequest.status === 'pending' || selectedStockInRequest.status === 'rejected') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500 text-center py-8">Request must be approved before slotting</p>
      </div>
    );
  }

  const totalAssignedQuantity = assignments.reduce((sum, a) => sum + a.quantity, 0);
  const assignmentCoverage = (totalAssignedQuantity / selectedStockInRequest.quantity) * 100;

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Visual Slotting - {selectedStockInRequest.productName}</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Product</p>
            <p className="font-semibold text-gray-900">{selectedStockInRequest.productName}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Quantity</p>
            <p className="font-semibold text-gray-900">{selectedStockInRequest.quantity} units</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">GRN</p>
            <p className="font-semibold text-gray-900 font-mono text-sm">{selectedStockInRequest.grn?.number || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Rotation Strategy</label>
          <div className="flex gap-3">
            {(['FIFO', 'FEFO', 'LIFO'] as RotationStrategy[]).map((strategy) => (
              <button
                key={strategy}
                onClick={() => setSelectedStrategy(strategy)}
                className={`px-4 py-2 rounded-md font-medium transition ${
                  selectedStrategy === strategy
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {strategy}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {selectedStrategy === 'FIFO' && 'First In First Out - Stock arrives in order'}
            {selectedStrategy === 'FEFO' && 'First Expired First Out - Prioritize by expiration'}
            {selectedStrategy === 'LIFO' && 'Last In First Out - Most recent stock processed first'}
          </p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Slotting Coverage</p>
            <p className="text-sm font-semibold text-gray-900">
              {totalAssignedQuantity} / {selectedStockInRequest.quantity} ({assignmentCoverage.toFixed(0)}%)
            </p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${Math.min(assignmentCoverage, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Assigned Locations</h3>

          {assignments.length === 0 ? (
            <p className="text-sm text-gray-500">No assignments available with current strategy</p>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {assignments.map((assignment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Structure: {assignment.structureId}</p>
                    <p className="text-xs text-gray-600">
                      Level {assignment.levelIndex + 1} / Partition {assignment.partitionIndex + 1}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{assignment.quantity} units</p>
                    <p className="text-xs text-gray-500">
                      {((assignment.quantity / selectedStockInRequest.quantity) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleConfirmAssignment}
            disabled={assignments.length === 0 || confirmed}
            className={`flex-1 px-4 py-2 font-medium rounded-md transition ${
              confirmed
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : assignments.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {confirmed ? 'Assignment Completed!' : 'Confirm & Complete Assignment'}
          </button>
        </div>
      </div>
    </div>
  );
};
