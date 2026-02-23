'use client';

import React, { useState, useEffect } from 'react';
import { GatePass } from '@/types/inbound';
import { ActionButton } from '../shared/ActionButton';
import { ArrowRight, Printer, TrendingUp, TrendingDown } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import QRCode from 'qrcode.react';

interface GateLogisticsProps {
  grnNumber: string;
  onSubmit: (entryPass: GatePass, exitPass?: GatePass) => void;
  loading?: boolean;
}

const generatePassId = (type: 'entry' | 'exit') => {
  const prefix = type === 'entry' ? 'ENT' : 'EXT';
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

const vehicleTypes = ['Truck', 'Van', 'Lorry', 'Flatbed', 'Container Truck'];

export const GateLogistics: React.FC<GateLogisticsProps> = ({
  grnNumber,
  onSubmit,
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState<'entry' | 'exit'>('entry');
  const [entryPassGenerated, setEntryPassGenerated] = useState(false);
  const [exitPassGenerated, setExitPassGenerated] = useState(false);

  // Entry Pass Form
  const [entryFormData, setEntryFormData] = useState({
    vehicleRegNumber: '',
    driverName: '',
    vehicleType: 'Truck',
  });
  const [entryPass, setEntryPass] = useState<GatePass | null>(null);
  const [entryErrors, setEntryErrors] = useState<Record<string, string>>({});

  // Exit Pass Form
  const [exitFormData, setExitFormData] = useState({
    unloadConfirmed: false,
  });
  const [exitPass, setExitPass] = useState<GatePass | null>(null);

  // Generate Entry Pass
  const handleGenerateEntryPass = () => {
    const newErrors: Record<string, string> = {};

    if (!entryFormData.vehicleRegNumber.trim()) {
      newErrors.vehicleRegNumber = 'Registration number is required';
    }
    if (!entryFormData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setEntryErrors(newErrors);
      return;
    }

    const passId = generatePassId('entry');
    const newEntryPass: GatePass = {
      passId,
      passType: 'entry',
      vehicleRegNumber: entryFormData.vehicleRegNumber,
      driverName: entryFormData.driverName,
      vehicleType: entryFormData.vehicleType,
      timestamp: new Date().toISOString(),
      qrCode: `${passId}|${grnNumber}|ENTRY|${new Date().getTime()}`,
    };

    setEntryPass(newEntryPass);
    setEntryPassGenerated(true);
    setEntryErrors({});
  };

  // Generate Exit Pass
  const handleGenerateExitPass = () => {
    if (!exitFormData.unloadConfirmed) {
      return;
    }

    const passId = generatePassId('exit');
    const newExitPass: GatePass = {
      passId,
      passType: 'exit',
      vehicleRegNumber: entryFormData.vehicleRegNumber,
      driverName: entryFormData.driverName,
      vehicleType: entryFormData.vehicleType,
      timestamp: new Date().toISOString(),
      qrCode: `${passId}|${grnNumber}|EXIT|${new Date().getTime()}`,
    };

    setExitPass(newExitPass);
    setExitPassGenerated(true);
  };

  // Submit both passes
  const handleSubmit = () => {
    if (!entryPass) return;
    onSubmit(entryPass, exitPass || undefined);
  };

  const canProceed = entryPassGenerated && exitPassGenerated;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Gate Logistics & Vehicle Passes</h2>
        <p className="text-muted-foreground">
          Generate entry and exit passes for vehicle management at the warehouse gate
        </p>
      </div>

      {/* GRN Display */}
      <div className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase">Associated GRN</p>
          <p className="text-lg font-mono font-bold text-foreground mt-1">{grnNumber}</p>
        </div>
        <StatusBadge status="in-progress" size="sm" />
      </div>

      {/* Entry Pass Section */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-accent" />
            <span>Vehicle Entry Pass</span>
          </h3>
          {entryPassGenerated && <StatusBadge status="completed" size="sm" />}
        </div>

        {!entryPassGenerated ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Registration <span className="text-status-error">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., ABC-1234"
                  value={entryFormData.vehicleRegNumber}
                  onChange={(e) => {
                    setEntryFormData((prev) => ({ ...prev, vehicleRegNumber: e.target.value }));
                    if (entryErrors.vehicleRegNumber) setEntryErrors({});
                  }}
                  className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                    entryErrors.vehicleRegNumber ? 'border-status-error' : 'border-border'
                  }`}
                />
                {entryErrors.vehicleRegNumber && (
                  <p className="text-xs text-status-error mt-1">{entryErrors.vehicleRegNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Vehicle Type <span className="text-status-error">*</span>
                </label>
                <select
                  value={entryFormData.vehicleType}
                  onChange={(e) =>
                    setEntryFormData((prev) => ({ ...prev, vehicleType: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Driver Name <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter driver's full name"
                value={entryFormData.driverName}
                onChange={(e) => {
                  setEntryFormData((prev) => ({ ...prev, driverName: e.target.value }));
                  if (entryErrors.driverName) setEntryErrors({});
                }}
                className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  entryErrors.driverName ? 'border-status-error' : 'border-border'
                }`}
              />
              {entryErrors.driverName && (
                <p className="text-xs text-status-error mt-1">{entryErrors.driverName}</p>
              )}
            </div>

            <ActionButton
              onClick={handleGenerateEntryPass}
              variant="primary"
              fullWidth
            >
              Generate Entry Pass
            </ActionButton>
          </div>
        ) : (
          entryPass && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Pass ID</p>
                    <p className="font-mono text-foreground mt-1">{entryPass.passId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Vehicle</p>
                    <p className="text-foreground mt-1">{entryPass.vehicleRegNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Driver</p>
                    <p className="text-foreground mt-1">{entryPass.driverName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Time</p>
                    <p className="text-sm text-foreground mt-1">
                      {new Date(entryPass.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
                <QRCode value={entryPass.qrCode} size={256} level="H" includeMargin={true} />
              </div>

              <ActionButton
                variant="outline"
                icon={Printer}
                fullWidth
                onClick={() => window.print()}
              >
                Print Entry Pass
              </ActionButton>
            </div>
          )
        )}
      </div>

      {/* Exit Pass Section */}
      {entryPassGenerated && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-secondary" />
              <span>Vehicle Exit Pass</span>
            </h3>
            {exitPassGenerated && <StatusBadge status="completed" size="sm" />}
          </div>

          {!exitPassGenerated ? (
            <div className="space-y-4">
              <div className="p-4 bg-status-info/10 border border-status-info/30 rounded-lg">
                <p className="text-sm text-status-info font-medium">All items must be unloaded before exit pass generation</p>
              </div>

              <label className="flex items-center gap-3 p-4 rounded-lg border border-border cursor-pointer hover:bg-muted/50 transition-colors">
                <input
                  type="checkbox"
                  checked={exitFormData.unloadConfirmed}
                  onChange={(e) =>
                    setExitFormData((prev) => ({ ...prev, unloadConfirmed: e.target.checked }))
                  }
                  className="w-4 h-4 rounded accent-accent"
                />
                <span className="text-sm font-medium text-foreground">
                  I confirm all items have been unloaded and inspected
                </span>
              </label>

              <ActionButton
                onClick={handleGenerateExitPass}
                variant="primary"
                disabled={!exitFormData.unloadConfirmed}
                fullWidth
              >
                Generate Exit Pass
              </ActionButton>
            </div>
          ) : (
            exitPass && (
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Pass ID</p>
                      <p className="font-mono text-foreground mt-1">{exitPass.passId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Vehicle</p>
                      <p className="text-foreground mt-1">{exitPass.vehicleRegNumber}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Driver</p>
                      <p className="text-foreground mt-1">{exitPass.driverName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Time</p>
                      <p className="text-sm text-foreground mt-1">
                        {new Date(exitPass.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
                  <QRCode value={exitPass.qrCode} size={256} level="H" includeMargin={true} />
                </div>

                <ActionButton
                  variant="outline"
                  icon={Printer}
                  fullWidth
                  onClick={() => window.print()}
                >
                  Print Exit Pass
                </ActionButton>
              </div>
            )
          )}
        </div>
      )}

      {/* Continue Button */}
      {canProceed && (
        <ActionButton
          onClick={handleSubmit}
          variant="primary"
          loading={loading}
          icon={ArrowRight}
          iconPosition="right"
          fullWidth
        >
          Both Passes Complete - Continue to Unloading
        </ActionButton>
      )}
    </div>
  );
};
