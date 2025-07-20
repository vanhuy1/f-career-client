import { Task } from '@/types/Task';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

interface TaskListResponse {
  items: Task[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

class TaskService {
  private rb = new RequestBuilder().setResourcePath('tasks');

  async findAll(): Promise<Task[]> {
    const url = this.rb.buildUrl();
    const response = await httpClient.get<TaskListResponse>({
      url,
      typeCheck: (data) => {
        // Check if the response has the expected structure
        if (
          data &&
          typeof data === 'object' &&
          'items' in data &&
          Array.isArray(data.items)
        ) {
          return { success: true, data: data as TaskListResponse };
        }
        // Fallback to direct array response
        if (Array.isArray(data)) {
          return {
            success: true,
            data: {
              items: data,
              meta: { total: data.length, page: 1, limit: data.length },
            },
          };
        }
        return {
          success: true,
          data: { items: [], meta: { total: 0, page: 1, limit: 10 } },
        };
      },
    });

    // Return just the items array
    return response.items;
  }

  async findById(id: string): Promise<Task> {
    const url = this.rb.buildUrl(id);
    const response = await httpClient.get<Task>({
      url,
      typeCheck: (data) => {
        return { success: true, data: data as Task };
      },
    });
    return response;
  }

  async create(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Task> {
    const url = this.rb.buildUrl();
    const response = await httpClient.post<
      Task,
      Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
    >({
      url,
      body: task,
      typeCheck: (data) => {
        return { success: true, data: data as Task };
      },
    });
    return response;
  }

  async update(id: string, task: Partial<Task>): Promise<Task> {
    const url = this.rb.buildUrl(id);
    const response = await httpClient.patch<Task, Partial<Task>>({
      url,
      body: task,
      typeCheck: (data) => {
        return { success: true, data: data as Task };
      },
    });
    return response;
  }

  async delete(id: string): Promise<void> {
    const url = this.rb.buildUrl(id);
    await httpClient.delete({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
  }

  async syncTasksToServer(tasks: Task[]): Promise<Task[]> {
    try {
      // First check if user has tasks
      const currentTasks = await this.findAll();

      // If user has existing tasks, delete them one by one
      if (currentTasks && currentTasks.length > 0) {
        for (const task of currentTasks) {
          await this.delete(task.id);
        }
      }

      // Then create all tasks from local storage
      const createdTasks: Task[] = [];
      for (const task of tasks) {
        const { ...taskData } = task;
        const createdTask = await this.create(
          taskData as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
        );
        createdTasks.push(createdTask);
      }

      return createdTasks;
    } catch (error) {
      console.error('Error during task sync:', error);
      throw error;
    }
  }

  async initTasksFromServer(userId: number): Promise<Task[]> {
    const url = this.rb.buildUrl(`user/${userId}`);

    try {
      const response = await httpClient.get<TaskListResponse>({
        url,
        typeCheck: (data) => {
          if (
            data &&
            typeof data === 'object' &&
            'items' in data &&
            Array.isArray(data.items)
          ) {
            return { success: true, data: data as TaskListResponse };
          }
          if (Array.isArray(data)) {
            return {
              success: true,
              data: {
                items: data,
                meta: { total: data.length, page: 1, limit: data.length },
              },
            };
          }
          return {
            success: true,
            data: { items: [], meta: { total: 0, page: 1, limit: 10 } },
          };
        },
      });

      console.log(`Fetched tasks for user ${userId}:`, response.items);
      return response.items;
    } catch (error) {
      console.error(`Error fetching tasks for user ${userId}:`, error);
      return [];
    }
  }
}

export const taskService = new TaskService();
