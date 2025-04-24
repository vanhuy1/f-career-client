'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { StatusCount } from '@/types/Application';

interface StatusTabsProps {
  statusCounts: StatusCount[];
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function StatusTabs({
  statusCounts,
  defaultValue = 'all',
  onChange,
}: StatusTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className="mb-8" onValueChange={onChange}>
      <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
        {statusCounts.map((item) => (
          <TabsTrigger
            key={item.status}
            value={
              item.status === 'All'
                ? 'all'
                : item.status.toLowerCase().replace(/\s+/g, '-')
            }
            className="h-10 rounded-none px-4 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
          >
            {item.status}{' '}
            <span className="ml-1 text-gray-500">({item.count})</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
