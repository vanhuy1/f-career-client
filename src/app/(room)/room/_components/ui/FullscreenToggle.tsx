'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Icon from './Icon';

export default function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`,
        );
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={cn('absolute bottom-0 left-0 z-10 w-full p-4')}>
      <div
        className={cn(
          'flex max-w-md items-center gap-4 rounded-lg bg-black/30 p-3 backdrop-blur-sm',
        )}
      >
        <button
          onClick={toggleFullscreen}
          className={cn(
            'rounded-full bg-stone-800/60 p-2 transition-colors hover:bg-stone-700/60',
            isFullscreen && 'bg-stone-700/80',
          )}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          <Icon name={isFullscreen ? 'UnScale' : 'Scale'} />
        </button>
      </div>
    </div>
  );
}
