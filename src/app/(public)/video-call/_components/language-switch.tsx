'use client';
import { cn } from '@/lib/utils';

interface LanguageSwitchProps {
  className?: string;
}

export function LanguageSwitch({ className }: LanguageSwitchProps) {
  return (
    <button
      data-testid="languageSwitch"
      className={cn(
        'bg-secondary text-secondary-foreground flex items-center gap-2 rounded-full px-3 py-1.5',
        className,
      )}
    >
      <span className="text-xs font-medium uppercase">EN</span>
    </button>
  );
}
