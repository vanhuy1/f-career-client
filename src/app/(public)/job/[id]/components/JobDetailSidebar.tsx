'use client';

import { useState, useEffect, useCallback } from 'react';
import { Job } from '@/types/Job';
import JobDetails from '@/components/job-search/job-detail';
import { formatDate, formatSalaryRange } from '../utils/formatters';
import GenerateRoadmapButton from './GenerateRoadmapButton';
import { useUser } from '@/services/state/userSlice';
import { ROLES } from '@/enums/roles.enum';
import JobSkills from './JobSkills';
import { applicationService } from '@/services/api/applications/application-api';

interface JobDetailSidebarProps {
  job: Job;
}

export default function JobDetailSidebar({ job }: JobDetailSidebarProps) {
  const user = useUser();
  const [applicantsCount, setApplicantsCount] = useState(0);

  const fetchApplicantsCount = useCallback(async () => {
    if (!job.id) return;

    try {
      const response = await applicationService.getApplicationByJobId({
        jobId: job.id.toString(),
        offset: 0,
        limit: 100,
      });

      if (response && response.applications) {
        setApplicantsCount(response.applications.length);
      } else {
        setApplicantsCount(0);
      }
    } catch (error) {
      console.error('Error fetching applicants count:', error);
      setApplicantsCount(0);
    }
  }, [job.id]);

  useEffect(() => {
    if (job.id) {
      fetchApplicantsCount();
    }
  }, [job.id, fetchApplicantsCount]);

  return (
    <div className="lg:col-span-1">
      <div className="space-y-8">
        {/* Job Details Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

          {/* Content */}
          <div className="relative space-y-8">
            <JobDetails
              applicantsCount={applicantsCount}
              applyBefore={formatDate(job.deadline)}
              postedOn={job.createdAt ? formatDate(job.createdAt) : ''}
              jobType={job.typeOfEmployment}
              experienceYears={job.experienceYears}
              salary={formatSalaryRange(job.salaryMin, job.salaryMax)}
              categories={[job.category.name]} // Thêm categories vào JobDetails
            />

            <div className="border-t pt-4">
              {(user?.data.roles[0] === ROLES.USER || !user) && (
                <GenerateRoadmapButton
                  jobId={job.id?.toString() || ''}
                  jobTitle={job.title}
                />
              )}
            </div>
          </div>

          {/* Decorative bottom accent */}
          <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
        </div>

        {/* Job Skills Card */}
        <JobSkills job={job} />
      </div>
    </div>
  );
}
