'use client';

import type * as React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ComponentProps<typeof ShadcnButton> {
  isLoading?: boolean;
  testId?: string;
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'default',
  isLoading = false,
  testId,
  ...props
}: ButtonProps) {
  return (
    <ShadcnButton
      data-testid={testId}
      className={cn(className)}
      variant={variant}
      size={size}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </ShadcnButton>
  );
}
