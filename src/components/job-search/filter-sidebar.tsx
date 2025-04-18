import { ChevronDown } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

export default function JobFilterSidebar() {
  const JobFilter = [
    {
      title: 'Type of Employment',
      options: [
        { label: 'Full-time', count: 3 },
        { label: 'Part-Time', count: 5 },
        { label: 'Remote', count: 2 },
        { label: 'Internship', count: 24 },
        { label: 'Contract', count: 3 },
      ],
    },
    {
      title: 'Categories',
      options: [
        { label: 'Design', count: 24 },
        { label: 'Sales', count: 3 },
        { label: 'Marketing', count: 3 },
        { label: 'Business', count: 3, checked: true },
        { label: 'Human Resource', count: 6 },
        { label: 'Finance', count: 4 },
        { label: 'Engineering', count: 4 },
        { label: 'Technology', count: 5, checked: true },
      ],
    },
    {
      title: 'Job Level',
      options: [
        { label: 'Entry Level', count: 57 },
        { label: 'Mid Level', count: 3 },
        { label: 'Senior Level', count: 5 },
        { label: 'Director', count: 12, checked: true },
        { label: 'VP or Above', count: 8 },
      ],
    },
    {
      title: 'Salary Range',
      options: [
        { label: '$700 - $1000', count: 4 },
        { label: '$100 - $1500', count: 6 },
        { label: '$1500 - $2000', count: 10 },
        { label: '$3000 or above', count: 4, checked: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {JobFilter.map((filter, index) => (
        <div key={index} className="border-b pb-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-medium text-gray-700">{filter.title}</h3>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>

          <div className="space-y-2">
            {filter.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center space-x-2">
                <Checkbox
                  id={`${filter.title}-${option.label}`}
                  checked={option.checked}
                />
                <Label
                  htmlFor={`${filter.title}-${option.label}`}
                  className="flex w-full items-center justify-between text-sm"
                >
                  <span>{option.label}</span>
                  <span className="text-gray-500">({option.count})</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
