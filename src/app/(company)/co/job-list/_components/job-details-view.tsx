import { Edit, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import type { JobDetails } from './types/job';
import { createSafeHtml } from '@/utils/html-sanitizer';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EditJobDialog } from '../[id]/job-details/components/EditJobDialog';
import { EditJobDescriptionDialog } from '../[id]/job-details/components/EditJobDescriptionDialog';
import { Job } from '@/types/Job';

interface JobDetailsViewProps {
  job: JobDetails;
  originalJob?: Job; // Add original job data for editing
  onJobUpdate?: () => Promise<void>; // Callback to refresh job data
}

export function JobDetailsView({
  job,
  originalJob,
  onJobUpdate,
}: JobDetailsViewProps) {
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditDescriptionDialogOpen, setIsEditDescriptionDialogOpen] =
    useState(false);

  const handleEditSuccess = async () => {
    // Close dialogs
    setIsEditDialogOpen(false);
    setIsEditDescriptionDialogOpen(false);

    // Refresh job data if callback is provided
    if (onJobUpdate) {
      try {
        await onJobUpdate();
      } catch (error) {
        console.error('Failed to refresh job data:', error);
      }
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-xl font-bold text-white">S</span>
            </div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-yellow-600 bg-white text-yellow-600 hover:bg-yellow-50"
              onClick={() =>
                router.push(`/co/job-list/${originalJob?.id}/top-job`)
              }
              disabled={!originalJob}
            >
              <Star className="mr-2 h-4 w-4" />
              {originalJob?.topJob && originalJob.topJob > 0
                ? `Top Position ${originalJob.topJob}`
                : 'Set Top Position'}
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 bg-white text-blue-600"
              onClick={() => setIsEditDialogOpen(true)}
              disabled={!originalJob}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Job Info
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Description</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditDescriptionDialogOpen(true)}
                disabled={!originalJob}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Description
              </Button>
            </div>
            <div
              className="prose max-w-none leading-relaxed text-gray-600"
              dangerouslySetInnerHTML={createSafeHtml(job.description)}
            />
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Benefits & Perks</h3>
            <div className="space-y-3">
              {job.niceToHaves.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">About this role</h3>
            <div className="space-y-4">
              <div>
                <div className="mb-1 text-sm text-gray-500">
                  {job.applicationsCount} applied of {job.capacity} capacity
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{
                      width: `${(job.applicationsCount / job.capacity) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Apply Before</span>
                  <span className="font-medium">{job.applyBefore}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Posted On</span>
                  <span className="font-medium">{job.postedOn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Job Type</span>
                  <span className="font-medium">{job.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium">
                    {job.experienceYears} years
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium">{job.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Top Position</span>
                  <span className="font-medium">
                    {originalJob?.topJob && originalJob.topJob > 0 ? (
                      <span className="font-semibold text-yellow-600">
                        Position {originalJob.topJob}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not set</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Categories</h3>
            <div className="flex gap-2">
              {job.categories.map((category, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className={
                    index === 0
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-green-100 text-green-700'
                  }
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Job Dialog */}
      {originalJob && (
        <EditJobDialog
          job={originalJob}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Edit Job Description Dialog */}
      {originalJob && (
        <EditJobDescriptionDialog
          job={originalJob}
          isOpen={isEditDescriptionDialogOpen}
          onClose={() => setIsEditDescriptionDialogOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
