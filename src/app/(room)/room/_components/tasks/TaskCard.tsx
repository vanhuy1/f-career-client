'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Task } from './TaskBoard';
import Icon from '../ui/Icon';

interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onClick: () => void;
}

export default function TaskCard({ task, onDragStart, onClick }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
  };

  const priorityBorders = {
    low: 'border-blue-500',
    medium: 'border-yellow-500',
    high: 'border-red-500'
  };

  // Calculate progress based on checklist if available
  const calculateProgress = () => {
    if (task.progress !== undefined) return task.progress;
    if (!task.checklist || task.checklist.length === 0) return 0;
    
    const completedItems = task.checklist.filter(item => item.completed).length;
    return Math.round((completedItems / task.checklist.length) * 100);
  };

  // Format due date to be more readable
  const formatDueDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const dueDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Check if due date is today or tomorrow
    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Otherwise return formatted date
    return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format estimated time
  const formatEstimatedTime = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Calculate if task is overdue
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  // Calculate if task is due soon (within 24 hours)
  const isDueSoon = task.dueDate && !isOverdue && 
    new Date(task.dueDate).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000 &&
    task.status !== 'done';

  const progress = calculateProgress();
  const formattedDueDate = formatDueDate(task.dueDate);
  const formattedEstimatedTime = formatEstimatedTime(task.estimatedTime);

  // Check if task has recurring schedule
  const isRecurring = task.recurring?.frequency;

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    onDragStart(e, task.id);
    
    // Add a ghost image that looks better when dragging
    const ghostElement = document.createElement('div');
    ghostElement.classList.add('task-card-ghost');
    ghostElement.textContent = task.title;
    ghostElement.style.position = 'absolute';
    ghostElement.style.top = '-1000px';
    ghostElement.style.padding = '8px 12px';
    ghostElement.style.background = '#1c1917';
    ghostElement.style.border = '1px solid #292524';
    ghostElement.style.borderRadius = '4px';
    ghostElement.style.color = 'white';
    ghostElement.style.fontSize = '14px';
    ghostElement.style.fontWeight = '500';
    ghostElement.style.zIndex = '-1';
    document.body.appendChild(ghostElement);
    
    e.dataTransfer.setDragImage(ghostElement, 0, 0);
    
    // Remove the ghost element after the drag operation
    setTimeout(() => {
      document.body.removeChild(ghostElement);
    }, 0);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={onClick}
      className={cn(
        "bg-stone-700/80 p-3 rounded-md cursor-pointer hover:bg-stone-700 transition-all border-l-4",
        priorityBorders[task.priority],
        isOverdue && "ring-1 ring-red-500/50",
        isDueSoon && "ring-1 ring-yellow-500/50",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-medium line-clamp-2 flex-1">{task.title}</h4>
        
        {/* Priority indicator */}
        <div 
          className={cn(
            "w-3 h-3 rounded-full ml-2 mt-1",
            priorityColors[task.priority]
          )}
          title={`Priority: ${task.priority}`}
        />
      </div>
      
      {/* Description */}
      {task.description && (
        <p className="text-stone-300 text-sm mb-3 line-clamp-2">{task.description}</p>
      )}
      
      {/* Progress bar */}
      {progress > 0 && (
        <div className="w-full h-1.5 bg-stone-600 rounded-full mb-2">
          <div 
            className={cn(
              "h-full rounded-full transition-all",
              progress >= 100 ? "bg-green-500" : "bg-blue-500"
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Checklist summary */}
      {task.checklist && task.checklist.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-stone-400 mb-2">
          <Icon name="Check-off" className="w-3.5 h-3.5" />
          <span>
            {task.checklist.filter(item => item.completed).length}/{task.checklist.length} completed
          </span>
        </div>
      )}
      
      {/* Metadata badges */}
      <div className="flex flex-wrap gap-2 mb-2 text-xs">
        {formattedDueDate && (
          <div className={cn(
            "flex items-center gap-1 px-2 py-0.5 rounded-full",
            isOverdue ? "bg-red-900/50 text-red-200" : 
            isDueSoon ? "bg-yellow-900/50 text-yellow-200" : 
            "bg-stone-600 text-stone-300"
          )}>
            <Icon name="Calendar" className="w-3 h-3" />
            <span>{formattedDueDate}</span>
          </div>
        )}
        
        {formattedEstimatedTime && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-stone-600 rounded-full text-stone-300">
            <Icon name="Clock" className="w-3 h-3" />
            <span>{formattedEstimatedTime}</span>
          </div>
        )}
        
        {isRecurring && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-stone-600 rounded-full text-stone-300">
            <Icon name="Calendar" className="w-3 h-3" />
            <span>{task.recurring?.frequency}</span>
          </div>
        )}
        
        {task.assignee && (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-900/50 rounded-full text-indigo-200">
            <span className="w-3 h-3 bg-indigo-500 rounded-full flex-shrink-0" />
            <span className="truncate max-w-[80px]">{task.assignee}</span>
          </div>
        )}
      </div>
      
      {/* Attachments indicator */}
      {task.attachments && task.attachments.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-stone-400 mb-2">
          <Icon name="MultiImage" className="w-3.5 h-3.5" />
          <span>{task.attachments.length} attachment{task.attachments.length !== 1 ? 's' : ''}</span>
        </div>
      )}
      
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {task.tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-0.5 bg-stone-600 rounded-full text-stone-300"
            >
              {tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-stone-600 rounded-full text-stone-300">
              +{task.tags.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 