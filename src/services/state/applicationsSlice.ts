import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Application } from '@/types/Application';
import { createSlice } from '@reduxjs/toolkit';

interface ApplicationState {
  list: AppStoreState<Application[]>;
  details: {
    data: Application[];
    loadingState: LoadingState;
    errors: string | null;
  };
  selectedApplication: Application | null;
}

const initialState: ApplicationState = {
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
  selectedApplication: null,
};

const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    // List actions
    setApplicationStart(state) {
      state.list.loadingState = LoadingState.loading;
      state.list.errors = null;
    },
    setApplicationSuccess(state, action) {
      state.list.data = action.payload;
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = null;
    },
    setApplicationFailure(state, action) {
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = action.payload;
    },
    clearApplication(state) {
      state.list.data = [];
      state.list.loadingState = LoadingState.init;
      state.list.errors = null;
    },
    // Details actions
    setApplicationDetailStart(state) {
      state.details.loadingState = LoadingState.loading;
      state.details.errors = null;
    },
    setApplicationDetailSuccess(state, action) {
      const existingIndex = state.details.data.findIndex(
        (application) => application.id === action.payload.id,
      );
      if (existingIndex !== -1) {
        // If application already exists, update it
        state.details.data[existingIndex] = action.payload;
      } else {
        // If not, add the new application
        state.details.data.push(action.payload);
      }
      state.details.loadingState = LoadingState.loaded;
      state.details.errors = null;
    },
    setApplicationDetailFailure(state, action) {
      state.details.loadingState = LoadingState.loaded;
      state.details.errors = action.payload;
    },
    clearApplicationDetail(state) {
      state.details.data = [];
      state.details.loadingState = LoadingState.init;
      state.details.errors = null;
    },
    removeApplicationDetail(state, action) {
      state.details.data = state.details.data.filter(
        (application) => application.id !== action.payload,
      );
    },
    // Selected application actions
    setSelectedApplication(state, action) {
      state.selectedApplication = action.payload;
    },
    clearSelectedApplication(state) {
      state.selectedApplication = null;
    },
  },
});

export const {
  setApplicationStart,
  setApplicationSuccess,
  setApplicationFailure,
  clearApplication,
  setApplicationDetailStart,
  setApplicationDetailSuccess,
  setApplicationDetailFailure,
  clearApplicationDetail,
  removeApplicationDetail,
  setSelectedApplication,
  clearSelectedApplication,
} = applicationSlice.actions;

export default applicationSlice.reducer;

// Selectors
export const selectApplicationList = (state: RootState) =>
  state.application.list.data;
export const selectApplicationListLoadingState = (state: RootState) =>
  state.application.list.loadingState;
export const selectApplicationListErrors = (state: RootState) =>
  state.application.list.errors;

export const selectApplicationDetails = (state: RootState) =>
  state.application.details.data;
export const selectApplicationDetailById =
  (id?: string) => (state: RootState) => {
    if (!id) return null;
    return (
      state.application.details.data.find(
        (application) => application.id === id,
      ) || null
    );
  };
export const selectApplicationDetailsLoadingState = (state: RootState) =>
  state.application.details.loadingState;
export const selectApplicationDetailsErrors = (state: RootState) =>
  state.application.details.errors;

// Selector for selected application
export const selectSelectedApplication = (state: RootState) =>
  state.application.selectedApplication;

// Custom hooks for list
export const useApplicationList = () => useAppSelector(selectApplicationList);
export const useApplicationListLoadingState = () =>
  useAppSelector(selectApplicationListLoadingState);
export const useApplicationListErrors = () =>
  useAppSelector(selectApplicationListErrors);

// Custom hooks for details
export const useApplicationDetails = () =>
  useAppSelector(selectApplicationDetails);
export const useApplicationDetailById = (id?: string) =>
  useAppSelector(selectApplicationDetailById(id));
export const useApplicationDetailsLoadingState = () =>
  useAppSelector(selectApplicationDetailsLoadingState);
export const useApplicationDetailsErrors = () =>
  useAppSelector(selectApplicationDetailsErrors);

// Custom hook for selected application
export const useSelectedApplication = () =>
  useAppSelector(selectSelectedApplication);
