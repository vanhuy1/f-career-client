'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.ComponentProps<'input'> {
  icon?: LucideIcon;
  error?: string;
  testId?: string;
  onChangeValue?: (value: string) => void;
}

function Input({
  className,
  type,
  icon: Icon,
  error,
  testId,
  onChangeValue,
  onChange,
  ...props
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChangeValue) {
      onChangeValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {Icon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <input
          type={type}
          data-testid={testId}
          className={cn(
            'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
            Icon && 'pl-10',
            error && 'border-destructive focus-visible:ring-destructive',
            className,
          )}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && <p className="text-destructive text-sm font-medium">{error}</p>}
    </div>
  );
}

export { Input };
