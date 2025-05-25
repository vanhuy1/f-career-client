import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Job } from '@/types/Job';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AppStoreState<Job[]> = {
  data: [],
  loadingState: LoadingState.init,
  errors: null,
};

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    setJobStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    setJobSuccess(state, action) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    setJobFailure(state, action) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    clearJob(state) {
      state.data = [];
      state.loadingState = LoadingState.init;
      state.errors = null;
    },
  },
});

export const { setJobStart, setJobSuccess, setJobFailure, clearJob } =
  jobSlice.actions;

export default jobSlice.reducer;

// Selector functions
export const selectJob = (state: RootState) => state.job.data;
export const selectJobById = (id: string | number) => (state: RootState) =>
  state.job.data?.find((job) => job.id === id) || null;
export const selectJobLoadingState = (state: RootState) =>
  state.job.loadingState;
export const selectJobErrors = (state: RootState) => state.job.errors;

// Custom hooks using selectors
export const useJobs = () => useAppSelector(selectJob);
export const useJobById = (id: string | number) =>
  useAppSelector(selectJobById(id));
export const useJobLoadingState = () => useAppSelector(selectJobLoadingState);
export const useJobErrors = () => useAppSelector(selectJobErrors);

// Custom hook using app dispatch
