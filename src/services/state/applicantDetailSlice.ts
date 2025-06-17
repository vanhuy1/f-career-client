import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { ApplicantDetail } from '@/types/Applicants';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: AppStoreState<ApplicantDetail> = {
  data: null,
  loadingState: LoadingState.init,
  errors: null,
};

const applicantDetailSlice = createSlice({
  name: 'applicantDetail',
  initialState,
  reducers: {
    setApplicantDetailStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    setApplicantDetailSuccess(state, action: PayloadAction<ApplicantDetail>) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    setApplicantDetailFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    clearApplicantDetail(state) {
      state.data = null;
      state.loadingState = LoadingState.init;
      state.errors = null;
    },
  },
});

export const {
  setApplicantDetailStart,
  setApplicantDetailSuccess,
  setApplicantDetailFailure,
  clearApplicantDetail,
} = applicantDetailSlice.actions;

export const applicantDetailReducer = applicantDetailSlice.reducer;

export const selectApplicantDetail = (state: RootState) =>
  state.applicantDetail.data;
export const selectApplicantDetailLoadingState = (state: RootState) =>
  state.applicantDetail.loadingState;
export const selectApplicantDetailErrors = (state: RootState) =>
  state.applicantDetail.errors;

export const useApplicantDetail = () => useAppSelector(selectApplicantDetail);
export const useApplicantDetailLoadingState = () =>
  useAppSelector(selectApplicantDetailLoadingState);
export const useApplicantDetailErrors = () =>
  useAppSelector(selectApplicantDetailErrors);
