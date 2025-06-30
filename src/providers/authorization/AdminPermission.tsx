import { ROLES } from '@/enums/roles.enum';
import AccessDeniedScreen from '@/pages/AccessDeniedPage';
import { useUser } from '@/services/state/userSlice';

interface AdminPermissionProps {
  children: React.ReactNode;
}

export function AdminPermission({ children }: AdminPermissionProps) {
  const user = useUser();

  if (!user || user.data.roles[0] !== ROLES.ADMIN) {
    return <AccessDeniedScreen />;
  }

  return <>{children}</>;
}
