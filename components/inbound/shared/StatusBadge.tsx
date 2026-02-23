'use client';

import React from 'react';
import { Check, AlertCircle, Clock, X } from 'lucide-react';

type StatusType = 'pending' | 'in-progress' | 'approved' | 'rejected' | 'completed' | 'issues' | 'ok' | 'damaged' | 'missing';

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const statusConfig: Record<StatusType, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  pending: {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    icon: <Clock className="w-4 h-4" />,
    label: 'Pending',
  },
  'in-progress': {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    icon: <Clock className="w-4 h-4" />,
    label: 'In Progress',
  },
  approved: {
    bg: 'bg-status-success/10',
    text: 'text-status-success dark:text-status-success',
    icon: <Check className="w-4 h-4" />,
    label: 'Approved',
  },
  rejected: {
    bg: 'bg-status-error/10',
    text: 'text-status-error dark:text-status-error',
    icon: <X className="w-4 h-4" />,
    label: 'Rejected',
  },
  completed: {
    bg: 'bg-status-success/10',
    text: 'text-status-success dark:text-status-success',
    icon: <Check className="w-4 h-4" />,
    label: 'Completed',
  },
  issues: {
    bg: 'bg-status-warning/10',
    text: 'text-status-warning dark:text-status-warning',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Issues Found',
  },
  ok: {
    bg: 'bg-status-success/10',
    text: 'text-status-success dark:text-status-success',
    icon: <Check className="w-4 h-4" />,
    label: 'OK',
  },
  damaged: {
    bg: 'bg-status-error/10',
    text: 'text-status-error dark:text-status-error',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Damaged',
  },
  missing: {
    bg: 'bg-status-warning/10',
    text: 'text-status-warning dark:text-status-warning',
    icon: <AlertCircle className="w-4 h-4" />,
    label: 'Missing',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', showIcon = true }) => {
  const config = statusConfig[status];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-medium ${config.bg} ${config.text} ${sizeClasses[size]}`}>
      {showIcon && config.icon}
      <span>{config.label}</span>
    </div>
  );
};
