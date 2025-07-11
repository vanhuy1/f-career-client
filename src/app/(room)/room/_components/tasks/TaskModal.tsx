'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import { Task, TaskStatus } from './TaskBoard';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
  roomUsers?: string[]; // List of users in the room
}

export default function TaskModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  task,
  roomUsers = ['You', 'User 1', 'User 2', 'User 3'] // Default users for demo
}: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    checklist: [],
    attachments: [],
    recurring: { frequency: null, interval: 1 }
  } as Partial<Task>);
  const [tagInput, setTagInput] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [reminderHours, setReminderHours] = useState('1');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (task) {
      setFormData({
        ...task
      });
      if (task.reminderTime) {
        // Extract hours from reminder time if it exists
        const dueDate = new Date(task.dueDate || '');
        const reminderDate = new Date(task.reminderTime);
        const diffHours = Math.round((dueDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60));
        setReminderHours(diffHours.toString());
      }
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        tags: [],
        checklist: [],
        attachments: [],
        recurring: { frequency: null, interval: 1 }
      });
      setReminderHours('1');
    }
  }, [task, isOpen]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(t => t !== tag) || []
    });
  };

  const handleAddChecklistItem = () => {
    if (checklistInput.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: checklistInput.trim(),
        completed: false
      };
      
      setFormData({
        ...formData,
        checklist: [...(formData.checklist || []), newItem]
      });
      setChecklistInput('');
      
      // Update progress
      updateProgress([...(formData.checklist || []), newItem]);
    }
  };
  
  const handleChecklistItemChange = (id: string, completed: boolean) => {
    const updatedChecklist = formData.checklist?.map(item => 
      item.id === id ? { ...item, completed } : item
    ) || [];
    
    setFormData({
      ...formData,
      checklist: updatedChecklist
    });
    
    // Update progress
    updateProgress(updatedChecklist);
  };
  
  const handleRemoveChecklistItem = (id: string) => {
    const updatedChecklist = formData.checklist?.filter(item => item.id !== id) || [];
    
    setFormData({
      ...formData,
      checklist: updatedChecklist
    });
    
    // Update progress
    updateProgress(updatedChecklist);
  };
  
  const updateProgress = (checklist: typeof formData.checklist) => {
    if (!checklist || checklist.length === 0) {
      setFormData(prev => ({ ...prev, progress: 0 }));
      return;
    }
    
    const completedItems = checklist.filter(item => item.completed).length;
    const progress = Math.round((completedItems / checklist.length) * 100);
    
    setFormData(prev => ({ ...prev, progress }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const newAttachments = Array.from(files).map(file => {
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      return {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 10),
        name: file.name,
        url: url,
        type: file.type
      };
    });
    
    setFormData({
      ...formData,
      attachments: [...(formData.attachments || []), ...newAttachments]
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleRemoveAttachment = (id: string) => {
    const attachment = formData.attachments?.find(a => a.id === id);
    if (attachment && attachment.url.startsWith('blob:')) {
      URL.revokeObjectURL(attachment.url);
    }
    
    setFormData({
      ...formData,
      attachments: formData.attachments?.filter(a => a.id !== id) || []
    });
  };
  
  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dueDate = e.target.value;
    setFormData({
      ...formData,
      dueDate
    });
    
    // Update reminder time if due date changes
    if (dueDate) {
      updateReminderTime(dueDate, reminderHours);
    } else {
      setFormData(prev => ({ ...prev, reminderTime: undefined }));
    }
  };
  
  const handleReminderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hours = e.target.value;
    setReminderHours(hours);
    
    if (formData.dueDate) {
      updateReminderTime(formData.dueDate, hours);
    }
  };
  
  const updateReminderTime = (dueDate: string, hours: string) => {
    const dueDateObj = new Date(dueDate);
    const reminderDate = new Date(dueDateObj.getTime() - parseInt(hours) * 60 * 60 * 1000);
    
    setFormData(prev => ({ 
      ...prev, 
      reminderTime: reminderDate.toISOString() 
    }));
  };
  
  const handleRecurringChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const frequency = value === 'none' ? null : value as 'daily' | 'weekly' | 'monthly';
    
    setFormData({
      ...formData,
      recurring: { 
        frequency: frequency,
        interval: formData.recurring?.interval || 1
      }
    });
  };
  
  const handleRecurringIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const interval = parseInt(e.target.value) || 1;
    
    setFormData({
      ...formData,
      recurring: { 
        frequency: formData.recurring?.frequency || null,
        interval: interval
      }
    });
  };
  
  const handleEstimatedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const estimatedTime = parseInt(e.target.value) || 0;
    
    setFormData({
      ...formData,
      estimatedTime
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      onSave(formData as Task);
    }
  };
  
  // Calculate progress
  const progress = formData.progress || 0;
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title={task ? 'Edit Task' : 'Add New Task'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 p-4 max-h-[80vh] overflow-y-auto">
        <div>
          <label className="block text-stone-400 text-sm mb-1">Title *</label>
          <input 
            type="text" 
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
            placeholder="Task title"
            required
          />
        </div>
        
        <div>
          <label className="block text-stone-400 text-sm mb-1">Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white h-24 resize-none"
            placeholder="Detailed task description"
          />
        </div>

        {/* Status, Priority, and Assignee */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1">Status</label>
            <select 
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          
          <div>
            <label className="block text-stone-400 text-sm mb-1">Priority</label>
            <select 
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div>
            <label className="block text-stone-400 text-sm mb-1">Assignee</label>
            <select 
              name="assignee"
              value={formData.assignee || ''}
              onChange={handleChange}
              className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
            >
              <option value="">Unassigned</option>
              {roomUsers.map((user, index) => (
                <option key={index} value={user}>{user}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Due Date and Reminder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1">Due Date</label>
            <input 
              type="datetime-local" 
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleDueDateChange}
              className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
            />
          </div>
          
          <div>
            <label className="block text-stone-400 text-sm mb-1">Reminder (before due date)</label>
            <select 
              value={reminderHours}
              onChange={handleReminderChange}
              disabled={!formData.dueDate}
              className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white disabled:opacity-50"
            >
              <option value="0.5">30 minutes</option>
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="4">4 hours</option>
              <option value="8">8 hours</option>
              <option value="24">1 day</option>
              <option value="48">2 days</option>
            </select>
          </div>
        </div>
        
        {/* Estimated Time and Recurring */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-stone-400 text-sm mb-1">Estimated Time (minutes)</label>
            <input 
              type="number" 
              name="estimatedTime"
              value={formData.estimatedTime || ''}
              onChange={handleEstimatedTimeChange}
              min="0"
              className="w-full bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
              placeholder="60"
            />
          </div>
          
          <div>
            <label className="block text-stone-400 text-sm mb-1">Recurring</label>
            <div className="flex gap-2">
              <select 
                value={formData.recurring?.frequency || 'none'}
                onChange={handleRecurringChange}
                className="flex-1 bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
              >
                <option value="none">Not recurring</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              
              {formData.recurring?.frequency && (
                <input 
                  type="number" 
                  value={formData.recurring?.interval || 1}
                  onChange={handleRecurringIntervalChange}
                  min="1"
                  max="30"
                  className="w-16 bg-stone-800 border border-stone-700 rounded-md px-3 py-2 text-white"
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Progress */}
        <div>
          <div className="flex justify-between text-stone-400 text-sm mb-1">
            <label>Progress</label>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-stone-700 rounded-full">
            <div 
              className={cn(
                "h-full rounded-full transition-all",
                progress >= 100 ? "bg-green-500" : "bg-blue-500"
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        {/* Checklist */}
        <div>
          <label className="block text-stone-400 text-sm mb-1">Checklist</label>
          <div className="flex mb-2">
            <input 
              type="text" 
              value={checklistInput}
              onChange={(e) => setChecklistInput(e.target.value)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-l-md px-3 py-2 text-white"
              placeholder="Add checklist item"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
            />
            <button 
              type="button"
              onClick={handleAddChecklistItem}
              className="bg-stone-700 text-white px-4 rounded-r-md hover:bg-stone-600"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {formData.checklist?.map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-stone-800/50 p-2 rounded-md">
                <input 
                  type="checkbox" 
                  checked={item.completed}
                  onChange={(e) => handleChecklistItemChange(item.id, e.target.checked)}
                  className="w-4 h-4 rounded bg-stone-700 border-stone-600"
                />
                <span className={cn(
                  "flex-1 text-sm",
                  item.completed && "line-through text-stone-500"
                )}>
                  {item.text}
                </span>
                <button 
                  type="button"
                  onClick={() => handleRemoveChecklistItem(item.id)}
                  className="text-stone-400 hover:text-white"
                >
                  <Icon name="Close" className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {(!formData.checklist || formData.checklist.length === 0) && (
              <p className="text-stone-500 text-sm italic">No checklist items added</p>
            )}
          </div>
        </div>
        
        {/* Attachments */}
        <div>
          <label className="block text-stone-400 text-sm mb-1">Attachments</label>
          <div 
            className="border-2 border-dashed border-stone-700 rounded-md p-4 text-center cursor-pointer hover:border-stone-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              onChange={handleFileChange}
              className="hidden"
              multiple
            />
            <p className="text-stone-400">
              <span className="block text-xl mb-1">+</span>
              Click to upload or drag files here
            </p>
          </div>
          
          {formData.attachments && formData.attachments.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {formData.attachments.map((file) => (
                <div key={file.id} className="relative group">
                  {file.type.startsWith('image/') ? (
                    <div className="aspect-square bg-stone-800 rounded-md overflow-hidden">
                      <img 
                        src={file.url} 
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-square bg-stone-800 rounded-md flex items-center justify-center">
                      <span className="text-2xl">📄</span>
                    </div>
                  )}
                  
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAttachment(file.id);
                    }}
                    className="absolute top-1 right-1 bg-red-800/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Icon name="Close" className="w-3 h-3" />
                  </button>
                  
                  <p className="text-xs text-stone-400 truncate mt-1">{file.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Tags */}
        <div>
          <label className="block text-stone-400 text-sm mb-1">Tags</label>
          <div className="flex">
            <input 
              type="text" 
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-l-md px-3 py-2 text-white"
              placeholder="Add tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <button 
              type="button"
              onClick={handleAddTag}
              className="bg-stone-700 text-white px-4 rounded-r-md hover:bg-stone-600"
            >
              Add
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags?.map((tag, index) => (
              <div 
                key={index} 
                className="bg-stone-700 text-white text-sm px-2 py-1 rounded-md flex items-center gap-1"
              >
                {tag}
                <button 
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="text-stone-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-end gap-2 pt-2">
          {task && onDelete && (
            <button 
              type="button"
              onClick={() => onDelete(task.id)}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          )}
          <button 
            type="button"
            onClick={onClose}
            className="bg-stone-700 hover:bg-stone-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
} 