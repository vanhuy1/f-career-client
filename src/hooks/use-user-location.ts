import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setCaProfileStart,
  setCaProfileSuccess,
  useCaProfile,
  useCaProfileLoading,
} from '@/services/state/caProfileSlice';
import { candidateProfileService } from '@/services/api/profile/ca-api';
import { LoadingState } from '@/store/store.model';

export function useUserLocation(): string | null {
  const dispatch = useDispatch();
  const profile = useCaProfile();
  const loadingState = useCaProfileLoading();

  useEffect(() => {
    if (!profile && loadingState !== LoadingState.loading) {
      const fetchData = async () => {
        try {
          dispatch(setCaProfileStart());
          const candidateProfile =
            await candidateProfileService.getCandidateProfile();
          dispatch(setCaProfileSuccess(candidateProfile));
        } catch (error) {
          console.error(
            'Error fetching candidate profile for location:',
            error,
          );
        }
      };

      fetchData();
    }
  }, [dispatch, profile, loadingState]);

  return profile?.location || null;
}
