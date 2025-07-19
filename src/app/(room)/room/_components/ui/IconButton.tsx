'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Icon from './Icon';

interface IconButtonProps {
  icon: string;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  labelPosition?: 'tooltip' | 'right' | 'hover-right';
  className?: string;
  tooltipClassName?: string;
}

export default function IconButton({
  icon,
  label,
  onClick,
  isActive,
  labelPosition = 'tooltip',
  className,
  tooltipClassName,
}: IconButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (labelPosition === 'right') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex items-center gap-2 rounded-lg px-3 py-2',
          'bg-stone-900/80 backdrop-blur-sm',
          'transition-all duration-200 hover:bg-stone-800/80',
          'border border-stone-700/50',
          isActive && 'border-green-500/50 bg-stone-800/80',
          className,
        )}
        aria-label={label}
      >
        <Icon name={icon} />
        <span className="text-sm text-stone-300">{label}</span>
      </button>
    );
  }

  if (labelPosition === 'hover-right') {
    return (
      <div className={cn('relative', className)}>
        <button
          onClick={onClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={cn(
            'rounded-full bg-stone-900/80 p-2 backdrop-blur-sm',
            'transition-all duration-200 hover:bg-stone-800/80',
            'border border-stone-700/50',
            isActive && 'border-green-500/50 bg-stone-800/80',
          )}
          aria-label={label}
        >
          <Icon name={icon} />
        </button>
        {showTooltip && (
          <div
            className={cn(
              'absolute top-1/2 left-[calc(100%+0.5rem)] -translate-y-1/2',
              'px-2 py-1 text-xs whitespace-nowrap',
              'rounded bg-stone-900/80 backdrop-blur-sm',
              'border border-stone-700/50 text-stone-300',
              'animate-in fade-in duration-200',
              tooltipClassName,
            )}
          >
            {label}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative', className)}>
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'rounded-full bg-stone-900/80 p-2 backdrop-blur-sm',
          'transition-all duration-200 hover:bg-stone-800/80',
          'border border-stone-700/50',
          isActive && 'border-green-500/50 bg-stone-800/80',
        )}
        aria-label={label}
      >
        <Icon name={icon} />
      </button>
      {showTooltip && (
        <div
          className={cn(
            'absolute top-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2',
            'px-2 py-1 text-xs whitespace-nowrap',
            'rounded bg-stone-900/80 backdrop-blur-sm',
            'border border-stone-700/50 text-stone-300',
            'animate-in fade-in duration-200',
            tooltipClassName,
          )}
        >
          {label}
        </div>
      )}
    </div>
  );
}
