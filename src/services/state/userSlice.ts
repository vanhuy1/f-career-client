import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { AppStoreState, LoadingState } from '../../store/store.model';
import { UserProfile } from '@/types/User';

const initialState: AppStoreState<UserProfile> = {
  data: null,
  loadingState: LoadingState.init,
  errors: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    setUserSuccess(state, action: PayloadAction<UserProfile>) {
      state.data = action.payload;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    setUserFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    updateUserStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    updateUserSuccess(state, action: PayloadAction<Partial<UserProfile>>) {
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
    // Thêm action mới để update points
    updateAiPoints(state, action: PayloadAction<number>) {
      if (state.data && state.data.data) {
        state.data.data.point = action.payload;
      }
    },
    decrementAiPoints(state) {
      if (state.data && state.data.data && state.data.data.point > 0) {
        state.data.data.point -= 1;
      }
    },
    deleteUserStart(state) {
      state.loadingState = LoadingState.loading;
      state.errors = null;
    },
    deleteUserSuccess(state) {
      state.data = null;
      state.loadingState = LoadingState.loaded;
      state.errors = null;
    },
    deleteUserFailure(state, action: PayloadAction<string>) {
      state.loadingState = LoadingState.loaded;
      state.errors = action.payload;
    },
    clearUser(state) {
      state.data = null;
      state.loadingState = LoadingState.init;
      state.errors = null;
    },
  },
});

// Export actions
export const {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  setUserStart,
  setUserSuccess,
  setUserFailure,
  clearUser,
  updateAiPoints,
  decrementAiPoints,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Selector functions
export const selectUser = (state: RootState) => state.user.data;
export const selectUserData = (state: RootState) => state.user.data?.data;
export const selectUserLoading = (state: RootState) => state.user.loadingState;
export const selectUserError = (state: RootState) => state.user.errors;
export const selectAiPoints = (state: RootState) =>
  state.user.data?.data?.point || 0;

// Custom hooks using useAppSelector
export const useUser = () => useAppSelector(selectUser);
export const useUserData = () => useAppSelector(selectUserData);
export const useUserLoading = () => useAppSelector(selectUserLoading);
export const useUserError = () => useAppSelector(selectUserError);
export const useAiPoints = () => useAppSelector(selectAiPoints);

// Custom hook using useAppDispatch
export const useUserActions = () => {
  const dispatch = useAppDispatch();
  return {
    updateUserStart: () => dispatch(updateUserStart()),
    updateUserSuccess: (user: Partial<UserProfile>) =>
      dispatch(updateUserSuccess(user)),
    updateUserFailure: (error: string) => dispatch(updateUserFailure(error)),
    deleteUserStart: () => dispatch(deleteUserStart()),
    deleteUserSuccess: () => dispatch(deleteUserSuccess()),
    deleteUserFailure: (error: string) => dispatch(deleteUserFailure(error)),
    updateAiPoints: (points: number) => dispatch(updateAiPoints(points)),
    decrementAiPoints: () => dispatch(decrementAiPoints()),
  };
};
