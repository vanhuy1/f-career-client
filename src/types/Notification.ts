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

export interface NotificationResponse {
  data: Notification[] | null;
  error: Error | null;
}

export interface NotificationMutationResponse {
  success: boolean;
  error?: string;
}
