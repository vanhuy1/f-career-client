import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Task } from '@/types/Task';
import { taskService } from '../api/room/task-api';

// Define the state interface
interface TasksState extends AppStoreState<Task[]> {
  selectedTask: Task | null;
}

// Initial state
const initialState: TasksState = {
  data: [],
  loadingState: LoadingState.init,
  errors: null,
  selectedTask: null,
};

// Async thunks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await taskService.findAll();
      // Check if response is in {items: Task[]} format and extract the items array
      if (
        response &&
        typeof response === 'object' &&
        'items' in response &&
        Array.isArray(response.items)
      ) {
        return response.items as Task[];
      }
      // Return as is if it's already an array
      return Array.isArray(response) ? response : [];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch tasks',
      );
    }
  },
);

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await taskService.findById(id);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch task',
      );
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async (
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
    { rejectWithValue },
  ) => {
    try {
      return await taskService.create(task);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to create task',
      );
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async (
    { id, task }: { id: string; task: Partial<Task> },
    { rejectWithValue },
  ) => {
    try {
      return await taskService.update(id, task);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to update task',
      );
    }
  },
);

export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await taskService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to delete task',
      );
    }
  },
);

// Create the slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<Task | null>) => {
      state.selectedTask = action.payload;
    },
    clearTasks: (state) => {
      state.data = [];
      state.loadingState = LoadingState.init;
      state.errors = null;
      state.selectedTask = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loadingState = LoadingState.loading;
        state.errors = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loadingState = LoadingState.loaded;
        state.data = action.payload || [];
        state.errors = null;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loadingState = LoadingState.error;
        state.errors = action.payload as string;
      });

    // Fetch task by ID
    builder
      .addCase(fetchTaskById.pending, (state) => {
        state.loadingState = LoadingState.loading;
        state.errors = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loadingState = LoadingState.loaded;
        state.selectedTask = action.payload;
        state.errors = null;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loadingState = LoadingState.error;
        state.errors = action.payload as string;
      });

    // Create task
    builder
      .addCase(createTask.pending, (state) => {
        state.loadingState = LoadingState.loading;
        state.errors = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loadingState = LoadingState.loaded;
        state.data = Array.isArray(state.data)
          ? [...state.data, action.payload]
          : [action.payload];
        state.errors = null;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loadingState = LoadingState.error;
        state.errors = action.payload as string;
      });

    // Update task
    builder
      .addCase(updateTask.pending, (state) => {
        state.loadingState = LoadingState.loading;
        state.errors = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loadingState = LoadingState.loaded;
        if (Array.isArray(state.data)) {
          state.data = state.data.map((task) =>
            task.id === action.payload.id ? action.payload : task,
          );
        }
        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
        state.errors = null;
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loadingState = LoadingState.error;
        state.errors = action.payload as string;
      });

    // Delete task
    builder
      .addCase(deleteTask.pending, (state) => {
        state.loadingState = LoadingState.loading;
        state.errors = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loadingState = LoadingState.loaded;
        if (Array.isArray(state.data)) {
          state.data = state.data.filter((task) => task.id !== action.payload);
        }
        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
        state.errors = null;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loadingState = LoadingState.error;
        state.errors = action.payload as string;
      });
  },
});

// Export actions
export const { setSelectedTask, clearTasks } = tasksSlice.actions;

// Export selectors
export const selectTasks = (state: RootState) => state.tasks?.data || [];
export const selectTasksLoading = (state: RootState) =>
  state.tasks?.loadingState || LoadingState.init;
export const selectTasksError = (state: RootState) => state.tasks?.errors;
export const selectSelectedTask = (state: RootState) =>
  state.tasks?.selectedTask;

// Export reducer
export default tasksSlice.reducer;
