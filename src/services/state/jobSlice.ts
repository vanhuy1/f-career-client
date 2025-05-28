import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Job } from '@/types/Job';
import { createSlice } from '@reduxjs/toolkit';

interface JobState {
  list: AppStoreState<Job[]>;
  details: {
    data: Job[];
    loadingState: LoadingState;
    errors: string | null;
  };
}

const initialState: JobState = {
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

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    // List actions
    setJobStart(state) {
      state.list.loadingState = LoadingState.loading;
      state.list.errors = null;
    },
    setJobSuccess(state, action) {
      state.list.data = action.payload;
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = null;
    },
    setJobFailure(state, action) {
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = action.payload;
    },
    clearJob(state) {
      state.list.data = [];
      state.list.loadingState = LoadingState.init;
      state.list.errors = null;
    },
    // Detail actions
    setJobDetailStart(state) {
      state.details.loadingState = LoadingState.loading;
      state.details.errors = null;
    },
    setJobDetailSuccess(state, action) {
      // Kiểm tra xem job đã tồn tại trong mảng chưa
      const existingIndex = state.details.data.findIndex(
        (job) => job.id === action.payload.id,
      );

      // Nếu chưa có thì thêm mới, nếu có rồi thì cập nhật
      if (existingIndex === -1) {
        state.details.data.push(action.payload);
      } else {
        state.details.data[existingIndex] = action.payload;
      }

      state.details.loadingState = LoadingState.loaded;
      state.details.errors = null;
    },
    setJobDetailFailure(state, action) {
      state.details.loadingState = LoadingState.loaded;
      state.details.errors = action.payload;
    },
    clearJobDetail(state) {
      state.details.data = [];
      state.details.loadingState = LoadingState.init;
      state.details.errors = null;
    },
    removeJobDetail(state, action) {
      state.details.data = state.details.data.filter(
        (job) => job.id !== action.payload,
      );
    },
  },
});

export const {
  setJobStart,
  setJobSuccess,
  setJobFailure,
  clearJob,
  setJobDetailStart,
  setJobDetailSuccess,
  setJobDetailFailure,
  clearJobDetail,
  removeJobDetail,
} = jobSlice.actions;

export default jobSlice.reducer;

// List selectors
export const selectJob = (state: RootState) => state.job.list.data;
export const selectJobLoadingState = (state: RootState) =>
  state.job.list.loadingState;
export const selectJobErrors = (state: RootState) => state.job.list.errors;

// Detail selectors
export const selectJobDetails = (state: RootState) => state.job.details.data;
export const selectJobDetailById = (id?: string) => (state: RootState) =>
  state.job.details.data.find((job) => job.id === id) || null;
export const selectJobDetailLoadingState = (state: RootState) =>
  state.job.details.loadingState;
export const selectJobDetailErrors = (state: RootState) =>
  state.job.details.errors;

// Custom hooks for list
export const useJobs = () => useAppSelector(selectJob);
export const useJobLoadingState = () => useAppSelector(selectJobLoadingState);
export const useJobErrors = () => useAppSelector(selectJobErrors);

// Custom hooks for detail
export const useJobDetails = () => useAppSelector(selectJobDetails);
export const useJobDetailById = (id?: string) =>
  useAppSelector(selectJobDetailById(id));
export const useJobDetailLoadingState = () =>
  useAppSelector(selectJobDetailLoadingState);
export const useJobDetailErrors = () => useAppSelector(selectJobDetailErrors);

// Custom hook using app dispatch
