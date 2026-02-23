'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { DiscrepancyType, DamageSeverity } from '@/types/inbound';
import { ActionButton } from './ActionButton';

interface DiscrepancyFormProps {
  itemId: string;
  itemDescription: string;
  onSubmit: (data: DiscrepancyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface DiscrepancyFormData {
  itemId: string;
  type: DiscrepancyType;
  damageSeverity?: DamageSeverity;
  notes: string;
  photoUrl?: string;
}

export const DiscrepancyForm: React.FC<DiscrepancyFormProps> = ({
  itemId,
  itemDescription,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [type, setType] = useState<DiscrepancyType>('damaged');
  const [severity, setSeverity] = useState<DamageSeverity>('minor');
  const [notes, setNotes] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      itemId,
      type,
      damageSeverity: type === 'damaged' ? severity : undefined,
      notes,
      photoUrl: photoFile ? URL.createObjectURL(photoFile) : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Report Discrepancy</h2>
          <button
            onClick={onCancel}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Item Info */}
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground">Item</p>
            <p className="text-sm font-semibold text-foreground mt-1">{itemDescription}</p>
            <p className="text-xs text-muted-foreground mt-0.5">ID: {itemId}</p>
          </div>

          {/* Discrepancy Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Discrepancy Type <span className="text-status-error">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as DiscrepancyType)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="damaged">Damaged</option>
              <option value="missing">Missing</option>
              <option value="quantity-mismatch">Quantity Mismatch</option>
            </select>
          </div>

          {/* Damage Severity (conditional) */}
          {type === 'damaged' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Damage Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as DamageSeverity)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="minor">Minor Damage</option>
                <option value="major">Major Damage</option>
                <option value="complete-loss">Complete Loss</option>
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes <span className="text-status-error">*</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe the discrepancy in detail..."
              required
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{notes.length}/500 characters</p>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Photo Evidence (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:bg-accent file:text-accent-foreground file:cursor-pointer hover:file:bg-accent-secondary"
            />
            {photoFile && (
              <p className="text-xs text-status-success mt-1 flex items-center gap-1">
                ✓ {photoFile.name}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <ActionButton variant="outline" onClick={onCancel} fullWidth disabled={loading}>
              Cancel
            </ActionButton>
            <ActionButton type="submit" variant="primary" loading={loading} fullWidth>
              Report
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
};
