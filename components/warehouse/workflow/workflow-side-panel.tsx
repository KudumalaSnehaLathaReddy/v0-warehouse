'use client';

import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { StockInForm } from './stock-in-form';
import { StockInApproval } from './stock-in-approval';
import { StockOutForm } from './stock-out-form';
import { StockOutApproval } from './stock-out-approval';
import { OperationsSummary } from './operations-summary';

type WorkflowMode = 'stock-in' | 'stock-out';

interface WorkflowSidePanelProps {
  mode: WorkflowMode;
}

export const WorkflowSidePanel: React.FC<WorkflowSidePanelProps> = ({ mode }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Hamburger Button - When Closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed left-4 top-20 z-40 p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 shadow-md transition"
          aria-label="Open workflow panel"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      )}

      {/* Side Panel */}
      <div
        className={`fixed left-0 top-0 h-full z-30 bg-white border-r border-gray-200 shadow-lg transition-all duration-300 overflow-y-auto ${
          isOpen ? 'w-96' : 'w-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-40">
          <h2 className="text-lg font-semibold text-gray-900">
            {mode === 'stock-in' ? 'Stock In' : 'Stock Out'}
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition"
            aria-label="Close workflow panel"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {mode === 'stock-in' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Create Request</h3>
                <StockInForm />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Approvals</h3>
                <StockInApproval />
              </div>
            </>
          )}

          {mode === 'stock-out' && (
            <>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Create Request</h3>
                <StockOutForm />
              </div>
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Approvals</h3>
                <StockOutApproval />
              </div>
            </>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Operations</h3>
            <OperationsSummary />
          </div>
        </div>
      </div>

      {/* Content Offset */}
      {isOpen && <div className="fixed left-0 top-0 w-96 h-full" style={{ pointerEvents: 'none' }} />}
    </>
  );
};
