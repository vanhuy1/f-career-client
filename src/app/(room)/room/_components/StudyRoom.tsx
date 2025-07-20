'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useRoomInit } from '../hooks/useRoomInit';
import Header from './ui/Header';
import Scenes from './ui/Scenes';
import Music from './ui/Music';
import Clock from './ui/Clock';
import PomodoroTimer from './pomodoro/PomodoroTimer';
import RoomChat from './chat/RoomChat';
import TaskBoardModal from './tasks/TaskBoardModal';
import { Button } from '@/components/ui/button';
import { Map, ClipboardList } from 'lucide-react';
import { useUser } from '@/services/state/userSlice';
import { taskService } from '@/services/api/room/task-api';
import { TaskStatus } from './tasks/TaskBoard';
import { useLocalStorageState } from '../hooks/useLocalStorage';

// Define a type for the task items
interface TaskItem {
  id: string | number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  dueDate?: string;
  reminderTime?: string;
  checklist?: unknown;
  recurring?: unknown;
  estimatedTime?: unknown;
  progress?: number;
}

export default function StudyRoom() {
  const [isTaskBoardOpen, setIsTaskBoardOpen] = useState<boolean>(false);
  const [showPomodoro, setShowPomodoro] = useState<boolean>(false);
  const user = useUser();
  const userId = Number(user?.data?.id) || 1; // Default to 1 if no user ID

  // We're keeping tasks state even though it's not directly used in rendering
  // because it's needed for the task initialization logic
  const [, setTasks] = useLocalStorageState<TaskItem[]>([], 'study-room-tasks');

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

          // Fetch tasks from server
          console.log(`Fetching tasks for user ${userId}...`);
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

            setTasks(localTasks);
            console.log('Loaded tasks from server:', localTasks);
          }

          localStorage.setItem('study-room-tasks-initialized', 'true');
        }
      } catch (error) {
        console.error('Failed to initialize tasks from server:', error);
      }
    };

    checkAndInitializeTasks();
  }, [userId, setTasks]);

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

  // Toggle Task Board
  const toggleTaskBoard = () => {
    setIsTaskBoardOpen(!isTaskBoardOpen);
  };

  return (
    <div className={cn('relative min-h-screen')}>
      <Scenes />
      <Header />
      <Music />
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
          onClick={() => {
            // Roadmap functionality is commented out for now
            console.log('Roadmap button clicked');
          }}
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

      {showPomodoro && <PomodoroTimer />}
      <RoomChat />

      <TaskBoardModal
        isOpen={isTaskBoardOpen}
        onClose={() => setIsTaskBoardOpen(false)}
        userId={userId}
      />
    </div>
  );
}
