'use client';

import { useState } from 'react';
import { Bell, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNotifications } from '@/hooks/use-notifications';
import { NotificationsDropdownSkeleton } from '@/components/ui/notification-skeleton';
import type { Notification } from '@/types/Notification';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: number) => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
}: NotificationItemProps) {
  const handleNotificationClick = () => {
    if (!notification.is_read) {
      onMarkAsRead(notification.id);
    }
  };

  const formatTime = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div
      className={`cursor-pointer border-b p-4 transition-colors hover:bg-gray-50 ${
        !notification.is_read ? 'bg-blue-50/50' : ''
      }`}
      onClick={handleNotificationClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleNotificationClick();
        }
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
            !notification.is_read ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        />
        <div className="min-w-0 flex-1">
          <h4 className="truncate font-medium text-gray-900">
            {notification.title}
          </h4>
          <p className="mt-1 line-clamp-2 text-sm text-gray-600">
            {notification.content}
          </p>
          <p className="mt-2 text-xs text-gray-400">
            {formatTime(notification.created_at)}
          </p>
        </div>
      </div>
    </div>
  );
}

function NotificationError({ onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>Failed to load notifications</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="text-destructive hover:text-destructive h-auto p-1"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}

function EmptyNotifications() {
  return (
    <div className="p-8 text-center">
      <Bell size={48} className="mx-auto mb-4 text-gray-300" />
      <p className="text-gray-500">No notifications yet</p>
      <p className="mt-1 text-xs text-gray-400">
        You&apos;ll see notifications here when you have them
      </p>
    </div>
  );
}

export default function NotificationsBell() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    retry,
  } = useNotifications();

  const handleMarkAsRead = async (notificationId: number) => {
    const result = await markAsRead(notificationId);
    if (!result.success) {
      console.error('Failed to mark notification as read:', result.error);
      // TODO: Show toast notification for error
    }
  };

  const handleMarkAllAsRead = async () => {
    const result = await markAllAsRead();
    if (!result.success) {
      console.error('Failed to mark all notifications as read:', result.error);
      // TODO: Show toast notification for error
    }
  };

  const handleDropdownOpenChange = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  if (!notifications && !isLoading && !error) {
    return null;
  }

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={handleDropdownOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-10 w-10 rounded-full ring-2 ring-transparent transition-all hover:ring-[#5e5cff]/20 focus-visible:ring-[#5e5cff]/20"
          aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        >
          <Bell size={20} className="text-gray-600" />
          {unreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 w-5 animate-pulse rounded-full bg-blue-600 p-0 text-xs text-white hover:bg-blue-700"
              aria-label={`${unreadCount} unread notifications`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-0"
        align="end"
        forceMount
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        {isLoading ? (
          <NotificationsDropdownSkeleton />
        ) : error ? (
          <NotificationError error={error} onRetry={retry} />
        ) : (
          <>
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notifications</h3>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="h-auto p-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <EmptyNotifications />
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                  />
                ))
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
