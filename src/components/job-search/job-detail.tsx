interface JobDetailsProps {
  applied: number;
  capacity: number;
  applyBefore: string;
  postedOn: string;
  jobType: string;
  salary: string;
}

export default function JobDetails({
  applied,
  capacity,
  applyBefore,
  postedOn,
  jobType,
  salary,
}: JobDetailsProps) {
  const percentage = (applied / capacity) * 100;
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold text-gray-800">About this role</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-gray-600">
            <span className="font-medium text-gray-800">{applied} applied</span>{' '}
            of {capacity} capacity
          </div>
          <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-indigo-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-gray-600">Apply Before</span>
          <span className="font-medium text-gray-800">{applyBefore}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-gray-600">Job Posted On</span>
          <span className="font-medium text-gray-800">{postedOn}</span>
        </div>
        <div className="flex justify-between border-b border-gray-100 py-3">
          <span className="text-gray-600">Job Type</span>
          <span className="font-medium text-gray-800">{jobType}</span>
        </div>
        <div className="flex justify-between py-3">
          <span className="text-gray-600">Salary</span>
          <span className="font-medium text-gray-800">{salary}</span>
        </div>
      </div>
    </section>
  );
}
