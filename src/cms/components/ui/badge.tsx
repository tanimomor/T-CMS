'use client';

import React from 'react';
import { cn } from '@/cms/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  rounded = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        roundedClasses,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export { Badge };
