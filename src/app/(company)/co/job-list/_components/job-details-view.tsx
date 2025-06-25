import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import type { JobDetails } from './types/job';

interface JobDetailsViewProps {
  job: JobDetails;
}

export function JobDetailsView({ job }: JobDetailsViewProps) {
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
          <Button
            variant="outline"
            className="border-blue-600 bg-white text-blue-600"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Job Details
          </Button>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div>
            <h3 className="mb-4 text-xl font-semibold">Description</h3>
            <p className="leading-relaxed text-gray-600">{job.description}</p>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Responsibilities</h3>
            <div className="space-y-3">
              {job.responsibilities.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Who You Are</h3>
            <div className="space-y-3">
              {job.requirements.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Nice-To-Haves</h3>
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
                  <span className="text-gray-600">Salary</span>
                  <span className="font-medium">{job.salary}</span>
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
    </div>
  );
}
