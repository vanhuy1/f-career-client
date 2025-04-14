import { authService } from '@/services/api/auth/auth-example';
import {
  setUserFailure,
  setUserStart,
  setUserSuccess,
} from '@/services/state/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);

  useEffect(() => {
    const setUSer = async () => {
      dispatch(setUserStart());
      try {
        const userProfile = await authService.getProfile();
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

  return <>{children}</>;
}
