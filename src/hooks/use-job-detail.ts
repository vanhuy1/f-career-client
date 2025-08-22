import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  setJobDetailStart,
  setJobDetailSuccess,
  setJobDetailFailure,
  useJobDetailById,
  useJobDetailLoadingState,
} from '@/services/state/jobSlice';
import { jobService } from '@/services/api/jobs/job-api';
import { LoadingState } from '@/store/store.model';

export function useJobDetail(jobId: string | undefined) {
  const dispatch = useDispatch();
  const job = useJobDetailById(jobId);
  const loadingState = useJobDetailLoadingState();
  const isLoading = loadingState === LoadingState.loading;

  useEffect(() => {
    if (!jobId || job) return;

    const fetchJobData = async () => {
      dispatch(setJobDetailStart());
      try {
        const data = await jobService.findOne(jobId);
        dispatch(setJobDetailSuccess(data));
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load job data';
        dispatch(setJobDetailFailure(errorMessage));
        console.error('Failed to fetch job data:', err);
      }
    };

    fetchJobData();
  }, [jobId, job, dispatch]);

  return {
    job,
    isLoading,
    loadingState,
  };
}
