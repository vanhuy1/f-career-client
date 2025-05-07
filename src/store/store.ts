import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/services/state/userSlice';
import authReducer from '@/services/state/authSlice';
import caProfileReducer from '@/services/state/caProfileSlice';
export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      auth: authReducer,
      caProfile: caProfileReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
