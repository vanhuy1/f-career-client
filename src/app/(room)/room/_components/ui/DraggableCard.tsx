'use client';

import React, { ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Draggable from 'react-draggable';
import { GripHorizontal } from 'lucide-react';

interface DraggableCardProps {
  title: string;
  initialPosition?: { x: number; y: number };
  className?: string;
  titleClassName?: string;
  children: ReactNode;
}

export default function DraggableCard({
  title,
  initialPosition,
  className,
  titleClassName,
  children,
}: DraggableCardProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  // Calculate default position or use provided initialPosition
  const [defaultPosition] = useState(() => {
    if (initialPosition) return initialPosition;

    if (typeof window === 'undefined') return { x: 0, y: 0 };

    return {
      x: Math.max(window.innerWidth / 2 - 160, 0),
      y: Math.max(window.innerHeight / 3, 0),
    };
  });

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={defaultPosition}
      handle="[data-drag-handle='true']"
      bounds="body"
    >
      <div
        ref={nodeRef}
        className={cn(
          'fixed z-20 rounded-lg border border-green-500/30 bg-stone-900/80 backdrop-blur-sm',
          'animate-in slide-in-from-right text-white shadow-lg duration-300',
          'w-[320px]',
          className,
        )}
      >
        <div
          data-drag-handle="true"
          className={cn(
            'flex cursor-move items-center justify-between px-4 py-2',
            'rounded-t-lg border-b border-green-500/20 bg-green-500/5',
            titleClassName,
          )}
        >
          <div className="flex items-center gap-2">
            <GripHorizontal className="h-4 w-4 text-green-400" />
            <span className="font-medium text-green-400">{title}</span>
          </div>
        </div>

        <div className="p-4">{children}</div>
      </div>
    </Draggable>
  );
}
