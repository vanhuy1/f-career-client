import { ROLES } from '@/enums/roles.enum';
import AccessDeniedScreen from '@/pages/AccessDeniedPage';
import { useUser } from '@/services/state/userSlice';

interface RecruiterPermissionProps {
  children: React.ReactNode;
}

export function RecruiterPermission({ children }: RecruiterPermissionProps) {
  const user = useUser();

  if (
    !user ||
    user.data.roles[0] !== (ROLES.RECRUITER && ROLES.ADMIN_RECRUITER)
  ) {
    return <AccessDeniedScreen />;
  }
  return <>{children}</>;
}
