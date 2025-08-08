'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRoomInit } from '../hooks/useRoomInit';
import Header from './ui/Header';
import Scenes from './scenes/Scenes';
import Clock from './promodo/Clock';
import PomodoroTimer from './promodo/PomodoroTimer';
import RoomChat from './chat/RoomChat';
import RoadmapModal from './roadmap/RoadmapModal';
import TaskBoardModal from './tasks/TaskBoardModal';
import { Button } from '@/components/ui/button';
import { Map, ClipboardList } from 'lucide-react';
import { useUser } from '@/services/state/userSlice';
import { taskService } from '@/services/api/room/task-api';
import { TaskStatus } from './tasks/TaskBoard';
import { roadmapService } from '@/services/api/roadmap/roadmap-api';
import { Roadmap } from '@/types/RoadMap';
interface RoadmapParams {
  jobId?: string;
  cvId?: string;
  jobTitle?: string;
}

interface StudyRoomProps {
  generateRoadmap?: boolean;
  openRoadmapModal?: boolean;
  roadmapParams?: RoadmapParams;
}

export default function StudyRoom({
  generateRoadmap = false,
  openRoadmapModal = false,
  roadmapParams = {},
}: StudyRoomProps) {
  const [isRoadmapModalOpen, setIsRoadmapModalOpen] = useState<boolean>(
    openRoadmapModal || generateRoadmap,
  );
  const [isTaskBoardOpen, setIsTaskBoardOpen] = useState<boolean>(false);
  const [showPomodoro, setShowPomodoro] = useState<boolean>(false);
  const user = useUser();
  const userId = Number(user?.data?.id) || 1;
  const [roadmapsInitialized, setRoadmapsInitialized] = useState(false);

  // Initialize room state
  useRoomInit();

  // Initialize tasks if needed
  useEffect(() => {
    const checkAndInitializeTasks = async () => {
      try {
        // Check if tasks are already initialized
        const initialized = localStorage.getItem(
          'study-room-tasks-initialized',
        );

        // If not initialized or forced initialization
        if (!initialized || initialized === 'false') {
          // Check if we have tasks in local storage
          const localStorageTasks = localStorage.getItem('study-room-tasks');

          if (localStorageTasks) {
            try {
              const parsedTasks = JSON.parse(localStorageTasks);
              if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
                // Already have tasks in local storage, just mark as initialized
                localStorage.setItem('study-room-tasks-initialized', 'true');
                return;
              }
            } catch (e) {
              console.error('Error parsing local storage tasks:', e);
            }
          }
          const serverTasks = await taskService.initTasksFromServer(userId);

          if (serverTasks && serverTasks.length > 0) {
            // Convert server tasks to local task format
            const localTasks = serverTasks.map((task) => {
              // Convert backend status to frontend status
              const status =
                task.status === 'TODO'
                  ? 'todo'
                  : task.status === 'IN_PROGRESS'
                    ? 'in-progress'
                    : task.status === 'REVIEW'
                      ? 'review'
                      : 'done';

              return {
                id: task.id,
                title: task.title,
                description: task.description || '',
                status: status as TaskStatus,
                priority: task.priority,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
                tags: task.tags || [],
                dueDate: task.dueDate,
                reminderTime: task.reminderTime,
                checklist: task.checklist,
                recurring: task.recurring,
                estimatedTime: task.estimatedTime,
                progress: task.progress,
              };
            });

            localStorage.setItem(
              'study-room-tasks',
              JSON.stringify(localTasks),
            );
            console.log('Loaded tasks from server:', localTasks);
          }

          localStorage.setItem('study-room-tasks-initialized', 'true');
        }
      } catch (error) {
        console.error('Failed to initialize tasks from server:', error);
      }
    };

    checkAndInitializeTasks();
  }, [userId]);

  useEffect(() => {
    const initRoadmaps = async () => {
      try {
        const initialized = localStorage.getItem('career-roadmaps-initialized');

        if (initialized === 'true') {
          setRoadmapsInitialized(true);
          return;
        }

        // Fetch roadmaps from backend
        const response = await roadmapService.findByUserId(userId, {
          page: 1,
          limit: 100,
        });
        const serverRoadmaps = response.items || [];

        // Get local roadmaps if any
        const localRoadmapsRaw = localStorage.getItem('career-roadmaps');
        let localRoadmaps: Roadmap[] = [];
        if (localRoadmapsRaw) {
          try {
            localRoadmaps = JSON.parse(localRoadmapsRaw);
          } catch (e) {
            console.error('Failed parsing local roadmaps', e);
          }
        }

        // Merge by id – keep local modifications (tasks progress etc.) where applicable
        const mergedRoadmaps = [...localRoadmaps];
        serverRoadmaps.forEach((sr: Roadmap) => {
          if (!mergedRoadmaps.some((lr) => lr.id === sr.id)) {
            mergedRoadmaps.push(sr);
          }
        });

        localStorage.setItem('career-roadmaps', JSON.stringify(mergedRoadmaps));
        localStorage.setItem('career-roadmaps-initialized', 'true');
        setRoadmapsInitialized(true);
      } catch (error) {
        console.error('Failed to init roadmaps:', error);
        setRoadmapsInitialized(true);
      }
    };

    if (!roadmapsInitialized && userId) {
      initRoadmaps();
    }
  }, [roadmapsInitialized, userId]);

  // Effect to handle URL parameter for opening modal
  useEffect(() => {
    if (openRoadmapModal) {
      setIsRoadmapModalOpen(true);
    }
  }, [openRoadmapModal]);

  // Listen for Pomodoro toggle events from Header
  useEffect(() => {
    const handleTogglePomodoro = () => {
      setShowPomodoro(!showPomodoro);
    };

    document.addEventListener('toggle-pomodoro', handleTogglePomodoro);

    return () => {
      document.removeEventListener('toggle-pomodoro', handleTogglePomodoro);
    };
  }, [showPomodoro]);

  // Open roadmap modal
  const openRoadmapModalHandler = () => {
    setIsRoadmapModalOpen(true);
  };

  // Close roadmap modal
  const closeRoadmapModal = () => {
    setIsRoadmapModalOpen(false);
  };

  // Toggle Pomodoro timer
  const togglePomodoro = () => {
    setShowPomodoro(!showPomodoro);
  };

  // Toggle Task Board
  const toggleTaskBoard = () => {
    setIsTaskBoardOpen(!isTaskBoardOpen);
  };

  return (
    <div className={cn('relative min-h-screen')}>
      <Scenes />
      <Header />
      <Clock />

      <div className="animate-in fade-in fixed top-20 left-8 z-20 flex flex-col gap-4 rounded-lg border border-green-500/30 bg-stone-900/80 p-4 backdrop-blur-sm duration-300">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-green-500/30 bg-stone-900/80 text-green-500 shadow-lg hover:bg-green-500/20"
          onClick={toggleTaskBoard}
        >
          <ClipboardList className="h-4 w-4" />
          <span>Task Manager</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-green-500/30 bg-stone-900/80 text-green-500 shadow-lg hover:bg-green-500/20"
          onClick={openRoadmapModalHandler}
        >
          <Map className="h-4 w-4" />
          <span>Learning Roadmap</span>
        </Button>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="space-y-4 text-center">
            <h2 className="text-2xl font-bold text-green-500">
              Welcome to Your Study Room
            </h2>
            <p className="max-w-md text-gray-300">
              This is your personal space for focused learning. Use the pomodoro
              timer to manage your study sessions.
            </p>
          </div>
        </div>
      </div>

      {showPomodoro && <PomodoroTimer onClose={togglePomodoro} />}
      <RoomChat />

      <RoadmapModal
        isOpen={isRoadmapModalOpen}
        onClose={closeRoadmapModal}
        generateRoadmap={generateRoadmap}
        jobId={roadmapParams.jobId}
        cvId={roadmapParams.cvId}
        jobTitle={roadmapParams.jobTitle}
      />

      <TaskBoardModal
        isOpen={isTaskBoardOpen}
        onClose={() => setIsTaskBoardOpen(false)}
      />
    </div>
  );
}
