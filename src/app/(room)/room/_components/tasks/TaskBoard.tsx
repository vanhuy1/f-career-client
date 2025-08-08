'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLocalStorageState } from '../../hooks/useLocalStorage';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import Icon from '../ui/Icon';
import { taskService } from '@/services/api/room/task-api';
import { toast } from 'react-toastify';
import { RefreshCw } from 'lucide-react';
import TaskNotificationInspiration from './TaskNotificationInspiration';
import { useUser } from '@/services/state/userSlice';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

// Map from frontend status to backend status
const statusMapToBackend = {
  todo: 'TODO',
  'in-progress': 'IN_PROGRESS',
  review: 'REVIEW',
  done: 'DONE',
} as const;

// Local Task interface for the TaskBoard component
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  dueDate?: string;
  reminderTime?: string;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  progress?: number;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | null;
    interval: number;
  };
  estimatedTime?: number; // in minutes
}

// Backend Task interface matching the API
export interface BackendTask {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  dueDate?: string;
  reminderTime?: string;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | null;
    interval: number;
  };
  estimatedTime?: number;
  progress?: number;
  userId: number;
}

interface TaskBoardProps {
  keepParentOpen?: boolean;
  onTaskModalOpen?: () => void;
  onTaskModalClose?: () => void;
}

export default function TaskBoard({
  onTaskModalOpen,
  onTaskModalClose,
}: TaskBoardProps) {
  const [tasks, setTasks] = useLocalStorageState<Task[]>(
    [],
    'study-room-tasks',
  );
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>(
    'all',
  );
  const [filterTag, setFilterTag] = useState<string | 'all'>('all');
  const [_, setFilterAssignee] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<
    'updatedAt' | 'dueDate' | 'priority' | 'title'
  >('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const filterMenuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  const user = useUser();
  const userId = Number(user?.data?.id);

  useEffect(() => {
    if (isAddingTask || editingTask) {
      onTaskModalOpen?.();
    } else {
      onTaskModalClose?.();
    }
  }, [isAddingTask, editingTask, onTaskModalOpen, onTaskModalClose]);

  // Close menus when clicking outside
  useOutsideClick(filterMenuRef, () => {
    if (isFilterMenuOpen) setIsFilterMenuOpen(false);
  });

  useOutsideClick(actionsMenuRef, () => {
    if (isActionsMenuOpen) setIsActionsMenuOpen(false);
  });

  // First time join room - initialize tasks from server
  useEffect(() => {
    const initializeTasksFromServer = async () => {
      try {
        // Check if we've already initialized
        const initialized = localStorage.getItem(
          'study-room-tasks-initialized',
        );

        // Check if we already have tasks in local storage
        const localStorageTasks = localStorage.getItem('study-room-tasks');

        if (!initialized) {
          // If we have tasks in local storage but haven't initialized from server
          if (localStorageTasks) {
            try {
              const parsedTasks = JSON.parse(localStorageTasks);
              if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
                // Fix any status format issues in local storage
                const fixedTasks = parsedTasks.map((task) => {
                  // Handle underscore format (in_progress) vs hyphen format (in-progress)
                  const status = task.status.replace('_', '-');
                  return {
                    ...task,
                    status: status as TaskStatus,
                  };
                });

                setTasks(fixedTasks);
                console.log(
                  'Loaded and fixed tasks from local storage:',
                  fixedTasks,
                );
                localStorage.setItem('study-room-tasks-initialized', 'true');
                setIsInitialized(true);
                return;
              }
            } catch (e) {
              console.error('Error parsing local storage tasks:', e);
            }
          }

          // If no valid tasks in local storage, fetch from server
          const serverTasks = await taskService.initTasksFromServer(
            userId ?? 0,
          );
          if (serverTasks && serverTasks.length > 0) {
            // Convert server tasks to local task format if needed
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
          setIsInitialized(true);
        } else {
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize tasks from server:', error);
        setIsInitialized(true);
      }
    };

    initializeTasksFromServer();
  }, [userId, setTasks]);

  // Sync tasks to server
  const handleSyncToServer = async () => {
    try {
      setIsSyncing(true);

      // Ensure userId is a number
      const userIdToUse = userId ?? 0;

      // Convert local tasks to server format
      const serverTasks: BackendTask[] = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: statusMapToBackend[task.status],
        priority: task.priority,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        tags: task.tags,
        dueDate: task.dueDate,
        reminderTime: task.reminderTime,
        checklist: task.checklist,
        recurring: task.recurring,
        estimatedTime: task.estimatedTime,
        progress: task.progress,
        userId: userIdToUse,
      }));

      await taskService.syncTasksToServer(serverTasks);
      toast.success(`${tasks.length} tasks have been save to the server.`);
    } catch (error) {
      console.error('Failed to save tasks to server:', error);
      toast.error('There was a problem save your tasks. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close menus when pressing escape
      if (e.key === 'Escape') {
        setIsFilterMenuOpen(false);
        setIsActionsMenuOpen(false);
      }

      // Add new task with Ctrl+N or Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setIsAddingTask(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const columns: { id: TaskStatus; title: string; icon: string }[] = [
    { id: 'todo', title: 'To Do', icon: 'Board' },
    { id: 'in-progress', title: 'In Progress', icon: 'Tool' },
    { id: 'review', title: 'Review', icon: 'Note' },
    { id: 'done', title: 'Done', icon: 'Check-off' },
  ];

  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap((task) => task.tags || [])));

  const handleAddTask = (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      createdAt: now,
      updatedAt: now,
    };

    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
  };

  const handleUpdateTask = (
    updatedTask: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    if ('id' in updatedTask) {
      setTasks(
        tasks.map((task) =>
          task.id === updatedTask.id
            ? ({ ...updatedTask, updatedAt: new Date().toISOString() } as Task)
            : task,
        ),
      );
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
    setEditingTask(null);
  };

  const handleDeleteAllCompleted = () => {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
      setTasks(tasks.filter((task) => task.status !== 'done'));
    }
  };

  // const handleExportTasks = () => {
  //   const dataStr = JSON.stringify(tasks, null, 2);
  //   const dataUri =
  //     'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  //   const exportFileDefaultName = `tasks-${new Date().toISOString().slice(0, 10)}.json`;

  //   const linkElement = document.createElement('a');
  //   linkElement.setAttribute('href', dataUri);
  //   linkElement.setAttribute('download', exportFileDefaultName);
  //   linkElement.click();
  // };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');

    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, status, updatedAt: new Date().toISOString() }
          : task,
      ),
    );
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search query filter
      if (
        searchQuery &&
        !task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.tags?.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      ) {
        return false;
      }

      // Priority filter
      if (filterPriority !== 'all' && task.priority !== filterPriority) {
        return false;
      }

      // Tag filter
      if (filterTag !== 'all' && !task.tags?.includes(filterTag)) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'dueDate') {
        // Handle null/undefined due dates
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return sortDirection === 'asc' ? 1 : -1;
        if (!b.dueDate) return sortDirection === 'asc' ? -1 : 1;

        return sortDirection === 'asc'
          ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
          : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }

      if (sortBy === 'priority') {
        const priorityValues = { high: 3, medium: 2, low: 1 };
        return sortDirection === 'asc'
          ? priorityValues[a.priority] - priorityValues[b.priority]
          : priorityValues[b.priority] - priorityValues[a.priority];
      }

      if (sortBy === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      // Default sort by updatedAt
      return sortDirection === 'asc'
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return (
    <div className="p-4">
      {/* Header with controls */}
      <TaskNotificationInspiration
        tasks={tasks}
        onTaskUpdate={handleUpdateTask}
      />

      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
          <Icon name="Board" className="h-6 w-6" />
          Task Board
          <span className="ml-2 rounded-full bg-stone-700 px-2 py-0.5 text-sm">
            {tasks.length}
          </span>
        </h2>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="group relative flex items-center gap-1 rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-600"
            title="Add new task (Ctrl+N)"
          >
            <span>+</span> Add Task
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 transform rounded bg-stone-800 px-2 py-1 text-xs opacity-0 transition-opacity group-hover:opacity-100">
              Ctrl+N
            </span>
          </button>

          <button
            onClick={handleSyncToServer}
            className="group relative flex items-center gap-1 rounded-md bg-blue-700 px-4 py-2 text-white hover:bg-blue-600"
            title="Sync tasks to server"
            disabled={isSyncing || !isInitialized}
          >
            <RefreshCw className={cn('h-4 w-4', isSyncing && 'animate-spin')} />
            <span>{isSyncing ? 'Save...' : 'Save'}</span>
          </button>

          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => {
                setIsFilterMenuOpen(!isFilterMenuOpen);
                setIsActionsMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-1 rounded-md bg-stone-700 px-4 py-2 text-white hover:bg-stone-600',
                isFilterMenuOpen && 'bg-stone-600',
              )}
            >
              <Icon name="Tool" className="h-4 w-4" />
              <span>Filter & Sort</span>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute top-full right-0 z-10 mt-2 w-72 rounded-md border border-stone-700 bg-stone-800 p-4 shadow-lg">
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="mb-1 block text-sm text-stone-400">
                      Search
                    </label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="w-full rounded-md border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                    />
                  </div>

                  {/* Priority filter */}
                  <div>
                    <label className="mb-1 block text-sm text-stone-400">
                      Priority
                    </label>
                    <select
                      value={filterPriority}
                      onChange={(e) =>
                        setFilterPriority(
                          e.target.value as TaskPriority | 'all',
                        )
                      }
                      className="w-full rounded-md border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                    >
                      <option value="all">All Priorities</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Tag filter */}
                  {allTags.length > 0 && (
                    <div>
                      <label className="mb-1 block text-sm text-stone-400">
                        Tag
                      </label>
                      <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full rounded-md border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                      >
                        <option value="all">All Tags</option>
                        {allTags.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Sort options */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="mb-1 block text-sm text-stone-400">
                        Sort By
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) =>
                          setSortBy(e.target.value as typeof sortBy)
                        }
                        className="w-full rounded-md border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                      >
                        <option value="updatedAt">Last Updated</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-stone-400">
                        Direction
                      </label>
                      <select
                        value={sortDirection}
                        onChange={(e) =>
                          setSortDirection(e.target.value as 'asc' | 'desc')
                        }
                        className="w-full rounded-md border border-stone-600 bg-stone-700 px-3 py-2 text-white"
                      >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                      </select>
                    </div>
                  </div>

                  {/* Reset filters */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setFilterPriority('all');
                        setFilterTag('all');
                        setFilterAssignee('all');
                        setSortBy('updatedAt');
                        setSortDirection('desc');
                      }}
                      className="rounded-md bg-stone-700 px-3 py-1 text-sm text-white hover:bg-stone-600"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={actionsMenuRef}>
            <button
              onClick={() => {
                setIsActionsMenuOpen(!isActionsMenuOpen);
                setIsFilterMenuOpen(false);
              }}
              className={cn(
                'flex items-center gap-1 rounded-md bg-stone-700 px-4 py-2 text-white hover:bg-stone-600',
                isActionsMenuOpen && 'bg-stone-600',
              )}
            >
              <Icon name="List" className="h-4 w-4" />
              <span>Actions</span>
            </button>
            {isActionsMenuOpen && (
              <div className="absolute top-full right-0 z-10 mt-2 w-48 rounded-md border border-stone-700 bg-stone-800 p-2 shadow-lg">
                {/* <button
                  onClick={() => {
                    handleExportTasks();
                    setIsActionsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-stone-700"
                >
                  <Icon name="Note" className="h-4 w-4" />
                  Export Tasks
                </button> */}
                <button
                  onClick={() => {
                    handleDeleteAllCompleted();
                    setIsActionsMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-red-400 hover:bg-stone-700"
                >
                  <Icon name="Trash" className="h-4 w-4" />
                  Delete Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty state when no tasks exist */}
      {tasks.length === 0 ? (
        <div className="rounded-lg bg-stone-800/50 p-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-700">
              <Icon name="Board" className="h-8 w-8" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-medium text-white">No tasks yet</h3>
          <p className="mx-auto mb-6 max-w-md text-stone-400">
            Create your first task to start organizing your work. You can add
            tasks, set due dates, assign them to people, and track progress.
          </p>
          <button
            onClick={() => setIsAddingTask(true)}
            className="inline-flex items-center gap-2 rounded-md bg-green-700 px-6 py-3 text-white hover:bg-green-600"
          >
            <span>+</span> Create your first task
          </button>
        </div>
      ) : (
        /* Task board columns */
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {columns.map((column) => {
            const columnTasks = filteredTasks.filter(
              (task) => task.status === column.id,
            );

            return (
              <div
                key={column.id}
                className="flex flex-col rounded-lg bg-stone-800/50 p-4"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <h3 className="mb-3 flex items-center justify-between text-lg font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Icon name={column.icon} className="h-5 w-5" />
                    {column.title}
                  </div>
                  <span className="rounded-full bg-stone-700 px-2 py-0.5 text-sm">
                    {columnTasks.length}
                  </span>
                </h3>

                <div className="max-h-[calc(100vh-300px)] min-h-[200px] flex-1 space-y-3 overflow-y-auto">
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDragStart={handleDragStart}
                        onClick={() => setEditingTask(task)}
                      />
                    ))
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-stone-500 italic">
                      <div className="text-center">
                        <Icon
                          name="Board"
                          className="mx-auto mb-2 h-6 w-6 opacity-50"
                        />
                        <p>Drop tasks here</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add task modal */}
      {isAddingTask && (
        <TaskModal
          isOpen={isAddingTask}
          onClose={() => setIsAddingTask(false)}
          onSave={handleAddTask}
        />
      )}

      {/* Edit task modal */}
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
          task={editingTask}
        />
      )}
    </div>
  );
}
