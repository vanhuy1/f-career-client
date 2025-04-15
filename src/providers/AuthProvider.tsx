import { userService } from '@/services/api/auth/user-api';
import {
  setUserFailure,
  setUserStart,
  setUserSuccess,
  useUserLoading,
} from '@/services/state/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LoadingState } from '@/store/store.model';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const isLoading = useUserLoading();

  useEffect(() => {
    const setUSer = async () => {
      dispatch(setUserStart());
      try {
        const userProfile = await userService.getMe();
        dispatch(setUserSuccess(userProfile));
      } catch (error) {
        dispatch(setUserFailure(error as string));
      }
    };

    if (!user) {
      setUSer();
    } else {
      setUserFailure('User already exists');
    }
  }, [user, dispatch]);

  if (isLoading === LoadingState.loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
}
