import { ROLES } from '@/enums/roles.enum';
import AccessDeniedScreen from '@/pages/AccessDeniedPage';
import { useUser } from '@/services/state/userSlice';

interface CandidatePermissionProps {
  children: React.ReactNode;
}

export function CandidatePermission({ children }: CandidatePermissionProps) {
  const user = useUser();

  if (!user || user.data.roles[0] !== ROLES.USER) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
