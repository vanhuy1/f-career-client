export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  reminderTime?: string;
  tags?: string[];
  assignee?: string;
  checklist?: Array<{
    id: string;
    text: string;
    completed: boolean;
  }>;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly' | null;
    interval: number;
  };
  estimatedTime?: number;
  priority: 'low' | 'medium' | 'high';
  progress?: number;
  userId: number;
}
