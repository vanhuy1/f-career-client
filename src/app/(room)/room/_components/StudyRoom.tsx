'use client';

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
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
    const dispatch = useAppDispatch();
    
    // Initialize room state
    useRoomInit();

    return (
        <div className={cn("relative min-h-screen")}>
            <Scenes />
            <Header />
            <Music />
            <Clock />
            <div className="fixed top-20 left-8 z-20 flex flex-col gap-4 bg-stone-900/80 backdrop-blur-sm rounded-lg p-4 border border-green-500/30 animate-in fade-in duration-300">
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