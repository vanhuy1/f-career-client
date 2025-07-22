'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showHomeButton?: boolean;
  showReloadButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  showHomeButton = true,
  showReloadButton = true,
  size = 'md',
  className = '',
}) => {
  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
  };

  const iconSizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const containerSizes = {
    sm: 'h-12 w-12',
    md: 'h-16 w-16',
    lg: 'h-20 w-20',
  };

  return (
    <div
      className={`flex min-h-[400px] items-center justify-center p-4 ${className}`}
    >
      <Card className={`w-full ${sizeClasses[size]} border-red-200 shadow-lg`}>
        <CardHeader className="text-center">
          <div
            className={`mx-auto mb-4 flex ${containerSizes[size]} items-center justify-center rounded-full bg-red-100`}
          >
            <AlertTriangle className={`${iconSizes[size]} text-red-600`} />
          </div>
          <CardTitle
            className={`${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}
          >
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">{message}</p>
            {error && process.env.NODE_ENV === 'development' && (
              <p className="mt-2 font-mono text-xs text-red-500">
                {error.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            {resetError && (
              <Button
                onClick={resetError}
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            {showReloadButton && (
              <Button
                onClick={handleReload}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reload
              </Button>
            )}
            {showHomeButton && (
              <Button
                onClick={handleGoHome}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Compact version for smaller spaces
export const ErrorFallbackCompact: React.FC<ErrorFallbackProps> = (props) => {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">
            {props.title || 'Error'}
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            {props.message || 'Something went wrong'}
          </p>
        </div>
        {props.resetError && (
          <Button onClick={props.resetError} size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
