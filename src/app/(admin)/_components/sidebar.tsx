'use client';

import {
  Building2,
  Users,
  BarChart3,
  Settings,
  Bell,
  MessageSquare,
  DollarSign,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { clearUser, useUser } from '@/services/state/userSlice';
import { useAppDispatch } from '@/store/hooks';
import ROUTES from '@/constants/navigation';

const menuItems = [
  {
    title: 'Dashboard',
    url: '/ad',
    icon: BarChart3,
  },
  {
    title: 'Profit',
    url: '/ad/profit',
    icon: DollarSign,
  },
  {
    title: 'Manage Companies',
    url: '/ad/companies',
    icon: Building2,
  },
  {
    title: 'Manage Users',
    url: '/ad/users',
    icon: Users,
  },
  {
    title: 'Notifications',
    url: '/ad/notifications',
    icon: Bell,
  },

  {
    title: 'Messages',
    url: '/ad/messages',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    url: '/ad/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const user = useUser();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    // Clear localStorage and cookies manually
    localStorage.clear();
    document.cookie =
      'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    dispatch(clearUser());

    window.location.href = ROUTES.HOMEPAGE.path;
  };

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900 text-white">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">ADMIN</h2>
            <p className="text-sm text-gray-500">Management Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium tracking-wider text-gray-500 uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 data-[active=true]:bg-gray-900 data-[active=true]:text-white"
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          onClick={handleLogout}
          className="mb-4 flex w-full items-center justify-start gap-3 rounded-md bg-white px-3 text-red-500 hover:bg-gray-100 hover:text-red-600"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </Button>

        <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.data.avatar ?? ''} />
            <AvatarFallback>{user?.data.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.data.name}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.data.email}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
