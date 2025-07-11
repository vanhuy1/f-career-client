'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Icon from './Icon';
import IconButton from './IconButton';
import TodoModal from '../todo/TodoModal';
import SceneSelector from './SceneSelector';
import MusicSelector from './MusicSelector';
import CalendarModal from '../calendar/CalendarModal';
import TaskBoardModal from '../tasks/TaskBoardModal';
import SoundControl from './SoundControl';
import RoadmapModal from '../learning/RoadmapModal';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function Header() {
    const [isTaskBoardOpen, setIsTaskBoardOpen] = useState(false);
    const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
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
        <div className={cn("px-9 py-4 flex items-center justify-between")}>
            <Link href="/" className={cn("text-white text-xl font-bold filter-green-glow")}>
                F-Career Study Room
            </Link>
            <div className={cn("flex items-center gap-4")}>
                <SceneSelector />
                <MusicSelector />
                <SoundControl />
                <TodoModal />
                <CalendarModal />
                <IconButton
                    icon="Board"
                    label="Task Board"
                    onClick={() => setIsTaskBoardOpen(true)}
                    isActive={isTaskBoardOpen}
                />
                <IconButton
                    icon="Roadmap"
                    label="Roadmaps"
                    onClick={() => setIsRoadmapOpen(true)}
                    isActive={isRoadmapOpen}
                />
                <button
                    onClick={toggleFullscreen}
                    className={cn(
                        "p-2 rounded-full bg-stone-900/80 backdrop-blur-sm",
                        "hover:bg-stone-800/80 transition-all duration-200",
                        "border border-stone-700/50",
                        isFullscreen && "border-green-500/50"
                    )}
                    aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? (
                        <Minimize2 className="w-5 h-5 text-green-400" />
                    ) : (
                        <Maximize2 className="w-5 h-5 text-white" />
                    )}
                </button>
            </div>
            <TaskBoardModal 
                isOpen={isTaskBoardOpen}
                onClose={() => setIsTaskBoardOpen(false)}
            />
            <RoadmapModal
                isOpen={isRoadmapOpen}
                onClose={() => setIsRoadmapOpen(false)}
            />
        </div>
    );
} 