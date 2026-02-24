'use client';

import React, { useState } from 'react';
import { useWorkflow } from '@/context/workflow-context';

export const StockOutForm: React.FC = () => {
  const { addStockOutRequest } = useWorkflow();
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    productSKU: '',
    quantity: '',
    destination: '',
    reason: 'sale' as const,
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.productSKU || !formData.quantity || !formData.destination) {
      alert('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Quantity must be a positive number');
      return;
    }

    addStockOutRequest({
      productId: formData.productId || `prod-${Date.now()}`,
      productName: formData.productName,
      productSKU: formData.productSKU,
      quantity,
      destination: formData.destination,
      reason: formData.reason,
    });

    setFormData({
      productId: '',
      productName: '',
      productSKU: '',
      quantity: '',
      destination: '',
      reason: 'sale',
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Stock Out Request</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="e.g., Widget A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product SKU *</label>
            <input
              type="text"
              name="productSKU"
              value={formData.productSKU}
              onChange={handleChange}
              placeholder="e.g., SKU-001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="e.g., 50"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
            <select
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sale">Sale</option>
              <option value="return">Return</option>
              <option value="damage">Damage</option>
              <option value="relocation">Relocation</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g., Customer ABC or Warehouse B"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product ID (optional)</label>
          <input
            type="text"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            placeholder="Auto-generated if empty"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          >
            Create Stock Out Request
          </button>
          {submitted && (
            <span className="text-green-600 text-sm font-medium flex items-center">
              Request created successfully!
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
