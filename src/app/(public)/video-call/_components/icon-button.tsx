'use client';

import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface IconButtonProps extends ComponentProps<'button'> {
  icon: ReactNode;
  testId?: string;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
}

export function IconButton({
  icon,
  className,
  testId,
  variant = 'default',
  ...props
}: IconButtonProps) {
  const variantStyles = {
    default: 'hover:bg-primary/90 bg-primary text-primary-foreground',
    destructive:
      'hover:bg-destructive/90 bg-destructive text-destructive-foreground',
    outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    link: 'text-primary underline-offset-4 hover:underline',
  };

  return (
    <button
      type="button"
      data-testid={testId}
      className={cn(
        'inline-flex items-center justify-center rounded-md p-2',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
