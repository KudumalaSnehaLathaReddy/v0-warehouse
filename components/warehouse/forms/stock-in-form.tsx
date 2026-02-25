import { useState } from "react";
import type { StockInRequest } from "../types";

interface StockInFormProps {
  onSubmit: (request: Omit<StockInRequest, "id" | "createdAt" | "status">) => void;
  onClose?: () => void;
}

export function StockInForm({ onSubmit, onClose }: StockInFormProps) {
  const [formData, setFormData] = useState({
    productName: "",
    productSKU: "",
    productQuantity: 0,
    receivedFrom: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.productName || !formData.productSKU || formData.productQuantity <= 0 || !formData.receivedFrom) {
      alert("Please fill in all required fields");
      return;
    }

    onSubmit({
      productName: formData.productName,
      productSKU: formData.productSKU,
      productQuantity: formData.productQuantity,
      receivedFrom: formData.receivedFrom,
    });

    setSubmitted(true);
    setFormData({ productName: "", productSKU: "", productQuantity: 0, receivedFrom: "" });
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div>
        <h3 className="text-sm font-semibold text-card-foreground mb-3">Create Stock In Request</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Product Name *
          </label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            placeholder="e.g., Widget A"
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Product SKU *
          </label>
          <input
            type="text"
            name="productSKU"
            value={formData.productSKU}
            onChange={handleChange}
            placeholder="e.g., SKU-001"
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Quantity *
          </label>
          <input
            type="number"
            name="productQuantity"
            value={formData.productQuantity}
            onChange={handleChange}
            placeholder="e.g., 100"
            min="1"
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">
            Received From *
          </label>
          <input
            type="text"
            name="receivedFrom"
            value={formData.receivedFrom}
            onChange={handleChange}
            placeholder="e.g., Supplier ABC"
            className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition"
          >
            Submit Request
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm font-medium border border-input text-foreground rounded-md hover:bg-accent transition"
            >
              Cancel
            </button>
          )}
        </div>

        {submitted && (
          <div className="text-xs text-green-600 font-medium">
            ✓ Request created successfully!
          </div>
        )}
      </form>
    </div>
  );
}
