export interface Notification {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_read: boolean;
  user_id: number;
  type?: 'info' | 'success' | 'warning' | 'error';
  action_url?: string;
}

export interface NotificationPagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationResponse {
  data: Notification[] | null;
  pagination?: NotificationPagination;
  error: Error | null;
}

export interface NotificationMutationResponse {
  success: boolean;
  error?: string;
}

export interface NotificationParams {
  page?: number;
  limit?: number;
  userId?: string;
}
