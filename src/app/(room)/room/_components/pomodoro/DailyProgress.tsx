'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Icon from '../ui/Icon';
import DraggableCard from '../ui/DraggableCard';
import { Trophy, CheckCircle, Clock } from 'lucide-react';

export default function DailyProgress() {
  const pomodoro = useSelector((state: RootState) => state.room.pomodoro);
  const { completedPomodoros, totalWorkTime, streak } = pomodoro.dailyStats;
  
  // Calculate initial position (right side, bottom third of screen)
  const initialPosition = {
    x: typeof window !== 'undefined' ? Math.max(window.innerWidth - 360, 0) : 0,
    y: typeof window !== 'undefined' ? Math.max(window.innerHeight - 400, 0) : 0
  };

  // Calculate hours and minutes from total work time (in seconds)
  const hours = Math.floor(totalWorkTime / 3600);
  const minutes = Math.floor((totalWorkTime % 3600) / 60);

  // Calculate progress percentage (assuming 8 pomodoros is a full day's goal)
  const progressPercentage = Math.min((completedPomodoros / 8) * 100, 100);

  if (!pomodoro.ui.isProgressVisible) {
    return null;
  }

  return (
    <DraggableCard title="Daily Progress" initialPosition={initialPosition}>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-green-300/80">Daily Goal</span>
            <span className="text-sm font-medium text-green-400">{completedPomodoros}/8 Pomodoros</span>
          </div>
          <Progress
            value={progressPercentage}
            className="h-2 bg-stone-800"
            indicatorClassName="bg-green-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-3 rounded-md bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-green-300/80">Pomodoros Completed</div>
                <div className="text-xl font-bold text-green-400 filter-green-glow">{completedPomodoros}</div>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-md bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-green-300/80">Focus Time</div>
                <div className="text-xl font-bold text-green-400 filter-green-glow">
                  {hours}h {minutes}m
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-3 rounded-md bg-green-500/5 border border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <Trophy className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm text-green-300/80">Day Streak</div>
                <div className="text-xl font-bold text-green-400 filter-green-glow">{streak}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Motivational message based on progress */}
        <div className="text-sm text-center text-green-300/80 p-3 bg-green-500/5 rounded-md border border-green-500/20">
          {progressPercentage >= 100 ? (
            "Amazing job! You've crushed your daily goal! 🎉"
          ) : progressPercentage >= 75 ? (
            "Almost there! Keep pushing! 💪"
          ) : progressPercentage >= 50 ? (
            "Halfway there! You're doing great! 🌟"
          ) : progressPercentage >= 25 ? (
            "Great start! Keep the momentum going! 🚀"
          ) : (
            "Let's make today productive! 💡"
          )}
        </div>
      </div>
    </DraggableCard>
  );
} 