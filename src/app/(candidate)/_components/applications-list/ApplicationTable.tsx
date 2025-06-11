'use client';

import type React from 'react';
import { useAppDispatch } from '@/store/hooks';
import type { Application } from '@/types/Application';
import { MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { formatDate } from './utils/helpers';
import StatusBadge from './StatusBadge';
import { useRouter } from 'next/navigation';
import { setSelectedApplication } from '@/services/state/applicationsSlice';

interface ApplicationTableProps {
  applications: Application[] | null;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export default function ApplicationTable({
  applications,
  loading,
  error,
  page,
  pageSize,
  total,
  onPageChange,
}: ApplicationTableProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleRowClick = (application: Application) => {
    // Set the selected application in Redux before navigation
    dispatch(setSelectedApplication(application));
    router.push(`/ca/application-list/${application.id}`);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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

  if (applications?.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">No applications found</div>
      </div>
    );
  }

  return (
    <div className="mb-16 overflow-x-auto">
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
          {applications?.map((application, index) => (
            <tr
              key={application.id}
              className={`${
                index % 2 === 1 ? 'bg-gray-50' : 'bg-white'
              } cursor-pointer transition-colors hover:bg-gray-100`}
              onClick={() => handleRowClick(application)}
            >
              <td className="px-4 py-4">{application.id}</td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-100">
                    {application.company?.logoUrl ? (
                      <Image
                        src={application.company?.logoUrl || '/placeholder.svg'}
                        alt={application.company.companyName}
                        width={40}
                        height={40}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">
                        {application.company?.companyName.charAt(0)}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">
                    {application.company?.companyName}
                  </span>
                </div>
              </td>
              <td className="px-4 py-4">{application.job?.title}</td>
              <td className="px-4 py-4">
                {formatDate(application.applied_at)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge
                  status={
                    application.status as import('@/types/Application').ApplicationStatus
                  }
                />
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
      {/* Pagination controls */}
      <div className="mt-4 flex justify-center">
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="mx-2">{page}</span>
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          onClick={() => onPageChange(page + 1)}
          disabled={
            (applications?.length ?? 0) < pageSize ||
            applications?.length === total
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
