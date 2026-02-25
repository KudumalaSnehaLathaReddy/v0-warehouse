'use client';

import React from 'react';
import { WarehouseCanvas } from '../warehouse-canvas';

interface WorkflowCanvasProps {
  mode: 'layout' | 'stock-in' | 'stock-out';
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({ mode }) => {
  return (
    <div className="w-full h-full">
      <WarehouseCanvas />
    </div>
  );
};
