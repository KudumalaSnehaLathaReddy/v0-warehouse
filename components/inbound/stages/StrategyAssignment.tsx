'use client';

import React, { useState } from 'react';
import { StrategyAssignmentData, InventoryRotationStrategy, WarehouseLocation } from '@/types/inbound';
import { ActionButton } from '../shared/ActionButton';
import { ArrowRight, Package } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';

interface StrategyAssignmentProps {
  expectedQuantity: number;
  unitOfMeasure: string;
  onSubmit: (data: StrategyAssignmentData) => void;
  loading?: boolean;
}

const mockWarehouseLocations: WarehouseLocation[] = [
  {
    locationId: 'LOC-A1-01',
    zone: 'Zone A',
    section: 'A1',
    capacity: 1000,
    currentUtilization: 750,
    isAvailable: true,
  },
  {
    locationId: 'LOC-A2-05',
    zone: 'Zone A',
    section: 'A2',
    capacity: 800,
    currentUtilization: 450,
    isAvailable: true,
  },
  {
    locationId: 'LOC-B1-03',
    zone: 'Zone B',
    section: 'B1',
    capacity: 1200,
    currentUtilization: 900,
    isAvailable: true,
  },
  {
    locationId: 'LOC-C3-02',
    zone: 'Zone C',
    section: 'C3',
    capacity: 600,
    currentUtilization: 600,
    isAvailable: false,
  },
];

const rotationStrategies: { id: InventoryRotationStrategy; label: string; description: string }[] = [
  {
    id: 'FIFO',
    label: 'FIFO',
    description: 'First In, First Out - Oldest items are used first. Ideal for perishables and items with expiration dates.',
  },
  {
    id: 'FEFO',
    label: 'FEFO',
    description: 'First Expired, First Out - Items closest to expiration are used first. Best for items with varying expiry dates.',
  },
  {
    id: 'LIFO',
    label: 'LIFO',
    description: 'Last In, First Out - Most recently received items are used first. Common for non-perishable goods.',
  },
];

export const StrategyAssignment: React.FC<StrategyAssignmentProps> = ({
  expectedQuantity,
  unitOfMeasure,
  onSubmit,
  loading = false,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<InventoryRotationStrategy>('FIFO');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const location = mockWarehouseLocations.find((l) => l.locationId === selectedLocation);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedLocation) {
      newErrors.location = 'Please select a storage location';
    }

    const selectedLoc = mockWarehouseLocations.find((l) => l.locationId === selectedLocation);
    if (selectedLoc && !selectedLoc.isAvailable) {
      newErrors.location = 'Selected location is not available';
    }

    const availableCapacity = location ? location.capacity - location.currentUtilization : 0;
    if (availableCapacity < expectedQuantity) {
      newErrors.capacity = `Insufficient capacity. Available: ${availableCapacity} ${unitOfMeasure}`;
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!location) return;

    onSubmit({
      locationId: location.locationId,
      locationName: `${location.zone} - ${location.section}`,
      rotationStrategy: selectedStrategy,
      assignedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Storage Strategy Assignment</h2>
        <p className="text-muted-foreground">
          Designate warehouse location and select inventory rotation logic
        </p>
      </div>

      {/* Location Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
            1
          </div>
          Select Storage Location
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockWarehouseLocations.map((loc) => {
            const utilizationPercent = (loc.currentUtilization / loc.capacity) * 100;
            const availableCapacity = loc.capacity - loc.currentUtilization;
            const canFit = availableCapacity >= expectedQuantity;

            return (
              <button
                key={loc.locationId}
                onClick={() => {
                  if (loc.isAvailable) {
                    setSelectedLocation(loc.locationId);
                    setErrors({});
                  }
                }}
                disabled={!loc.isAvailable}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedLocation === loc.locationId
                    ? 'border-accent bg-accent/10'
                    : 'border-border hover:border-muted-foreground'
                } ${!loc.isAvailable ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{loc.zone} - {loc.section}</p>
                    <p className="text-xs text-muted-foreground">ID: {loc.locationId}</p>
                  </div>
                  {!loc.isAvailable && (
                    <StatusBadge status="missing" size="sm" />
                  )}
                  {canFit && <StatusBadge status="ok" size="sm" />}
                  {loc.isAvailable && !canFit && (
                    <StatusBadge status="damaged" size="sm" />
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Capacity Used</span>
                      <span className="text-xs font-medium text-foreground">{utilizationPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${utilizationPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium text-foreground">{loc.capacity}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Available</p>
                      <p className={`font-medium ${canFit ? 'text-status-success' : 'text-status-error'}`}>
                        {availableCapacity}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {errors.location && (
          <p className="text-sm text-status-error flex items-center gap-2">
            <span className="text-base">⚠</span>
            {errors.location}
          </p>
        )}
        {errors.capacity && (
          <p className="text-sm text-status-error flex items-center gap-2">
            <span className="text-base">⚠</span>
            {errors.capacity}
          </p>
        )}
      </div>

      {/* Strategy Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
            2
          </div>
          Select Rotation Strategy
        </h3>

        <div className="space-y-3">
          {rotationStrategies.map((strategy) => (
            <label
              key={strategy.id}
              className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedStrategy === strategy.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-muted-foreground'
              }`}
            >
              <input
                type="radio"
                name="strategy"
                value={strategy.id}
                checked={selectedStrategy === strategy.id}
                onChange={() => setSelectedStrategy(strategy.id)}
                className="mt-1 w-4 h-4 accent-accent"
              />
              <div className="flex-1">
                <p className="font-semibold text-foreground">{strategy.label}</p>
                <p className="text-sm text-muted-foreground mt-1">{strategy.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Assignment Summary */}
      {selectedLocation && location && (
        <div className="bg-status-info/10 border border-status-info/30 rounded-lg p-4 space-y-2">
          <p className="text-sm font-medium text-status-info">Assignment Summary</p>
          <div className="text-sm text-foreground space-y-1">
            <p>
              <span className="font-medium">Location:</span> {location.zone} - {location.section} ({location.locationId})
            </p>
            <p>
              <span className="font-medium">Strategy:</span> {selectedStrategy}
            </p>
            <p>
              <span className="font-medium">Items to Store:</span> {expectedQuantity} {unitOfMeasure}
            </p>
            <p>
              <span className="font-medium">Available After:</span>{' '}
              {location.capacity - location.currentUtilization - expectedQuantity} units
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <ActionButton
          onClick={handleSubmit}
          variant="primary"
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
        >
          Assign & Continue
        </ActionButton>
      </div>
    </div>
  );
};
