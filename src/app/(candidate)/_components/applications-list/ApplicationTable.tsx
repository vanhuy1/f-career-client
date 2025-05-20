'use client';

import type React from 'react';

import type { Application } from '@/types/Application';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from './utils/helpers';
import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';

interface ApplicationTableProps {
  applications: Application[];
  loading: boolean;
  error: string | null;
}

export default function ApplicationTable({
  applications,
  loading,
  error,
}: ApplicationTableProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">No applications found</div>
      </div>
    );
  }

  const handleRowClick = (id: string | number) => {
    router.push(`/ca/application-list/${id}`);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="mb-16 overflow-x-auto">
      {' '}
      {/* Added mb-16 to make space for the fixed pagination */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="w-12 px-4 py-3">#</th>
            <th className="px-4 py-3">Company Name</th>
            <th className="px-4 py-3">Roles</th>
            <th className="px-4 py-3">Date Applied</th>
            <th className="px-4 py-3">Status</th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {applications.map((application, index) => (
            <tr
              key={application.id}
              className={`${
                index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
              } cursor-pointer transition-colors hover:bg-gray-100`}
              onClick={() => handleRowClick(application.id)}
            >
              <td className="px-4 py-4">{application.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    {application.company.logo ? (
                      <Image
                        src={application.company.logo || '/placeholder.svg'}
                        alt={application.company.name}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        {application.company.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">
                    {application.company.name}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">{application.role}</td>
              <td className="px-4 py-4">
                {formatDate(application.dateApplied)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={application.status} />
              </td>
              <td className="px-4 py-4">
                <button
                  className="rounded-full p-1 hover:bg-gray-200"
                  onClick={handleMoreClick}
                >
                  <MoreVertical className="h-5 w-5 text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
