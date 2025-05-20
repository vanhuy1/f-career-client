'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  displayText: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onDateRangeChange,
  displayText,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // This would be replaced with a proper date picker component in a real app
  // For this example, we're just showing a button that would open the date picker

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        <span>{displayText}</span>
        <Calendar className="h-4 w-4 text-gray-500" />
      </button>

      {/* This would be a proper date picker dropdown in a real implementation */}
      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-lg border bg-white p-4 shadow-lg">
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onDateRangeChange(e.target.value, endDate)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onDateRangeChange(startDate, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
