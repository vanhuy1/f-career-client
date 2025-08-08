'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Task } from './TaskBoard';

interface TaskNotificationInspirationProps {
  tasks: Task[];
  onTaskUpdate: (
    updatedTask: Task | Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ) => void;
}

const motivationalMessages = [
  '🎉 Amazing! 10 tasks completed today! Keep up the great work!',
  "💪 You're on fire! 10 tasks done - success is just around the corner!",
  "🌟 Incredible productivity! 10 tasks completed - you're unstoppable!",
  '🚀 Wow! 10 tasks finished today - persistence leads to success!',
  '🏆 Champion performance! 10 tasks done - keep pushing forward!',
  '✨ Fantastic! 10 tasks completed - every step counts towards your goals!',
  '🎯 Outstanding! 10 tasks done today - consistency is the key to success!',
  "💫 Brilliant work! 10 tasks finished - you're making it happen!",
];

// Interface for window with confetti
interface WindowWithConfetti extends Window {
  confetti?: (options: {
    particleCount: number;
    spread: number;
    origin: { y: number };
  }) => void;
}

export default function TaskNotificationInspiration({
  tasks,
}: TaskNotificationInspirationProps) {
  const notifiedTasks = useRef<Set<string>>(new Set());
  const dailyCompletedCount = useRef<number>(0);
  const lastResetDate = useRef<string>(new Date().toDateString());
  const hasShownMotivation = useRef<boolean>(false);
  const hasShown5Tasks = useRef<boolean>(false);

  // Check and send reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      tasks.forEach((task) => {
        // Skip if already notified or task is done
        if (notifiedTasks.current.has(task.id) || task.status === 'done') {
          return;
        }

        // Check for reminder time
        if (task.reminderTime) {
          const reminderTime = new Date(task.reminderTime);

          if (reminderTime <= now) {
            // Send reminder notification with custom options
            toast.info(`⏰ Reminder: "${task.title}" is due soon!`, {
              position: 'top-right',
              autoClose: 10000,
              closeOnClick: false, // Prevent click from closing
              pauseOnFocusLoss: false, // Don't pause when focus changes
              draggable: false, // Disable dragging
              onClick: (e) => {
                e.stopPropagation(); // Stop event bubbling
              },
            });

            notifiedTasks.current.add(task.id);

            // Also play a sound if available
            try {
              const audio = new Audio('/bell.mp3');
              audio.play().catch(() => {
                // Ignore audio errors
              });
            } catch {
              // Ignore audio errors - using empty catch block as errors are handled silently
            }
          }
        }

        // Check for overdue tasks
        if (task.dueDate) {
          const dueDate = new Date(task.dueDate);

          if (
            dueDate < now &&
            !notifiedTasks.current.has(`overdue-${task.id}`)
          ) {
            toast.warning(`⚠️ Task "${task.title}" is overdue!`, {
              position: 'top-right',
              autoClose: false,
              closeOnClick: false,
              pauseOnFocusLoss: false,
              draggable: false,
              onClick: (e) => {
                e.stopPropagation();
              },
            });

            notifiedTasks.current.add(`overdue-${task.id}`);
          }
        }
      });
    };

    // Check every minute
    const interval = setInterval(checkReminders, 60000);

    // Also check immediately
    checkReminders();

    return () => clearInterval(interval);
  }, [tasks]);

  // Track completed tasks and show motivation
  useEffect(() => {
    const today = new Date().toDateString();

    // Reset counter if it's a new day
    if (lastResetDate.current !== today) {
      dailyCompletedCount.current = 0;
      hasShownMotivation.current = false;
      hasShown5Tasks.current = false;
      lastResetDate.current = today;
      notifiedTasks.current.clear();
    }

    // Count today's completed tasks
    const todayCompletedTasks = tasks.filter((task) => {
      if (task.status !== 'done') return false;

      const updatedDate = new Date(task.updatedAt);
      return updatedDate.toDateString() === today;
    });

    dailyCompletedCount.current = todayCompletedTasks.length;

    // Show progress encouragement at 5 tasks
    if (
      dailyCompletedCount.current >= 5 &&
      dailyCompletedCount.current < 10 &&
      !hasShown5Tasks.current
    ) {
      // Use setTimeout to avoid immediate focus issues
      setTimeout(() => {
        toast.info("🎯 Great job! You're halfway to 10 tasks today!", {
          position: 'top-center',
          autoClose: 5000,
          closeOnClick: false, // Prevent accidental close
          pauseOnFocusLoss: false, // Don't pause when modal is open
          draggable: false, // Disable drag
          closeButton: ({ closeToast }) => (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop event bubbling
                closeToast(e);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          ),
          onClick: (e) => {
            e.stopPropagation(); // Prevent event bubbling
          },
        });
      }, 100); // Small delay to avoid focus conflicts

      hasShown5Tasks.current = true;
    }

    // Show motivational message when reaching 10 tasks
    if (dailyCompletedCount.current >= 10 && !hasShownMotivation.current) {
      const randomMessage =
        motivationalMessages[
          Math.floor(Math.random() * motivationalMessages.length)
        ];

      // Use setTimeout to avoid immediate focus issues
      setTimeout(() => {
        toast.success(randomMessage, {
          position: 'top-center',
          autoClose: 8000,
          closeOnClick: false,
          pauseOnFocusLoss: false,
          draggable: false,
          style: {
            fontSize: '16px',
            fontWeight: 'bold',
          },
          closeButton: ({ closeToast }) => (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeToast(e);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          ),
          onClick: (e) => {
            e.stopPropagation();
          },
        });
      }, 100);

      hasShownMotivation.current = true;

      // Show confetti effect if available
      try {
        if (
          typeof window !== 'undefined' &&
          (window as WindowWithConfetti).confetti
        ) {
          setTimeout(() => {
            const windowWithConfetti = window as WindowWithConfetti;
            if (windowWithConfetti.confetti) {
              windowWithConfetti.confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            }
          }, 200);
        }
      } catch {
        // Ignore confetti errors - using empty catch block as errors are handled silently
      }
    }
  }, [tasks]);

  // Browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Send browser notifications for important reminders
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const timeouts: NodeJS.Timeout[] = [];

      tasks.forEach((task) => {
        if (task.reminderTime && task.status !== 'done') {
          const reminderTime = new Date(task.reminderTime);
          const now = new Date();
          const timeDiff = reminderTime.getTime() - now.getTime();

          // Schedule browser notification
          if (timeDiff > 0 && timeDiff < 24 * 60 * 60 * 1000) {
            // Within 24 hours
            const timeout = setTimeout(() => {
              // Re-check if task is still not done
              new Notification('Task Reminder', {
                body: `"${task.title}" is due soon!`,
                icon: '/favicon.ico',
                requireInteraction: true,
              });
            }, timeDiff);

            timeouts.push(timeout);
          }
        }
      });

      // Cleanup timeouts on unmount or tasks change
      return () => {
        timeouts.forEach((timeout) => clearTimeout(timeout));
      };
    }
  }, [tasks]);

  return null; // This component doesn't render anything
}
