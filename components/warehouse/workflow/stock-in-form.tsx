'use client';

import React, { useState } from 'react';
import { useWorkflow } from '@/context/workflow-context';

export const StockInForm: React.FC = () => {
  const { addStockInRequest } = useWorkflow();
  const [formData, setFormData] = useState({
    productId: '',
    productName: '',
    productSKU: '',
    quantity: '',
    receivedFrom: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.productSKU || !formData.quantity || !formData.receivedFrom) {
      alert('Please fill in all required fields');
      return;
    }

    const quantity = parseInt(formData.quantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      alert('Quantity must be a positive number');
      return;
    }

    addStockInRequest({
      productId: formData.productId || `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      productName: formData.productName,
      productSKU: formData.productSKU,
      quantity,
      receivedFrom: formData.receivedFrom,
    });

    setFormData({
      productId: '',
      productName: '',
      productSKU: '',
      quantity: '',
      receivedFrom: '',
    });

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Stock In Request</h2>

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
              placeholder="e.g., 100"
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Received From *</label>
            <input
              type="text"
              name="receivedFrom"
              value={formData.receivedFrom}
              onChange={handleChange}
              placeholder="e.g., Supplier ABC"
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
            Create Request
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
