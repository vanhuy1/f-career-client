'use client';

import { Button } from '@/components/ui/button';
import {
  X,
  Crown,
  Star,
  TrendingUp,
  MapPin,
  Clock,
  Code,
  Building2,
} from 'lucide-react';
import Image from 'next/image';

// Vietnamese provinces data (same as job-board.tsx)
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

// Mock data for homepage preview
const mockHomepageJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: {
      companyName: 'TechCorp Vietnam',
      logoUrl: '/Logo/talkit.svg',
    },
    location: 'Đà Nẵng, Việt Nam',
    category: { name: 'Technology' },
    skills: [{ name: 'React' }, { name: 'TypeScript' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 3,
    salaryMin: 25000,
    salaryMax: 35000,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: {
      companyName: 'Innovation Labs',
      logoUrl: '/Logo/amd.webp',
    },
    location: 'TP. Hồ Chí Minh, Việt Nam',
    category: { name: 'Product' },
    skills: [{ name: 'Agile' }, { name: 'Scrum' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 5,
    salaryMin: 30000,
    salaryMax: 45000,
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: {
      companyName: 'Creative Studio',
      logoUrl: '/Logo/amd.webp',
    },
    location: 'Hà Nội, Việt Nam',
    category: { name: 'Design' },
    skills: [{ name: 'Figma' }, { name: 'Adobe XD' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 2,
    salaryMin: 20000,
    salaryMax: 30000,
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: {
      companyName: 'Data Systems Inc',
      logoUrl: '/Logo/talkit.svg',
    },
    location: 'Đà Nẵng, Việt Nam',
    category: { name: 'Technology' },
    skills: [{ name: 'Node.js' }, { name: 'MongoDB' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 4,
    salaryMin: 28000,
    salaryMax: 38000,
  },
  {
    id: '5',
    title: 'Marketing Specialist',
    company: {
      companyName: 'Growth Marketing',
      logoUrl: '/Logo/talkit.svg',
    },
    location: 'TP. Hồ Chí Minh, Việt Nam',
    category: { name: 'Marketing' },
    skills: [{ name: 'Digital Marketing' }, { name: 'SEO' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 3,
    salaryMin: 22000,
    salaryMax: 32000,
  },
  {
    id: '6',
    title: 'DevOps Engineer',
    company: {
      companyName: 'Cloud Solutions',
      logoUrl: '/Logo/amd.webp',
    },
    location: 'Hà Nội, Việt Nam',
    category: { name: 'Technology' },
    skills: [{ name: 'Docker' }, { name: 'Kubernetes' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 4,
    salaryMin: 30000,
    salaryMax: 40000,
  },
  {
    id: '7',
    title: 'Content Writer',
    company: {
      companyName: 'Content Hub',
      logoUrl: '/Logo/talkit.svg',
    },
    location: 'Đà Nẵng, Việt Nam',
    category: { name: 'Content' },
    skills: [{ name: 'Copywriting' }, { name: 'SEO' }],
    typeOfEmployment: 'PART_TIME',
    experienceYears: 2,
    salaryMin: 15000,
    salaryMax: 25000,
  },
  {
    id: '8',
    title: 'Sales Representative',
    company: {
      companyName: 'Sales Pro',
      logoUrl: '/Logo/amd.webp',
    },
    location: 'TP. Hồ Chí Minh, Việt Nam',
    category: { name: 'Sales' },
    skills: [{ name: 'B2B Sales' }, { name: 'CRM' }],
    typeOfEmployment: 'FULL_TIME',
    experienceYears: 3,
    salaryMin: 20000,
    salaryMax: 35000,
  },
];

interface TopJobPreviewProps {
  showPreview: boolean;
  onClose: () => void;
  currentJobTitle: string;
}

export function TopJobPreview({
  showPreview,
  onClose,
  currentJobTitle,
}: TopJobPreviewProps) {
  if (!showPreview) return null;

  // Format location function (same as job-board.tsx)
  const formatLocation = (location: string) => {
    if (!location) return 'Remote';

    // Split by comma and clean up each part
    const parts = location.split(',').map((part) => part.trim().toLowerCase());

    // Find the Vietnamese province/city from the end of the location
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

  // Get employment type text
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

  // Create a modified job list with current job as the first featured job
  const previewJobs = [
    {
      ...mockHomepageJobs[0],
      title: currentJobTitle,
      company: {
        companyName: 'Your Company',
        logoUrl: '/Logo/amd.webp',
      },
      location: 'Your Location',
      isFeatured: true,
    },
    ...mockHomepageJobs.slice(1, 8),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-[1200px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b bg-gradient-to-r from-amber-50 to-orange-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 p-3 text-white shadow-lg">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Homepage Spotlight Preview
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your job will be featured prominently on the homepage with
                  maximum visibility
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2.5 shadow-sm transition-colors hover:bg-gray-200"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6">
          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {previewJobs.map((job, index) => {
              const employmentTypeText = getEmploymentTypeText(
                job.typeOfEmployment,
              );
              const category = job.category?.name;
              const skills =
                job.skills?.slice(0, 2).map((skill) => skill.name) || [];
              const isFeatured = index === 0;

              return (
                <div key={job.id} className="group block">
                  <div
                    className={`flex h-full cursor-pointer flex-col rounded-xl border bg-white p-5 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg ${
                      isFeatured
                        ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg'
                        : 'border-gray-200'
                    }`}
                  >
                    {/* Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                        <Image
                          src={job.company.logoUrl || '/placeholder.svg'}
                          alt={`${job.company.companyName} logo`}
                          width={40}
                          height={40}
                          className="object-cover"
                          style={{ objectPosition: 'center' }}
                        />
                      </div>
                      <div className="flex gap-2">
                        {category && (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
                            <Building2 className="h-3 w-3" />
                            {category}
                          </span>
                        )}
                        <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                          {employmentTypeText}
                        </span>
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

                    {/* Location */}
                    <div className="mb-4 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">
                        {formatLocation(job.location)}
                      </span>
                    </div>

                    {/* Skills Tags */}
                    {skills.length > 0 && (
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {skills.map((skill: string, skillIndex: number) => (
                          <span
                            key={skillIndex}
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
                </div>
              );
            })}
          </div>
        </div>

        <div className="bottom--5 sticky border-t bg-gradient-to-r from-amber-50 to-orange-50 p-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-amber-100 to-orange-100 p-4 text-amber-800">
            <Star className="h-6 w-6 flex-shrink-0 text-amber-600" />
            <p className="text-sm font-medium">
              <span className="font-bold">Homepage spotlight</span> positions
              receive up to 15x more visibility and 8x more applications than
              regular listings
            </p>
            <Button
              size="lg"
              variant="default"
              onClick={onClose}
              className="ml-auto bg-gradient-to-r from-amber-600 to-orange-600 px-8 shadow-lg hover:opacity-90"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
