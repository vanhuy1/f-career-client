import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Filter visibility management
const FILTER_VISIBILITY_KEY = 'jobSearchFilterVisibility';

export const getFilterVisibility = (): boolean => {
  if (typeof window === 'undefined') return true; // Default to true on server
  const stored = localStorage.getItem(FILTER_VISIBILITY_KEY);
  return stored ? JSON.parse(stored) : true; // Default to visible
};

export const setFilterVisibility = (isVisible: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(FILTER_VISIBILITY_KEY, JSON.stringify(isVisible));

  // Dispatch event so other components can react
  window.dispatchEvent(
    new CustomEvent('filterVisibilityChanged', { detail: isVisible }),
  );
};

export const toggleFilterVisibility = (): boolean => {
  const currentVisibility = getFilterVisibility();
  const newVisibility = !currentVisibility;
  setFilterVisibility(newVisibility);
  return newVisibility;
};
