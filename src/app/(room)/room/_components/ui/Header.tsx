'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import IconButton from './IconButton';
import SceneSelector from '../scenes/SceneSelector';
// import CalendarModal from '../calendar/CalendarModal';
import TaskBoardModal from '../tasks/TaskBoardModal';
import SoundControl from '../music/SoundControl';
import { LogOut, Maximize2, Minimize2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isTaskBoardOpen, setIsTaskBoardOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);
  const router = useRouter();

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

  const togglePomodoro = () => {
    setIsPomodoroActive(!isPomodoroActive);
    const event = new CustomEvent('toggle-pomodoro');
    document.dispatchEvent(event);
  };

  const handleBackClick = () => {
    const confirmLeave = window.confirm(
      'Are you sure you want to leave workspaces?',
    );
    if (confirmLeave) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      router.push('/');
    }
  };

  return (
    <div className={cn('flex items-center justify-between px-9 py-4')}>
      <Link
        href="/"
        className={cn('filter-green-glow text-xl font-bold text-white')}
      >
        F-Career Study Room
      </Link>
      <div className={cn('flex items-center gap-7')}>
        <SceneSelector />
        <SoundControl />
        <IconButton
          icon="Clock"
          label="Pomodoro"
          onClick={togglePomodoro}
          isActive={isPomodoroActive}
        />
        {/* <CalendarModal /> */}

        <button
          onClick={toggleFullscreen}
          className={cn(
            'rounded-full bg-stone-900/80 p-2 backdrop-blur-sm',
            'transition-all duration-200 hover:bg-stone-800/80',
            'border border-stone-700/50',
            isFullscreen && 'border-green-500/50',
          )}
          aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-5 w-5 text-green-400" />
          ) : (
            <Maximize2 className="h-5 w-5 text-white" />
          )}
        </button>

        <button
          onClick={handleBackClick}
          className={cn(
            'group flex items-center gap-2 rounded-xl px-8 py-2',
            'bg-gradient-to-r from-white/10 to-white/5',
            'shadow-lg backdrop-blur-md',
            'border border-white/20',
            'transition-all duration-300 ease-out',
            'hover:from-white/15 hover:to-white/10',
            'hover:scale-105 hover:shadow-xl',
            'text-white/90 hover:text-white',
          )}
        >
          <LogOut className="h-4 w-4 rotate-180" />
          <span className="text-sm font-medium">Exit Room</span>
        </button>
      </div>
      <TaskBoardModal
        isOpen={isTaskBoardOpen}
        onClose={() => setIsTaskBoardOpen(false)}
      />
    </div>
  );
}
