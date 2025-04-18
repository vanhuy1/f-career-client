import { ChevronDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export default function FilterSidebar() {
  const filters = [
    {
      title: 'Industry',
      options: [
        { label: 'Advertising', count: 43 },
        { label: 'Business Service', count: 4 },
        { label: 'Blockchain', count: 5 },
        { label: 'Cloud', count: 15 },
        { label: 'Consumer Tech', count: 5 },
        { label: 'Education', count: 34 },
        { label: 'Fintech', count: 45 },
        { label: 'Gaming', count: 33 },
        { label: 'Food & Beverage', count: 5 },
        { label: 'Healthcare', count: 3 },
        { label: 'Hosting', count: 5 },
        { label: 'Media', count: 4 },
      ],
    },
    {
      title: 'Company Size',
      options: [
        { label: '1-50', count: 25 },
        { label: '51-150', count: 57 },
        { label: '151-250', count: 45 },
        { label: '251-500', count: 4, checked: true },
        { label: '501-1000', count: 43 },
        { label: '1000 - above', count: 23 },
      ],
    },
  ];

  return (
    <div className="w-full shrink-0 space-y-6 md:w-64">
      {filters.map((filter, index) => (
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
                  className="flex w-full items-center justify-between text-sm text-gray-700"
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
