'use client';

import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { OutboundRequest, OutboundItem, OrderType } from '@/types/outbound';
import { StatusBadge } from '@/components/inbound/shared/StatusBadge';
import { ActionButton } from '@/components/inbound/shared/ActionButton';

interface RequestCreationProps {
  onRequestSubmit: (request: OutboundRequest) => void;
}

export function RequestCreation({ onRequestSubmit }: RequestCreationProps) {
  const [orderType, setOrderType] = useState<OrderType>('sales-order');
  const [formData, setFormData] = useState({
    orderNumber: '',
    customerName: '',
    destinationLocation: '',
    notes: '',
  });
  const [items, setItems] = useState<OutboundItem[]>([
    {
      itemId: '1',
      sku: 'SKU-001',
      productName: 'Product A',
      quantity: 10,
      unit: 'units',
    },
    {
      itemId: '2',
      sku: 'SKU-002',
      productName: 'Product B',
      quantity: 5,
      unit: 'units',
    },
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddItem = () => {
    const newItem: OutboundItem = {
      itemId: String(items.length + 1),
      sku: '',
      productName: '',
      quantity: 0,
      unit: 'units',
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.itemId !== itemId));
  };

  const handleItemChange = (itemId: string, field: string, value: any) => {
    setItems(
      items.map((item) =>
        item.itemId === itemId ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderNumber.trim()) {
      newErrors.orderNumber = 'Order number is required';
    }
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.destinationLocation.trim()) {
      newErrors.destinationLocation = 'Destination location is required';
    }
    if (items.length === 0) {
      newErrors.items = 'At least one item is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const totalItems = items.length;
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

    const request: OutboundRequest = {
      requestId: `REQ-${Date.now()}`,
      orderNumber: formData.orderNumber,
      orderType,
      customerName: formData.customerName,
      destinationLocation: formData.destinationLocation,
      requestDate: new Date().toISOString(),
      status: 'pending',
      totalItems,
      totalUnits,
      notes: formData.notes,
      items,
    };

    onRequestSubmit(request);
    setErrors({});
  };

  return (
    <div className="space-y-6" suppressHydrationWarning>
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Create Outbound Request</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Initiate a new outbound order from sales order or transfer request
        </p>
      </div>

      {/* Order Type Selection */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <label className="block text-sm font-semibold text-foreground">Order Type</label>
        <div className="flex gap-3">
          {(['sales-order', 'transfer-order', 'return-order'] as OrderType[]).map(
            (type) => (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                suppressHydrationWarning
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  orderType === type
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary text-secondary-foreground hover:bg-border'
                }`}
              >
                {type === 'sales-order'
                  ? 'Sales Order'
                  : type === 'transfer-order'
                    ? 'Transfer Order'
                    : 'Return Order'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Request Details Form */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Request Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Order Number
            </label>
            <input
              type="text"
              placeholder="e.g., SO-2024-001"
              value={formData.orderNumber}
              onChange={(e) =>
                setFormData({ ...formData, orderNumber: e.target.value })
              }
              suppressHydrationWarning
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                errors.orderNumber
                  ? 'border-status-error bg-red-50'
                  : 'border-border bg-background'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            />
            {errors.orderNumber && (
              <p className="text-xs text-status-error mt-1">{errors.orderNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Customer/Warehouse"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              suppressHydrationWarning
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                errors.customerName
                  ? 'border-status-error bg-red-50'
                  : 'border-border bg-background'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            />
            {errors.customerName && (
              <p className="text-xs text-status-error mt-1">{errors.customerName}</p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Destination Location
            </label>
            <input
              type="text"
              placeholder="Enter destination location"
              value={formData.destinationLocation}
              onChange={(e) =>
                setFormData({ ...formData, destinationLocation: e.target.value })
              }
              suppressHydrationWarning
              className={`w-full px-3 py-2 rounded-lg border transition-colors ${
                errors.destinationLocation
                  ? 'border-status-error bg-red-50'
                  : 'border-border bg-background'
              } focus:outline-none focus:ring-2 focus:ring-accent`}
            />
            {errors.destinationLocation && (
              <p className="text-xs text-status-error mt-1">
                {errors.destinationLocation}
              </p>
            )}
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              placeholder="Add any additional notes or special instructions"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              suppressHydrationWarning
              className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-card rounded-lg p-6 border border-border space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Line Items</h3>
          <ActionButton
            onClick={handleAddItem}
            icon={Plus}
            label="Add Item"
            variant="secondary"
            suppressHydrationWarning
          />
        </div>

        {errors.items && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-status-error rounded-lg">
            <AlertCircle className="w-5 h-5 text-status-error" />
            <p className="text-sm text-status-error">{errors.items}</p>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.itemId}
              className="flex items-end gap-3 p-3 bg-secondary rounded-lg border border-border"
            >
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">SKU</label>
                <input
                  type="text"
                  value={item.sku}
                  onChange={(e) =>
                    handleItemChange(item.itemId, 'sku', e.target.value)
                  }
                  placeholder="SKU-001"
                  suppressHydrationWarning
                  className="w-full px-2 py-1 rounded border border-border text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Product Name
                </label>
                <input
                  type="text"
                  value={item.productName}
                  onChange={(e) =>
                    handleItemChange(item.itemId, 'productName', e.target.value)
                  }
                  placeholder="Product Name"
                  suppressHydrationWarning
                  className="w-full px-2 py-1 rounded border border-border text-sm"
                />
              </div>
              <div className="w-24">
                <label className="text-xs font-medium text-muted-foreground">
                  Quantity
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(item.itemId, 'quantity', parseInt(e.target.value) || 0)
                  }
                  suppressHydrationWarning
                  className="w-full px-2 py-1 rounded border border-border text-sm"
                />
              </div>
              <button
                onClick={() => handleRemoveItem(item.itemId)}
                suppressHydrationWarning
                className="p-2 text-muted-foreground hover:text-status-error transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-accent/10 rounded-lg p-4 flex justify-between items-center border border-accent/20">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Total Items: {items.length}</p>
          <p className="text-sm text-muted-foreground">
            Total Units: {items.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
        <StatusBadge status="pending" label="Pending Approval" />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <ActionButton
          onClick={handleSubmit}
          label="Submit Request"
          variant="primary"
          suppressHydrationWarning
        />
      </div>
    </div>
  );
}
