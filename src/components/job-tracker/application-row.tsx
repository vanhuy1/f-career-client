'use client';

import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CompanyLogo } from './company-logo';
import type { JobApplication } from '@/types/Application';

interface ApplicationRowProps {
  application: JobApplication;
  onOptionsClick?: (id: number) => void;
}

export function ApplicationRow({
  application,
  onOptionsClick,
}: ApplicationRowProps) {
  const getStatusBadge = () => {
    switch (application.statusColor) {
      case 'yellow':
        return (
          <Badge className="border border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-50">
            {application.status}
          </Badge>
        );
      case 'green':
        return (
          <Badge className="border border-green-200 bg-green-50 text-green-600 hover:bg-green-50">
            {application.status}
          </Badge>
        );
      case 'blue':
        return (
          <Badge className="border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-50">
            {application.status}
          </Badge>
        );
      case 'red':
        return (
          <Badge className="border border-red-200 bg-red-50 text-red-600 hover:bg-red-50">
            {application.status}
          </Badge>
        );
      case 'purple':
        return (
          <Badge className="border border-purple-200 bg-purple-50 text-purple-600 hover:bg-purple-50">
            {application.status}
          </Badge>
        );
      default:
        return <Badge variant="outline">{application.status}</Badge>;
    }
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-6 text-gray-500">{application.id}</td>
      <td className="px-4 py-6">
        <div className="flex items-center">
          <CompanyLogo
            company={application.company.name}
            color={application.company.logoColor}
          />
          <span className="ml-3 font-medium">{application.company.name}</span>
        </div>
      </td>
      <td className="px-4 py-6 text-gray-700">{application.role}</td>
      <td className="px-4 py-6 text-gray-700">{application.dateApplied}</td>
      <td className="px-4 py-6">{getStatusBadge()}</td>
      <td className="px-4 py-6 text-right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOptionsClick && onOptionsClick(application.id)}
        >
          <MoreVertical className="h-5 w-5" />
          <span className="sr-only">More options</span>
        </Button>
      </td>
    </tr>
  );
}
