'use client';

import React from 'react';
import { cn } from '@/cms/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCharCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className,
    label,
    error,
    helperText,
    resize = 'vertical',
    showCharCount = false,
    maxLength,
    id,
    value,
    ...props 
  }, ref) => {
    const inputId = id || 'textarea-field';
    const currentLength = typeof value === 'string' ? value.length : 0;
    
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative">
          <textarea
            id={inputId}
            className={cn(
              'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 shadow-sm transition-colors',
              'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              error && 'border-red-300 focus:border-red-500 focus:ring-red-500',
              resizeClasses[resize],
              className
            )}
            ref={ref}
            value={value}
            maxLength={maxLength}
            {...props}
          />
          
          {showCharCount && maxLength && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {currentLength}/{maxLength}
            </div>
          )}
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

Textarea.displayName = 'Textarea';

export { Textarea };
