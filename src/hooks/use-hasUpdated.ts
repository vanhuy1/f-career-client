import { candidateProfileService } from '@/services/api/profile/ca-api';
import { useEffect, useState } from 'react';
import { useUser } from '@/services/state/userSlice';
import { ROLES } from '@/enums/roles.enum';

export function useHasUpdated() {
  const [hasUpdated, setHasUpdated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Only fetch profile data if user has USER role
        if (!user || user.data.roles[0] !== ROLES.USER) {
          setHasUpdated(null);
          setLoading(false);
          return;
        }

        const response = await candidateProfileService.getCandidateProfile();
        setHasUpdated(response.hasUpdated);
      } catch (error) {
        console.error('Error fetching candidate profile:', error);
        setHasUpdated(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  return { hasUpdated, loading };
}
