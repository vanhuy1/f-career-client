'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  Minimize2,
  Maximize2,
  Play,
  Pause,
  RotateCcw,
  Bell,
  BellOff,
  X,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface PomodoroTimerProps {
  onClose?: () => void;
}

export default function PomodoroTimer({ onClose }: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [timerType, setTimerType] = useState<'focus' | 'break'>('focus');
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio element with volume
  useEffect(() => {
    audioRef.current = new Audio('/sound/bell.mp3');
    audioRef.current.volume = volume;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (alarmTimeoutRef.current) {
        clearTimeout(alarmTimeoutRef.current);
      }
    };
  }, [volume]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Use useCallback to memoize playAlarm function
  const playAlarm = useCallback(() => {
    if (audioRef.current && soundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setIsAlarmPlaying(true);
          alarmTimeoutRef.current = setTimeout(() => {
            stopAlarm();
          }, 5000);
        })
        .catch((err) => {
          console.error('Cannot play sound:', err);
        });
    }
  }, [soundEnabled]);

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsAlarmPlaying(false);
    if (alarmTimeoutRef.current) {
      clearTimeout(alarmTimeoutRef.current);
      alarmTimeoutRef.current = null;
    }
  };

  const testSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => {
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          }, 2000);
        })
        .catch((err) => {
          console.error('Cannot test sound:', err);
        });
    }
  };

  // Main timer effect with playAlarm dependency
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playAlarm();

      if (Notification.permission === 'granted') {
        new Notification(
          `${timerType === 'focus' ? 'Focus time' : 'Break time'} is over!`,
          {
            body:
              timerType === 'focus'
                ? 'Take a short break!'
                : 'Time to get back to work!',
            icon: '/favicon.ico',
          },
        );
      }

      if (timerType === 'focus') {
        setTimerType('break');
        setTimeLeft(breakTime * 60);
      } else {
        setTimerType('focus');
        setTimeLeft(focusTime * 60);
      }

      setIsActive(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, timerType, focusTime, breakTime, playAlarm]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(timerType === 'focus' ? focusTime * 60 : breakTime * 60);
    stopAlarm();
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
        className="fixed right-4 bottom-4 z-50 flex cursor-pointer items-center gap-2 rounded-lg border border-green-500/30 bg-stone-800 p-2 shadow-lg transition-all hover:border-green-500/50"
        onClick={toggleMinimize}
      >
        <div
          className={cn(
            'h-3 w-3 animate-pulse rounded-full',
            isActive
              ? timerType === 'focus'
                ? 'bg-green-500'
                : 'bg-blue-500'
              : 'bg-stone-500',
          )}
        />
        <span className="font-mono text-sm text-white">
          {formatTime(timeLeft)}
        </span>
        <Maximize2 className="h-4 w-4 text-stone-400" />
      </div>
    );
  }

  return (
    <div className="fixed top-1/2 left-1/2 z-50 w-80 -translate-x-1/2 -translate-y-1/2 transform rounded-lg border border-green-500/30 bg-stone-800 shadow-2xl">
      {/* Header */}
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

      {isAlarmPlaying && (
        <div className="animate-pulse border-b border-stone-700 bg-yellow-900/30 p-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-yellow-400">
              <Bell className="h-4 w-4 animate-bounce" />
              <span>Alarm is playing...</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-red-400 hover:bg-red-900/30 hover:text-red-300"
              onClick={stopAlarm}
            >
              <VolumeX className="mr-1 h-3 w-3" />
              Stop
            </Button>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* Timer display */}
        <div className="mb-4 flex justify-center">
          <div className="text-center">
            <div
              className={cn(
                'mb-1 font-mono text-5xl font-bold transition-colors',
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
              {timerType === 'focus' ? 'Focus time' : 'Break time'}
            </div>
          </div>
        </div>

        {/* Timer type selector */}
        <div className="mb-4 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'border-stone-600 transition-all',
              timerType === 'focus'
                ? 'border-green-500/50 bg-green-900/20 text-green-400 hover:text-green-300'
                : 'text-stone-400 hover:text-stone-300',
            )}
            onClick={() => {
              setTimerType('focus');
              setIsActive(false);
              setTimeLeft(focusTime * 60);
              stopAlarm();
            }}
          >
            Focus
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              'border-stone-600 transition-all',
              timerType === 'break'
                ? 'border-blue-500/50 bg-blue-900/20 text-blue-400 hover:text-blue-300'
                : 'text-stone-400 hover:text-stone-300',
            )}
            onClick={() => {
              setTimerType('break');
              setIsActive(false);
              setTimeLeft(breakTime * 60);
              stopAlarm();
            }}
          >
            Break
          </Button>
        </div>

        {/* Controls */}
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

        {/* Toggle settings */}
        <div className="mb-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs text-stone-400 hover:text-stone-300"
            onClick={() => setShowSettings(!showSettings)}
          >
            {showSettings ? 'Hide settings' : 'Show settings'}
          </Button>
        </div>

        {/* Settings panel */}
        {showSettings && (
          <div className="mt-2 space-y-3 rounded-md bg-stone-700/30 p-3">
            <div>
              <div className="mb-1 flex justify-between text-xs text-stone-400">
                <span>Focus duration</span>
                <span>{focusTime} minutes</span>
              </div>
              <Slider
                value={[focusTime]}
                min={5}
                max={60}
                step={5}
                onValueChange={handleFocusTimeChange}
                disabled={isActive}
                className="cursor-pointer"
              />
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs text-stone-400">
                <span>Break duration</span>
                <span>{breakTime} minutes</span>
              </div>
              <Slider
                value={[breakTime]}
                min={1}
                max={30}
                step={1}
                onValueChange={handleBreakTimeChange}
                disabled={isActive}
                className="cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-stone-400">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="h-4 w-4 rounded border-stone-600 bg-stone-700 text-green-500 focus:ring-2 focus:ring-green-500 focus:ring-offset-0"
                />
                <div className="flex items-center gap-1">
                  {soundEnabled ? (
                    <Bell className="h-3.5 w-3.5" />
                  ) : (
                    <BellOff className="h-3.5 w-3.5" />
                  )}
                  <span>Enable sound</span>
                </div>
              </label>
            </div>

            {soundEnabled && (
              <div className="space-y-2 rounded bg-stone-800/50 p-2">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-stone-400">
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3" />
                      <span>Volume</span>
                    </div>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <Slider
                    value={[volume]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="cursor-pointer"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-green-600/50 text-xs text-green-400 hover:bg-green-900/20 hover:text-green-300"
                  onClick={testSound}
                >
                  <Volume2 className="mr-1 h-3 w-3" />
                  Test sound
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
