'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/cms/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    options,
    placeholder,
    size = 'md',
    leftIcon,
    id,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-3',
      lg: 'h-12 px-4 text-lg',
    };

    const iconSizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              <div className={iconSizeClasses[size]}>
                {leftIcon}
              </div>
            </div>
          )}
          
          <select
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors',
              'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              leftIcon && 'pl-10',
              'pr-10', // Always add right padding for the chevron
              sizeClasses[size],
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            <ChevronDown className={iconSizeClasses[size]} />
          </div>
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
