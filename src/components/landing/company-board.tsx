'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import CompanyCard from './company-card';
import { companyService } from '@/services/api/company/company-api';
import {
  setCompanyStart,
  setCompanySuccess,
  setCompanyFailure,
  useCompanies,
  useCompanyLoadingState,
} from '@/services/state/companySlice';
import { LoadingState } from '@/store/store.model';

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

// Smart location formatting function
const formatLocation = (address?: string[] | null): string => {
  if (!address || address.length === 0) return '';

  // Take only the first element (headquarters)
  const headquarters = address[0];

  if (!headquarters) return 'Remote';

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
      parts[parts.length - 1]?.slice(1) || 'Remote'
  );
};

export default function CompanyBoard() {
  const [count, setCount] = useState(0);
  console.log(count);
  const hasInitialized = useRef(false);
  const dispatch = useDispatch();
  const companies = useCompanies();
  const loading = useCompanyLoadingState();
  const isLoading = loading === LoadingState.loading;

  // Only show real companies from API, limit to 8
  const displayCompanies = companies ? companies.slice(0, 8) : [];

  useEffect(() => {
    async function fetchTopCompanies() {
      // Prevent duplicate API calls
      if (isLoading || hasInitialized.current) return;

      try {
        hasInitialized.current = true;
        dispatch(setCompanyStart());
        const res = await companyService.getTopCompanies();
        dispatch(setCompanySuccess(res.data));
        setCount(res.meta.count);
      } catch (error) {
        console.error('Failed to fetch top companies:', error);
        dispatch(setCompanyFailure(error as string));
        hasInitialized.current = false; // Reset on error to allow retry
      }
    }

    // Only fetch if we don't have companies data and not currently loading
    if (!companies || companies.length === 0) {
      fetchTopCompanies();
    }
  }, [dispatch, isLoading]);

  return (
    <main className="min-h-screen bg-[#f8f8fd] px-4 py-16 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-800 md:text-5xl">
              Discover <span className="text-[#3b82f6]">TOP COMPANIES</span>
            </h1>
            <Link
              href="/company"
              className="flex items-center gap-2 text-[#6366f1] transition-colors hover:text-[#818cf8]"
            >
              Show all companies <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-xl bg-white/50"
                />
              ))}
            </div>
          ) : displayCompanies.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {displayCompanies.map((company) => (
                <CompanyCard
                  key={company.id}
                  id={company.id}
                  companyName={company.companyName}
                  logoUrl={company.logoUrl || '/placeholder.svg'}
                  industry={company.industry || 'Technology'}
                  website={company.website}
                  location={formatLocation(company.address)}
                  employees={company.employees}
                  foundedAt={company.foundedAt}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600">
                No companies available at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
