'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@/store/hooks';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';
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
import Icon from '../ui/Icon';
import DraggableCard from '../ui/DraggableCard';
import { Timer, Settings, RotateCcw, Play, Pause } from 'lucide-react';

export default function PomodoroTimer() {
  const dispatch = useAppDispatch();
  const pomodoro = useSelector((state: RootState) => state.room.pomodoro);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState(pomodoro.settings);
  
  // Calculate center position for the timer
  const initialPosition = {
    x: typeof window !== 'undefined' ? Math.max(window.innerWidth / 2 - 160, 0) : 0,
    y: typeof window !== 'undefined' ? Math.max(window.innerHeight / 3, 0) : 0
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
            toast.success('Break time is over! Let\'s get back to work! 💪');
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [pomodoro.isRunning, pomodoro.isPaused, pomodoro.timeRemaining, pomodoro.currentPhase, dispatch]);

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
        <div className="flex items-center gap-3 p-3 rounded-md bg-green-500/5 border border-green-500/20">
          <div className="p-2 rounded-full bg-green-500/10">
            <Timer className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-green-300/80 capitalize">
              {pomodoro.currentPhase === 'longBreak' ? 'Long Break' : pomodoro.currentPhase}
            </div>
            <div className="text-3xl font-bold text-green-400 filter-green-glow tabular-nums">
              {formatTime(pomodoro.timeRemaining)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {!pomodoro.isRunning ? (
              <button
                onClick={handleStart}
                className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 flex items-center justify-center"
              >
                <Play className="w-4 h-4 text-green-400" />
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 flex items-center justify-center"
              >
                <Pause className="w-4 h-4 text-green-400" />
              </button>
            )}
            <button
              onClick={handleReset}
              className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 text-green-400" />
            </button>
          </div>
          
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <button
                className="p-2 rounded-full bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 flex items-center justify-center"
              >
                <Settings className="w-4 h-4 text-green-400" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-stone-900/95 border-green-500/30 text-white">
              <DialogHeader>
                <DialogTitle className="text-green-400">Timer Settings</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="workDuration" className="text-right text-green-300/80">
                    Work (min)
                  </Label>
                  <Input
                    id="workDuration"
                    type="number"
                    value={tempSettings.workDuration}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      workDuration: parseInt(e.target.value) || 25
                    })}
                    className="col-span-3 bg-stone-800 border-green-500/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="breakDuration" className="text-right text-green-300/80">
                    Break (min)
                  </Label>
                  <Input
                    id="breakDuration"
                    type="number"
                    value={tempSettings.breakDuration}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      breakDuration: parseInt(e.target.value) || 5
                    })}
                    className="col-span-3 bg-stone-800 border-green-500/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="longBreakDuration" className="text-right text-green-300/80">
                    Long Break (min)
                  </Label>
                  <Input
                    id="longBreakDuration"
                    type="number"
                    value={tempSettings.longBreakDuration}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      longBreakDuration: parseInt(e.target.value) || 15
                    })}
                    className="col-span-3 bg-stone-800 border-green-500/30 text-white"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="longBreakInterval" className="text-right text-green-300/80">
                    Long Break After
                  </Label>
                  <Input
                    id="longBreakInterval"
                    type="number"
                    value={tempSettings.longBreakInterval}
                    onChange={(e) => setTempSettings({
                      ...tempSettings,
                      longBreakInterval: parseInt(e.target.value) || 4
                    })}
                    className="col-span-3 bg-stone-800 border-green-500/30 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleSettingsSave}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50"
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="text-sm text-center text-green-300/80 p-2 bg-green-500/5 rounded-md border border-green-500/20">
          Pomodoros: {pomodoro.dailyStats.completedPomodoros} | Streak: {pomodoro.dailyStats.streak}
        </div>
      </div>
    </DraggableCard>
  );
} 