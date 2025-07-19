'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalRef, () => {
    if (isOpen) onClose();
  });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        'fixed inset-0 z-50',
        'flex items-center justify-center',
        'bg-black/70 backdrop-blur-sm',
        'animate-fadeIn',
      )}
    >
      <div
        ref={modalRef}
        className={cn(
          'rounded-lg bg-stone-900/95 shadow-xl',
          'border border-stone-700/50',
          'max-h-[90vh] overflow-hidden',
          'animate-scaleIn',
          size === 'sm' && 'w-[300px]',
          size === 'md' && 'w-[500px]',
          size === 'lg' && 'w-[700px]',
          size === 'xl' && 'w-[90vw] max-w-[1200px]',
        )}
      >
        <div className="flex items-center justify-between border-b border-stone-700/50 p-4">
          {title && <h2 className="text-lg font-medium text-white">{title}</h2>}
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-700/50 hover:text-white"
            aria-label="Close modal"
          >
            <Icon name="Close" />
          </button>
        </div>

        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
}
