'use client';

import { ArrowRight } from 'lucide-react';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import CompanyCard from './company-card'; // Use local company card instead of search card
import { companyService } from '@/services/api/company/company-api';
import { Company } from '@/types/Company';
import {
  setCompanyStart,
  setCompanySuccess,
  setCompanyFailure,
  useCompanies,
  useCompanyLoadingState,
} from '@/services/state/companySlice';
import { LoadingState } from '@/store/store.model';

// Vietnamese provinces data (copied from job-board.tsx)
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

// Sample companies data for fallback to ensure always 8 companies
const sampleCompanies: Company[] = [
  {
    id: 'sample-1',
    companyName: 'TechViet Solutions',
    industry: 'Technology',
    logoUrl: '/logo-landing/nomad.png',
    website: 'techviet.com.vn',
    address: ['Ho Chi Minh City', 'Vietnam'],
    employees: 250,
    foundedAt: '2018',
  },
  {
    id: 'sample-2',
    companyName: 'VietWeb Digital',
    industry: 'Web Development',
    logoUrl: '/logo-landing/netlify.webp',
    website: 'vietwebdigital.vn',
    address: ['Hanoi', 'Vietnam'],
    employees: 180,
    foundedAt: '2019',
  },
  {
    id: 'sample-3',
    companyName: 'CloudVN Storage',
    industry: 'Cloud Services',
    logoUrl: '/logo-landing/dropbox.png',
    website: 'cloudvn.com',
    address: ['Da Nang', 'Vietnam'],
    employees: 320,
    foundedAt: '2017',
  },
  {
    id: 'sample-4',
    companyName: 'UX Design Studio',
    industry: 'UX/UI Design',
    logoUrl: '/logo-landing/maze.png',
    website: 'uxstudio.vn',
    address: ['Ho Chi Minh City', 'Vietnam'],
    employees: 95,
    foundedAt: '2020',
  },
  {
    id: 'sample-5',
    companyName: 'DevOps Vietnam',
    industry: 'DevOps & Infrastructure',
    logoUrl: '/logo-landing/terraform.png',
    website: 'devops.vn',
    address: ['Hanoi', 'Vietnam'],
    employees: 140,
    foundedAt: '2016',
  },
  {
    id: 'sample-6',
    companyName: 'EduTech Vietnam',
    industry: 'Education Technology',
    logoUrl: '/logo-landing/udacity.png',
    website: 'edutech.vn',
    address: ['Ho Chi Minh City', 'Vietnam'],
    employees: 280,
    foundedAt: '2015',
  },
  {
    id: 'sample-7',
    companyName: 'BuildTech Systems',
    industry: 'Software Engineering',
    logoUrl: '/logo-landing/packer.avif',
    website: 'buildtech.com.vn',
    address: ['Can Tho', 'Vietnam'],
    employees: 160,
    foundedAt: '2018',
  },
  {
    id: 'sample-8',
    companyName: 'FlowDesign Co.',
    industry: 'Web Design & Development',
    logoUrl: '/logo-landing/webflow.webp',
    website: 'flowdesign.vn',
    address: ['Da Nang', 'Vietnam'],
    employees: 120,
    foundedAt: '2019',
  },
];

// Smart location formatting function (adapted from job-board.tsx)
// Only shows headquarters (first element in address array)
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

export default function CompanyBoard() {
  const [count, setCount] = useState(0);
  const hasInitialized = useRef(false); // Track if we've already fetched data
  console.log(count);
  const dispatch = useDispatch();
  const companies = useCompanies();
  const loading = useCompanyLoadingState();
  const isLoading = loading === LoadingState.loading;

  // Merge real companies with sample data to ensure always 8 companies
  const displayCompanies = useMemo(() => {
    const realCompanies = companies || [];
    const neededCount = Math.max(0, 8 - realCompanies.length);

    if (neededCount === 0) {
      // If we have 8+ real companies, just return first 8
      return realCompanies.slice(0, 8);
    }

    // Filter out sample companies that might conflict with real ones (by name)
    const realCompanyNames = realCompanies.map((c) =>
      c.companyName.toLowerCase(),
    );
    const filteredSamples = sampleCompanies.filter(
      (sample) => !realCompanyNames.includes(sample.companyName.toLowerCase()),
    );

    // Combine real companies + needed sample companies
    return [...realCompanies, ...filteredSamples.slice(0, neededCount)];
  }, [companies]);

  useEffect(() => {
    async function fetchTopCompanies() {
      // Prevent duplicate API calls
      if (isLoading || hasInitialized.current) return;

      try {
        hasInitialized.current = true;
        dispatch(setCompanyStart());
        const res = await companyService.getTopCompanies(); // Use new top companies API
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
  }, [dispatch, isLoading]); // Removed limit since top companies API doesn't need it

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
          ) : (
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
          )}

          {/* Always show success state since we guarantee 8 companies */}
        </div>
      </div>
    </main>
  );
}
