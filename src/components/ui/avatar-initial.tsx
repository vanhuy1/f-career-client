import React from 'react';
import { cn } from '@/lib/utils';

interface AvatarInitialProps {
  name: string | null | undefined;
  className?: string;
  fontSize?: string;
  backgroundColor?: string;
  textColor?: string;
}

export function AvatarInitial({
  name,
  className,
  fontSize = 'text-xl',
  backgroundColor = 'bg-blue-600',
  textColor = 'text-white',
}: AvatarInitialProps) {
  const initials = React.useMemo(() => {
    if (!name) return '?';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) return '?';

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  }, [name]);

  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        backgroundColor,
        textColor,
        fontSize,
        'font-semibold',
        className,
      )}
    >
      {initials}
    </div>
  );
}
