'use client';

import React, { useMemo } from 'react';
import { WarehouseCanvas } from '../warehouse-canvas';
import { VisualSlotting } from './visual-slotting';
import { StockOutRemoval } from './stock-out-removal';
import { useWorkflow } from '@/context/workflow-context';
import { StructureData, StorageData } from '../types';
import { Node } from '@xyflow/react';

interface WorkflowCanvasProps {
  mode: 'layout' | 'stock-in' | 'stock-out';
  nodes?: Node[];
  storageMap?: Map<string, StorageData>;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ mode }) => {
  const { selectedStockInRequest, selectedStockOutRequest } = useWorkflow();

  // Since WarehouseCanvas manages its own state via ReactFlow,
  // we just need to display the visualization panels when requests are approved
  
  const isStockInApproved = mode === 'stock-in' && selectedStockInRequest?.status === 'approved';
  const isStockOutApproved = mode === 'stock-out' && selectedStockOutRequest?.status === 'approved';

  return (
    <div className="w-full h-full flex bg-gray-50">
      {/* React Flow Canvas - Main Area */}
      <div className="flex-1 overflow-hidden">
        <WarehouseCanvas />
      </div>

      {/* Right Side Visualization Panel - Stock In */}
      {isStockInApproved && selectedStockInRequest && (
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto shadow-lg">
          <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-gray-200 px-6 py-4 z-10">
            <h3 className="text-sm font-semibold text-gray-900">Visual Slotting</h3>
            <p className="text-xs text-gray-600 mt-1">{selectedStockInRequest.productName}</p>
            <p className="text-xs text-blue-600 font-medium mt-2">Quantity: {selectedStockInRequest.quantity} units</p>
          </div>
          <div className="p-6">
            <VisualSlotting structures={[]} storageMap={new Map()} />
          </div>
        </div>
      )}

      {/* Right Side Visualization Panel - Stock Out */}
      {isStockOutApproved && selectedStockOutRequest && (
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto shadow-lg">
          <div className="sticky top-0 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-gray-200 px-6 py-4 z-10">
            <h3 className="text-sm font-semibold text-gray-900">Stock Out Removal</h3>
            <p className="text-xs text-gray-600 mt-1">{selectedStockOutRequest.productName}</p>
            <p className="text-xs text-orange-600 font-medium mt-2">Quantity: {selectedStockOutRequest.quantity} units</p>
          </div>
          <div className="p-6">
            <StockOutRemoval structures={[]} storageMap={new Map()} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isStockInApproved && !isStockOutApproved && (
        <div className="hidden sm:flex w-96 border-l border-gray-200 bg-gray-50 items-center justify-center text-center p-6">
          <div>
            <p className="text-sm text-gray-500">Approve a request to see visual slotting</p>
          </div>
        </div>
      )}
    </div>
  );
};
