'use client';

import { useRef, useEffect, useState } from 'react';
import Draggable from 'react-draggable';

interface DraggableOptions {
  defaultPosition?: { x: number, y: number };
  bounds?: string | object;
  handle?: string;
  grid?: [number, number];
  scale?: number;
  zIndex?: number;
}

export interface DraggableProps {
  nodeRef: React.RefObject<HTMLDivElement>;
  defaultPosition: { x: number, y: number };
  bounds?: string | object;
  handle?: string;
  grid?: [number, number];
  scale?: number;
  zIndex?: number;
  onStart?: (e: any, data: any) => void | false;
  onDrag?: (e: any, data: any) => void | false;
  onStop?: (e: any, data: any) => void | false;
}

export function useDraggable(options: DraggableOptions = {}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [defaultPosition, setDefaultPosition] = useState({ x: 0, y: 0 });

  // Set initial position to center of the screen
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const centerX = options.defaultPosition?.x ?? (window.innerWidth / 2 - (nodeRef.current?.offsetWidth || 0) / 2);
      const centerY = options.defaultPosition?.y ?? (window.innerHeight / 2 - (nodeRef.current?.offsetHeight || 0) / 2);
      setDefaultPosition({ x: centerX, y: centerY });
    }
  }, [options.defaultPosition]);

  const handleDrag = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  // Draggable props for the component
  const draggableProps = {
    nodeRef,
    defaultPosition,
    bounds: options.bounds ?? 'parent',
    handle: options.handle ?? '[data-drag-handle="true"]',
    grid: options.grid,
    scale: options.scale ?? 1,
    zIndex: options.zIndex,
    onDrag: handleDrag,
  };

  return { nodeRef, position, draggableProps };
} 