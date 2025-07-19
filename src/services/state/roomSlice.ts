import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Scene {
  id: string;
  name: string;
  image: string;
}

interface SceneState {
  scenes: Scene[];
  selectedScene: Scene | null;
}

interface MusicTrack {
  id: string;
  name: string;
  url: string;
}

interface MusicState {
  tracks: MusicTrack[];
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoListState {
  items: TodoItem[];
  ui: {
    isVisible: boolean;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  notes?: string;
  color?: string;
  notification?: boolean;
  notificationTime?: number; // minutes before event
  synced?: boolean; // whether synced with Google Calendar
}

interface CalendarState {
  events: CalendarEvent[];
}

interface PomodoroSettings {
  workDuration: number; // in minutes
  breakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // number of pomodoros before long break
}

interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  currentPhase: 'work' | 'break' | 'longBreak';
  timeRemaining: number; // in seconds
  completedPomodoros: number;
  settings: PomodoroSettings;
  dailyStats: {
    date: string;
    completedPomodoros: number;
    totalWorkTime: number; // in seconds
    streak: number;
  };
  ui: {
    isTimerVisible: boolean;
    isProgressVisible: boolean;
  };
}

interface RoomState {
  scene: SceneState;
  music: MusicState;
  todolist: TodoListState;
  calendar: CalendarState;
  pomodoro: PomodoroState;
}

const initialState: RoomState = {
  scene: {
    scenes: [],
    selectedScene: null,
  },
  music: {
    tracks: [],
    currentTrack: null,
    isPlaying: false,
    volume: 50,
  },
  todolist: {
    items: [],
    ui: {
      isVisible: false,
    },
  },
  calendar: {
    events: [],
  },
  pomodoro: {
    isRunning: false,
    isPaused: false,
    currentPhase: 'work',
    timeRemaining: 25 * 60, // 25 minutes in seconds
    completedPomodoros: 0,
    settings: {
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
    },
    dailyStats: {
      date: new Date().toISOString().split('T')[0],
      completedPomodoros: 0,
      totalWorkTime: 0,
      streak: 0,
    },
    ui: {
      isTimerVisible: false,
      isProgressVisible: false,
    },
  },
};

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    setScenes: (state, action: PayloadAction<Scene[]>) => {
      state.scene.scenes = action.payload;
    },
    setSelectedScene: (state, action: PayloadAction<Scene>) => {
      state.scene.selectedScene = action.payload;
    },
    setMusicTracks: (state, action: PayloadAction<MusicTrack[]>) => {
      state.music.tracks = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<MusicTrack>) => {
      state.music.currentTrack = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.music.isPlaying = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.music.volume = action.payload;
    },
    addTodoItem: (state, action: PayloadAction<TodoItem>) => {
      state.todolist.items.push(action.payload);
    },
    updateTodoItem: (
      state,
      action: PayloadAction<{ id: string; completed: boolean }>,
    ) => {
      const { id, completed } = action.payload;
      const item = state.todolist.items.find((item) => item.id === id);
      if (item) {
        item.completed = completed;
      }
    },
    removeTodoItem: (state, action: PayloadAction<string>) => {
      state.todolist.items = state.todolist.items.filter(
        (item) => item.id !== action.payload,
      );
    },
    addCalendarEvent: (state, action: PayloadAction<CalendarEvent>) => {
      state.calendar.events.push(action.payload);
    },
    updateCalendarEvent: (state, action: PayloadAction<CalendarEvent>) => {
      const index = state.calendar.events.findIndex(
        (event) => event.id === action.payload.id,
      );
      if (index !== -1) {
        state.calendar.events[index] = action.payload;
      }
    },
    removeCalendarEvent: (state, action: PayloadAction<string>) => {
      state.calendar.events = state.calendar.events.filter(
        (event) => event.id !== action.payload,
      );
    },
    startPomodoro: (state) => {
      state.pomodoro.isRunning = true;
      state.pomodoro.isPaused = false;
    },
    pausePomodoro: (state) => {
      state.pomodoro.isPaused = true;
      state.pomodoro.isRunning = false;
    },
    resetPomodoro: (state) => {
      const { workDuration } = state.pomodoro.settings;
      state.pomodoro.isRunning = false;
      state.pomodoro.isPaused = false;
      state.pomodoro.timeRemaining = workDuration * 60;
      state.pomodoro.currentPhase = 'work';
    },
    updateTimeRemaining: (state, action: PayloadAction<number>) => {
      state.pomodoro.timeRemaining = action.payload;
    },
    completePomodoro: (state) => {
      const today = new Date().toISOString().split('T')[0];

      // Reset stats if it's a new day
      if (state.pomodoro.dailyStats.date !== today) {
        state.pomodoro.dailyStats = {
          date: today,
          completedPomodoros: 0,
          totalWorkTime: 0,
          streak: state.pomodoro.dailyStats.streak + 1,
        };
      }

      state.pomodoro.completedPomodoros += 1;
      state.pomodoro.dailyStats.completedPomodoros += 1;
      state.pomodoro.dailyStats.totalWorkTime +=
        state.pomodoro.settings.workDuration * 60;

      // Determine next phase
      if (
        state.pomodoro.completedPomodoros %
          state.pomodoro.settings.longBreakInterval ===
        0
      ) {
        state.pomodoro.currentPhase = 'longBreak';
        state.pomodoro.timeRemaining =
          state.pomodoro.settings.longBreakDuration * 60;
      } else {
        state.pomodoro.currentPhase = 'break';
        state.pomodoro.timeRemaining =
          state.pomodoro.settings.breakDuration * 60;
      }
    },
    completeBreak: (state) => {
      state.pomodoro.currentPhase = 'work';
      state.pomodoro.timeRemaining = state.pomodoro.settings.workDuration * 60;
    },
    updatePomodoroSettings: (
      state,
      action: PayloadAction<Partial<PomodoroSettings>>,
    ) => {
      state.pomodoro.settings = {
        ...state.pomodoro.settings,
        ...action.payload,
      };
      // Reset timer with new duration if it's not running
      if (!state.pomodoro.isRunning) {
        state.pomodoro.timeRemaining =
          state.pomodoro.settings.workDuration * 60;
      }
    },
    toggleTimerVisibility: (state) => {
      state.pomodoro.ui.isTimerVisible = !state.pomodoro.ui.isTimerVisible;
    },
    toggleProgressVisibility: (state) => {
      state.pomodoro.ui.isProgressVisible =
        !state.pomodoro.ui.isProgressVisible;
    },
    toggleTodoVisibility: (state) => {
      state.todolist.ui.isVisible = !state.todolist.ui.isVisible;
    },
  },
});

export const {
  setScenes,
  setSelectedScene,
  setMusicTracks,
  setCurrentTrack,
  setIsPlaying,
  setVolume,
  addTodoItem,
  updateTodoItem,
  removeTodoItem,
  addCalendarEvent,
  updateCalendarEvent,
  removeCalendarEvent,
  startPomodoro,
  pausePomodoro,
  resetPomodoro,
  updateTimeRemaining,
  completePomodoro,
  completeBreak,
  updatePomodoroSettings,
  toggleTimerVisibility,
  toggleProgressVisibility,
  toggleTodoVisibility,
} = roomSlice.actions;

export default roomSlice.reducer;
