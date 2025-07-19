'use client';

import { cn } from '@/lib/utils';
import { useRoomInit } from '../hooks/useRoomInit';
import Header from './ui/Header';
import Scenes from './ui/Scenes';
import Music from './ui/Music';
import Clock from './ui/Clock';
import PomodoroTimer from './pomodoro/PomodoroTimer';
import DailyProgress from './pomodoro/DailyProgress';
import PomodoroFAB from './pomodoro/PomodoroFAB';
import RoomChat from './chat/RoomChat';
import TodoFAB from './todo/TodoFAB';
import DraggableTodoList from './todo/DraggableTodoList';

export default function StudyRoom() {
  // Initialize room state
  useRoomInit();

  return (
    <div className={cn('relative min-h-screen')}>
      <Scenes />
      <Header />
      <Music />
      <Clock />
      <div className="animate-in fade-in fixed top-20 left-8 z-20 flex flex-col gap-4 rounded-lg border border-green-500/30 bg-stone-900/80 p-4 backdrop-blur-sm duration-300">
        <PomodoroFAB />
        <TodoFAB />
      </div>
      <PomodoroTimer />
      <DailyProgress />
      <DraggableTodoList />
      <RoomChat />
    </div>
  );
}
