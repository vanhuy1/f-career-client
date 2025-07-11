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
  size = 'md'
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
    <div className={cn(
      "fixed inset-0 z-50",
      "flex items-center justify-center",
      "bg-black/70 backdrop-blur-sm",
      "animate-fadeIn"
    )}>
      <div 
        ref={modalRef}
        className={cn(
          "bg-stone-900/95 rounded-lg shadow-xl",
          "border border-stone-700/50",
          "max-h-[90vh] overflow-hidden",
          "animate-scaleIn",
          size === 'sm' && "w-[300px]",
          size === 'md' && "w-[500px]",
          size === 'lg' && "w-[700px]",
          size === 'xl' && "w-[90vw] max-w-[1200px]"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-700/50">
          {title && <h2 className="text-white text-lg font-medium">{title}</h2>}
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-700/50 text-stone-400 hover:text-white"
            aria-label="Close modal"
          >
            <Icon name="Close" />
          </button>
        </div>
        
        <div className="overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
} 