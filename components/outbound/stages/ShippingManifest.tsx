'use client';

import { useState, useEffect } from 'react';
import { Check, Download, FileText } from 'lucide-react';
import { ShippingManifest as ManifestType, VehicleLog } from '@/types/outbound';
import { ActionButton } from '@/components/inbound/shared/ActionButton';
import { StatusBadge } from '@/components/inbound/shared/StatusBadge';
import { DataTable } from '@/components/inbound/shared/DataTable';
import { generateQRCodeDataUrl } from '@/lib/qr-utils';

interface ShippingManifestProps {
  dispatchRefNumber: string;
  vehicleLog: VehicleLog;
  totalPackages: number;
  onManifestFinalize: (manifest: ManifestType) => void;
}

export function ShippingManifest({
  dispatchRefNumber,
  vehicleLog,
  totalPackages,
  onManifestFinalize,
}: ShippingManifestProps) {
  const [manifest, setManifest] = useState<ManifestType | null>(null);
  const [manifestQRDataUrl, setManifestQRDataUrl] = useState<string | null>(null);

  // Auto-generate shipping manifest
  useEffect(() => {
    const gatePassNumber = `GP-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`;

    const newManifest: ManifestType = {
      manifestId: `MAN-${Date.now()}`,
      dispatchRefNumber,
      manifestDate: new Date().toISOString(),
      gatePassNumber,
      vehicleRegNumber: vehicleLog.vehicleRegNumber,
      driverName: vehicleLog.driverName,
      totalPackages,
      totalWeight: totalPackages * 25, // Assume 25kg per package
      destination: 'Regional Distribution Center',
      items: [
        {
          sku: 'SKU-001',
          productName: 'Product A',
          quantity: 50,
          packageNumber: 'PKG-001',
          batchNumber: 'BATCH-2024-001',
        },
        {
          sku: 'SKU-002',
          productName: 'Product B',
          quantity: 30,
          packageNumber: 'PKG-002',
          batchNumber: 'BATCH-2024-002',
        },
      ],
      qrCode: gatePassNumber,
      status: 'draft',
    };

    setManifest(newManifest);

    // Generate QR code for the manifest
    generateQRCodeDataUrl(gatePassNumber)
      .then((qrDataUrl) => {
        setManifestQRDataUrl(qrDataUrl);
      })
      .catch((error) => {
        console.error('Failed to generate manifest QR code:', error);
      });
  }, [dispatchRefNumber, vehicleLog, totalPackages]);

  const handleFinalizeManifest = () => {
    if (manifest) {
      onManifestFinalize({
        ...manifest,
        status: 'finalized',
      });
    }
  };

  const handleDownloadManifest = () => {
    if (manifest) {
      const manifestText = `
SHIPPING MANIFEST
================

Manifest ID: ${manifest.manifestId}
Gate Pass: ${manifest.gatePassNumber}
Dispatch Reference: ${manifest.dispatchRefNumber}
Date: ${new Date(manifest.manifestDate).toLocaleDateString()}

VEHICLE DETAILS
===============
Registration: ${manifest.vehicleRegNumber}
Driver: ${manifest.driverName}
Total Packages: ${manifest.totalPackages}
Total Weight: ${manifest.totalWeight} kg
Destination: ${manifest.destination}

ITEMS
=====
${manifest.items.map((item) => `SKU: ${item.sku} | Product: ${item.productName} | Qty: ${item.quantity} | Package: ${item.packageNumber}`).join('\n')}

Status: ${manifest.status}
`;

      const blob = new Blob([manifestText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Manifest-${manifest.manifestId}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  if (!manifest) {
    return <div className="text-center py-8">Generating shipping manifest...</div>;
  }

  const columns = [
    { key: 'sku', label: 'SKU', width: '15%' },
    { key: 'productName', label: 'Product Name', width: '25%' },
    { key: 'quantity', label: 'Quantity', width: '15%' },
    { key: 'packageNumber', label: 'Package #', width: '15%' },
    { key: 'batchNumber', label: 'Batch Number', width: '15%' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Shipping Manifest & Gate Pass</h2>
        <p className="text-sm text-muted-foreground mt-1">
          DRN: <span className="font-semibold">{dispatchRefNumber}</span>
        </p>
      </div>

      {/* Manifest Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Gate Pass Number</p>
          <p className="text-lg font-bold text-accent">{manifest.gatePassNumber}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Packages</p>
          <p className="text-lg font-bold text-foreground">{manifest.totalPackages}</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Total Weight</p>
          <p className="text-lg font-bold text-foreground">{manifest.totalWeight} kg</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border">
          <p className="text-xs text-muted-foreground mb-1">Status</p>
          <StatusBadge status="pending" label="Draft" />
        </div>
      </div>

      {/* Manifest QR Code Section */}
      <div className="bg-accent/10 rounded-lg p-6 border border-accent/20 space-y-4">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Gate Pass QR Code
        </h3>
        <div className="flex justify-center p-4 bg-background rounded-lg border border-border">
          {manifestQRDataUrl && (
            <img
              src={manifestQRDataUrl}
              alt="Manifest Gate Pass QR Code"
              className="w-64 h-64"
            />
          )}
        </div>
        <p className="text-sm text-center text-muted-foreground">
          Scan this QR code at the gate for vehicle exit authorization
        </p>
      </div>

      {/* Manifest Details */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Vehicle & Destination Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Vehicle Registration</p>
            <p className="text-lg font-semibold text-foreground">
              {manifest.vehicleRegNumber}
            </p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Driver Name</p>
            <p className="text-lg font-semibold text-foreground">{manifest.driverName}</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Destination</p>
            <p className="text-lg font-semibold text-foreground">{manifest.destination}</p>
          </div>
          <div className="bg-background rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Dispatch Reference</p>
            <p className="text-lg font-semibold text-foreground">{dispatchRefNumber}</p>
          </div>
        </div>
      </div>

      {/* Manifest Items */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Shipped Items</h3>
        <div className="overflow-x-auto">
          <DataTable data={manifest.items} columns={columns} searchKey="sku" />
        </div>
      </div>

      {/* Manifest Summary */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Manifest Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground text-sm">Manifest ID:</span>
            <span className="font-semibold text-foreground">{manifest.manifestId}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground text-sm">Manifest Date:</span>
            <span className="font-semibold text-foreground">
              {new Date(manifest.manifestDate).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground text-sm">Manifest Status:</span>
            <span
              className={`font-semibold ${
                manifest.status === 'draft' ? 'text-status-warning' : 'text-status-success'
              }`}
            >
              {manifest.status === 'draft' ? 'Draft' : 'Finalized'}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground text-sm">Total Line Items:</span>
            <span className="font-semibold text-foreground">{manifest.items.length}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          onClick={handleDownloadManifest}
          label="Download Manifest"
          variant="secondary"
          icon={Download}
        />
        <ActionButton
          onClick={handleFinalizeManifest}
          label="Finalize & Complete Dispatch"
          variant="primary"
          icon={Check}
        />
      </div>
    </div>
  );
}
