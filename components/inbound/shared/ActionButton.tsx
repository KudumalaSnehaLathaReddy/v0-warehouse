'use client';

import React from 'react';
import { LucideIcon, Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'destructive' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  tooltip?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-accent hover:bg-accent-secondary text-accent-foreground disabled:bg-gray-400 dark:disabled:bg-gray-600',
  secondary:
    'bg-secondary hover:bg-secondary/80 text-secondary-foreground disabled:bg-gray-200 dark:disabled:bg-gray-700',
  destructive:
    'bg-status-error hover:bg-red-600 text-white disabled:bg-gray-400 dark:disabled:bg-gray-600',
  outline:
    'border border-border hover:bg-muted text-foreground disabled:opacity-50 dark:disabled:opacity-30',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm gap-2',
  md: 'px-4 py-2 text-base gap-2',
  lg: 'px-6 py-3 text-base gap-3',
};

export const ActionButton: React.FC<ActionButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  tooltip,
  fullWidth = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${variantStyles[variant]} ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      title={tooltip}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
        </>
      )}
    </button>
  );
};
