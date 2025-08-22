'use client';

import { Button } from '@/components/ui/button';
import {
  X,
  Crown,
  Building2,
  Users,
  Calendar,
  MapPin,
  Globe,
} from 'lucide-react';
import Image from 'next/image';

// Vietnamese provinces data (same as company-header-section.tsx)
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

// Smart location formatting function (same as company-header-section.tsx)
const formatLocation = (address?: string[] | null): string => {
  if (!address || address.length === 0) return 'N/A';

  // Take only the first element (headquarters)
  const headquarters = address[0];

  if (!headquarters) return 'N/A';

  // Split by comma and clean up each part
  const parts = headquarters
    .split(',')
    .map((part) => part.trim().toLowerCase());

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
      parts[parts.length - 1]?.slice(1) || 'N/A'
  );
};

// Mock data for homepage preview
const mockHomepageCompanies = [
  {
    id: '1',
    companyName: 'TechCorp Vietnam',
    logoUrl: '/Logo/talkit.svg',
    industry: 'Technology',
    website: 'https://techcorp.vn',
    address: ['123 Nguyen Hue, District 1, TP. Hồ Chí Minh'],
    employees: 500,
    foundedAt: '2010-01-15',
  },
  {
    id: '2',
    companyName: 'Innovation Labs',
    logoUrl: '/Logo/amd.webp',
    industry: 'Software Development',
    website: 'https://innovationlabs.com',
    address: ['456 Le Loi, District 3, TP. Hồ Chí Minh'],
    employees: 300,
    foundedAt: '2015-03-20',
  },
  {
    id: '3',
    companyName: 'Creative Studio',
    logoUrl: '/Logo/talkit.svg',
    industry: 'Design',
    website: 'https://creativestudio.com',
    address: ['789 Tran Phu, Hai Chau, Đà Nẵng'],
    employees: 150,
    foundedAt: '2018-07-10',
  },
  {
    id: '4',
    companyName: 'Data Systems Inc',
    logoUrl: '/Logo/amd.webp',
    industry: 'Data Analytics',
    website: 'https://datasystems.vn',
    address: ['321 Bach Dang, Hai Chau, Đà Nẵng'],
    employees: 200,
    foundedAt: '2012-11-05',
  },
];

interface CompanyPromotionPreviewProps {
  showPreview: boolean;
  onClose: () => void;
}

export function CompanyPromotionPreview({
  showPreview,
  onClose,
}: CompanyPromotionPreviewProps) {
  if (!showPreview) return null;

  // Format founded year for better display
  const formatFoundedYear = (year?: string): string => {
    if (!year) return '';
    // If it's just a year (4 digits), format nicely
    if (/^\d{4}$/.test(year)) {
      return `Founded in ${year}`;
    }
    // If it's a full date, extract year
    const yearMatch = year.match(/\d{4}/);
    if (yearMatch) {
      return `Founded in ${yearMatch[0]}`;
    }
    return `Founded ${year}`;
  };

  // Extract domain from website URL for display
  const getDisplayWebsite = (website?: string) => {
    return website
      ? website.replace(/^https?:\/\//, '').replace(/\/$/, '')
      : null;
  };

  // Create a modified company list with first company as VIP
  const previewCompanies = [
    {
      ...mockHomepageCompanies[0],
      isFeatured: true,
    },
    ...mockHomepageCompanies.slice(1, 4),
  ];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-[1200px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b bg-gradient-to-r from-orange-50 to-amber-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-orange-600 to-amber-600 p-3 text-white shadow-lg">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  VIP Company Preview
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Your company will be featured prominently on the homepage with
                  VIP priority
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
          {/* Company Cards Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {previewCompanies.map((company, index) => {
              const isFeatured = index === 0;
              const displayWebsite = getDisplayWebsite(company.website);
              const location = formatLocation(company.address);

              return (
                <div
                  key={company.id}
                  className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-100"
                >
                  {/* VIP Badge for featured company */}
                  {isFeatured && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg ring-2 ring-white/50 backdrop-blur-sm">
                        <Crown className="h-3.5 w-3.5 animate-pulse fill-current" />
                        <span className="tracking-wide">VIP</span>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Header with Logo and Company Name */}
                    <div className="mb-4 flex items-start gap-4">
                      <div className="shrink-0">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-2 shadow-sm ring-2 ring-white">
                          <Image
                            src={
                              company.logoUrl ||
                              '/Logo/default-company-logo.svg'
                            }
                            alt={`${company.companyName} logo`}
                            width={64}
                            height={64}
                            className="h-full w-full object-contain"
                          />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 pr-8">
                        <h3 className="text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                          {company.companyName}
                        </h3>
                        <div className="mt-1 flex items-center gap-1 text-sm text-blue-600">
                          <Building2 className="h-4 w-4" />
                          <span className="font-medium">
                            {company.industry}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Company Details */}
                    <div className="mb-4 space-y-2">
                      {/* Website */}
                      {displayWebsite && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{displayWebsite}</span>
                        </div>
                      )}

                      {/* Location */}
                      {location && location !== 'N/A' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{location}</span>
                        </div>
                      )}
                    </div>

                    {/* Company Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {company.employees && (
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{company.employees}+ employees</span>
                          </div>
                        )}
                        {company.foundedAt && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span className="font-medium">
                              {formatFoundedYear(company.foundedAt)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* View Company Button */}
                      <button className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:from-blue-600 hover:to-indigo-700 hover:shadow-md">
                        View Company
                      </button>
                    </div>
                  </div>

                  {/* Gradient Border Effect */}
                  <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              );
            })}
          </div>
        </div>

        <div className="sticky bottom-0 border-t bg-gradient-to-r from-orange-50 to-amber-50 p-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-orange-100 to-amber-100 p-4 text-orange-800">
            <Crown className="h-6 w-6 flex-shrink-0 text-orange-600" />
            <p className="text-sm font-medium">
              <span className="font-bold">VIP companies</span> receive top
              priority positioning, enhanced visibility, and premium features on
              the homepage
            </p>
            <Button
              size="lg"
              variant="default"
              onClick={onClose}
              className="ml-auto bg-gradient-to-r from-orange-600 to-amber-600 px-8 shadow-lg hover:opacity-90"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
