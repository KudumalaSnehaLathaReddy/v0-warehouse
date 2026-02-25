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
    <div className="w-full bg-gradient-to-br from-orange-50 to-white rounded-lg border border-orange-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Send items out of the warehouse</h2>
        <p className="text-sm text-gray-600 mt-1">Tell us which items you need to remove and where they're going</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">Which product?</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Example: Metal Chair, Wooden Table, etc."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-base"
          />
        </div>

        {/* Product SKU */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">Product code (SKU)</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            name="productSKU"
            value={formData.productSKU}
            onChange={handleChange}
            placeholder="Example: SKU-001, or any unique code"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-base"
          />
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">How many items to send out?</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Example: 10, 25, 50"
            min="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-base"
          />
        </div>

        {/* Reason */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">Why are you sending them out?</label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'sale', label: 'Selling (Sale)', icon: '🛒' },
              { value: 'return', label: 'Customer Return' },
              { value: 'damage', label: 'Damaged Items', icon: '⚠️' },
              { value: 'relocation', label: 'Moving to another place', icon: '📦' },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition ${
                  formData.reason === option.value
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={option.value}
                  checked={formData.reason === option.value}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Destination */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">Where are they going?</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Example: John's Store, Customer ABC, Warehouse B"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition text-base"
          />
          <p className="text-xs text-gray-500 mt-1">The person or place receiving these items</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-sm text-base"
          >
            Submit Request
          </button>
          {submitted && (
            <div className="flex-1 flex items-center justify-center bg-green-50 border-2 border-green-300 rounded-lg">
              <span className="text-green-700 text-sm font-semibold">✓ Successfully submitted!</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
