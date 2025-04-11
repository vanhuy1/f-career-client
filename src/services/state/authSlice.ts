import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { AppStoreState, LoadingState } from '../../store/store.model';
import { LoginResponse } from '@/schemas/Auth';

const initialState: AppStoreState<LoginResponse> = {
  data: null,
  loadingState: LoadingState.init,
  errors: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    loginSuccess(state, action: PayloadAction<LoginResponse>) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    refreshTokenStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    refreshTokenSuccess(state, action: PayloadAction<Partial<LoginResponse>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    refreshTokenFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    logout(state) {
      state.data = null;
      state.loadingState = LoadingState.init;
      state.errors = null;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  refreshTokenStart,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selector functions
export const selectAuth = (state: RootState) => state.auth.data;
export const selectAuthLoading = (state: RootState) => state.auth.loadingState;
export const selectAuthError = (state: RootState) => state.auth.errors;

// Custom hooks using useAppSelector
export const useAuth = () => useAppSelector(selectAuth);
export const useAuthLoading = () => useAppSelector(selectAuthLoading);
export const useAuthError = () => useAppSelector(selectAuthError);

// Custom hook using useAppDispatch
export const useAuthActions = () => {
  const dispatch = useAppDispatch();
  return {
    loginStart: () => dispatch(loginStart()),
    loginSuccess: (auth: LoginResponse) => dispatch(loginSuccess(auth)),
    loginFailure: (error: string) => dispatch(loginFailure(error)),
    refreshTokenStart: () => dispatch(refreshTokenStart()),
    refreshTokenSuccess: (auth: Partial<LoginResponse>) =>
      dispatch(refreshTokenSuccess(auth)),
    refreshTokenFailure: (error: string) =>
      dispatch(refreshTokenFailure(error)),
    logout: () => dispatch(logout()),
  };
};
