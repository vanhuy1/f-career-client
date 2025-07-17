'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/services/state/userSlice';
import type {
  Notification,
  NotificationMutationResponse,
} from '@/types/Notification';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: number) => Promise<NotificationMutationResponse>;
  markAllAsRead: () => Promise<NotificationMutationResponse>;
  retry: () => void;
}

const NOTIFICATIONS_LIMIT = 20;
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;
const CACHE_DURATION = 5 * 60 * 1000;

const notificationsCache = new Map<
  string,
  { data: Notification[]; timestamp: number }
>();

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const fetchNotificationsWithRetry = async (
  userId: string,
): Promise<Notification[]> => {
  if (!userId) throw new Error('User ID is required');

  const cached = notificationsCache.get(userId);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  let retries = 0;

  const attemptFetch = async (): Promise<Notification[]> => {
    try {
      const { data, error } = await supabase
        .from('notification')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(NOTIFICATIONS_LIMIT);

      if (error) throw error;

      const notifications = data || [];
      notificationsCache.set(userId, {
        data: notifications,
        timestamp: Date.now(),
      });
      return notifications;
    } catch (error) {
      retries++;
      if (retries <= MAX_RETRIES) {
        // Exponential backoff: 1s, 2s, 4s
        const delayMs = RETRY_DELAY_BASE * Math.pow(2, retries - 1);
        await delay(delayMs);
        return attemptFetch();
      }
      throw error;
    }
  };

  return attemptFetch();
};

export const useNotifications = (): UseNotificationsReturn => {
  const user = useUser();
  const userId = user?.data?.id;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const unreadCount = notifications.filter(
    (notif: Notification) => !notif.is_read,
  ).length;

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchNotificationsWithRetry(userId);
      setNotifications(data);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    fetchNotifications();

    const channel = supabase
      .channel(`notifications_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notification',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newNotification = payload.new as Notification;
          setNotifications((prev: Notification[]) => {
            const updated = [newNotification, ...prev].slice(
              0,
              NOTIFICATIONS_LIMIT,
            );
            notificationsCache.set(userId, {
              data: updated,
              timestamp: Date.now(),
            });
            return updated;
          });
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notification',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const updatedNotification = payload.new as Notification;
          setNotifications((prev: Notification[]) => {
            const updated = prev.map((notif: Notification) =>
              notif.id === updatedNotification.id ? updatedNotification : notif,
            );
            notificationsCache.set(userId, {
              data: updated,
              timestamp: Date.now(),
            });
            return updated;
          });
        },
      )
      .subscribe();

    // Capture the current ref value for cleanup
    const currentAbortController = abortControllerRef.current;

    return () => {
      supabase.removeChannel(channel);
      if (currentAbortController) {
        currentAbortController.abort();
      }
    };
  }, [userId, fetchNotifications]);

  // Mark single notification as read
  const markAsRead = useCallback(
    async (notificationId: number): Promise<NotificationMutationResponse> => {
      try {
        const { error } = await supabase
          .from('notification')
          .update({ is_read: true })
          .eq('id', notificationId);

        if (error) throw error;

        setNotifications((prev: Notification[]) => {
          const updated = prev.map((notif: Notification) =>
            notif.id === notificationId ? { ...notif, is_read: true } : notif,
          );
          // Update cache
          if (userId) {
            notificationsCache.set(userId, {
              data: updated,
              timestamp: Date.now(),
            });
          }
          return updated;
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to mark notification as read';
        return { success: false, error: errorMessage };
      }
    },
    [userId],
  );

  const markAllAsRead =
    useCallback(async (): Promise<NotificationMutationResponse> => {
      if (!userId) return { success: false, error: 'User not authenticated' };

      try {
        const { error } = await supabase
          .from('notification')
          .update({ is_read: true })
          .eq('user_id', userId)
          .eq('is_read', false);

        if (error) throw error;

        setNotifications((prev: Notification[]) => {
          const updated = prev.map((notif: Notification) => ({
            ...notif,
            is_read: true,
          }));
          notificationsCache.set(userId, {
            data: updated,
            timestamp: Date.now(),
          });
          return updated;
        });

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to mark all notifications as read';
        return { success: false, error: errorMessage };
      }
    }, [userId]);

  const retry = useCallback(() => {
    if (userId) {
      notificationsCache.delete(userId);
    }
    fetchNotifications();
  }, [fetchNotifications, userId]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    retry,
  };
};
