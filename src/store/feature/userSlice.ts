import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/store";
import { useAppSelector, useAppDispatch } from "@/store/hooks"; // Already imported
import { AppStoreState, LoadingState } from "../store.model";

interface User {
  id: string;
  name: string;
  email: string;
  isAuthenticated: boolean;
}

const initialState: AppStoreState<User> = {
  data: null,
  loadingState: LoadingState.init,
  errors: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    loginSuccess(state, action: PayloadAction<User>) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    logout(state) {
      state.data = null;
      state.loadingState = LoadingState.init;
      state.errors = null;
    },
    updateUserStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    updateUserSuccess(state, action: PayloadAction<Partial<User>>) {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    updateUserFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
  },
});

// Export actions
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Selector functions
export const selectUser = (state: RootState) => state.user.data;
export const selectUserLoading = (state: RootState) => state.user.loadingState;
export const selectUserError = (state: RootState) => state.user.errors;

// Custom hooks using useAppSelector
export const useUser = () => useAppSelector(selectUser);
export const useUserLoading = () => useAppSelector(selectUserLoading);
export const useUserError = () => useAppSelector(selectUserError);

// Custom hook using useAppDispatch
export const useUserActions = () => {
  const dispatch = useAppDispatch();
  return {
    loginStart: () => dispatch(loginStart()),
    loginSuccess: (user: User) => dispatch(loginSuccess(user)),
    loginFailure: (error: string) => dispatch(loginFailure(error)),
    logout: () => dispatch(logout()),
    updateUserStart: () => dispatch(updateUserStart()),
    updateUserSuccess: (user: Partial<User>) =>
      dispatch(updateUserSuccess(user)),
    updateUserFailure: (error: string) => dispatch(updateUserFailure(error)),
  };
};
