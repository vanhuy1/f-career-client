'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import { Task } from './TaskBoard';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
  roomUsers?: string[];
  keepParentOpen?: boolean;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
  keepParentOpen = false,
}: TaskModalProps) {
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    tags: [],
    checklist: [],
    attachments: [],
    recurring: { frequency: null, interval: 1 },
  } as Partial<Task>);
  const [tagInput, setTagInput] = useState('');
  const [checklistInput, setChecklistInput] = useState('');
  const [reminderHours, setReminderHours] = useState('1');

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
      });
      if (task.reminderTime) {
        // Extract hours from reminder time if it exists
        const dueDate = new Date(task.dueDate || '');
        const reminderDate = new Date(task.reminderTime);
        const diffHours = Math.round(
          (dueDate.getTime() - reminderDate.getTime()) / (1000 * 60 * 60),
        );
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
        recurring: { frequency: null, interval: 1 },
      });
      setReminderHours('1');
    }
  }, [task, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  const handleAddChecklistItem = () => {
    if (checklistInput.trim()) {
      const newItem = {
        id: Date.now().toString(),
        text: checklistInput.trim(),
        completed: false,
      };

      setFormData({
        ...formData,
        checklist: [...(formData.checklist || []), newItem],
      });
      setChecklistInput('');

      // Update progress
      updateProgress([...(formData.checklist || []), newItem]);
    }
  };

  const handleChecklistItemChange = (id: string, completed: boolean) => {
    const updatedChecklist =
      formData.checklist?.map((item) =>
        item.id === id ? { ...item, completed } : item,
      ) || [];

    setFormData({
      ...formData,
      checklist: updatedChecklist,
    });

    // Update progress
    updateProgress(updatedChecklist);
  };

  const handleRemoveChecklistItem = (id: string) => {
    const updatedChecklist =
      formData.checklist?.filter((item) => item.id !== id) || [];

    setFormData({
      ...formData,
      checklist: updatedChecklist,
    });

    // Update progress
    updateProgress(updatedChecklist);
  };

  const updateProgress = (checklist: typeof formData.checklist) => {
    if (!checklist || checklist.length === 0) {
      setFormData((prev) => ({ ...prev, progress: 0 }));
      return;
    }

    const completedItems = checklist.filter((item) => item.completed).length;
    const progress = Math.round((completedItems / checklist.length) * 100);

    setFormData((prev) => ({ ...prev, progress }));
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dueDate = e.target.value;
    setFormData({
      ...formData,
      dueDate,
    });

    // Update reminder time if due date changes
    if (dueDate) {
      updateReminderTime(dueDate, reminderHours);
    } else {
      setFormData((prev) => ({ ...prev, reminderTime: undefined }));
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
    const reminderDate = new Date(
      dueDateObj.getTime() - parseInt(hours) * 60 * 60 * 1000,
    );

    setFormData((prev) => ({
      ...prev,
      reminderTime: reminderDate.toISOString(),
    }));
  };

  const handleRecurringChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const frequency =
      value === 'none' ? null : (value as 'daily' | 'weekly' | 'monthly');

    setFormData({
      ...formData,
      recurring: {
        frequency: frequency,
        interval: formData.recurring?.interval || 1,
      },
    });
  };

  const handleRecurringIntervalChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const interval = parseInt(e.target.value) || 1;

    setFormData({
      ...formData,
      recurring: {
        frequency: formData.recurring?.frequency || null,
        interval: interval,
      },
    });
  };

  const handleEstimatedTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const estimatedTime = parseInt(e.target.value) || 0;

    setFormData({
      ...formData,
      estimatedTime,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title) {
      onSave(formData as Task);
    }
  };

  const handleModalClose = () => {
    if (!keepParentOpen) {
      onClose();
    } else {
      // Just reset the form without closing the parent modal
      if (task) {
        setFormData({
          ...task,
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          tags: [],
          checklist: [],
          recurring: { frequency: null, interval: 1 },
        });
      }
      onClose();
    }
  };

  // Calculate progress
  const progress = formData.progress || 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={task ? 'Edit Task' : 'Add New Task'}
      size="lg"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[80vh] space-y-4 overflow-y-auto p-4"
      >
        <div>
          <label className="mb-1 block text-sm text-stone-400">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
            placeholder="Task title"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-stone-400">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="h-24 w-full resize-none rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
            placeholder="Detailed task description"
          />
        </div>

        {/* Status, Priority, and Assignee */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm text-stone-400">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">
              Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Due Date and Reminder */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-stone-400">
              Due Date
            </label>
            <input
              type="datetime-local"
              name="dueDate"
              value={formData.dueDate || ''}
              onChange={handleDueDateChange}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">
              Reminder (before due date)
            </label>
            <select
              value={reminderHours}
              onChange={handleReminderChange}
              disabled={!formData.dueDate}
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white disabled:opacity-50"
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-stone-400">
              Estimated Time (minutes)
            </label>
            <input
              type="number"
              name="estimatedTime"
              value={formData.estimatedTime || ''}
              onChange={handleEstimatedTimeChange}
              min="0"
              className="w-full rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
              placeholder="60"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">
              Recurring
            </label>
            <div className="flex gap-2">
              <select
                value={formData.recurring?.frequency || 'none'}
                onChange={handleRecurringChange}
                className="flex-1 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
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
                  className="w-16 rounded-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="mb-1 flex justify-between text-sm text-stone-400">
            <label>Progress</label>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-stone-700">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                progress >= 100 ? 'bg-green-500' : 'bg-blue-500',
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div>
          <label className="mb-1 block text-sm text-stone-400">Checklist</label>
          <div className="mb-2 flex">
            <input
              type="text"
              value={checklistInput}
              onChange={(e) => setChecklistInput(e.target.value)}
              className="flex-1 rounded-l-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
              placeholder="Add checklist item"
              onKeyPress={(e) =>
                e.key === 'Enter' &&
                (e.preventDefault(), handleAddChecklistItem())
              }
            />
            <button
              type="button"
              onClick={handleAddChecklistItem}
              className="rounded-r-md bg-stone-700 px-4 text-white hover:bg-stone-600"
            >
              Add
            </button>
          </div>

          <div className="max-h-40 space-y-2 overflow-y-auto">
            {formData.checklist?.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 rounded-md bg-stone-800/50 p-2"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) =>
                    handleChecklistItemChange(item.id, e.target.checked)
                  }
                  className="h-4 w-4 rounded border-stone-600 bg-stone-700"
                />
                <span
                  className={cn(
                    'flex-1 text-sm',
                    item.completed && 'text-stone-500 line-through',
                  )}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveChecklistItem(item.id)}
                  className="text-stone-400 hover:text-white"
                >
                  <Icon name="Close" className="h-4 w-4" />
                </button>
              </div>
            ))}

            {(!formData.checklist || formData.checklist.length === 0) && (
              <p className="text-sm text-stone-500 italic">
                No checklist items added
              </p>
            )}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="mb-1 block text-sm text-stone-400">Tags</label>
          <div className="flex">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 rounded-l-md border border-stone-700 bg-stone-800 px-3 py-2 text-white"
              placeholder="Add tag"
              onKeyPress={(e) =>
                e.key === 'Enter' && (e.preventDefault(), handleAddTag())
              }
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-r-md bg-stone-700 px-4 text-white hover:bg-stone-600"
            >
              Add
            </button>
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags?.map((tag, index) => (
              <div
                key={index}
                className="flex items-center gap-1 rounded-md bg-stone-700 px-2 py-1 text-sm text-white"
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
              className="rounded-md bg-red-700 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={handleModalClose}
            className="rounded-md bg-stone-700 px-4 py-2 text-white hover:bg-stone-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-600"
          >
            {task ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
