import { Badge } from '@/components/ui/badge';
import { formatEmploymentType } from '@/utils/formatters';

interface JobDetailsProps {
  applyBefore: string;
  postedOn: string;
  jobType: string;
  experienceYears?: number;
  salary: string;
  categories?: string[];
}

export default function JobDetails({
  applyBefore,
  jobType,
  experienceYears,
  salary,
  categories,
}: JobDetailsProps) {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">About this Job</h2>
      <div className="space-y-6">
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-gray-600">Apply Before</span>
          <span className="font-medium text-gray-800">{applyBefore}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-gray-600">Job Type</span>
          <span className="font-medium text-gray-800">
            {formatEmploymentType(jobType)}
          </span>
        </div>
        {experienceYears !== undefined && (
          <div className="flex justify-between border-b border-gray-100 py-3">
            <span className="text-gray-600">Experience</span>
            <span className="font-medium text-gray-900">
              {experienceYears} years +
            </span>
          </div>
        )}
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-gray-600">Salary</span>
          <span className="font-medium text-gray-900">{salary}</span>
        </div>
        {categories && categories.length > 0 && (
          <div className="flex justify-between py-3">
            <span className="text-gray-600">Categories</span>
            <div className="flex gap-2">
              {categories.map((category, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={
                    index === 0
                      ? 'border-orange-200 bg-orange-100 text-orange-700'
                      : 'border-amber-200 bg-amber-100 text-amber-700'
                  }
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
