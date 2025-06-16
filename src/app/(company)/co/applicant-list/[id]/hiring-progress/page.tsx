import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Circle } from 'lucide-react';

export default function HiringProgressPage() {
  const stages = [
    { name: 'Application Received', status: 'completed', date: '2 days ago' },
    { name: 'Initial Screening', status: 'completed', date: '1 day ago' },
    {
      name: 'Technical Interview',
      status: 'current',
      date: 'Scheduled for tomorrow',
    },
    { name: 'Final Interview', status: 'pending', date: 'Pending' },
    { name: 'Offer', status: 'pending', date: 'Pending' },
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Hiring Progress</h3>

      <div className="space-y-4">
        {stages.map((stage) => (
          <div
            key={stage.name}
            className="flex items-center gap-4 rounded-lg border border-gray-200 p-4"
          >
            <div className="flex-shrink-0">
              {stage.status === 'completed' && (
                <CheckCircle className="h-6 w-6 text-green-600" />
              )}
              {stage.status === 'current' && (
                <Clock className="h-6 w-6 text-blue-600" />
              )}
              {stage.status === 'pending' && (
                <Circle className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{stage.name}</h4>
              <p className="text-sm text-gray-600">{stage.date}</p>
            </div>
            <div>
              <Badge
                variant={
                  stage.status === 'completed'
                    ? 'default'
                    : stage.status === 'current'
                      ? 'secondary'
                      : 'outline'
                }
                className={
                  stage.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : stage.status === 'current'
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500'
                }
              >
                {stage.status === 'completed'
                  ? 'Completed'
                  : stage.status === 'current'
                    ? 'In Progress'
                    : 'Pending'}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 font-medium text-blue-900">Next Steps</h4>
        <p className="text-sm text-blue-800">
          Technical interview is scheduled for tomorrow at 2:00 PM. The
          candidate will be interviewed by the engineering team.
        </p>
      </div>
    </div>
  );
}
