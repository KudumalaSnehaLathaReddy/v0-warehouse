'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { WarehouseCanvas } from './warehouse-canvas';
import { WorkflowSidePanel } from './workflow/workflow-side-panel';
import { WorkflowCanvas } from './workflow/workflow-canvas';
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
      <div className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-20">
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

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'layout' && (
          <WarehouseCanvas />
        )}

        {activeTab === 'stock-in' && (
          <>
            <WorkflowSidePanel mode="stock-in" />
            <div className="w-full h-full" style={{ marginLeft: 0 }}>
              <WorkflowCanvas
                mode="stock-in"
                nodes={warehouseStateRef.current.nodes}
                storageMap={warehouseStateRef.current.storageMap}
              />
            </div>
          </>
        )}

        {activeTab === 'stock-out' && (
          <>
            <WorkflowSidePanel mode="stock-out" />
            <div className="w-full h-full" style={{ marginLeft: 0 }}>
              <WorkflowCanvas
                mode="stock-out"
                nodes={warehouseStateRef.current.nodes}
                storageMap={warehouseStateRef.current.storageMap}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
