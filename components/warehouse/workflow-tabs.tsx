'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WarehouseCanvas } from './warehouse-canvas';
import { StockInForm } from './workflow/stock-in-form';
import { StockInApproval } from './workflow/stock-in-approval';
import { VisualSlotting } from './workflow/visual-slotting';
import { StockOutForm } from './workflow/stock-out-form';
import { StockOutApproval } from './workflow/stock-out-approval';
import { StockOutRemoval } from './workflow/stock-out-removal';
import { OperationsSummary } from './workflow/operations-summary';
import { CapacityDashboard } from './workflow/capacity-dashboard';
import { Node } from '@xyflow/react';
import { StructureData, StorageData } from './types';

type TabType = 'layout' | 'stock-in' | 'stock-out';

interface WarehouseStateRef {
  nodes: Node[];
  storageMap: Map<string, StorageData>;
}

export const WorkflowTabs: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('layout');
  const warehouseStateRef = useRef<WarehouseStateRef>({
    nodes: [],
    storageMap: new Map(),
  });

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract structures from nodes
  const structures = useMemo(() => {
    return warehouseStateRef.current.nodes
      .filter((n) => n.type === 'structure')
      .map((n) => n.data as StructureData);
  }, [warehouseStateRef.current.nodes.length]);

  const tabs: Array<{ id: TabType; label: string }> = [
    { id: 'layout', label: 'Layout Designer' },
    { id: 'stock-in', label: 'Stock In' },
    { id: 'stock-out', label: 'Stock Out' },
  ];

  const handleWarehouseStateUpdate = (newNodes: Node[], newStorageMap: Map<string, StorageData>) => {
    warehouseStateRef.current = { nodes: newNodes, storageMap: newStorageMap };
  };

  if (!isClient) {
    return (
      <div className="w-full h-screen flex flex-col bg-gray-50">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading warehouse system...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'layout' && (
          <div className="w-full h-full">
            <WarehouseCanvas />
          </div>
        )}

        {activeTab === 'stock-in' && (
          <div className="w-full h-full flex flex-col">
            {/* Top section: Request form and approval */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white overflow-y-auto max-h-80">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <StockInForm />
                    <StockInApproval />
                  </div>
                  <div>
                    <OperationsSummary />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom section: Visual slotting with full height */}
            {structures.length > 0 && (
              <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <VisualSlotting structures={structures} storageMap={warehouseStateRef.current.storageMap} />
              </div>
            )}
            
            {structures.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Create a warehouse layout first before processing stock in requests</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stock-out' && (
          <div className="w-full h-full flex flex-col">
            {/* Top section: Request form and approval */}
            <div className="flex-shrink-0 border-b border-gray-200 bg-white overflow-y-auto max-h-80">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-3 gap-6">
                  <div className="col-span-2 space-y-6">
                    <StockOutForm />
                    <StockOutApproval />
                  </div>
                  <div>
                    <OperationsSummary />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom section: Removal with full height */}
            {structures.length > 0 && (
              <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                <StockOutRemoval structures={structures} storageMap={warehouseStateRef.current.storageMap} />
              </div>
            )}
            
            {structures.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Create a warehouse layout first before processing stock out requests</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
