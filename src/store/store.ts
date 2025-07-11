import { configureStore } from '@reduxjs/toolkit';
import userReducer from '@/services/state/userSlice';
import authReducer from '@/services/state/authSlice';
import caProfileReducer from '@/services/state/caProfileSlice';
import jobReducer from '@/services/state/jobSlice';
import companyReducer from '@/services/state/companySlice';
import cvReducer from '@/services/state/cvSlice';
import applicationReducer from '@/services/state/applicationsSlice';
import { applicantDetailReducer } from '@/services/state/applicantDetailSlice';
import roomReducer from '@/services/state/roomSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      user: userReducer,
      auth: authReducer,
      caProfile: caProfileReducer,
      job: jobReducer,
      company: companyReducer,
      cv: cvReducer,
      application: applicationReducer,
      applicantDetail: applicantDetailReducer,
      room: roomReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
