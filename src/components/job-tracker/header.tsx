import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  userName: string;
  dateRange: string;
}

export function Header({ userName, dateRange }: HeaderProps) {
  return (
    <div className="mb-4 flex flex-col items-start justify-between md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Keep it up, {userName}
        </h1>
        <p className="mt-1 text-gray-500">
          Here is job applications status from {dateRange}.
        </p>
      </div>
      <div className="mt-4 md:mt-0">
        <Button variant="outline" className="h-10 rounded-md border px-4 py-2">
          <span>Jul 19 - Jul 25</span>
          <CalendarIcon className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
