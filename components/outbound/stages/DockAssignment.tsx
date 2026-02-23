'use client';

import { useState } from 'react';
import { Check, AlertCircle, Zap } from 'lucide-react';
import { DockAssignment as DockType } from '@/types/outbound';
import { ActionButton } from '@/components/inbound/shared/ActionButton';

interface DockAssignmentProps {
  dispatchRefNumber: string;
  totalPackages: number;
  onDockAssigned: (dock: DockType) => void;
}

export function DockAssignment({
  dispatchRefNumber,
  totalPackages,
  onDockAssigned,
}: DockAssignmentProps) {
  const [selectedDock, setSelectedDock] = useState<string | null>(null);

  // Mock dock data
  const docks: DockType[] = [
    {
      dockId: 'DOCK-01',
      dockName: 'Dock 01',
      capacity: 500,
      occupiedCapacity: 150,
      status: 'available',
      notes: 'Climate controlled',
    },
    {
      dockId: 'DOCK-02',
      dockName: 'Dock 02',
      capacity: 500,
      occupiedCapacity: 450,
      status: 'available',
      notes: 'Standard dock',
    },
    {
      dockId: 'DOCK-03',
      dockName: 'Dock 03',
      capacity: 350,
      occupiedCapacity: 350,
      status: 'occupied',
      notes: 'High-value items',
    },
    {
      dockId: 'DOCK-04',
      dockName: 'Dock 04',
      capacity: 500,
      occupiedCapacity: 0,
      status: 'available',
      notes: 'Recently cleared',
    },
    {
      dockId: 'DOCK-05',
      dockName: 'Dock 05',
      capacity: 400,
      occupiedCapacity: 200,
      status: 'maintenance',
      notes: 'Under maintenance',
    },
  ];

  const availableDocks = docks.filter((dock) => dock.status === 'available');
  const selectedDockData = docks.find((dock) => dock.dockId === selectedDock);

  const getCapacityColor = (occupied: number, capacity: number) => {
    const percentage = (occupied / capacity) * 100;
    if (percentage < 50) return 'bg-status-success';
    if (percentage < 80) return 'bg-status-warning';
    return 'bg-status-error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-status-success/10 text-status-success border-status-success/30';
      case 'occupied':
        return 'bg-status-warning/10 text-status-warning border-status-warning/30';
      case 'maintenance':
        return 'bg-status-error/10 text-status-error border-status-error/30';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleAssignDock = () => {
    if (selectedDockData) {
      onDockAssigned({
        ...selectedDockData,
        assignedDispatchRefNumber: dispatchRefNumber,
        estimatedReadyTime: new Date(Date.now() + 30 * 60000).toISOString(),
      });
    }
  };

  const spaceNeeded = totalPackages * 2.5; // Assuming 2.5 units per package

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Dock Assignment</h2>
        <p className="text-sm text-muted-foreground mt-1">
          DRN: <span className="font-semibold">{dispatchRefNumber}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Assign shipment to an available loading dock
        </p>
      </div>

      {/* Requirements Card */}
      <div className="bg-accent/10 rounded-lg p-4 border border-accent/20 flex items-start gap-3">
        <Zap className="w-5 h-5 text-accent mt-0.5" />
        <div>
          <p className="font-semibold text-foreground">Space Required</p>
          <p className="text-sm text-muted-foreground">
            {totalPackages} packages ({spaceNeeded.toFixed(1)} units)
          </p>
        </div>
      </div>

      {/* Dock Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {docks.map((dock) => {
          const capacityPercentage = (dock.occupiedCapacity / dock.capacity) * 100;
          const isSelectable = dock.status === 'available';
          const hasEnoughSpace = dock.capacity - dock.occupiedCapacity >= spaceNeeded;

          return (
            <div
              key={dock.dockId}
              onClick={() => isSelectable && setSelectedDock(dock.dockId)}
              className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                selectedDock === dock.dockId
                  ? 'border-accent bg-accent/5'
                  : isSelectable
                    ? 'border-border hover:border-accent/50'
                    : 'border-border opacity-60'
              } ${isSelectable ? '' : 'cursor-not-allowed'}`}
            >
              {/* Dock Name & Status */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-foreground text-lg">{dock.dockName}</p>
                  <p className="text-xs text-muted-foreground">{dock.dockId}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dock.status)}`}
                >
                  {dock.status === 'available'
                    ? 'Available'
                    : dock.status === 'occupied'
                      ? 'Occupied'
                      : 'Maintenance'}
                </span>
              </div>

              {/* Notes */}
              <p className="text-xs text-muted-foreground mb-3">{dock.notes}</p>

              {/* Capacity Bar */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-foreground">Capacity</span>
                  <span className="text-xs text-muted-foreground">
                    {dock.occupiedCapacity}/{dock.capacity}
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${getCapacityColor(
                      dock.occupiedCapacity,
                      dock.capacity
                    )}`}
                    style={{ width: `${capacityPercentage}%` }}
                  />
                </div>
              </div>

              {/* Available Space */}
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground">Available:</p>
                <p
                  className={`text-sm font-semibold ${
                    hasEnoughSpace ? 'text-status-success' : 'text-status-error'
                  }`}
                >
                  {dock.capacity - dock.occupiedCapacity} units
                </p>
              </div>

              {/* Warning */}
              {!hasEnoughSpace && (
                <div className="mt-2 flex items-center gap-2 text-status-error text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>Insufficient space</span>
                </div>
              )}

              {/* Selection Indicator */}
              {selectedDock === dock.dockId && (
                <div className="mt-3 pt-3 border-t border-border flex items-center gap-2 text-accent">
                  <Check className="w-4 h-4" />
                  <span className="text-xs font-medium">Selected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Dock Details */}
      {selectedDockData && (
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            {selectedDockData.dockName} - Assignment Details
          </h3>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Available Capacity</p>
              <p className="text-2xl font-bold text-accent">
                {selectedDockData.capacity - selectedDockData.occupiedCapacity} units
              </p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Space Needed</p>
              <p className="text-2xl font-bold text-foreground">{spaceNeeded.toFixed(1)} units</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-1">Estimated Ready</p>
              <p className="text-2xl font-bold text-foreground">30 min</p>
            </div>
          </div>

          <div className="bg-background rounded-lg p-4 border border-border">
            <p className="text-sm font-semibold text-foreground mb-2">Assignment Summary</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                Dispatch Reference: <span className="font-semibold">{dispatchRefNumber}</span>
              </li>
              <li>
                Total Packages: <span className="font-semibold">{totalPackages}</span>
              </li>
              <li>
                Dock Location:{' '}
                <span className="font-semibold">
                  {selectedDockData.dockName} ({selectedDockData.dockId})
                </span>
              </li>
              <li>
                Status:{' '}
                <span className="font-semibold text-status-success">
                  {selectedDockData.status === 'available' ? 'Ready for Assignment' : ''}
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* No Available Docks Warning */}
      {availableDocks.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-status-error/10 border border-status-error/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-status-error" />
          <p className="text-sm text-status-error">
            No available docks at the moment. Please try again later.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          onClick={handleAssignDock}
          label="Confirm Dock Assignment"
          variant="primary"
          icon={Check}
          disabled={!selectedDock || !selectedDockData?.status.includes('available')}
        />
      </div>
    </div>
  );
}
