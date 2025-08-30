'use client';

import { Button } from '@/components/ui/button';
import { CompanyInfo } from '@/types/Job';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, Eye, Star, Briefcase } from 'lucide-react';
import { employmentType } from '@/enums/employmentType';

// Vietnamese provinces data (copied from company-board.tsx)
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

// Smart location formatting function (copied from company-board.tsx)
const formatLocation = (location: string): string => {
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

interface JobCardProps {
  id?: string;
  title: string;
  company: CompanyInfo;
  location: string;
  typeOfEmployment: string;
  category: { id: string; name: string };
  salary?: string;
  priorityPosition: number;
  createdAt?: string;
}

// Map the incoming string to the enum value
function getEmploymentTypeLabel(type: string): string {
  const normalized = type.replace(/[\s_-]/g, '').toLowerCase();

  // Check both keys and values of the enum
  for (const key of Object.keys(employmentType) as Array<
    keyof typeof employmentType
  >) {
    const enumValue = employmentType[key];
    if (
      key.replace(/[\s_-]/g, '').toLowerCase() === normalized ||
      enumValue.replace(/[\s_-]/g, '').toLowerCase() === normalized
    ) {
      return enumValue;
    }
  }
  // fallback to original string if not found
  return type;
}

export default function JobCard({
  id,
  title,
  company,
  location,
  typeOfEmployment,
  category,
  salary,
  priorityPosition,
  createdAt,
}: JobCardProps) {
  const router = useRouter();

  // Format time difference for job posting
  const formatTimeAgo = (createdAt?: string) => {
    if (!createdAt) return 'Recently';

    const now = new Date();
    const created = new Date(createdAt);
    const diffInMs = now.getTime() - created.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInMinutes > 0) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  // Get styles based on priorityPosition
  const getPositionStyles = () => {
    switch (priorityPosition) {
      case 1: // VIP
        return {
          card: 'border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-2xl ring-2 ring-purple-200 ring-opacity-50',
          badge:
            'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white animate-pulse shadow-lg',
          title: 'text-purple-800 font-bold',
          border:
            'border-gradient-to-r from-purple-400 via-pink-500 to-orange-400 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_25px_rgba(168,85,247,0.6)] after:animate-pulse',
        };
      case 2: // Premium
        return {
          card: 'border-2 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl ring-1 ring-blue-200',
          badge:
            'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md',
          title: 'text-blue-800 font-semibold',
          border: 'border-gradient-to-r from-blue-400 to-cyan-500 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
      case 3: // Basic
        return {
          card: 'border bg-gradient-to-br from-gray-50 to-gray-50/80 shadow-sm',
          badge: 'bg-gradient-to-r from-gray-600 to-gray-600 text-white',
          title: 'text-gray-800 font-medium',
          border: 'border-gray-300',
          effect: '',
        };
      default:
        return {
          card: 'border bg-white hover:shadow-md transition-all duration-200',
          badge: '',
          title: 'text-gray-800',
          border: '',
          effect: '',
        };
    }
  };

  const styles = getPositionStyles();

  // Position badge component
  const PositionBadge = () => {
    if (priorityPosition === 1) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-0 bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-1 text-xs text-white shadow-lg"
        >
          <Trophy className="h-3 w-3" />
          <span className="font-bold">VIP</span>
        </Badge>
      );
    }
    if (priorityPosition === 2) {
      return (
        <Badge
          variant="outline"
          className="flex items-center gap-1 border-0 bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-1 text-xs text-white shadow-md"
        >
          <Star className="h-3 w-3" /> PREMIUM
        </Badge>
      );
    }
    return null;
  };

  const handleCardClick = () => {
    if (id) {
      router.push(`/job/${id}`);
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (id) {
      router.push(`/job/${id}`);
    }
  };

  return (
    <div className="group w-full">
      <div
        className={`w-full cursor-pointer overflow-hidden rounded-lg ${styles.card} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
        onClick={handleCardClick}
      >
        <div className="relative w-full">
          {priorityPosition <= 2 && (
            <div className="absolute top-0 left-0">
              {priorityPosition === 1 ? (
                <Badge
                  className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs font-bold`}
                >
                  🔥 HOT
                </Badge>
              ) : priorityPosition === 2 ? (
                <Badge
                  className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs`}
                >
                  ⭐ TOP
                </Badge>
              ) : null}
            </div>
          )}

          <div className="flex p-3">
            <div className="mr-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={company.logoUrl || '/placeholder.svg'}
                  alt={`${company.companyName} logo`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm font-semibold ${styles.title} truncate`}
                  title={title}
                >
                  {title}
                </h3>
                <p className="mb-2 truncate text-xs text-gray-600">
                  <span className="font-medium text-gray-700">
                    {company.companyName}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">
                    {formatLocation(location)}
                  </span>
                </p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="h-3 w-3 text-blue-500" />
                    <span className="font-medium text-blue-600">
                      {getEmploymentTypeLabel(typeOfEmployment)}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-gray-400">•</span>
                  <Badge
                    variant="outline"
                    className="border border-gray-700 bg-transparent text-xs font-medium text-gray-700"
                  >
                    <Briefcase className="mr-1 h-3 w-3" />
                    {category.name}
                  </Badge>
                </div>
              </div>

              <div className="ml-3 flex flex-col items-end justify-between text-xs">
                <div className="mb-1 flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span className="font-medium">
                    {formatTimeAgo(createdAt)}
                  </span>
                </div>
                {salary && (
                  <div className="mb-2 flex items-center gap-1 font-semibold text-green-600">
                    <span>{salary}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {priorityPosition <= 2 && <PositionBadge />}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDetailClick}
                    className={`h-7 px-3 py-1 text-xs transition-all duration-200 hover:shadow-sm ${
                      priorityPosition === 1
                        ? 'border-purple-300 text-purple-700 hover:bg-purple-50'
                        : priorityPosition === 2
                          ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
