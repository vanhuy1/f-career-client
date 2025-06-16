import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, MapPin, Plus } from 'lucide-react';

export default function InterviewSchedulePage() {
  const interviews = [
    {
      type: 'Technical Interview',
      date: 'Tomorrow, Dec 17',
      time: '2:00 PM - 3:00 PM',
      interviewer: 'Sarah Johnson, Senior Engineer',
      location: 'Video Call',
      status: 'scheduled',
    },
    {
      type: 'Cultural Fit Interview',
      date: 'Dec 19, 2023',
      time: '10:00 AM - 11:00 AM',
      interviewer: 'Mike Chen, HR Manager',
      location: 'Conference Room A',
      status: 'pending',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Interview Schedule
        </h3>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Schedule Interview
        </Button>
      </div>

      <div className="space-y-4">
        {interviews.map((interview, index) => (
          <div key={index} className="rounded-lg border border-gray-200 p-6">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h4 className="mb-1 font-medium text-gray-900">
                  {interview.type}
                </h4>
                <p className="text-sm text-gray-600">{interview.interviewer}</p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    interview.status === 'scheduled'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {interview.status === 'scheduled'
                    ? 'Scheduled'
                    : 'Pending Confirmation'}
                </span>
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{interview.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{interview.time}</span>
              </div>
              <div className="flex items-center gap-2">
                {interview.location === 'Video Call' ? (
                  <Video className="h-4 w-4 text-gray-400" />
                ) : (
                  <MapPin className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-600">
                  {interview.location}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Reschedule
              </Button>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              {interview.location === 'Video Call' && (
                <Button variant="outline" size="sm">
                  <Video className="mr-2 h-4 w-4" />
                  Join Call
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-gray-50 p-6 text-center">
        <h4 className="mb-2 font-medium text-gray-900">
          No more interviews scheduled
        </h4>
        <p className="mb-4 text-sm text-gray-600">
          Schedule additional interviews to continue the hiring process.
        </p>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Interview
        </Button>
      </div>
    </div>
  );
}
