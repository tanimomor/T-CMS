'use client';

import React from 'react';
import { cn } from '@/cms/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-gray-500',
    white: 'text-white',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-200 border-t-current',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      {...props}
    />
  );
};

export interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
}

const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  color = 'primary',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-gray-500',
    white: 'bg-white',
  };

  return (
    <div className={cn('flex space-x-1', className)} {...props}>
      <div
        className={cn(
          'rounded-full animate-bounce',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn(
          'rounded-full animate-bounce',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn(
          'rounded-full animate-bounce',
          sizeClasses[size],
          colorClasses[color]
        )}
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
};

export interface LoadingSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: boolean;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = '1rem',
  rounded = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200',
        rounded ? 'rounded-full' : 'rounded',
        className
      )}
      style={{ width, height }}
      {...props}
    />
  );
};

export interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  message = 'Loading...',
  className,
  ...props
}) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className={cn('relative', className)} {...props}>
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="flex flex-col items-center space-y-2">
          <LoadingSpinner size="lg" />
          {message && (
            <p className="text-sm text-gray-600">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export interface LoadingPageProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

const LoadingPage: React.FC<LoadingPageProps> = ({
  message = 'Loading...',
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        'flex items-center justify-center min-h-screen bg-gray-50',
        className
      )}
      {...props}
    >
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        {message && (
          <p className="text-lg text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export {
  LoadingSpinner,
  LoadingDots,
  LoadingSkeleton,
  LoadingOverlay,
  LoadingPage,
};
