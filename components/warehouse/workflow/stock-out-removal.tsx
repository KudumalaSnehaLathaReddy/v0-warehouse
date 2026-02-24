'use client';

import React, { useState } from 'react';
import { useWorkflow } from '@/context/workflow-context';
import { StorageCoordinate, StructureData, StorageData } from '@/components/warehouse/types';

interface StockOutRemovalProps {
  structures: StructureData[];
  storageMap: Map<string, StorageData>;
}

export const StockOutRemoval: React.FC<StockOutRemovalProps> = ({ structures, storageMap }) => {
  const { selectedStockOutRequest, assignRemovalLocations, completeStockOutRequest } = useWorkflow();
  const [selectedLocations, setSelectedLocations] = useState<StorageCoordinate[]>([]);
  const [confirmed, setConfirmed] = useState(false);

  if (!selectedStockOutRequest) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500 text-center py-8">Select an approved stock out request to view removal options</p>
      </div>
    );
  }

  if (selectedStockOutRequest.status === 'pending' || selectedStockOutRequest.status === 'rejected') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <p className="text-gray-500 text-center py-8">Request must be approved before removal</p>
      </div>
    );
  }

  const handleSelectLocation = (structureId: string, levelIndex: number, partitionIndex: number) => {
    const existing = selectedLocations.find(
      (l) => l.structureId === structureId && l.levelIndex === levelIndex && l.partitionIndex === partitionIndex
    );

    if (existing) {
      setSelectedLocations(selectedLocations.filter((l) => l !== existing));
    } else {
      // Add with default quantity of 1
      setSelectedLocations([
        ...selectedLocations,
        {
          structureId,
          levelIndex,
          partitionIndex,
          quantity: 1,
        },
      ]);
    }
  };

  const handleQuantityChange = (
    structureId: string,
    levelIndex: number,
    partitionIndex: number,
    newQuantity: number
  ) => {
    setSelectedLocations(
      selectedLocations.map((l) =>
        l.structureId === structureId && l.levelIndex === levelIndex && l.partitionIndex === partitionIndex
          ? { ...l, quantity: Math.max(1, newQuantity) }
          : l
      )
    );
  };

  const handleConfirmRemoval = () => {
    if (selectedLocations.length === 0) {
      alert('Please select at least one location');
      return;
    }

    const totalQuantity = selectedLocations.reduce((sum, l) => sum + l.quantity, 0);
    if (totalQuantity !== selectedStockOutRequest.quantity) {
      alert(`Total quantity must equal ${selectedStockOutRequest.quantity}`);
      return;
    }

    assignRemovalLocations(selectedStockOutRequest.id, selectedLocations);
    setConfirmed(true);

    setTimeout(() => {
      completeStockOutRequest(selectedStockOutRequest.id);
    }, 1500);
  };

  const totalSelectedQuantity = selectedLocations.reduce((sum, l) => sum + l.quantity, 0);
  const removalCoverage = (totalSelectedQuantity / selectedStockOutRequest.quantity) * 100;

  return (
    <div className="w-full space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Stock Out Removal - {selectedStockOutRequest.productName}</h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Product</p>
            <p className="font-semibold text-gray-900">{selectedStockOutRequest.productName}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Quantity</p>
            <p className="font-semibold text-gray-900">{selectedStockOutRequest.quantity} units</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Destination</p>
            <p className="font-semibold text-gray-900 truncate">{selectedStockOutRequest.destination}</p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-700">Removal Coverage</p>
            <p className="text-sm font-semibold text-gray-900">
              {totalSelectedQuantity} / {selectedStockOutRequest.quantity} ({removalCoverage.toFixed(0)}%)
            </p>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${Math.min(removalCoverage, 100)}%` }}
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Removal Locations</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
            {structures.length === 0 ? (
              <p className="text-sm text-gray-500">No structures available</p>
            ) : (
              structures.map((structure) => (
                <div key={structure.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-900 mb-3">{structure.label}</p>

                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: structure.partitions }).map((_, partIndex) => (
                      <div
                        key={`${structure.id}-${partIndex}`}
                        onClick={() => handleSelectLocation(structure.id, 0, partIndex)}
                        className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedLocations.some(
                            (l) =>
                              l.structureId === structure.id &&
                              l.levelIndex === 0 &&
                              l.partitionIndex === partIndex
                          )
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-300 bg-white hover:border-red-300'
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-600">P{partIndex + 1}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {storageMap.get(structure.id)?.usedCapacity || 0} / {structure.partitionCapacity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {selectedLocations.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Selected Locations for Removal</h3>
            <div className="space-y-2">
              {selectedLocations.map((location, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-red-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Structure: {location.structureId}</p>
                    <p className="text-xs text-gray-600">
                      Level {location.levelIndex + 1} / Partition {location.partitionIndex + 1}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          location.structureId,
                          location.levelIndex,
                          location.partitionIndex,
                          location.quantity - 1
                        )
                      }
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={location.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          location.structureId,
                          location.levelIndex,
                          location.partitionIndex,
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                      min="1"
                      className="w-12 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          location.structureId,
                          location.levelIndex,
                          location.partitionIndex,
                          location.quantity + 1
                        )
                      }
                      className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleConfirmRemoval}
            disabled={selectedLocations.length === 0 || confirmed}
            className={`flex-1 px-4 py-2 font-medium rounded-md transition ${
              confirmed
                ? 'bg-green-100 text-green-700 cursor-not-allowed'
                : selectedLocations.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {confirmed ? 'Removal Completed!' : 'Confirm & Complete Removal'}
          </button>
        </div>
      </div>
    </div>
  );
};
