'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import {
  startPomodoro,
  pausePomodoro,
  resetPomodoro,
  updateTimeRemaining,
  completePomodoro,
  completeBreak,
  updatePomodoroSettings,
} from '@/services/state/roomSlice';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import DraggableCard from '../ui/DraggableCard';
import { Timer, Settings, RotateCcw, Play, Pause } from 'lucide-react';

export default function PomodoroTimer() {
  const dispatch = useAppDispatch();
  const pomodoro = useSelector((state: RootState) => state.room.pomodoro);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(pomodoro.settings);

  // Calculate center position for the timer
  const initialPosition = {
    x:
      typeof window !== 'undefined'
        ? Math.max(window.innerWidth / 2 - 160, 0)
        : 0,
    y: typeof window !== 'undefined' ? Math.max(window.innerHeight / 3, 0) : 0,
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (pomodoro.isRunning && !pomodoro.isPaused) {
      interval = setInterval(() => {
        if (pomodoro.timeRemaining > 0) {
          dispatch(updateTimeRemaining(pomodoro.timeRemaining - 1));
        } else {
          if (pomodoro.currentPhase === 'work') {
            dispatch(completePomodoro());
            toast.success('Pomodoro completed! Take a break! 🎉');
          } else {
            dispatch(completeBreak());
            toast.success("Break time is over! Let's get back to work! 💪");
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [
    pomodoro.isRunning,
    pomodoro.isPaused,
    pomodoro.timeRemaining,
    pomodoro.currentPhase,
    dispatch,
  ]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    dispatch(startPomodoro());
  };

  const handlePause = () => {
    dispatch(pausePomodoro());
  };

  const handleReset = () => {
    dispatch(resetPomodoro());
  };

  const handleSettingsSave = () => {
    dispatch(updatePomodoroSettings(tempSettings));
    setIsSettingsOpen(false);
    toast.success('Settings updated successfully!');
  };

  if (!pomodoro.ui.isTimerVisible) {
    return null;
  }

  return (
    <DraggableCard title="Pomodoro Timer" initialPosition={initialPosition}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 rounded-md border border-green-500/20 bg-green-500/5 p-3">
          <div className="rounded-full bg-green-500/10 p-2">
            <Timer className="h-5 w-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-green-300/80 capitalize">
              {pomodoro.currentPhase === 'longBreak'
                ? 'Long Break'
                : pomodoro.currentPhase}
            </div>
            <div className="filter-green-glow text-3xl font-bold text-green-400 tabular-nums">
              {formatTime(pomodoro.timeRemaining)}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!pomodoro.isRunning ? (
              <button
                onClick={handleStart}
                className="flex items-center justify-center rounded-full border border-green-500/50 bg-green-500/20 p-2 hover:bg-green-500/30"
              >
                <Play className="h-4 w-4 text-green-400" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex items-center justify-center rounded-full border border-green-500/50 bg-green-500/20 p-2 hover:bg-green-500/30"
              >
                <Pause className="h-4 w-4 text-green-400" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="flex items-center justify-center rounded-full border border-green-500/50 bg-green-500/20 p-2 hover:bg-green-500/30"
            >
              <RotateCcw className="h-4 w-4 text-green-400" />
            </button>
          </div>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center justify-center rounded-full border border-green-500/50 bg-green-500/20 p-2 hover:bg-green-500/30">
                <Settings className="h-4 w-4 text-green-400" />
              </button>
            </DialogTrigger>
            <DialogContent className="border-green-500/30 bg-stone-900/95 text-white">
              <DialogHeader>
                <DialogTitle className="text-green-400">
                  Timer Settings
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="workDuration"
                    className="text-right text-green-300/80"
                  >
                    Work (min)
                  </Label>
                  <Input
                    id="workDuration"
                    type="number"
                    value={tempSettings.workDuration}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        workDuration: parseInt(e.target.value) || 25,
                      })
                    }
                    className="col-span-3 border-green-500/30 bg-stone-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="breakDuration"
                    className="text-right text-green-300/80"
                  >
                    Break (min)
                  </Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    value={tempSettings.breakDuration}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        breakDuration: parseInt(e.target.value) || 5,
                      })
                    }
                    className="col-span-3 border-green-500/30 bg-stone-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="longBreakDuration"
                    className="text-right text-green-300/80"
                  >
                    Long Break (min)
                  </Label>
                  <Input
                    id="longBreakDuration"
                    type="number"
                    value={tempSettings.longBreakDuration}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        longBreakDuration: parseInt(e.target.value) || 15,
                      })
                    }
                    className="col-span-3 border-green-500/30 bg-stone-800 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="longBreakInterval"
                    className="text-right text-green-300/80"
                  >
                    Long Break After
                  </Label>
                  <Input
                    id="longBreakInterval"
                    type="number"
                    value={tempSettings.longBreakInterval}
                    onChange={(e) =>
                      setTempSettings({
                        ...tempSettings,
                        longBreakInterval: parseInt(e.target.value) || 4,
                      })
                    }
                    className="col-span-3 border-green-500/30 bg-stone-800 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSettingsSave}
                  className="border border-green-500/50 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-md border border-green-500/20 bg-green-500/5 p-2 text-center text-sm text-green-300/80">
          Pomodoros: {pomodoro.dailyStats.completedPomodoros} | Streak:{' '}
          {pomodoro.dailyStats.streak}
        </div>
      </div>
    </DraggableCard>
  );
}
