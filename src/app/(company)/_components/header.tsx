'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, ChevronDown, Plus, Menu } from 'lucide-react';
import EditFormDialog, { type FormField } from './edit-form-dialog';
import Link from 'next/link';
import ROUTES from '@/constants/navigation';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [companyEditOpen, setCompanyEditOpen] = useState(false);

  const companyFields: FormField[] = [
    {
      id: 'name',
      label: 'Company Name',
      type: 'text',
      defaultValue: 'Nomad',
      placeholder: 'Enter company name',
    },
    {
      id: 'website',
      label: 'Website',
      type: 'url',
      defaultValue: 'https://nomad.com',
      placeholder: 'Enter company website',
    },
    {
      id: 'description',
      label: 'Description',
      type: 'textarea',
      defaultValue: 'A global technology company',
      placeholder: 'Enter company description',
    },
  ];

  const handleCompanySubmit = (data: Record<string, string>) => {
    // Here you would typically update the state or send to an API
    console.log('Company data submitted:', data);
  };

  return (
    <div className="border-b">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        <div className="flex items-center gap-2">
          {/* Hamburger Menu for Mobile */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-6 w-6 text-gray-500" />
          </Button>

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
          <div
            className="flex cursor-pointer items-center gap-1"
            onClick={() => setCompanyEditOpen(true)}
          >
            <span className="hidden text-sm text-gray-500 sm:inline">
              Company
            </span>
            <span className="text-sm font-medium">Nomad</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <Bell className="h-5 w-5 text-gray-500" />
          <Button
            size="sm"
            className="bg-indigo-600 text-xs text-white hover:bg-indigo-700 sm:text-sm"
          >
            <Plus className="mr-1 h-4 w-4" />
            <Link
              href={ROUTES.CO.HOME.POSTJOB.path}
              className="flex items-center gap-2"
            >
              <span className="hidden sm:inline">Post a job</span>
            </Link>

            <span className="sm:hidden">Post</span>
          </Button>
        </div>
      </header>

      {/* Company Edit Dialog */}
      <EditFormDialog
        title="Edit Company Information"
        description="Update your company details"
        fields={companyFields}
        onSubmit={handleCompanySubmit}
        open={companyEditOpen}
        onOpenChange={setCompanyEditOpen}
      />
    </div>
  );
}
