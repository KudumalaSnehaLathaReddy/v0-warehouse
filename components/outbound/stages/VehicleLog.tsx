'use client';

import { useState } from 'react';
import { Check, Truck, Clock } from 'lucide-react';
import { VehicleLog as VehicleLogType } from '@/types/outbound';
import { ActionButton } from '@/components/inbound/shared/ActionButton';
import { StatusBadge } from '@/components/inbound/shared/StatusBadge';
import { DataTable } from '@/components/inbound/shared/DataTable';

interface VehicleLogProps {
  dispatchRefNumber: string;
  dockName: string;
  onVehicleExit: (log: VehicleLogType) => void;
}

export function VehicleLog({
  dispatchRefNumber,
  dockName,
  onVehicleExit,
}: VehicleLogProps) {
  const [formData, setFormData] = useState({
    vehicleRegNumber: '',
    vehicleType: 'semi-truck',
    driverName: '',
    driverContact: '',
  });
  const [vehicleEntry, setVehicleEntry] = useState<VehicleLogType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logs, setLogs] = useState<VehicleLogType[]>([
    {
      vehicleLogId: 'VL-001',
      vehicleRegNumber: 'ABC-1234',
      vehicleType: 'semi-truck',
      driverName: 'John Smith',
      event: 'entry',
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      dockAssignment: 'DOCK-01',
      dispatchRefNumber: 'DRN-2024-0001',
      gatePassNumber: 'GP-2024-001',
    },
    {
      vehicleLogId: 'VL-002',
      vehicleRegNumber: 'XYZ-5678',
      vehicleType: 'van',
      driverName: 'Sarah Jones',
      event: 'exit',
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      dockAssignment: 'DOCK-02',
      dispatchRefNumber: 'DRN-2024-0002',
      gatePassNumber: 'GP-2024-002',
    },
  ]);

  const handleVehicleEntry = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.vehicleRegNumber.trim()) {
      newErrors.vehicleRegNumber = 'Registration number is required';
    }
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newEntry: VehicleLogType = {
      vehicleLogId: `VL-${logs.length + 1}`,
      vehicleRegNumber: formData.vehicleRegNumber,
      vehicleType: formData.vehicleType,
      driverName: formData.driverName,
      event: 'entry',
      timestamp: new Date().toISOString(),
      dockAssignment: dockName,
      dispatchRefNumber,
      gatePassNumber: `GP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    };

    setVehicleEntry(newEntry);
    setLogs([newEntry, ...logs]);
    setFormData({
      vehicleRegNumber: '',
      vehicleType: 'semi-truck',
      driverName: '',
      driverContact: '',
    });
    setErrors({});
  };

  const handleVehicleExit = () => {
    if (vehicleEntry) {
      const exitLog: VehicleLogType = {
        ...vehicleEntry,
        vehicleLogId: `VL-${logs.length + 1}`,
        event: 'exit',
        timestamp: new Date().toISOString(),
      };

      setLogs([exitLog, ...logs]);
      onVehicleExit(exitLog);
    }
  };

  const columns = [
    { key: 'timestamp', label: 'Timestamp', width: '20%' },
    { key: 'vehicleRegNumber', label: 'Vehicle Reg', width: '15%' },
    { key: 'driverName', label: 'Driver', width: '15%' },
    { key: 'vehicleType', label: 'Type', width: '12%' },
    {
      key: 'event',
      label: 'Event',
      width: '12%',
      render: (value: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value === 'entry'
              ? 'bg-status-success/20 text-status-success'
              : 'bg-status-error/20 text-status-error'
          }`}
        >
          {value === 'entry' ? 'Entry' : 'Exit'}
        </span>
      ),
    },
    { key: 'dockAssignment', label: 'Dock', width: '12%' },
    { key: 'gatePassNumber', label: 'Gate Pass', width: '14%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Vehicle Entry & Exit Log</h2>
        <p className="text-sm text-muted-foreground mt-1">
          DRN: <span className="font-semibold">{dispatchRefNumber}</span> | Dock:{' '}
          <span className="font-semibold">{dockName}</span>
        </p>
      </div>

      {/* Vehicle Entry Section */}
      {!vehicleEntry ? (
        <div className="bg-card rounded-lg p-6 border border-border space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Truck className="w-5 h-5 text-accent" />
            Vehicle Entry
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g., ABC-1234"
                value={formData.vehicleRegNumber}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleRegNumber: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  errors.vehicleRegNumber
                    ? 'border-status-error bg-red-50'
                    : 'border-border bg-background'
                } focus:outline-none focus:ring-2 focus:ring-accent`}
              />
              {errors.vehicleRegNumber && (
                <p className="text-xs text-status-error mt-1">{errors.vehicleRegNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Vehicle Type
              </label>
              <select
                value={formData.vehicleType}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleType: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="semi-truck">Semi Truck</option>
                <option value="van">Van</option>
                <option value="pickup">Pickup Truck</option>
                <option value="container">Container</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Driver Name
              </label>
              <input
                type="text"
                placeholder="Enter driver name"
                value={formData.driverName}
                onChange={(e) =>
                  setFormData({ ...formData, driverName: e.target.value })
                }
                className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                  errors.driverName
                    ? 'border-status-error bg-red-50'
                    : 'border-border bg-background'
                } focus:outline-none focus:ring-2 focus:ring-accent`}
              />
              {errors.driverName && (
                <p className="text-xs text-status-error mt-1">{errors.driverName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contact Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="Enter contact number"
                value={formData.driverContact}
                onChange={(e) =>
                  setFormData({ ...formData, driverContact: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <ActionButton
              onClick={handleVehicleEntry}
              label="Record Vehicle Entry"
              variant="primary"
            />
          </div>
        </div>
      ) : (
        <div className="bg-status-success/10 rounded-lg p-6 border border-status-success/30 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Truck className="w-5 h-5 text-status-success" />
                Vehicle Loaded & Ready for Exit
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Vehicle {vehicleEntry.vehicleRegNumber} is loaded and ready for dispatch
              </p>
            </div>
            <StatusBadge status="completed" label="Ready for Exit" />
          </div>

          <div className="grid grid-cols-2 gap-4 bg-background rounded-lg p-4">
            <div>
              <p className="text-xs text-muted-foreground">Vehicle Registration</p>
              <p className="font-semibold text-foreground">{vehicleEntry.vehicleRegNumber}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Driver</p>
              <p className="font-semibold text-foreground">{vehicleEntry.driverName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Entry Time</p>
              <p className="font-semibold text-foreground">
                {new Date(vehicleEntry.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gate Pass</p>
              <p className="font-semibold text-foreground">{vehicleEntry.gatePassNumber}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end">
            <ActionButton
              onClick={handleVehicleExit}
              label="Record Vehicle Exit & Complete Dispatch"
              variant="primary"
              icon={Check}
            />
          </div>
        </div>
      )}

      {/* Vehicle Log Table */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          Recent Activity Log
        </h3>
        <div className="overflow-x-auto">
          <DataTable data={logs} columns={columns} searchKey="vehicleRegNumber" />
        </div>
      </div>
    </div>
  );
}
