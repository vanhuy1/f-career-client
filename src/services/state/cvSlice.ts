// services/state/cvSlice.ts
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Cv } from '@/types/Cv';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cvService, CvOptimizationHistoryItem } from '../api/cv/cv-api';

// Async thunks - giữ nguyên existing thunks
export const fetchCvList = createAsyncThunk(
  'cv/fetchList',
  async (userId: number) => {
    const response = await cvService.findAll(userId);
    return response.items;
  },
);

export const fetchCvById = createAsyncThunk(
  'cv/fetchById',
  async (cvId: string) => {
    console.log('Fetching CV by ID:', cvId);
    const response = await cvService.findById(cvId);
    console.log('CV API Response in thunk:', response);

    if (!response || !response.id) {
      throw new Error('Invalid CV data received from API');
    }

    return {
      ...response,
      experience: response.experience || [],
      education: response.education || [],
      certifications: response.certifications || [],
      skills: response.skills || [],
      languages: response.languages || [],
    };
  },
);

export const fetchCvByUserId = createAsyncThunk(
  'cv/fetchByUserId',
  async (userId: number) => {
    const response = await cvService.findAll(userId);
    return response.items;
  },
);

export const createCv = createAsyncThunk(
  'cv/create',
  async (cv: Partial<Cv>) => {
    const response = await cvService.create(cv);
    return response;
  },
);

export const updateCvById = createAsyncThunk(
  'cv/update',
  async ({ cvId, cv }: { cvId: string; cv: Partial<Cv> }) => {
    console.log('Updating CV with ID:', cvId, 'Data:', cv);
    const response = await cvService.update(cvId, cv);
    console.log('Update CV API Response:', response);

    if (!response || !response.id) {
      throw new Error('Invalid CV data received from update API');
    }

    return response;
  },
);

export const deleteCvById = createAsyncThunk(
  'cv/delete',
  async (cvId: string) => {
    await cvService.delete(cvId);
    return cvId;
  },
);

// Updated optimizeCvById - sẽ tự động lưu vào history từ backend
export const optimizeCvById = createAsyncThunk(
  'cv/optimize',
  async ({
    cvId,
    jobTitle,
    jobDescription,
    userId,
  }: {
    cvId: string;
    jobTitle: string;
    jobDescription: string;
    userId: number;
  }) => {
    if (!userId) {
      throw new Error('User ID is required for optimization');
    }

    console.log('Optimizing CV with ID:', cvId, 'User ID:', userId);
    const response = await cvService.optimizeCv(
      cvId,
      jobTitle,
      jobDescription,
      userId,
    );
    console.log('Optimization API Response:', response);

    if (!response || !response.data) {
      throw new Error('Invalid optimization data received from API');
    }

    // Ensure the optimizedCv has default values for potentially null fields
    if (response.data.optimizedCv) {
      response.data.optimizedCv = {
        ...response.data.optimizedCv,
        experience: response.data.optimizedCv.experience || [],
        education: response.data.optimizedCv.education || [],
        certifications: response.data.optimizedCv.certifications || [],
        skills: response.data.optimizedCv.skills || [],
        languages: response.data.optimizedCv.languages || [],
      };
    }

    return {
      optimizedCv: response.data.optimizedCv,
      suggestions: response.data.suggestions,
      jobTitle,
      jobDescription,
    };
  },
);

// New async thunks for history
export const fetchOptimizationHistory = createAsyncThunk(
  'cv/fetchOptimizationHistory',
  async ({
    cvId,
    limit = 10,
    offset = 0,
  }: {
    cvId: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await cvService.getOptimizationHistory(
      cvId,
      limit,
      offset,
    );
    return response.data;
  },
);

export const restoreFromHistoryById = createAsyncThunk(
  'cv/restoreFromHistory',
  async (historyId: string) => {
    const response = await cvService.restoreFromHistory(historyId);
    return response.data;
  },
);

export const fetchUserOptimizationHistory = createAsyncThunk(
  'cv/fetchUserOptimizationHistory',
  async ({
    userId,
    limit = 10,
    offset = 0,
  }: {
    userId: number;
    limit?: number;
    offset?: number;
  }) => {
    const response = await cvService.getUserOptimizationHistory(
      userId,
      limit,
      offset,
    );
    return response.data;
  },
);

// Interfaces
interface CvSuggestion {
  summary?: {
    suggestion: string;
    reason: string;
  };
  skills?: {
    suggestions: string[];
    reason: string;
  };
  experience?: {
    index: number;
    field: string;
    suggestion: string;
    reason: string;
  }[];
  education?: {
    index: number;
    field: string;
    suggestion: string;
    reason: string;
  }[];
}

interface CvState {
  list: AppStoreState<Cv[]>;
  details: {
    data: Cv[];
    loadingState: LoadingState;
    errors: string | null;
  };
  optimization: {
    suggestions: CvSuggestion | null;
    history: CvOptimizationHistoryItem[];
    selectedHistoryId: string | null;
    historyMeta: {
      total: number;
      limit: number;
      offset: number;
    };
    loadingState: LoadingState;
    historyLoadingState: LoadingState;
    errors: string | null;
  };
}

const initialState: CvState = {
  list: {
    data: [],
    loadingState: LoadingState.init,
    errors: null,
  },
  details: {
    data: [],
    loadingState: LoadingState.init,
    errors: null,
  },
  optimization: {
    suggestions: null,
    history: [],
    selectedHistoryId: null,
    historyMeta: {
      total: 0,
      limit: 10,
      offset: 0,
    },
    loadingState: LoadingState.init,
    historyLoadingState: LoadingState.init,
    errors: null,
  },
};

const cvSlice = createSlice({
  name: 'cv',
  initialState,
  reducers: {
    // List actions
    setCvStart(state) {
      state.list.loadingState = LoadingState.loading;
      state.list.errors = null;
    },
    setCvSuccess(state, action: PayloadAction<Cv[]>) {
      state.list.data = action.payload;
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = null;
    },
    setCvFailure(state, action: PayloadAction<string>) {
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = action.payload;
    },
    clearCv(state) {
      state.list.data = [];
      state.list.loadingState = LoadingState.init;
      state.list.errors = null;
    },
    // Detail actions
    setCvDetailStart(state) {
      state.details.loadingState = LoadingState.loading;
      state.details.errors = null;
    },
    setCvDetailSuccess(state, action: PayloadAction<Cv>) {
      const existingIndex = state.details.data.findIndex(
        (cv) => cv.id === action.payload.id,
      );
      if (existingIndex === -1) {
        state.details.data.push(action.payload);
      } else {
        state.details.data[existingIndex] = action.payload;
      }
      state.details.loadingState = LoadingState.loaded;
      state.details.errors = null;
    },
    setCvDetailFailure(state, action: PayloadAction<string>) {
      state.details.loadingState = LoadingState.loaded;
      state.details.errors = action.payload;
    },
    clearCvDetail(state) {
      state.details.data = [];
      state.details.loadingState = LoadingState.init;
      state.details.errors = null;
    },
    removeCvDetail(state, action: PayloadAction<string>) {
      state.details.data = state.details.data.filter(
        (cv) => cv.id !== action.payload,
      );
    },
    // Optimization actions
    clearOptimizationSuggestions(state) {
      state.optimization.suggestions = null;
      state.optimization.loadingState = LoadingState.init;
      state.optimization.errors = null;
    },
    selectHistoryItem(state, action: PayloadAction<string | null>) {
      state.optimization.selectedHistoryId = action.payload;
    },
    clearOptimizationHistory(state) {
      state.optimization.history = [];
      state.optimization.historyMeta = {
        total: 0,
        limit: 10,
        offset: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing fetch CV list handlers
      .addCase(fetchCvList.pending, (state) => {
        state.list.loadingState = LoadingState.loading;
        state.list.errors = null;
      })
      .addCase(fetchCvList.fulfilled, (state, action) => {
        state.list.data = action.payload;
        state.list.loadingState = LoadingState.loaded;
        state.list.errors = null;
      })
      .addCase(fetchCvList.rejected, (state, action) => {
        state.list.loadingState = LoadingState.loaded;
        state.list.errors = action.error.message || 'Failed to fetch CVs';
      })
      // Existing fetch CV by ID handlers
      .addCase(fetchCvById.pending, (state) => {
        state.details.loadingState = LoadingState.loading;
        state.details.errors = null;
      })
      .addCase(fetchCvById.fulfilled, (state, action) => {
        console.log('Storing CV in Redux:', action.payload);
        const existingIndex = state.details.data.findIndex(
          (cv) => cv.id === action.payload.id,
        );
        if (existingIndex === -1) {
          state.details.data.push(action.payload);
        } else {
          state.details.data[existingIndex] = action.payload;
        }
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = null;
      })
      .addCase(fetchCvById.rejected, (state, action) => {
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = action.error.message || 'Failed to fetch CV';
      })
      // Existing create CV handlers
      .addCase(createCv.pending, (state) => {
        state.details.loadingState = LoadingState.loading;
        state.details.errors = null;
      })
      .addCase(createCv.fulfilled, (state, action) => {
        state.details.data.push(action.payload);
        if (state.list.data) {
          state.list.data.push(action.payload);
        }
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = null;
      })
      .addCase(createCv.rejected, (state, action) => {
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = action.error.message || 'Failed to create CV';
      })
      // Existing update CV handlers
      .addCase(updateCvById.pending, (state) => {
        state.details.loadingState = LoadingState.loading;
        state.details.errors = null;
      })
      .addCase(updateCvById.fulfilled, (state, action) => {
        const existingIndex = state.details.data.findIndex(
          (cv) => cv.id === action.payload.id,
        );
        if (existingIndex !== -1) {
          state.details.data[existingIndex] = action.payload;
        }
        if (state.list.data) {
          const listIndex = state.list.data.findIndex(
            (cv) => cv.id === action.payload.id,
          );
          if (listIndex !== -1) {
            state.list.data[listIndex] = action.payload;
          }
        }
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = null;
      })
      .addCase(updateCvById.rejected, (state, action) => {
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = action.error.message || 'Failed to update CV';
      })
      // Existing delete CV handlers
      .addCase(deleteCvById.fulfilled, (state, action) => {
        state.details.data = state.details.data.filter(
          (cv) => cv.id !== action.payload,
        );
        if (state.list.data) {
          state.list.data = state.list.data.filter(
            (cv) => cv.id !== action.payload,
          );
        }
      })
      // Optimization handlers - updated
      .addCase(optimizeCvById.pending, (state) => {
        state.optimization.loadingState = LoadingState.loading;
        state.optimization.errors = null;
      })
      .addCase(optimizeCvById.fulfilled, (state, action) => {
        state.optimization.suggestions = action.payload.suggestions;
        state.optimization.loadingState = LoadingState.loaded;
        state.optimization.errors = null;
      })
      .addCase(optimizeCvById.rejected, (state, action) => {
        state.optimization.loadingState = LoadingState.loaded;
        state.optimization.errors =
          action.error.message || 'Failed to optimize CV';
      })
      // New history handlers
      .addCase(fetchOptimizationHistory.pending, (state) => {
        state.optimization.historyLoadingState = LoadingState.loading;
      })
      .addCase(fetchOptimizationHistory.fulfilled, (state, action) => {
        state.optimization.history = action.payload;
        state.optimization.historyLoadingState = LoadingState.loaded;
      })
      .addCase(fetchOptimizationHistory.rejected, (state, action) => {
        state.optimization.historyLoadingState = LoadingState.loaded;
        state.optimization.errors =
          action.error.message || 'Failed to fetch optimization history';
      })
      // Restore from history handlers
      .addCase(restoreFromHistoryById.pending, (state) => {
        state.optimization.loadingState = LoadingState.loading;
      })
      .addCase(restoreFromHistoryById.fulfilled, (state, action) => {
        state.optimization.suggestions = action.payload.suggestions;
        state.optimization.loadingState = LoadingState.loaded;
      })
      .addCase(restoreFromHistoryById.rejected, (state, action) => {
        state.optimization.loadingState = LoadingState.loaded;
        state.optimization.errors =
          action.error.message || 'Failed to restore from history';
      });
  },
});

export const {
  setCvStart,
  setCvSuccess,
  setCvFailure,
  clearCv,
  setCvDetailStart,
  setCvDetailSuccess,
  setCvDetailFailure,
  clearCvDetail,
  removeCvDetail,
  clearOptimizationSuggestions,
  selectHistoryItem,
  clearOptimizationHistory,
} = cvSlice.actions;

export default cvSlice.reducer;

// List selectors
export const selectCv = (state: RootState) => state.cv.list.data;
export const selectCvLoadingState = (state: RootState) =>
  state.cv.list.loadingState;
export const selectCvErrors = (state: RootState) => state.cv.list.errors;

// Detail selectors
export const selectCvDetails = (state: RootState) => state.cv.details.data;
export const selectCvDetailById = (id?: string) => (state: RootState) =>
  state.cv.details.data.find((cv) => cv.id === id) || null;
export const selectCvDetailLoadingState = (state: RootState) =>
  state.cv.details.loadingState;
export const selectCvDetailErrors = (state: RootState) =>
  state.cv.details.errors;

// Optimization selectors
export const selectCvOptimizationSuggestions = (state: RootState) =>
  state.cv.optimization.suggestions;
export const selectCvOptimizationLoadingState = (state: RootState) =>
  state.cv.optimization.loadingState;
export const selectCvOptimizationErrors = (state: RootState) =>
  state.cv.optimization.errors;

// History selectors
export const selectCvOptimizationHistory = (state: RootState) =>
  state.cv.optimization.history;
export const selectCvOptimizationHistoryLoadingState = (state: RootState) =>
  state.cv.optimization.historyLoadingState;
export const selectSelectedHistoryId = (state: RootState) =>
  state.cv.optimization.selectedHistoryId;
export const selectHistoryMeta = (state: RootState) =>
  state.cv.optimization.historyMeta;

// Custom hooks for list
export const useCvs = () => useAppSelector(selectCv);
export const useCvLoadingState = () => useAppSelector(selectCvLoadingState);
export const useCvErrors = () => useAppSelector(selectCvErrors);

// Custom hooks for detail
export const useCvDetails = () => useAppSelector(selectCvDetails);
export const useCvDetailById = (id?: string) =>
  useAppSelector(selectCvDetailById(id));
export const useCvDetailLoadingState = () =>
  useAppSelector(selectCvDetailLoadingState);
export const useCvDetailErrors = () => useAppSelector(selectCvDetailErrors);

// Custom hooks for optimization
export const useCvOptimizationSuggestions = () =>
  useAppSelector(selectCvOptimizationSuggestions);
export const useCvOptimizationLoadingState = () =>
  useAppSelector(selectCvOptimizationLoadingState);
export const useCvOptimizationErrors = () =>
  useAppSelector(selectCvOptimizationErrors);

// Custom hooks for history
export const useCvOptimizationHistory = () =>
  useAppSelector(selectCvOptimizationHistory);
export const useCvOptimizationHistoryLoadingState = () =>
  useAppSelector(selectCvOptimizationHistoryLoadingState);
export const useSelectedHistoryId = () =>
  useAppSelector(selectSelectedHistoryId);
export const useHistoryMeta = () => useAppSelector(selectHistoryMeta);
