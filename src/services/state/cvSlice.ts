// services/state/cvSlice.ts
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Cv } from '@/types/Cv';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { cvService } from '../api/cv/cv-api';

// Async thunks
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

interface CvState {
  list: AppStoreState<Cv[]>;
  details: {
    data: Cv[];
    loadingState: LoadingState;
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
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createCv.pending, (state) => {
        state.details.loadingState = LoadingState.loading;
        state.details.errors = null;
      })
      .addCase(createCv.fulfilled, (state, action) => {
        state.details.data.push(action.payload);
        if (!state.list.data) {
          state.list.data = [];
        }
        state.list.data.push(action.payload);
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = null;
      })
      .addCase(createCv.rejected, (state, action) => {
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = action.error.message || 'Failed to create CV';
      })
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
        } else {
          state.details.data.push(action.payload);
        }
        if (!state.list.data) {
          state.list.data = [];
        }
        const listIndex = state.list.data.findIndex(
          (cv) => cv.id === action.payload.id,
        );
        if (listIndex !== -1) {
          state.list.data[listIndex] = action.payload;
        } else {
          state.list.data.push(action.payload);
        }
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = null;
      })
      .addCase(updateCvById.rejected, (state, action) => {
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = action.error.message || 'Failed to update CV';
      })
      .addCase(deleteCvById.pending, (state) => {
        state.details.loadingState = LoadingState.loading;
        state.details.errors = null;
      })
      .addCase(deleteCvById.fulfilled, (state, action) => {
        state.details.data = state.details.data.filter(
          (cv) => cv.id !== action.payload,
        );
        if (state.list.data) {
          state.list.data = state.list.data.filter(
            (cv) => cv.id !== action.payload,
          );
        }
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = null;
      })
      .addCase(deleteCvById.rejected, (state, action) => {
        state.details.loadingState = LoadingState.loaded;
        state.details.errors = action.error.message || 'Failed to delete CV';
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
