'use client';

import { useState, useEffect } from 'react';
import { Bookmark, CheckCircle2, Share2, MapPin } from 'lucide-react';
import Image from 'next/image';
import ApplyJobButton from '@/app/(public)/_components/apply-job-button';
import { useUser } from '@/services/state/userSlice';
import { ROLES } from '@/enums/roles.enum';
import { bookmarkJobService } from '@/services/api/bookmark/bookmark-job.api';
import { toast } from 'react-toastify';
import { jobService } from '@/services/api/jobs/job-api';
import { formatEmploymentType } from '@/utils/formatters';

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

interface JobHeaderProps {
  companyName: string;
  jobTitle: string;
  location: string;
  jobType: string;
  jobId: string;
  isBookmarked?: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  companyLogo?: string; // Add company logo prop
}

export default function JobHeader({
  companyName,
  jobTitle,
  location,
  jobType,
  jobId,
  isBookmarked = false,
  onBookmarkChange,
  companyLogo, // Company logo URL
}: JobHeaderProps) {
  const user = useUser();
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [isApplied, setIsApplied] = useState<boolean | null>(null);
  const [isAppliedLoading, setIsAppliedLoading] = useState<boolean>(false);
  const logoLetter = companyName.charAt(0).toUpperCase();

  const handleBookmarkToggle = async () => {
    if (!user) {
      toast.error('Please sign in to bookmark jobs');
      return;
    }

    if (isBookmarkLoading) return;

    setIsBookmarkLoading(true);
    try {
      const response = await bookmarkJobService.toggleBookmarkJob(jobId);
      setBookmarked(response.bookmarked);
      onBookmarkChange?.(response.bookmarked);
    } catch (error) {
      console.error('Bookmark toggle error:', error);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  // Sync local state with prop changes
  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  // Check whether current user has already applied
  useEffect(() => {
    const checkApplied = async () => {
      if (!user || !jobId) {
        setIsApplied(null);
        return;
      }
      setIsAppliedLoading(true);
      try {
        const result = await jobService.checkIsApplied(jobId);
        setIsApplied(result.isApply);
        console.log(result);
      } catch (error) {
        // Silently ignore and allow applying
        setIsApplied(null);
        console.error('Failed to check apply status:', error);
      } finally {
        setIsAppliedLoading(false);
      }
    };

    checkApplied();
  }, [user, jobId]);

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

  return (
    <div className="mb-8">
      <div className="relative overflow-hidden rounded-2xl border border-white/50 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-6 shadow-xl backdrop-blur-sm">
        {/* Background pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

        {/* Content */}
        <div className="relative flex items-center justify-between">
          {/* Left Side - Logo and Title */}
          <div className="flex items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-emerald-100 to-blue-100 p-1 shadow-lg ring-2 ring-white/50">
              {companyLogo ? (
                <Image
                  src={companyLogo}
                  alt={`${companyName} logo`}
                  width={64}
                  height={64}
                  className="h-full w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-gradient-to-br from-emerald-200 to-blue-200">
                  <span className="text-2xl font-bold text-emerald-700">
                    {logoLetter}
                  </span>
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{jobTitle}</h1>
              <div className="mt-1 flex items-center gap-2 text-lg text-gray-600">
                <span>{companyName}</span>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{formatLocation(location)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span>{formatEmploymentType(jobType)}</span>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleBookmarkToggle}
              disabled={isBookmarkLoading}
              className={`rounded-full p-2 transition-colors ${
                bookmarked
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                  : 'text-gray-500 hover:bg-gray-100'
              } ${isBookmarkLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Bookmark
                className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`}
              />
            </button>
            <button className="rounded-full border border-gray-200 bg-white p-2 shadow-sm hover:bg-gray-100">
              <Share2 className="h-4 w-4 text-gray-500" />
            </button>
            {(user?.data.roles[0] === ROLES.USER || !user) &&
              (isAppliedLoading ? (
                <button
                  disabled
                  className="cursor-not-allowed rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-500"
                >
                  Checking...
                </button>
              ) : isApplied ? (
                <span className="inline-flex items-center rounded-md bg-green-100 px-3 py-2 text-sm font-semibold text-green-700">
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Applied
                </span>
              ) : (
                <ApplyJobButton
                  jobTitle={jobTitle}
                  company={companyName}
                  location={location}
                  jobType={jobType}
                  jobId={jobId}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
