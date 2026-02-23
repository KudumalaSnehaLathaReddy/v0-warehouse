'use client';

import React, { useState } from 'react';
import { RequestData } from '@/types/inbound';
import { ActionButton } from '../shared/ActionButton';
import { ArrowRight, Plus } from 'lucide-react';

interface RequestCreationProps {
  onSubmit: (data: RequestData) => void;
  loading?: boolean;
}

const mockSuppliers = [
  { id: 'SUP001', name: 'Global Manufacturing Co.' },
  { id: 'SUP002', name: 'Premium Supply Chain' },
  { id: 'SUP003', name: 'Express Logistics Ltd.' },
  { id: 'SUP004', name: 'Quality Parts Distribution' },
];

const generateRequestId = () => {
  return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

export const RequestCreation: React.FC<RequestCreationProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    supplierId: '',
    supplierName: '',
    purchaseOrderNumber: '',
    expectedQuantity: '',
    unitOfMeasure: 'units',
    arrivalDateTime: '',
    specialInstructions: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSupplierChange = (id: string) => {
    const supplier = mockSuppliers.find((s) => s.id === id);
    setFormData((prev) => ({
      ...prev,
      supplierId: id,
      supplierName: supplier?.name || '',
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.supplierId) newErrors.supplierId = 'Please select a supplier';
    if (!formData.purchaseOrderNumber) newErrors.purchaseOrderNumber = 'PO number is required';
    if (!formData.expectedQuantity || Number(formData.expectedQuantity) <= 0)
      newErrors.expectedQuantity = 'Quantity must be greater than 0';
    if (!formData.arrivalDateTime) newErrors.arrivalDateTime = 'Arrival date & time is required';

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const requestId = generateRequestId();

    onSubmit({
      requestId,
      supplierId: formData.supplierId,
      supplierName: formData.supplierName,
      purchaseOrderNumber: formData.purchaseOrderNumber,
      expectedQuantity: Number(formData.expectedQuantity),
      unitOfMeasure: formData.unitOfMeasure,
      arrivalDateTime: formData.arrivalDateTime,
      specialInstructions: formData.specialInstructions,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">Create Stock-In Request</h2>
        <p className="text-muted-foreground">
          Initiate a new inbound shipment by providing supplier and item details
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Selection */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
              1
            </div>
            Supplier Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Select Supplier <span className="text-status-error">*</span>
            </label>
            <select
              value={formData.supplierId}
              onChange={(e) => handleSupplierChange(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
                errors.supplierId ? 'border-status-error' : 'border-border'
              }`}
            >
              <option value="">Choose a supplier...</option>
              {mockSuppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.id})
                </option>
              ))}
            </select>
            {errors.supplierId && <p className="text-xs text-status-error mt-1">{errors.supplierId}</p>}
          </div>
        </div>

        {/* Purchase Order Details */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
              2
            </div>
            Purchase Order Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PO Number <span className="text-status-error">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., PO-2024-001234"
                value={formData.purchaseOrderNumber}
                onChange={(e) => setFormData((prev) => ({ ...prev, purchaseOrderNumber: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.purchaseOrderNumber ? 'border-status-error' : 'border-border'
                }`}
              />
              {errors.purchaseOrderNumber && (
                <p className="text-xs text-status-error mt-1">{errors.purchaseOrderNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Arrival Date & Time <span className="text-status-error">*</span>
              </label>
              <input
                type="datetime-local"
                value={formData.arrivalDateTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, arrivalDateTime: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.arrivalDateTime ? 'border-status-error' : 'border-border'
                }`}
              />
              {errors.arrivalDateTime && (
                <p className="text-xs text-status-error mt-1">{errors.arrivalDateTime}</p>
              )}
            </div>
          </div>
        </div>

        {/* Item Details */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">
              3
            </div>
            Item Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Expected Quantity <span className="text-status-error">*</span>
              </label>
              <input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.expectedQuantity}
                onChange={(e) => setFormData((prev) => ({ ...prev, expectedQuantity: e.target.value }))}
                className={`w-full px-4 py-2.5 rounded-lg border text-foreground bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent ${
                  errors.expectedQuantity ? 'border-status-error' : 'border-border'
                }`}
              />
              {errors.expectedQuantity && (
                <p className="text-xs text-status-error mt-1">{errors.expectedQuantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Unit of Measure
              </label>
              <select
                value={formData.unitOfMeasure}
                onChange={(e) => setFormData((prev) => ({ ...prev, unitOfMeasure: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-foreground bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="units">Units</option>
                <option value="boxes">Boxes</option>
                <option value="pallets">Pallets</option>
                <option value="kg">Kilograms</option>
                <option value="liters">Liters</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Special Instructions (Optional)
            </label>
            <textarea
              placeholder="e.g., Fragile items, requires temperature control, handle with care..."
              value={formData.specialInstructions}
              onChange={(e) => setFormData((prev) => ({ ...prev, specialInstructions: e.target.value }))}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-foreground bg-background text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
          </div>
        </div>

        {/* Request Preview */}
        {formData.supplierId && (
          <div className="bg-status-info/10 border border-status-info/30 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium text-status-info">Request Summary</p>
            <div className="text-sm text-foreground space-y-1">
              <p>
                <span className="font-medium">Supplier:</span> {formData.supplierName}
              </p>
              <p>
                <span className="font-medium">PO Number:</span> {formData.purchaseOrderNumber || 'Not provided'}
              </p>
              <p>
                <span className="font-medium">Expected Qty:</span> {formData.expectedQuantity || 'Not specified'} {formData.unitOfMeasure}
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <ActionButton
            type="submit"
            variant="primary"
            loading={loading}
            icon={ArrowRight}
            iconPosition="right"
            fullWidth
          >
            Create Request & Continue
          </ActionButton>
        </div>
      </form>
    </div>
  );
};
