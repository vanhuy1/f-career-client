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
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <div className={cn("absolute bottom-0 left-0 w-full z-10 p-4")}>
      <div className={cn("flex items-center gap-4 bg-black/30 backdrop-blur-sm p-3 rounded-lg max-w-md")}>

        <button
          onClick={toggleFullscreen}
          
          className={cn("p-2 rounded-full bg-stone-800/60 hover:bg-stone-700/60 transition-colors",
            isFullscreen && "bg-stone-700/80"
          )}
          aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          <Icon name={isFullscreen ? "UnScale" : "Scale"} />
        </button>
      </div>
    </div>
  );
} 