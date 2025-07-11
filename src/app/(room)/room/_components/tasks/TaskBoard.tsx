'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useLocalStorageState } from '../../hooks/useLocalStorage';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import Icon from '../ui/Icon';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

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
  assignee?: string;
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
  }>;
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

export default function TaskBoard() {
  const [tasks, setTasks] = useLocalStorageState<Task[]>([], 'study-room-tasks');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterTag, setFilterTag] = useState<string | 'all'>('all');
  const [filterAssignee, setFilterAssignee] = useState<string | 'all'>('all');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'dueDate' | 'priority' | 'title'>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  
  const filterMenuRef = useRef<HTMLDivElement>(null);
  const actionsMenuRef = useRef<HTMLDivElement>(null);
  
  // Close menus when clicking outside
  useOutsideClick(filterMenuRef, () => {
    if (isFilterMenuOpen) setIsFilterMenuOpen(false);
  });
  
  useOutsideClick(actionsMenuRef, () => {
    if (isActionsMenuOpen) setIsActionsMenuOpen(false);
  });
  
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
    { id: 'done', title: 'Done', icon: 'Check-off' }
  ];
  
  // Get all unique tags from tasks
  const allTags = Array.from(new Set(tasks.flatMap(task => task.tags || [])));
  
  // Get all unique assignees from tasks
  const allAssignees = Array.from(new Set(tasks.map(task => task.assignee).filter(Boolean) as string[]));
  
  const handleAddTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      createdAt: now,
      updatedAt: now
    };
    
    setTasks([...tasks, newTask]);
    setIsAddingTask(false);
  };
  
  const handleUpdateTask = (updatedTask: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if ('id' in updatedTask) {
      setTasks(tasks.map(task => 
        task.id === updatedTask.id 
          ? { ...updatedTask, updatedAt: new Date().toISOString() } as Task
          : task
      ));
    }
    setEditingTask(null);
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setEditingTask(null);
  };

  const handleDeleteAllCompleted = () => {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
      setTasks(tasks.filter(task => task.status !== 'done'));
    }
  };
  
  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `tasks-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status, updatedAt: new Date().toISOString() } 
        : task
    ));
  };

  // Filter and sort tasks
  const filteredTasks = tasks.filter(task => {
    // Search query filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !task.description?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))) {
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
    
    // Assignee filter
    if (filterAssignee !== 'all' && task.assignee !== filterAssignee) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Icon name="Board" className="w-6 h-6" />
          Task Board
          <span className="text-sm bg-stone-700 px-2 py-0.5 rounded-full ml-2">
            {tasks.length}
          </span>
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-1 group relative"
            title="Add new task (Ctrl+N)"
          >
            <span>+</span> Add Task
            <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-stone-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Ctrl+N
            </span>
          </button>
          
          <div className="relative" ref={filterMenuRef}>
            <button
              onClick={() => {
                setIsFilterMenuOpen(!isFilterMenuOpen);
                setIsActionsMenuOpen(false);
              }}
              className={cn(
                "bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-md flex items-center gap-1",
                isFilterMenuOpen && "bg-stone-600"
              )}
            >
              <Icon name="Tool" className="w-4 h-4" />
              <span>Filter & Sort</span>
            </button>
            
            {isFilterMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-stone-800 border border-stone-700 rounded-md shadow-lg p-4 z-10 w-72">
                <div className="space-y-4">
                  {/* Search */}
                  <div>
                    <label className="block text-stone-400 text-sm mb-1">Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tasks..."
                      className="w-full bg-stone-700 border border-stone-600 rounded-md px-3 py-2 text-white"
                    />
                  </div>
                  
                  {/* Priority filter */}
                  <div>
                    <label className="block text-stone-400 text-sm mb-1">Priority</label>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value as TaskPriority | 'all')}
                      className="w-full bg-stone-700 border border-stone-600 rounded-md px-3 py-2 text-white"
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
                      <label className="block text-stone-400 text-sm mb-1">Tag</label>
                      <select
                        value={filterTag}
                        onChange={(e) => setFilterTag(e.target.value)}
                        className="w-full bg-stone-700 border border-stone-600 rounded-md px-3 py-2 text-white"
                      >
                        <option value="all">All Tags</option>
                        {allTags.map((tag) => (
                          <option key={tag} value={tag}>{tag}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Assignee filter */}
                  {allAssignees.length > 0 && (
                    <div>
                      <label className="block text-stone-400 text-sm mb-1">Assignee</label>
                      <select
                        value={filterAssignee}
                        onChange={(e) => setFilterAssignee(e.target.value)}
                        className="w-full bg-stone-700 border border-stone-600 rounded-md px-3 py-2 text-white"
                      >
                        <option value="all">All Assignees</option>
                        {allAssignees.map((assignee) => (
                          <option key={assignee} value={assignee}>{assignee}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  
                  {/* Sort options */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-400 text-sm mb-1">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                        className="w-full bg-stone-700 border border-stone-600 rounded-md px-3 py-2 text-white"
                      >
                        <option value="updatedAt">Last Updated</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-stone-400 text-sm mb-1">Direction</label>
                      <select
                        value={sortDirection}
                        onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                        className="w-full bg-stone-700 border border-stone-600 rounded-md px-3 py-2 text-white"
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
                      className="bg-stone-700 hover:bg-stone-600 text-white px-3 py-1 rounded-md text-sm"
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
                "bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-md flex items-center gap-1",
                isActionsMenuOpen && "bg-stone-600"
              )}
            >
              <Icon name="List" className="w-4 h-4" />
              <span>Actions</span>
            </button>
            {isActionsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 bg-stone-800 border border-stone-700 rounded-md shadow-lg p-2 z-10 w-48">
                <button
                  onClick={() => {
                    handleExportTasks();
                    setIsActionsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-700 rounded-md flex items-center gap-2"
                >
                  <Icon name="Note" className="w-4 h-4" />
                  Export Tasks
                </button>
                <button
                  onClick={() => {
                    handleDeleteAllCompleted();
                    setIsActionsMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-700 rounded-md flex items-center gap-2 text-red-400"
                >
                  <Icon name="Trash" className="w-4 h-4" />
                  Delete Completed
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Empty state when no tasks exist */}
      {tasks.length === 0 ? (
        <div className="bg-stone-800/50 rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center">
              <Icon name="Board" className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No tasks yet</h3>
          <p className="text-stone-400 mb-6 max-w-md mx-auto">
            Create your first task to start organizing your work. You can add tasks, set due dates, assign them to people, and track progress.
          </p>
          <button
            onClick={() => setIsAddingTask(true)}
            className="bg-green-700 hover:bg-green-600 text-white px-6 py-3 rounded-md inline-flex items-center gap-2"
          >
            <span>+</span> Create your first task
          </button>
        </div>
      ) : (
        /* Task board columns */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {columns.map(column => {
            const columnTasks = filteredTasks.filter(task => task.status === column.id);
            
            return (
              <div 
                key={column.id}
                className="bg-stone-800/50 rounded-lg p-4 flex flex-col"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                <h3 className="text-lg font-medium text-white mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name={column.icon} className="w-5 h-5" />
                    {column.title}
                  </div>
                  <span className="text-sm bg-stone-700 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </h3>
                
                <div className="space-y-3 min-h-[200px] flex-1 overflow-y-auto max-h-[calc(100vh-300px)]">
                  {columnTasks.length > 0 ? (
                    columnTasks.map(task => (
                      <TaskCard 
                        key={task.id} 
                        task={task} 
                        onDragStart={handleDragStart}
                        onClick={() => setEditingTask(task)}
                      />
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center text-stone-500 italic text-sm">
                      <div className="text-center">
                        <Icon name="Board" className="w-6 h-6 mx-auto mb-2 opacity-50" />
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
      <TaskModal
        isOpen={isAddingTask}
        onClose={() => setIsAddingTask(false)}
        onSave={handleAddTask}
        roomUsers={['You', 'User 1', 'User 2', 'User 3']} // Example room users
      />
      
      {/* Edit task modal */}
      {editingTask && (
        <TaskModal
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleUpdateTask}
          onDelete={handleDeleteTask}
          task={editingTask}
          roomUsers={['You', 'User 1', 'User 2', 'User 3']} // Example room users
        />
      )}
    </div>
  );
} 