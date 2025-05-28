import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { AppStoreState, LoadingState } from '@/store/store.model';
import { Company } from '@/types/Company';
import { createSlice } from '@reduxjs/toolkit';

interface CompanyState {
  list: AppStoreState<Company[]>;
  details: {
    data: Company[];
    loadingState: LoadingState;
    errors: string | null;
  };
}

const initialState: CompanyState = {
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

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    // List actions
    setCompanyStart(state) {
      state.list.loadingState = LoadingState.loading;
      state.list.errors = null;
    },
    setCompanySuccess(state, action) {
      state.list.data = action.payload;
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = null;
    },
    setCompanyFailure(state, action) {
      state.list.loadingState = LoadingState.loaded;
      state.list.errors = action.payload;
    },
    clearCompany(state) {
      state.list.data = [];
      state.list.loadingState = LoadingState.init;
      state.list.errors = null;
    },

    // Detail actions
    setCompanyDetailStart(state) {
      state.details.loadingState = LoadingState.loading;
      state.details.errors = null;
    },
    setCompanyDetailSuccess(state, action) {
      // Kiểm tra xem company đã tồn tại trong mảng chưa
      const existingIndex = state.details.data.findIndex(
        (company) => company.id === action.payload.id,
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
    setCompanyDetailFailure(state, action) {
      state.details.loadingState = LoadingState.loaded;
      state.details.errors = action.payload;
    },
    clearCompanyDetail(state) {
      state.details.data = [];
      state.details.loadingState = LoadingState.init;
      state.details.errors = null;
    },
    removeCompanyDetail(state, action) {
      state.details.data = state.details.data.filter(
        (company) => company.id !== action.payload,
      );
    },
  },
});

export const {
  setCompanyStart,
  setCompanySuccess,
  setCompanyFailure,
  clearCompany,
  setCompanyDetailStart,
  setCompanyDetailSuccess,
  setCompanyDetailFailure,
  clearCompanyDetail,
  removeCompanyDetail,
} = companySlice.actions;

export default companySlice.reducer;

// List selectors
export const selectCompany = (state: RootState) => state.company.list.data;
export const selectCompanyLoadingState = (state: RootState) =>
  state.company.list.loadingState;
export const selectCompanyErrors = (state: RootState) =>
  state.company.list.errors;

// Detail selectors
export const selectCompanyDetails = (state: RootState) =>
  state.company.details.data;
export const selectCompanyDetailById = (id: string) => (state: RootState) =>
  state.company.details.data.find((company) => company.id === id) || null;
export const selectCompanyDetailLoadingState = (state: RootState) =>
  state.company.details.loadingState;
export const selectCompanyDetailErrors = (state: RootState) =>
  state.company.details.errors;

// Custom hooks for list
export const useCompanies = () => useAppSelector(selectCompany);
export const useCompanyLoadingState = () =>
  useAppSelector(selectCompanyLoadingState);
export const useCompanyErrors = () => useAppSelector(selectCompanyErrors);

// Custom hooks for detail
export const useCompanyDetails = () => useAppSelector(selectCompanyDetails);
export const useCompanyDetailById = (id: string) =>
  useAppSelector(selectCompanyDetailById(id));
export const useCompanyDetailLoadingState = () =>
  useAppSelector(selectCompanyDetailLoadingState);
export const useCompanyDetailErrors = () =>
  useAppSelector(selectCompanyDetailErrors);
