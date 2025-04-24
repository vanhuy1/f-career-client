import type { JobApplication } from '@/types/Application';
import { ApplicationRow } from './application-row';

interface ApplicationsTableProps {
  applications: JobApplication[];
  onOptionsClick?: (id: number) => void;
}

export function ApplicationsTable({
  applications,
  onOptionsClick,
}: ApplicationsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="px-4 py-4 font-medium text-gray-500">#</th>
            <th className="px-4 py-4 font-medium text-gray-500">
              Company Name
            </th>
            <th className="px-4 py-4 font-medium text-gray-500">Roles</th>
            <th className="px-4 py-4 font-medium text-gray-500">
              Date Applied
            </th>
            <th className="px-4 py-4 font-medium text-gray-500">Status</th>
            <th className="px-4 py-4 font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              onOptionsClick={onOptionsClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
