'use client';

import React, { useState, useEffect } from 'react';
import { GatePass } from '@/types/inbound';
import { ActionButton } from '../shared/ActionButton';
import { ArrowRight, Printer, TrendingUp, TrendingDown } from 'lucide-react';
import { StatusBadge } from '../shared/StatusBadge';
import { generateQRCodeDataUrl } from '@/lib/qr-utils';

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
  // Entry Pass Form
  const [entryFormData, setEntryFormData] = useState({
    vehicleRegNumber: '',
    driverName: '',
    vehicleType: 'Truck',
  });
  const [entryPass, setEntryPass] = useState<GatePass | null>(null);
  const [entryErrors, setEntryErrors] = useState<Record<string, string>>({});
  const [entryQRDataUrl, setEntryQRDataUrl] = useState<string | null>(null);
  const [entryPassGenerated, setEntryPassGenerated] = useState(false);

  // Exit Pass Form
  const [exitFormData, setExitFormData] = useState({
    unloadConfirmed: false,
  });
  const [exitPass, setExitPass] = useState<GatePass | null>(null);
  const [exitQRDataUrl, setExitQRDataUrl] = useState<string | null>(null);
  const [exitPassGenerated, setExitPassGenerated] = useState(false);

  // Generate Entry Pass
  const handleGenerateEntryPass = async () => {
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
    const qrContent = `${passId}|${grnNumber}|ENTRY|${new Date().getTime()}`;
    
    const newEntryPass: GatePass = {
      passId,
      passType: 'entry',
      vehicleRegNumber: entryFormData.vehicleRegNumber,
      driverName: entryFormData.driverName,
      vehicleType: entryFormData.vehicleType,
      timestamp: new Date().toISOString(),
      qrCode: qrContent,
    };

    try {
      const qrDataUrl = await generateQRCodeDataUrl(qrContent);
      setEntryQRDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }

    setEntryPass(newEntryPass);
    setEntryPassGenerated(true);
    setEntryErrors({});
  };

  // Generate Exit Pass
  const handleGenerateExitPass = async () => {
    if (!exitFormData.unloadConfirmed) {
      return;
    }

    const passId = generatePassId('exit');
    const qrContent = `${passId}|${grnNumber}|EXIT|${new Date().getTime()}`;
    
    const newExitPass: GatePass = {
      passId,
      passType: 'exit',
      vehicleRegNumber: entryFormData.vehicleRegNumber,
      driverName: entryFormData.driverName,
      vehicleType: entryFormData.vehicleType,
      timestamp: new Date().toISOString(),
      qrCode: qrContent,
    };

    try {
      const qrDataUrl = await generateQRCodeDataUrl(qrContent);
      setExitQRDataUrl(qrDataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }

    setExitPass(newExitPass);
    setExitPassGenerated(true);
  };

  const handleSubmit = () => {
    if (entryPass && exitPass) {
      onSubmit(entryPass, exitPass);
    } else if (entryPass) {
      onSubmit(entryPass);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gate Logistics</h2>
        <p className="text-muted-foreground">Generate vehicle entry and exit passes for GRN {grnNumber}</p>
      </div>

      {/* Entry Pass Section */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Vehicle Entry Pass
          </h3>
        </div>

        {!entryPassGenerated ? (
          <div className="space-y-4">
            {/* Vehicle Registration */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Vehicle Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g., KA01AB1234"
                value={entryFormData.vehicleRegNumber}
                onChange={(e) =>
                  setEntryFormData({
                    ...entryFormData,
                    vehicleRegNumber: e.target.value.toUpperCase(),
                  })
                }
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
                  entryErrors.vehicleRegNumber ? 'border-status-error' : 'border-border'
                }`}
              />
              {entryErrors.vehicleRegNumber && (
                <p className="text-sm text-status-error mt-1">{entryErrors.vehicleRegNumber}</p>
              )}
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Driver Name
              </label>
              <input
                type="text"
                placeholder="Enter driver name"
                value={entryFormData.driverName}
                onChange={(e) =>
                  setEntryFormData({
                    ...entryFormData,
                    driverName: e.target.value,
                  })
                }
                className={`w-full px-4 py-2.5 rounded-lg border bg-background text-foreground ${
                  entryErrors.driverName ? 'border-status-error' : 'border-border'
                }`}
              />
              {entryErrors.driverName && (
                <p className="text-sm text-status-error mt-1">{entryErrors.driverName}</p>
              )}
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Vehicle Type
              </label>
              <select
                value={entryFormData.vehicleType}
                onChange={(e) =>
                  setEntryFormData({
                    ...entryFormData,
                    vehicleType: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground"
              >
                {vehicleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <ActionButton
              onClick={handleGenerateEntryPass}
              label="Generate Entry Pass"
              variant="primary"
              icon={ArrowRight}
              disabled={loading}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Entry Pass Details */}
            <div className="bg-background rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pass ID</p>
                  <p className="font-mono font-semibold text-foreground">{entryPass?.passId}</p>
                </div>
                <StatusBadge status="success" label="Generated" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Vehicle Registration</p>
                  <p className="text-foreground">{entryPass?.vehicleRegNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Driver Name</p>
                  <p className="text-foreground">{entryPass?.driverName}</p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
              {entryQRDataUrl && (
                <img src={entryQRDataUrl} alt="Entry Pass QR Code" className="w-64 h-64" />
              )}
            </div>

            <div className="flex gap-2">
              <ActionButton
                onClick={() => window.print()}
                label="Print Pass"
                variant="secondary"
                icon={Printer}
              />
              <ActionButton
                onClick={() => {
                  setEntryPassGenerated(false);
                  setEntryFormData({ vehicleRegNumber: '', driverName: '', vehicleType: 'Truck' });
                  setEntryErrors({});
                  setEntryQRDataUrl(null);
                }}
                label="Create Another"
                variant="secondary"
              />
            </div>
          </div>
        )}
      </div>

      {/* Exit Pass Section */}
      {entryPassGenerated && (
        <div className="bg-card rounded-lg border border-border p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-accent-secondary" />
              Vehicle Exit Pass
            </h3>
          </div>

          {!exitPassGenerated ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-status-info/10 border border-status-info/30 rounded-lg">
                <input
                  type="checkbox"
                  checked={exitFormData.unloadConfirmed}
                  onChange={(e) =>
                    setExitFormData({
                      ...exitFormData,
                      unloadConfirmed: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded"
                />
                <label className="text-sm text-foreground cursor-pointer">
                  Confirm that all items have been unloaded and inspected
                </label>
              </div>

              <ActionButton
                onClick={handleGenerateExitPass}
                label="Generate Exit Pass"
                variant="primary"
                icon={ArrowRight}
                disabled={!exitFormData.unloadConfirmed || loading}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Exit Pass Details */}
              <div className="bg-background rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Pass ID</p>
                    <p className="font-mono font-semibold text-foreground">{exitPass?.passId}</p>
                  </div>
                  <StatusBadge status="success" label="Generated" />
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center p-4 bg-white rounded-lg border border-border">
                {exitQRDataUrl && (
                  <img src={exitQRDataUrl} alt="Exit Pass QR Code" className="w-64 h-64" />
                )}
              </div>

              <div className="flex gap-2">
                <ActionButton
                  onClick={() => window.print()}
                  label="Print Pass"
                  variant="secondary"
                  icon={Printer}
                />
                <ActionButton
                  onClick={() => {
                    setExitPassGenerated(false);
                    setExitFormData({ unloadConfirmed: false });
                    setExitQRDataUrl(null);
                  }}
                  label="Create Another"
                  variant="secondary"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Submit Button */}
      {entryPassGenerated && exitPassGenerated && (
        <ActionButton
          onClick={handleSubmit}
          label="Complete Gate Logistics"
          variant="primary"
          icon={ArrowRight}
          disabled={loading}
        />
      )}
    </div>
  );
};
