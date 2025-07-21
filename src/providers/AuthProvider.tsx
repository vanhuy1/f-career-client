'use client';

import ROUTES from '@/constants/navigation';
import { ROLES } from '@/enums/roles.enum';
import LoadingScreen from '@/pages/LoadingScreen';
import { userService } from '@/services/api/auth/user-api';
import {
  setUserFailure,
  setUserStart,
  setUserSuccess,
  useUserLoading,
} from '@/services/state/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LoadingState } from '@/store/store.model';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.data);
  const isLoading = useUserLoading();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const setUSer = async () => {
      try {
        dispatch(setUserStart());
        const userProfile = await userService.getMe();
        dispatch(setUserSuccess(userProfile));
        if (
          userProfile.data.roles[0] === ROLES.ADMIN &&
          pathname &&
          !pathname.startsWith('/ad')
        ) {
          router.push(ROUTES.ADMIN.Home.path);
        }
      } catch (error) {
        dispatch(setUserFailure(error as string));
      }
    };

    if (pathname === ROUTES.AUTH.SUCCESS.path) {
      return;
    }

    if (
      !user &&
      typeof window !== 'undefined' &&
      localStorage.getItem('accessToken')
    ) {
      setUSer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, pathname]);

  if (isLoading === LoadingState.loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
