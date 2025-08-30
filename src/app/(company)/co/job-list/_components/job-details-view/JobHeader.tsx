import { Edit, Star, MapPin, Copy, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { JobDetails } from '../types/job';
import { Job } from '@/types/Job';
import { useState } from 'react';
import { jobService } from '@/services/api/jobs/job-api';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUser } from '@/services/state/userSlice';

interface JobHeaderProps {
  job: JobDetails;
  originalJob?: Job;
  onEditJobInfo?: () => void;
  onEditStatusDeadline?: () => void;
}

export function JobHeader({
  job,
  originalJob,
  onEditJobInfo,
  onEditStatusDeadline,
}: JobHeaderProps) {
  const router = useRouter();
  const user = useUser();
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [showDeadlineDialog, setShowDeadlineDialog] = useState(false);
  const [customDeadline, setCustomDeadline] = useState('');

  // Basic package limit constants
  const BASIC_LIMIT_KEY = 'BASIC_JOB_LIMIT';
  const BASIC_LIMIT_PER_DAY = 3;

  // Helper functions for basic package limit
  const getBasicJobLimit = () => {
    const companyId = user?.data?.companyId;
    if (!companyId) return { count: 0, date: null };

    const limitData = localStorage.getItem(`${BASIC_LIMIT_KEY}_${companyId}`);
    if (!limitData) return { count: 0, date: null };

    try {
      return JSON.parse(limitData);
    } catch {
      return { count: 0, date: null };
    }
  };

  const updateBasicJobLimit = () => {
    const companyId = user?.data?.companyId;
    if (!companyId) return;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const currentLimit = getBasicJobLimit();

    if (currentLimit.date === today) {
      // Same day, increment count
      const newLimit = {
        count: currentLimit.count + 1,
        date: today,
      };
      localStorage.setItem(
        `${BASIC_LIMIT_KEY}_${companyId}`,
        JSON.stringify(newLimit),
      );
    } else {
      // New day, reset count
      const newLimit = {
        count: 1,
        date: today,
      };
      localStorage.setItem(
        `${BASIC_LIMIT_KEY}_${companyId}`,
        JSON.stringify(newLimit),
      );
    }
  };

  const checkBasicJobLimit = () => {
    const companyId = user?.data?.companyId;
    if (!companyId) return { allowed: false, remaining: 0 };

    const limit = getBasicJobLimit();
    const today = new Date().toISOString().split('T')[0];

    if (limit.date !== today) {
      // New day, reset limit
      return { allowed: true, remaining: BASIC_LIMIT_PER_DAY };
    }

    const remaining = BASIC_LIMIT_PER_DAY - limit.count;
    return { allowed: remaining > 0, remaining: Math.max(0, remaining) };
  };

  const handleConfirmDuplicate = async () => {
    if (!originalJob || !customDeadline) return;

    try {
      setIsDuplicating(true);

      // Check basic package limit for duplicate job
      const limitCheck = checkBasicJobLimit();
      if (!limitCheck.allowed) {
        toast.error(
          <div>
            <p className="mb-2 font-medium">Daily limit exceeded!</p>
            <p className="text-sm">
              You can only create {BASIC_LIMIT_PER_DAY} jobs per day (including
              duplicates). Please upgrade to Premium or VIP package for
              unlimited posting.
            </p>
          </div>,
        );
        return;
      }

      // Validate deadline is within 30 days
      const selectedDate = new Date(customDeadline);
      const now = new Date();
      const thirtyDaysFromNow = new Date(
        now.getTime() + 30 * 24 * 60 * 60 * 1000,
      );

      if (selectedDate < now || selectedDate > thirtyDaysFromNow) {
        toast.error('Deadline must be within 30 days from now');
        return;
      }

      // Prepare job data for duplication
      const duplicateJobData = {
        title: `${originalJob.title} (Copy)`,
        description: originalJob.description,
        categoryId: originalJob.category.id,
        companyId: originalJob.company.id,
        location: originalJob.location,
        salaryMin: originalJob.salaryMin,
        salaryMax: originalJob.salaryMax,
        experienceYears: originalJob.experienceYears,
        typeOfEmployment: originalJob.typeOfEmployment,
        benefit: originalJob.benefit,
        deadline: selectedDate.toISOString(),
        status: 'CLOSED' as const,
        isVip: false,
        skillIds: originalJob.skills.map((skill) => skill.id), // Extract skill IDs as strings
        // Add additional fields that might be required
        priorityPosition: 3, // Set to basic priority
        isDeleted: false,
      };

      // Call API to create duplicate job
      const newJob = await jobService.create(duplicateJobData);

      // Update basic job limit after successful duplication
      updateBasicJobLimit();

      // Ensure the job status is set to CLOSED (in case BE overrides it)
      try {
        await jobService.update(newJob.id!, { status: 'CLOSED' });
      } catch (updateError) {
        console.warn('Could not update job status to CLOSED:', updateError);
        // Continue anyway as the job was created successfully
      }

      toast.success('Job duplicated successfully!');
      setShowDeadlineDialog(false);

      // Redirect to the new job's edit page
      router.push(`/co/job-list/${newJob.id}/job-details`);
    } catch (error) {
      console.error('Error duplicating job:', error);
      toast.error('Failed to duplicate job. Please try again.');
    } finally {
      setIsDuplicating(false);
    }
  };

  // Set default deadline to 30 days from now when dialog opens
  const handleOpenDeadlineDialog = () => {
    const defaultDeadline = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    setCustomDeadline(defaultDeadline.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    setShowDeadlineDialog(true);
  };

  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 shadow-xl backdrop-blur-sm">
        {/* Background pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

        {/* Content */}
        <div className="relative">
          {/* Top Row - Logo and Title */}
          <div className="mb-4 flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 to-blue-100 p-1 shadow-lg ring-2 ring-white/50">
              {job.companyLogo ? (
                <Image
                  src={job.companyLogo}
                  alt={`${job.companyName} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-emerald-200 to-blue-200">
                  <span className="text-2xl font-bold text-emerald-700">
                    {job.companyName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-1 flex items-center gap-2 text-lg text-gray-600">
                <span>{job.companyName}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{job.location || 'Location not specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row - Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              className="border-green-500 bg-white text-green-600 shadow-sm hover:border-green-600 hover:bg-green-50"
              onClick={handleOpenDeadlineDialog}
              disabled={!originalJob || !checkBasicJobLimit().allowed}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate Job
              {!checkBasicJobLimit().allowed && (
                <span className="ml-1 text-xs">(Limit Reached)</span>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-amber-500 bg-white text-amber-600 shadow-sm hover:border-amber-600 hover:bg-amber-50"
              onClick={() =>
                router.push(`/co/job-list/${originalJob?.id}/top-job`)
              }
              disabled={!originalJob}
            >
              <Star className="mr-2 h-4 w-4" />
              Top Positions
            </Button>
            <Button
              variant="outline"
              className="border-blue-600 bg-white text-blue-600 shadow-sm hover:border-blue-700 hover:bg-blue-50"
              onClick={onEditJobInfo}
              disabled={!originalJob || !onEditJobInfo}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Job Info
            </Button>
            <Button
              variant="outline"
              className="border-purple-600 bg-white text-purple-600 shadow-sm hover:border-purple-700 hover:bg-blue-50"
              onClick={onEditStatusDeadline}
              disabled={!originalJob || !onEditStatusDeadline}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Status/Deadline
            </Button>
          </div>
        </div>
      </div>

      {/* Deadline Input Dialog */}
      <Dialog open={showDeadlineDialog} onOpenChange={setShowDeadlineDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-green-600" />
              Set Deadline for Duplicate Job
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Basic package limit info */}
            {(() => {
              const limitInfo = checkBasicJobLimit();
              return (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-semibold text-amber-800">
                      Daily Job Limit
                    </span>
                  </div>
                  <div className="text-sm text-amber-700">
                    {limitInfo.allowed ? (
                      <>
                        <span className="font-medium">
                          {limitInfo.remaining} of {BASIC_LIMIT_PER_DAY} jobs
                          remaining today
                        </span>
                        <br />
                        <span className="text-xs text-amber-600">
                          This includes both new jobs and duplicates
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-medium text-red-600">
                          Daily limit reached ({BASIC_LIMIT_PER_DAY}/
                          {BASIC_LIMIT_PER_DAY})
                        </span>
                        <br />
                        <span className="text-xs text-amber-600">
                          Upgrade to Premium/VIP for unlimited posting
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-sm font-medium">
                Deadline (within 30 days)
              </Label>
              <Input
                id="deadline"
                type="date"
                value={customDeadline}
                onChange={(e) => setCustomDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                max={
                  new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split('T')[0]
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Select a deadline within the next 30 days
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDeadlineDialog(false)}
              disabled={isDuplicating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDuplicate}
              disabled={!customDeadline || isDuplicating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isDuplicating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Duplicating...
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Job
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
