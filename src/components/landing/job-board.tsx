'use client';

import {
  ArrowRight,
  MapPin,
  Clock,
  TrendingUp,
  Code,
  Building2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { jobService } from '@/services/api/jobs/job-api';
import { Job } from '@/types/Job';
import { Skeleton } from '@/components/ui/skeleton';

// Vietnamese provinces data
const VIETNAM_PROVINCES = [
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cần Thơ',
  'Cao Bằng',
  'Đà Nẵng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Nội',
  'Hà Tĩnh',
  'Hải Dương',
  'Hải Phòng',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'TP. Hồ Chí Minh',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
];

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchTopJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch top jobs from new API
        const response = await jobService.getTopJobs();
        console.log(response.data);
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching top jobs:', err);
        setError('Failed to load top jobs');
        // Fallback to empty array
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopJobs();
  }, []);

  // Calculate pagination
  const jobsPerPage = 8;
  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const startIndex = currentPage * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const currentJobs = jobs.slice(startIndex, endIndex);

  // Auto-slide functionality
  useEffect(() => {
    if (totalPages <= 1) return;

    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [totalPages]);

  if (loading) {
    return (
      <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Top<span className="text-[#3B82F6]"> Jobs</span>
            </h2>
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
              Top<span className="text-[#3B82F6]"> Jobs</span>
            </h2>
          </div>
          <div className="py-8 text-center">
            <p className="text-gray-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-gray-800 md:text-4xl">
            Top<span className="text-[#3B82F6]"> Jobs</span>
          </h2>
          <Link
            href="/job"
            className="flex items-center text-sm text-[#3B82F6] hover:text-blue-700 md:text-base"
          >
            Show all jobs <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">
              No top jobs available at the moment.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Job Cards Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {currentJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>

            {/* Auto-slide Progress Bar */}
            {totalPages > 1 && (
              <div className="mt-8">
                <div className="flex justify-center">
                  <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-500 ease-linear"
                      style={{
                        width: `${((currentPage + 1) / totalPages) * 100}%`,
                        animation: 'slide 5s linear infinite',
                      }}
                    />
                  </div>
                </div>

                {/* Page Indicators */}
                <div className="mt-4 flex justify-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full transition-all duration-300 ${
                        index === currentPage
                          ? 'scale-125 bg-blue-600'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function JobCard({ job }: { job: Job }) {
  // Convert employment type from FULL_TIME to Full Time format
  const getEmploymentTypeText = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return 'Full Time';
      case 'PART_TIME':
        return 'Part Time';
      case 'CONTRACT':
        return 'Contract';
      case 'INTERNSHIP':
        return 'Internship';
      default:
        return type?.replace('_', ' ') || 'Full Time';
    }
  };

  const employmentTypeText = getEmploymentTypeText(job.typeOfEmployment);

  // Format location to show only Vietnamese province/city
  const formatLocation = (location: string) => {
    if (!location) return 'Remote';

    // Split by comma and clean up each part
    const parts = location.split(',').map((part) => part.trim().toLowerCase());

    // Find the Vietnamese province/city from the end of the location
    // Since API always returns province/city, it's usually at the end
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];

      // Check if this part matches any Vietnamese province
      const foundProvince = VIETNAM_PROVINCES.find(
        (province) =>
          part.includes(province.toLowerCase()) ||
          province.toLowerCase().includes(part),
      );

      if (foundProvince) {
        return foundProvince;
      }
    }

    // If no province found, try to extract meaningful city name
    // Remove common address words and keep the most relevant part
    const addressWords = [
      'đường',
      'phố',
      'quận',
      'huyện',
      'xã',
      'phường',
      'thị trấn',
      'thị xã',
      'street',
      'district',
      'ward',
      'commune',
      'town',
      'city',
      'province',
      'việt nam',
      'vietnam',
      'vn',
    ];

    // Find the last meaningful part (usually city/province)
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];

      // Skip if it's just an address word or too short
      if (addressWords.includes(part) || part.length < 2) {
        continue;
      }

      // Return the first meaningful part found
      return part.charAt(0).toUpperCase() + part.slice(1);
    }

    // Fallback: return the last part if nothing else works
    return (
      parts[parts.length - 1]?.charAt(0).toUpperCase() +
        parts[parts.length - 1]?.slice(1) || 'Remote'
    );
  };

  // Get category and skills separately
  const getCategoryAndSkills = () => {
    const category = job.category?.name;
    const skills = job.skills?.slice(0, 2).map((skill) => skill.name) || [];
    return { category, skills };
  };

  const { category, skills } = getCategoryAndSkills();

  return (
    <Link href={`/job/${job.id}`} className="group block">
      <div className="flex h-full cursor-pointer flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
            <Image
              src={job.company.logoUrl || '/placeholder.svg'}
              alt={`${job.company.companyName} logo`}
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="flex gap-2">
            {category && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                <Building2 className="h-3 w-3" />
                {category}
              </span>
            )}
          </div>
        </div>

        {/* Job Title */}
        <h3 className="mb-3 line-clamp-2 min-h-[3.5rem] text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {job.title}
        </h3>

        {/* Company Name */}
        <div className="mb-2">
          <span className="text-sm font-medium text-gray-700">
            {job.company.companyName}
          </span>
        </div>

        {/* Location & Employment Type */}
        <div className="mb-4 flex items-center gap-1 text-sm text-gray-600">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{formatLocation(job.location)}</span>
          <span className="mx-1 text-gray-400">•</span>
          <Clock className="h-3 w-3 flex-shrink-0 text-blue-500" />
          <span className="truncate font-medium text-blue-600">
            {employmentTypeText}
          </span>
        </div>

        {/* Skills Tags */}
        {skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                <Code className="h-3 w-3" />
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Info Row */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            {job.experienceYears > 0 && (
              <>
                <Clock className="h-3 w-3" />
                <span>{job.experienceYears}+ years</span>
              </>
            )}
          </div>

          {job.salaryMin && job.salaryMax && (
            <div className="flex items-center gap-1 text-xs font-medium text-green-600">
              <TrendingUp className="h-3 w-3" />
              <span className="truncate">
                ${job.salaryMin.toLocaleString()} - $
                {job.salaryMax.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

function JobCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
      <Skeleton className="mb-3 h-14 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-4 h-4 w-1/3" />
      <div className="mb-4 flex gap-1.5">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <div className="mt-auto flex justify-between border-t border-gray-100 pt-3">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}
