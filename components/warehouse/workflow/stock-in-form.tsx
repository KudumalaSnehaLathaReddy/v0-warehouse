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
    <div className="w-full bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 shadow-sm p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Tell us about the new items</h2>
        <p className="text-sm text-gray-600 mt-1">Fill in the details of the products you're receiving</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">What is the product name?</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="Example: Metal Chair, Wooden Table, etc."
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-base"
          />
          <p className="text-xs text-gray-500 mt-1">Give it a simple, easy-to-remember name</p>
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
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-base"
          />
          <p className="text-xs text-gray-500 mt-1">A unique identifier to track this product</p>
        </div>

        {/* Quantity */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">How many items are you receiving?</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Example: 50, 100, 500"
            min="1"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-base"
          />
          <p className="text-xs text-gray-500 mt-1">Enter the total number of units</p>
        </div>

        {/* Received From */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="text-sm font-semibold text-gray-800">Who sent these items?</label>
            <span className="text-red-500">*</span>
          </div>
          <input
            type="text"
            name="receivedFrom"
            value={formData.receivedFrom}
            onChange={handleChange}
            placeholder="Example: Supplier ABC, Factory XYZ, Vendor Name"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition text-base"
          />
          <p className="text-xs text-gray-500 mt-1">The supplier or warehouse sending the products</p>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-sm text-base"
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
