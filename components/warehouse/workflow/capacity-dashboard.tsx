'use client';

import React, { useMemo } from 'react';
import { StructureData, StorageData } from '@/components/warehouse/types';
import { calculateTotalUtilization } from '@/components/warehouse/workflow-utils';

interface CapacityDashboardProps {
  structures: StructureData[];
  storageMap: Map<string, StorageData>;
}

export const CapacityDashboard: React.FC<CapacityDashboardProps> = ({ structures, storageMap }) => {
  const totalUtilization = useMemo(() => {
    return calculateTotalUtilization(structures, storageMap);
  }, [structures, storageMap]);

  const getUtilizationColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getUtilizationStatus = (percentage: number) => {
    if (percentage < 50) return 'Low Usage';
    if (percentage < 75) return 'Moderate Usage';
    if (percentage < 90) return 'High Usage';
    return 'Critical';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Warehouse Capacity Overview</h3>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Capacity</p>
          <p className="text-2xl font-bold text-blue-600">{totalUtilization.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Used Capacity</p>
          <p className="text-2xl font-bold text-green-600">{totalUtilization.used.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Available</p>
          <p className="text-2xl font-bold text-purple-600">
            {(totalUtilization.total - totalUtilization.used).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-1">units</p>
        </div>
      </div>

      {/* Overall Utilization */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700">Overall Utilization</p>
          <p className="text-sm font-semibold text-gray-900">
            {totalUtilization.utilization.toFixed(1)}%
          </p>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getUtilizationColor(totalUtilization.utilization)} transition-all duration-300`}
            style={{ width: `${Math.min(totalUtilization.utilization, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">{getUtilizationStatus(totalUtilization.utilization)}</p>
      </div>

      {/* Structure Breakdown */}
      {structures.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Structure Details</p>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {structures.map((structure) => {
              const storage = storageMap.get(structure.id);
              const used = storage?.usedCapacity || 0;
              const total = structure.levelCapacity * structure.levels;
              const utilization = total > 0 ? (used / total) * 100 : 0;

              return (
                <div key={structure.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{structure.label}</p>
                      <p className="text-xs text-gray-600">
                        {used} / {total} units
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{utilization.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${getUtilizationColor(utilization)} transition-all duration-300`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
