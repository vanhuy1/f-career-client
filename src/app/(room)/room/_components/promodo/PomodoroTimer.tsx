'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  Bell,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  onClose?: () => void;
}

export default function PomodoroTimer({ onClose }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const [focusTime, setFocusTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [showSettings, setShowSettings] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/sound/bell.mp3');

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      if (audioRef.current) {
        audioRef.current.play();
      }

      // Show notification
      if (Notification.permission === 'granted') {
        new Notification(
          `${timerType === 'focus' ? 'Focus' : 'Break'} time is over!`,
          {
            body:
              timerType === 'focus'
                ? 'Take a break now!'
                : 'Time to get back to work!',
            icon: '/favicon.ico',
          },
        );
      }

      // Switch timer type
      if (timerType === 'focus') {
        setTimerType('break');
        setTimeLeft(breakTime * 60);
      } else {
        setTimerType('focus');
        setTimeLeft(focusTime * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerType, focusTime, breakTime]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerType === 'focus' ? focusTime * 60 : breakTime * 60);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFocusTimeChange = (value: number[]) => {
    const newValue = value[0];
    setFocusTime(newValue);
    if (timerType === 'focus' && !isActive) {
      setTimeLeft(newValue * 60);
    }
  };

  const handleBreakTimeChange = (value: number[]) => {
    const newValue = value[0];
    setBreakTime(newValue);
    if (timerType === 'break' && !isActive) {
      setTimeLeft(newValue * 60);
    }
  };

  const requestNotificationPermission = async () => {
    if (Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  if (isMinimized) {
    return (
      <div
        className="fixed right-4 bottom-4 z-50 flex cursor-pointer items-center gap-2 rounded-lg border border-green-500/30 bg-stone-800 p-2 shadow-lg"
        onClick={toggleMinimize}
      >
        <div
          className={cn(
            'h-3 w-3 rounded-full',
            isActive
              ? timerType === 'focus'
                ? 'bg-green-500'
                : 'bg-blue-500'
              : 'bg-stone-500',
          )}
        ></div>
        <span className="font-mono text-sm text-white">
          {formatTime(timeLeft)}
        </span>
        <Maximize2 className="h-4 w-4 text-stone-400" />
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-green-500/30 bg-stone-800 shadow-lg">
      <div className="flex items-center justify-between border-b border-stone-700 p-3">
        <h2 className="flex items-center gap-2 font-medium text-white">
          <Clock className="h-4 w-4 text-green-500" />
          <span>Pomodoro Timer</span>
        </h2>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-full hover:bg-stone-700"
            onClick={toggleMinimize}
          >
            <Minimize2 className="h-3.5 w-3.5 text-stone-400" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-stone-700"
              onClick={onClose}
            >
              <X className="h-3.5 w-3.5 text-stone-400" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 flex justify-center">
          <div className="text-center">
            <div
              className={cn(
                'mb-1 font-mono text-4xl font-bold',
                timerType === 'focus' ? 'text-green-500' : 'text-blue-500',
              )}
            >
              {formatTime(timeLeft)}
            </div>
            <div
              className={cn(
                'text-xs tracking-wider uppercase',
                timerType === 'focus' ? 'text-green-400' : 'text-blue-400',
              )}
            >
              {timerType === 'focus' ? 'Focus Time' : 'Break Time'}
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'border-stone-600',
              timerType === 'focus'
                ? 'text-green-400 hover:text-green-300'
                : 'text-stone-400 hover:text-stone-300',
            )}
            onClick={() => {
              setTimerType('focus');
              setIsActive(false);
              setTimeLeft(focusTime * 60);
            }}
          >
            Focus
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'border-stone-600',
              timerType === 'break'
                ? 'text-blue-400 hover:text-blue-300'
                : 'text-stone-400 hover:text-stone-300',
            )}
            onClick={() => {
              setTimerType('break');
              setIsActive(false);
              setTimeLeft(breakTime * 60);
            }}
          >
            Break
          </Button>
        </div>

        <div className="mb-4 flex justify-center gap-2">
          <Button
            variant={isActive ? 'destructive' : 'default'}
            size="sm"
            className={!isActive ? 'bg-green-600 hover:bg-green-700' : ''}
            onClick={toggleTimer}
          >
            {isActive ? (
              <>
                <Pause className="mr-1 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-1 h-4 w-4" /> Start
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-stone-600 text-stone-400 hover:text-stone-300"
            onClick={resetTimer}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" /> Reset
          </Button>
        </div>

        <div className="mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-stone-400 hover:text-stone-300"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </Button>
        </div>

        {showSettings && (
          <div className="mt-2 space-y-3 rounded-md bg-stone-700/30 p-3">
            <div>
              <div className="mb-1 flex justify-between text-xs text-stone-400">
                <span>Focus Time</span>
                <span>{focusTime} min</span>
              </div>
              <Slider
                value={[focusTime]}
                min={5}
                max={60}
                step={5}
                onValueChange={handleFocusTimeChange}
                disabled={isActive}
              />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs text-stone-400">
                <span>Break Time</span>
                <span>{breakTime} min</span>
              </div>
              <Slider
                value={[breakTime]}
                min={1}
                max={30}
                step={1}
                onValueChange={handleBreakTimeChange}
                disabled={isActive}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-stone-400">
                <Bell className="h-3.5 w-3.5" />
                <span>Sound notification</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-green-400 hover:text-green-300"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.play();
                  }
                }}
              >
                Test
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
