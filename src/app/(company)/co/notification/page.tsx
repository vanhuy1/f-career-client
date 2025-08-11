'use client';

import React, { useState, useCallback, useEffect } from 'react';
import {
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCheck,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationSkeleton } from '@/components/ui/notification-skeleton';
import NotificationsPagination from '@/components/ui/notifications-pagination';
import type {
  Notification,
  NotificationPagination,
} from '@/types/Notification';
import { formatTime } from '@/utils/formatters';
import { supabase } from '@/lib/supabaseClient';
import { useUser } from '@/services/state/userSlice';

/**
 * Safe date formatter that handles invalid dates gracefully
 */
function safeFormatTime(dateString: string): string {
  try {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return formatTime(dateString);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return 'Invalid date';
  }
}

/**
 * NotificationItem component displays individual notification with actions
 */
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
  isMarkingAsRead?: boolean;
  markAsReadError?: string | null;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingAsRead = false,
  markAsReadError = null,
}: NotificationItemProps) {
  const handleMarkAsRead = async () => {
    if (!notification.is_read && !isMarkingAsRead) {
      try {
        await onMarkAsRead(notification.id);
      } catch (error) {
        console.error('Error marking notification as read:', error);
        // Error handling is managed by parent component
      }
    }
  };

  const getNotificationTypeColor = (type: string, isRead: boolean) => {
    switch (type) {
      case 'success':
        return isRead
          ? 'bg-white border-gray-200 hover:bg-green-50/30'
          : 'bg-green-50 border-green-200 shadow-sm';
      case 'warning':
        return isRead
          ? 'bg-white border-gray-200 hover:bg-yellow-50/30'
          : 'bg-yellow-50 border-yellow-200 shadow-sm';
      case 'error':
        return isRead
          ? 'bg-white border-gray-200 hover:bg-red-50/30'
          : 'bg-red-50 border-red-200 shadow-sm';
      default:
        return isRead
          ? 'bg-white border-gray-200 hover:bg-blue-50/30'
          : 'bg-blue-50 border-blue-300 shadow-sm';
    }
  };

  const getNotificationTypeBadge = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${getNotificationTypeColor(
        notification.type || 'info',
        notification.is_read,
      )} ${!notification.is_read ? 'ring-1 ring-blue-200/50' : ''}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3
                className={`text-sm font-medium transition-colors ${
                  !notification.is_read
                    ? 'font-semibold text-gray-900'
                    : 'text-gray-600'
                }`}
              >
                {notification.title || 'Untitled notification'}
              </h3>
              {notification.type && (
                <Badge
                  className={`text-xs ${getNotificationTypeBadge(
                    notification.type,
                  )}`}
                >
                  {notification.type}
                </Badge>
              )}
              {!notification.is_read && (
                <div className="flex items-center">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-blue-600" />
                    <div className="absolute inset-0 h-2 w-2 animate-ping rounded-full bg-blue-600 opacity-75" />
                  </div>
                </div>
              )}
            </div>

            <p
              className={`text-sm transition-colors ${
                !notification.is_read ? 'text-gray-800' : 'text-gray-500'
              }`}
            >
              {notification.content || 'No content available'}
            </p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {safeFormatTime(notification.created_at)}
              </div>
            </div>

            {markAsReadError && (
              <Alert className="mt-2">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Failed to mark as read: {markAsReadError}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {!notification.is_read && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAsRead}
              disabled={isMarkingAsRead}
              className="border-blue-200 text-xs whitespace-nowrap text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:ring-2 focus:ring-blue-200"
            >
              {isMarkingAsRead ? (
                <>
                  <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                  Marking...
                </>
              ) : (
                'Mark as read'
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * ErrorState component displays error state with retry option
 */
function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load notifications: {error.message}</span>
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * EmptyState component displays when no notifications are available
 */
function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 p-3">
          <CheckCheck className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          All caught up!
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          You don&apos;t have any notifications right now.
          <br />
          New notifications will appear here as they come in.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * LoadingState component displays loading skeletons
 */
function LoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <NotificationSkeleton key={index} />
      ))}
    </div>
  );
}

/**
 * NotificationsPage component displays company notifications with proper loading and error states
 */
export default function NotificationsPage() {
  const user = useUser();
  const userId = user?.data?.id;

  // Use original notifications hook
  const {
    notifications: allNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<NotificationPagination | null>(
    null,
  );
  const [paginatedNotifications, setPaginatedNotifications] = useState<
    Notification[]
  >([]);
  const [isLoadingPagination, setIsLoadingPagination] = useState(false);
  const [paginationError, setPaginationError] = useState<Error | null>(null);

  const itemsPerPage = 10;

  // Local error states for individual actions
  const [markAsReadErrors, setMarkAsReadErrors] = useState<
    Record<number, string>
  >({});
  const [markingAsReadIds, setMarkingAsReadIds] = useState<Set<number>>(
    new Set(),
  );
  const [markAllAsReadError, setMarkAllAsReadError] = useState<string | null>(
    null,
  );
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false);

  /**
   * Fetch total notification count for pagination
   */
  const fetchTotalCount = useCallback(async (): Promise<number> => {
    if (!userId) return 0;

    try {
      const { count, error } = await supabase
        .from('notification')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.warn('Failed to fetch notification count:', error);
      return 0;
    }
  }, [userId]);

  /**
   * Fetch paginated notifications
   */
  const fetchPaginatedNotifications = useCallback(
    async (page: number) => {
      if (!userId) return;

      setIsLoadingPagination(true);
      setPaginationError(null);

      try {
        const offset = (page - 1) * itemsPerPage;

        // Fetch notifications and total count in parallel
        const [notificationsResponse, totalCount] = await Promise.all([
          supabase
            .from('notification')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(offset, offset + itemsPerPage - 1),
          fetchTotalCount(),
        ]);

        if (notificationsResponse.error) {
          throw notificationsResponse.error;
        }

        const notifications = notificationsResponse.data || [];
        const totalPages = Math.ceil(totalCount / itemsPerPage);

        const paginationData: NotificationPagination = {
          currentPage: page,
          itemsPerPage,
          totalItems: totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        };

        setPaginatedNotifications(notifications);
        setPagination(paginationData);
        setCurrentPage(page);
      } catch (err) {
        console.error('Failed to fetch paginated notifications:', err);
        setPaginationError(
          err instanceof Error
            ? err
            : new Error('Failed to fetch notifications'),
        );
      } finally {
        setIsLoadingPagination(false);
      }
    },
    [userId, itemsPerPage, fetchTotalCount],
  );

  /**
   * Handle pagination page change
   */
  const handlePageChange = useCallback(
    async (page: number) => {
      await fetchPaginatedNotifications(page);
    },
    [fetchPaginatedNotifications],
  );

  /**
   * Retry pagination fetch
   */
  const retryPagination = useCallback(() => {
    fetchPaginatedNotifications(currentPage);
  }, [fetchPaginatedNotifications, currentPage]);

  // Initial pagination fetch
  useEffect(() => {
    if (userId) {
      fetchPaginatedNotifications(1);
    }
  }, [userId, fetchPaginatedNotifications]);

  const handleMarkAsRead = async (notificationId: number) => {
    if (markingAsReadIds.has(notificationId)) return;

    setMarkingAsReadIds((prev) => new Set(prev).add(notificationId));
    setMarkAsReadErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[notificationId];
      return newErrors;
    });

    try {
      const result = await markAsRead(notificationId);
      if (!result.success) {
        throw new Error(result.error || 'Failed to mark notification as read');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';

      console.error('Failed to mark notification as read:', error);
      setMarkAsReadErrors((prev) => ({
        ...prev,
        [notificationId]: errorMessage,
      }));
    } finally {
      setMarkingAsReadIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!allNotifications?.length || unreadCount === 0 || isMarkingAllAsRead)
      return;

    setIsMarkingAllAsRead(true);
    setMarkAllAsReadError(null);

    try {
      const result = await markAllAsRead();
      if (!result.success) {
        throw new Error(
          result.error || 'Failed to mark all notifications as read',
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred while marking all notifications as read';

      console.error('Failed to mark all notifications as read:', error);
      setMarkAllAsReadError(errorMessage);
    } finally {
      setIsMarkingAllAsRead(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-1 text-sm text-gray-600">
              Stay updated with important information and updates
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="flex items-center gap-4">
              <Badge className="border border-blue-200 bg-blue-100 px-3 py-1 font-medium text-blue-800">
                {unreadCount} unread
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllAsRead}
                className="border-blue-200 whitespace-nowrap text-blue-700 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 focus:ring-2 focus:ring-blue-200"
              >
                {isMarkingAllAsRead ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Marking all...
                  </>
                ) : (
                  <>
                    <CheckCheck className="mr-2 h-4 w-4" />
                    Mark all as read
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {markAllAsReadError && (
          <Alert className="mt-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to mark all notifications as read: {markAllAsReadError}
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="ml-2"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <div className="space-y-4">
        {isLoadingPagination && <LoadingState />}

        {paginationError && (
          <ErrorState error={paginationError} onRetry={retryPagination} />
        )}

        {!isLoadingPagination && !paginationError && paginatedNotifications && (
          <>
            {paginatedNotifications.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-3">
                {paginatedNotifications.map((notification) => {
                  // Additional validation for notification data
                  if (!notification || typeof notification.id === 'undefined') {
                    console.warn('Invalid notification data:', notification);
                    return null;
                  }

                  try {
                    return (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        isMarkingAsRead={markingAsReadIds.has(notification.id)}
                        markAsReadError={
                          markAsReadErrors[notification.id] || null
                        }
                      />
                    );
                  } catch (error) {
                    console.error(
                      'Error rendering notification:',
                      error,
                      notification,
                    );
                    return (
                      <Card
                        key={notification.id || Math.random()}
                        className="border-red-200 bg-red-50"
                      >
                        <CardContent className="p-4">
                          <Alert>
                            <XCircle className="h-4 w-4" />
                            <AlertDescription>
                              Error displaying notification. Please refresh the
                              page.
                            </AlertDescription>
                          </Alert>
                        </CardContent>
                      </Card>
                    );
                  }
                })}
              </div>
            )}
          </>
        )}

        {!isLoadingPagination &&
          !paginationError &&
          !paginatedNotifications && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Unable to load notifications. This might be a temporary issue.
                <Button
                  variant="outline"
                  size="sm"
                  onClick={retryPagination}
                  className="ml-2"
                >
                  <RefreshCw className="mr-1 h-3 w-3" />
                  Try again
                </Button>
              </AlertDescription>
            </Alert>
          )}

        {/* Pagination */}
        {!isLoadingPagination &&
          !paginationError &&
          pagination &&
          pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <NotificationsPagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalItems={pagination.totalItems}
                itemsPerPage={pagination.itemsPerPage}
                isLoading={isLoadingPagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}

        {/* Pagination info for single page */}
        {!isLoadingPagination &&
          !paginationError &&
          pagination &&
          pagination.totalPages === 1 &&
          pagination.totalItems > 0 && (
            <div className="mt-6 flex justify-center">
              <div className="text-sm text-gray-600">
                Showing all {pagination.totalItems} notifications
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
