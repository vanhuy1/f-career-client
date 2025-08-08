'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import { Task } from './TaskBoard';
import { toast } from 'react-toastify';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDelete?: (taskId: string) => void;
  task?: Task;
  roomUsers?: string[];
}

interface ReminderOption {
  value: string;
  label: string;
  minutes: number | null;
}

export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  task,
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
  const [selectedReminder, setSelectedReminder] = useState<string>('none');
  const [errors, setErrors] = useState<{
    title?: string;
    dueDate?: string;
    reminder?: string;
  }>({});

  // Define reminder options
  const reminderOptions: ReminderOption[] = [
    { value: 'none', label: 'No reminder', minutes: null },
    { value: '5', label: '5 minutes before', minutes: 5 },
    { value: '10', label: '10 minutes before', minutes: 10 },
    { value: '15', label: '15 minutes before', minutes: 15 },
    { value: '30', label: '30 minutes before', minutes: 30 },
    { value: '60', label: '1 hour before', minutes: 60 },
    { value: '120', label: '2 hours before', minutes: 120 },
    { value: '180', label: '3 hours before', minutes: 180 },
    { value: '360', label: '6 hours before', minutes: 360 },
    { value: '720', label: '12 hours before', minutes: 720 },
    { value: '1440', label: '1 day before', minutes: 1440 },
  ];

  // Get smart reminder suggestions based on due date
  const getSmartReminderSuggestions = (): ReminderOption[] => {
    if (!formData.dueDate) return reminderOptions;

    const now = new Date();
    const dueDate = new Date(formData.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const minutesUntilDue = Math.floor(timeDiff / (1000 * 60));

    // Filter options that are valid for the time remaining
    const validOptions = reminderOptions.filter((option) => {
      if (option.minutes === null) return true; // Always include "none"
      // Reminder should be at least 5 minutes from now
      return option.minutes < minutesUntilDue - 5;
    });

    // If no valid options (due date too soon), suggest adjusted options
    if (validOptions.length <= 1) {
      // Only "none" is available
      const adjustedOptions: ReminderOption[] = [
        { value: 'none', label: 'No reminder', minutes: null },
      ];

      if (minutesUntilDue > 5) {
        adjustedOptions.push({
          value: '5',
          label: '5 minutes before',
          minutes: 5,
        });
      }

      if (minutesUntilDue > 10) {
        const halfTime = Math.floor(minutesUntilDue / 2);
        adjustedOptions.push({
          value: halfTime.toString(),
          label: `${halfTime} minutes before (50% of time)`,
          minutes: halfTime,
        });
      }

      if (minutesUntilDue > 15) {
        const quarterTime = Math.floor(minutesUntilDue / 4);
        adjustedOptions.push({
          value: quarterTime.toString(),
          label: `${quarterTime} minutes before (25% of time)`,
          minutes: quarterTime,
        });
      }

      return adjustedOptions;
    }

    return validOptions;
  };

  // Get available reminder options
  const availableReminderOptions = getSmartReminderSuggestions();

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
      });

      // Set reminder selection
      if (!task.reminderTime) {
        setSelectedReminder('none');
      } else if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const reminderDate = new Date(task.reminderTime);
        const diffMinutes = Math.round(
          (dueDate.getTime() - reminderDate.getTime()) / (1000 * 60),
        );
        setSelectedReminder(diffMinutes.toString());
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
      setSelectedReminder('none');
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate title length
    if (!formData.title || formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters long';
    }

    // Validate due date
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const now = new Date();

      if (dueDate < now) {
        newErrors.dueDate = 'Due date must be in the future';
      }

      // Validate reminder time if not "none"
      if (selectedReminder !== 'none') {
        const reminderMinutes = parseInt(selectedReminder);
        const reminderMs = reminderMinutes * 60 * 1000;
        const earliestReminderTime = new Date(now.getTime() + 5 * 60 * 1000); // At least 5 minutes from now
        const reminderTime = new Date(dueDate.getTime() - reminderMs);

        if (reminderTime < earliestReminderTime) {
          newErrors.reminder =
            'Reminder time is too early. Please adjust the due date or choose a different reminder time';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
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

    // Clear due date error
    if (errors.dueDate) {
      setErrors({
        ...errors,
        dueDate: undefined,
        reminder: undefined,
      });
    }

    // Update reminder time if due date changes
    if (dueDate && selectedReminder !== 'none') {
      updateReminderTime(dueDate, selectedReminder);
    } else if (!dueDate) {
      setFormData((prev) => ({ ...prev, reminderTime: undefined }));
      setSelectedReminder('none');
    }
  };

  const handleReminderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedReminder(value);

    // Clear reminder error
    if (errors.reminder) {
      setErrors({
        ...errors,
        reminder: undefined,
      });
    }

    if (formData.dueDate && value !== 'none') {
      updateReminderTime(formData.dueDate, value);
    } else {
      // Remove reminder time if "none" is selected
      setFormData((prev) => ({ ...prev, reminderTime: undefined }));
    }
  };

  const updateReminderTime = (dueDate: string, minutes: string) => {
    if (minutes === 'none') {
      setFormData((prev) => ({ ...prev, reminderTime: undefined }));
      return;
    }

    const dueDateObj = new Date(dueDate);
    const reminderDate = new Date(
      dueDateObj.getTime() - parseInt(minutes) * 60 * 1000,
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

    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    if (formData.title) {
      onSave(formData as Task);
      toast.success(
        task ? 'Task updated successfully!' : 'New task created successfully!',
      );
    }
  };

  const handleModalClose = () => {
    // Reset form data
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

    setErrors({});
    setSelectedReminder('none');
    // Luôn gọi onClose (TaskBoard sẽ xử lý việc cập nhật state)
    onClose();
  };

  // Calculate progress
  const progress = formData.progress || 0;

  // Get minimum date/time for due date input (current time)
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Check if due date is too soon for meaningful reminders
  const isDueDateTooSoon = () => {
    if (!formData.dueDate) return false;
    const dueDate = new Date(formData.dueDate);
    const now = new Date();
    const minutesUntilDue = Math.floor(
      (dueDate.getTime() - now.getTime()) / (1000 * 60),
    );
    return minutesUntilDue < 10;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="lg"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[80vh] space-y-4 overflow-y-auto p-4"
      >
        <div>
          <label className="mb-1 block text-sm text-stone-400">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={cn(
              'w-full rounded-md border px-3 py-2 text-white',
              errors.title
                ? 'border-red-500 bg-red-900/20'
                : 'border-stone-700 bg-stone-800',
            )}
            placeholder="Enter task title (min 3 characters)"
            required
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-500">{errors.title}</p>
          )}
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
            placeholder="Add a detailed description (optional)"
          />
        </div>

        {/* Status and Priority */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              min={getMinDateTime()}
              className={cn(
                'w-full rounded-md border px-3 py-2 text-white',
                errors.dueDate
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-stone-700 bg-stone-800',
              )}
            />
            {errors.dueDate && (
              <p className="mt-1 text-xs text-red-500">{errors.dueDate}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm text-stone-400">
              Reminder
            </label>
            <select
              value={selectedReminder}
              onChange={handleReminderChange}
              disabled={!formData.dueDate}
              className={cn(
                'w-full rounded-md border px-3 py-2 text-white disabled:opacity-50',
                errors.reminder
                  ? 'border-red-500 bg-red-900/20'
                  : 'border-stone-700 bg-stone-800',
              )}
            >
              {availableReminderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.reminder && (
              <p className="mt-1 text-xs text-red-500">{errors.reminder}</p>
            )}
            {isDueDateTooSoon() && formData.dueDate && (
              <p className="mt-1 text-xs text-yellow-500">
                ⚠️ Due date is very soon. Limited reminder options available.
              </p>
            )}
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
              onClick={() => {
                if (confirm('Are you sure you want to delete this task?')) {
                  onDelete(task.id);
                  toast.success('Task deleted successfully!');
                }
              }}
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
