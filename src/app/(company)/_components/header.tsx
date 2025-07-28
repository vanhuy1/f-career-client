'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, Plus, Menu } from 'lucide-react';
import Link from 'next/link';
import ROUTES from '@/constants/navigation';
import { companyService } from '@/services/api/company/company-api';
import { Company } from '@/types/Company';
import { useUser } from '@/services/state/userSlice';

// Interface for component props
interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

// Main Header component
const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();

  // Fetch company data
  const fetchCompanyData = useCallback(async () => {
    if (!user?.data?.companyId) {
      setError('Company ID not found');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await companyService.findOne(
        user?.data?.companyId as string,
      );
      setCompany(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load company data';
      setError(errorMessage);
      console.error('Error fetching company data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.data?.companyId]);

  // Trigger fetch on mount or when companyId changes
  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  return (
    <div className="border-b">
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu for Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </Button>

          {/* Company Logo */}
          <div className="rounded-md bg-emerald-500 p-1.5">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2Z" fill="white" />
            </svg>
          </div>

          {/* Company Name */}
          <div className="flex items-center gap-1">
            <span className="hidden text-sm text-gray-500 sm:inline">
              Company
            </span>
            <span className="text-sm font-medium">
              {isLoading
                ? 'Loading...'
                : error
                  ? 'Company'
                  : company?.companyName || 'Company'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        {/* Right-side Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Bell className="h-5 w-5 text-gray-500" aria-label="Notifications" />
          <Button
            size="sm"
            className="bg-blue-600 text-xs text-white hover:bg-blue-700 sm:text-sm"
            asChild
          >
            <Link
              href={ROUTES.CO.HOME.POSTJOB.path}
              className="flex items-center gap-2"
            >
              <Plus className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">Post a job</span>
              <span className="sm:hidden">Post</span>
            </Link>
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
