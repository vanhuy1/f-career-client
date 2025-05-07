import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { CandidateProfile } from '@/types/CandidateProfile';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppStoreState<CandidateProfile> = {
  data: null,
  loadingState: LoadingState.init,
  errors: null,
};

const caProfileSlice = createSlice({
  name: 'caProfile',
  initialState,
  reducers: {
    setCaProfileStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },

    setCaProfileSuccess(state, action: PayloadAction<CandidateProfile>) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },

    setCaProfileFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },

    updateCaProfileStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },

    updateCaProfileSuccess(state) {
      // if (state.data) {
      //     state.data = { ...state.data, ...action.payload };
      // }
      state.data = null;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },

    updateCaProfileFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },

    clearCaProfile(state) {
      state.data = null;
      state.loadingState = LoadingState.init;
      state.errors = null;
    },
  },
});

export const {
  setCaProfileStart,
  setCaProfileSuccess,
  setCaProfileFailure,
  updateCaProfileStart,
  updateCaProfileSuccess,
  updateCaProfileFailure,
} = caProfileSlice.actions;

export default caProfileSlice.reducer;

export const selectCaProfile = (state: RootState) => state.caProfile.data;
export const selectCaProfileLoading = (state: RootState) =>
  state.caProfile.loadingState;
export const selectCaProfileErrors = (state: RootState) =>
  state.caProfile.errors;

export const useCaProfile = () => useAppSelector(selectCaProfile);
export const useCaProfileLoading = () => useAppSelector(selectCaProfileLoading);
export const useCaProfileErrors = () => useAppSelector(selectCaProfileErrors);
