import { useState } from 'react';
import type { JobDetails } from './types/job';
import { Job } from '@/types/Job';
import { EditJobDialog } from '../[id]/job-details/components/EditJobDialog';
import { EditJobDescriptionDialog } from '../[id]/job-details/components/EditJobDescriptionDialog';
import { EditJobStatusDeadlineDialog } from '../[id]/job-details/components/EditJobStatusDeadlineDialog';

// Import new components
import { JobHeader } from './job-details-view/JobHeader';
import { JobDescription } from './job-details-view/JobDescription';
import { BenefitsSection } from './job-details-view/BenefitsSection';
import { AboutRoleSection } from './job-details-view/AboutRoleSection';
import { SkillsSection } from './job-details-view/SkillsSection';
import { BackgroundDecorations } from './job-details-view/BackgroundDecorations';

interface JobDetailsViewProps {
  job: JobDetails;
  originalJob?: Job; // Add original job data for editing
  onJobUpdate?: () => Promise<void>; // Callback to refresh job data
  applicantsCount?: number; // Add actual applicants count from API
}

export function JobDetailsView({
  job,
  originalJob,
  onJobUpdate,
  applicantsCount,
}: JobDetailsViewProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditDescriptionDialogOpen, setIsEditDescriptionDialogOpen] =
    useState(false);
  const [isEditStatusDeadlineOpen, setIsEditStatusDeadlineOpen] =
    useState(false);

  const handleEditSuccess = async () => {
    // Close dialogs
    setIsEditDialogOpen(false);
    setIsEditDescriptionDialogOpen(false);
    setIsEditStatusDeadlineOpen(false);

    // Refresh job data if callback is provided
    if (onJobUpdate) {
      try {
        await onJobUpdate();
      } catch (error) {
        console.error('Failed to refresh job data:', error);
      }
    }
  };

  const handleEditDescription = () => {
    setIsEditDescriptionDialogOpen(true);
  };

  const handleEditJobInfo = () => {
    setIsEditDialogOpen(true);
  };

  const handleEditStatusDeadline = () => {
    setIsEditStatusDeadlineOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <BackgroundDecorations />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Job Header */}
        <JobHeader
          job={job}
          originalJob={originalJob}
          onEditJobInfo={handleEditJobInfo}
          onEditStatusDeadline={handleEditStatusDeadline}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-8">
            <JobDescription
              job={job}
              originalJob={originalJob}
              onEditDescription={handleEditDescription}
            />
            <BenefitsSection job={job} />
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8 lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              <AboutRoleSection job={job} applicantsCount={applicantsCount} />
              <SkillsSection job={job} />
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

      {/* Edit Status & Deadline Dialog */}
      {originalJob && (
        <EditJobStatusDeadlineDialog
          job={originalJob}
          isOpen={isEditStatusDeadlineOpen}
          onClose={() => setIsEditStatusDeadlineOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
}
