'use client';

import { useEffect, RefObject } from 'react';

export function useOutsideClick(
  ref: RefObject<HTMLElement | null>,
  callback: () => void,
): void {
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    }

    document.addEventListener('click', handleClick as EventListener);

    return () =>
      document.removeEventListener('click', handleClick as EventListener);
  }, [ref, callback]);
}
