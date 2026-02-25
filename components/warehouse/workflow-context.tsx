'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  StockInRequest,
  StockOutRequest,
  StorageCoordinate,
  RotationStrategy,
  GRN,
} from '@/components/warehouse/types';

interface WorkflowContextType {
  // Stock In
  stockInRequests: StockInRequest[];
  selectedStockInRequest: StockInRequest | null;
  addStockInRequest: (request: Omit<StockInRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateStockInRequest: (id: string, updates: Partial<StockInRequest>) => void;
  selectStockInRequest: (id: string | null) => void;
  approveStockInRequest: (id: string, approvedBy: string) => void;
  rejectStockInRequest: (id: string, reason: string) => void;
  assignCoordinates: (requestId: string, coordinates: StorageCoordinate[], strategy: RotationStrategy) => void;
  completeStockInRequest: (id: string) => void;

  // Stock Out
  stockOutRequests: StockOutRequest[];
  selectedStockOutRequest: StockOutRequest | null;
  addStockOutRequest: (request: Omit<StockOutRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateStockOutRequest: (id: string, updates: Partial<StockOutRequest>) => void;
  selectStockOutRequest: (id: string | null) => void;
  approveStockOutRequest: (id: string, approvedBy: string) => void;
  rejectStockOutRequest: (id: string, reason: string) => void;
  assignRemovalLocations: (requestId: string, locations: StorageCoordinate[]) => void;
  completeStockOutRequest: (id: string) => void;

  // Capacity tracking
  updateStructureCapacity: (structureId: string, levelIndex: number, partitionIndex: number, quantity: number, operation: 'add' | 'subtract') => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const WorkflowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stockInRequests, setStockInRequests] = useState<StockInRequest[]>([]);
  const [stockOutRequests, setStockOutRequests] = useState<StockOutRequest[]>([]);
  const [selectedStockInRequest, setSelectedStockInRequest] = useState<StockInRequest | null>(null);
  const [selectedStockOutRequest, setSelectedStockOutRequest] = useState<StockOutRequest | null>(null);

  // Generate GRN - Only on client
  const generateGRN = useCallback((requestId: string): GRN => {
    if (typeof window === 'undefined') {
      // Server-side fallback
      return {
        id: `grn-${requestId}`,
        requestId,
        generatedAt: new Date(),
        number: `GRN-PENDING`,
      };
    }
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
    const randomNum = Math.floor(Math.random() * 100000)
      .toString()
      .padStart(5, '0');
    return {
      id: `grn-${requestId}`,
      requestId,
      generatedAt: now,
      number: `GRN-${dateStr}-${randomNum}`,
    };
  }, []);

  // Stock In Methods
  const addStockInRequest = useCallback(
    (request: Omit<StockInRequest, 'id' | 'createdAt' | 'status'>) => {
      // Generate ID safely on client
      const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
      const randomPart = typeof window !== 'undefined' ? Math.random().toString(36).substr(2, 9) : 'pending';
      const id = `stock-in-${timestamp}-${randomPart}`;
      
      const newRequest: StockInRequest = {
        ...request,
        id,
        createdAt: new Date(),
        status: 'pending',
      };
      setStockInRequests((prev) => [...prev, newRequest]);
    },
    []
  );

  const updateStockInRequest = useCallback((id: string, updates: Partial<StockInRequest>) => {
    setStockInRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updates } : req))
    );
    if (selectedStockInRequest?.id === id) {
      setSelectedStockInRequest((prev) => (prev ? { ...prev, ...updates } : null));
    }
  }, [selectedStockInRequest?.id]);

  const selectStockInRequest = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedStockInRequest(null);
    } else {
      const request = stockInRequests.find((r) => r.id === id);
      setSelectedStockInRequest(request || null);
    }
  }, [stockInRequests]);

  const approveStockInRequest = useCallback(
    (id: string, approvedBy: string) => {
      const request = stockInRequests.find((r) => r.id === id);
      if (request) {
        const grn = generateGRN(id);
        updateStockInRequest(id, {
          status: 'approved',
          approvedAt: new Date(),
          approvedBy,
          grn,
        });
      }
    },
    [stockInRequests, updateStockInRequest]
  );

  const rejectStockInRequest = useCallback(
    (id: string, reason: string) => {
      updateStockInRequest(id, {
        status: 'rejected',
        rejectionReason: reason,
      });
    },
    [updateStockInRequest]
  );

  const assignCoordinates = useCallback(
    (requestId: string, coordinates: StorageCoordinate[], strategy: RotationStrategy) => {
      updateStockInRequest(requestId, {
        assignedCoordinates: coordinates,
        rotationStrategy: strategy,
      });
    },
    [updateStockInRequest]
  );

  const completeStockInRequest = useCallback(
    (id: string) => {
      updateStockInRequest(id, { status: 'completed' });
    },
    [updateStockInRequest]
  );

  // Stock Out Methods
  const addStockOutRequest = useCallback(
    (request: Omit<StockOutRequest, 'id' | 'createdAt' | 'status'>) => {
      // Generate ID safely on client
      const timestamp = typeof window !== 'undefined' ? Date.now() : 0;
      const randomPart = typeof window !== 'undefined' ? Math.random().toString(36).substr(2, 9) : 'pending';
      const id = `stock-out-${timestamp}-${randomPart}`;
      
      const newRequest: StockOutRequest = {
        ...request,
        id,
        createdAt: new Date(),
        status: 'pending',
      };
      setStockOutRequests((prev) => [...prev, newRequest]);
    },
    []
  );

  const updateStockOutRequest = useCallback((id: string, updates: Partial<StockOutRequest>) => {
    setStockOutRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, ...updates } : req))
    );
    if (selectedStockOutRequest?.id === id) {
      setSelectedStockOutRequest((prev) => (prev ? { ...prev, ...updates } : null));
    }
  }, [selectedStockOutRequest?.id]);

  const selectStockOutRequest = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedStockOutRequest(null);
    } else {
      const request = stockOutRequests.find((r) => r.id === id);
      setSelectedStockOutRequest(request || null);
    }
  }, [stockOutRequests]);

  const approveStockOutRequest = useCallback(
    (id: string, approvedBy: string) => {
      updateStockOutRequest(id, {
        status: 'approved',
        approvedAt: new Date(),
        approvedBy,
      });
    },
    [updateStockOutRequest]
  );

  const rejectStockOutRequest = useCallback(
    (id: string, reason: string) => {
      updateStockOutRequest(id, {
        status: 'rejected',
        rejectionReason: reason,
      });
    },
    [updateStockOutRequest]
  );

  const assignRemovalLocations = useCallback(
    (requestId: string, locations: StorageCoordinate[]) => {
      updateStockOutRequest(requestId, {
        removedFrom: locations,
      });
    },
    [updateStockOutRequest]
  );

  const completeStockOutRequest = useCallback(
    (id: string) => {
      updateStockOutRequest(id, { status: 'completed' });
    },
    [updateStockOutRequest]
  );

  // Capacity tracking (placeholder - will be integrated with main warehouse state)
  const updateStructureCapacity = useCallback(
    (structureId: string, levelIndex: number, partitionIndex: number, quantity: number, operation: 'add' | 'subtract') => {
      // This will be connected to the main warehouse state management
    },
    []
  );

  const value: WorkflowContextType = {
    stockInRequests,
    selectedStockInRequest,
    addStockInRequest,
    updateStockInRequest,
    selectStockInRequest,
    approveStockInRequest,
    rejectStockInRequest,
    assignCoordinates,
    completeStockInRequest,
    stockOutRequests,
    selectedStockOutRequest,
    addStockOutRequest,
    updateStockOutRequest,
    selectStockOutRequest,
    approveStockOutRequest,
    rejectStockOutRequest,
    assignRemovalLocations,
    completeStockOutRequest,
    updateStructureCapacity,
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export const useWorkflow = (): WorkflowContextType => {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within a WorkflowProvider');
  }
  return context;
};
