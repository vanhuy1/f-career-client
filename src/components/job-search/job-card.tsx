import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface JobCardProps {
  title: string;
  company: string;
  location: string;
  logo: string;
  tags: string[];
  applied: number;
  capacity: number;
}

export default function JobCard({
  title,
  company,
  location,
  logo,
  tags,
  applied,
  capacity,
}: JobCardProps) {
  // Calculate progress percentage
  const progress = (applied / capacity) * 100;

  // Determine color based on applications
  const getProgressColor = () => {
    if (applied === 0) return 'bg-gray-200';
    if (applied < capacity / 2) return 'bg-green-500';
    if (applied < capacity) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="flex items-start gap-4 p-4">
        <div className="shrink-0">
          <div className="h-14 w-14 overflow-hidden rounded bg-gray-100">
            <Image
              src={logo || '/placeholder.svg'}
              alt={`${company} logo`}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-600">
            {company} • {location}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const getTagStyle = (tag: string) => {
                switch (tag) {
                  case 'Full-Time':
                    return 'bg-green-100 text-green-800 border-green-200';
                  case 'Marketing':
                    return 'bg-orange-100 text-orange-800 border-orange-200';
                  case 'Design':
                    return 'bg-indigo-100 text-indigo-800 border-indigo-200';
                  default:
                    return 'bg-gray-100 text-gray-800 border-gray-200';
                }
              };

              return (
                <span
                  key={index}
                  className={`rounded-full border px-3 py-1 text-xs ${getTagStyle(tag)}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        <div className="shrink-0">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Apply</Button>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
          <span>{applied} applied</span>
          <span>of {capacity} capacity</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <div
            className={`h-1.5 rounded-full ${getProgressColor()}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
