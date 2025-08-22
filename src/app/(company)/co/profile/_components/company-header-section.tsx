'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  companyDetailsSchemaInput,
  type CompanyDetailsInput,
} from '@/schemas/Company';
import { format } from 'date-fns';
import {
  Eye,
  Settings,
  Users,
  MapPin,
  Layers,
  Building,
  ImageIcon,
  Globe,
  Calendar,
  Loader2,
  Crown,
} from 'lucide-react';
import { Company } from '@/types/Company';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import FileUploader from '@/components/common/FileUploader';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { uploadFile } from '@/lib/storage';
import { Input } from '@/components/ui/input';
import debounce from 'lodash/debounce';
import CompanyPromotionModal from './CompanyPromotionModal';

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

// Smart location formatting function (adapted from company-board.tsx)
// Only shows headquarters (first element in address array)
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
      parts[parts.length - 1]?.slice(1) || 'N/A'
  );
};

// Thêm interface cho Nominatim response
interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

// Component riêng cho location input với suggestions
function LocationInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLocationSuggestions = async (q: string) => {
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch location suggestions:', error);
      toast.error('Failed to fetch location suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce(fetchLocationSuggestions, 300),
    [],
  );

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          debouncedFetch(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder || 'Search for a location...'}
        className={`pr-8 ${className || ''}`}
      />
      {isLoading && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}

      {/* Location Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {suggestions.map((suggestion) => {
            const addressParts = [
              suggestion.address.city,
              suggestion.address.state,
              suggestion.address.country,
            ].filter(Boolean);

            return (
              <div
                key={`${suggestion.lat}-${suggestion.lon}`}
                className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                onClick={() => {
                  onChange(suggestion.display_name);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                <div className="text-sm font-medium">
                  {suggestion.display_name}
                </div>
                {addressParts.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {addressParts.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Thêm hàm helper để lấy ngày hiện tại ở định dạng YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Thêm hàm helper để format date cho input
const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

interface CompanyHeaderSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<Company>) => Promise<void>;
}

export default function CompanyHeaderSection({
  company,
  onUpdateCompany,
}: CompanyHeaderSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
  const [employeesError, setEmployeesError] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const router = useRouter();

  const handleLogoSelect = (file: File) => {
    // Create a local preview URL
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
    setLogoFile(file);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CompanyDetailsInput>({
    resolver: zodResolver(companyDetailsSchemaInput),
    defaultValues: {
      name: company.companyName || '',
      website: company.website || '',
      founded: formatDateForInput(company.foundedAt || ''),
      employees: company.employees?.toString() || '',
      location: company.address?.[0] || '',
      industry: company.industry || '',
    },
  });

  // Watch location field for suggestions
  const locationValue = watch('location');

  useEffect(() => {
    reset({
      name: company.companyName || '',
      website: company.website || '',
      founded: formatDateForInput(company.foundedAt || ''),
      employees: company.employees?.toString() || '',
      location: company.address?.[0] || '',
      industry: company.industry || '',
    });
  }, [company, reset]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (logoPreview) {
        URL.revokeObjectURL(logoPreview);
      }
    };
  }, [logoPreview]);

  const onSubmit: SubmitHandler<CompanyDetailsInput> = async (data) => {
    try {
      // Validate employees number
      const employeesNum = parseInt(data.employees, 10);
      if (employeesNum < 10) {
        setEmployeesError('Company must have at least 10 employees');
        return;
      }

      let logoUrl = company.logoUrl;

      // Upload the logo file to Supabase if we have a new one
      if (logoFile) {
        const { publicUrl, error } = await uploadFile({
          file: logoFile,
          bucket: SupabaseBucket.USER_SETTINGS,
          folder: SupabaseFolder.COMPANY_LOGOS,
        });

        if (error) {
          toast.error(`Failed to upload logo: ${error.message}`);
          return;
        }

        logoUrl = publicUrl;
      }

      const newAddresses = company.address
        ? [data.location, ...company.address.slice(1)]
        : [data.location];

      await onUpdateCompany({
        companyName: data.name,
        website: data.website,
        foundedAt: data.founded,
        employees: employeesNum,
        address: newAddresses,
        industry: data.industry,
        logoUrl: logoUrl,
      });

      // Clear the temporary file and preview
      if (logoFile) {
        setLogoFile(null);
        if (logoPreview) {
          URL.revokeObjectURL(logoPreview);
          setLogoPreview(null);
        }
      }

      toast.success('Profile information updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update company details:', error);
      toast.error('Failed to update company information');
    }
  };

  const handlePublicView = () => {
    router.push(`/company/${company.id}`);
  };

  const handleModalClose = () => {
    // Clean up logo preview when modal closes
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
    setLogoFile(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-r from-white via-blue-50 to-indigo-50 p-8 shadow-2xl backdrop-blur-sm">
        {/* Background pattern */}
        <div className="bg-grid-pattern absolute inset-0 opacity-5"></div>

        {/* Content */}
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Company Logo */}
          <div className="flex-shrink-0">
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 p-2 shadow-lg ring-4 ring-white/50">
              {company.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt={company.companyName}
                  width={112}
                  height={112}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-emerald-200 to-blue-200">
                  <Building className="h-16 w-16 text-emerald-700" />
                </div>
              )}
            </div>
          </div>

          {/* Company Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900">
                  {company.companyName}
                </h1>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-base text-indigo-600 transition-colors duration-200 hover:text-indigo-700"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="group-hover:underline">
                      {company.website}
                    </span>
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 text-sm font-bold text-indigo-700"
                  onClick={handlePublicView}
                >
                  <Eye className="h-4 w-4" />
                  Public View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-sm text-indigo-700"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Company Info
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-sm text-orange-700 hover:bg-orange-50"
                  onClick={() => setIsPromotionModalOpen(true)}
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade to VIP
                </Button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Founded Date */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Founded
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">
                      {company.foundedAt
                        ? format(new Date(company.foundedAt), 'MMM dd, yyyy')
                        : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
              </div>

              {/* Employees */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Employees
                    </div>
                    <div className="mt-1 text-sm font-bold text-gray-900">
                      {company.employees || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
              </div>

              {/* Location */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 p-3 shadow-lg">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Location
                    </div>
                    <div
                      className="mt-1 truncate text-sm font-bold text-gray-900"
                      title={formatLocation(company.address)}
                    >
                      {formatLocation(company.address)}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
              </div>

              {/* Industry */}
              <div className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-5 shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 p-3 shadow-lg">
                    <Layers className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                      Industry
                    </div>
                    <div
                      className="mt-1 truncate text-sm font-bold text-gray-900"
                      title={company.industry || 'N/A'}
                    >
                      {company.industry || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 -translate-x-full -skew-x-12 transform bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => !open && handleModalClose()}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Company Profile
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-500">
              Update your company profile information. Fields marked with
              <span className="text-red-500">*</span> are required.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
            {/* Logo Upload Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Company Logo
                </h3>
              </div>
              <div className="flex flex-col gap-6 md:flex-row">
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Upload your company logo. This will be displayed on your
                    profile and job postings.
                  </p>
                </div>

                <div className="flex flex-1 items-start gap-6">
                  {/* Current logo preview */}
                  <div className="relative">
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-emerald-100">
                      {logoPreview || company.logoUrl ? (
                        <Image
                          src={logoPreview || company.logoUrl || ''}
                          alt="Company Logo"
                          width={96}
                          height={96}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      ) : (
                        <Building className="h-12 w-12 text-emerald-600" />
                      )}
                    </div>
                  </div>

                  {/* FileUploader */}
                  <FileUploader
                    bucket={SupabaseBucket.USER_SETTINGS}
                    folder={SupabaseFolder.COMPANY_LOGOS}
                    onFileSelect={handleLogoSelect}
                    wrapperClassName="
                        flex
                        h-24
                        w-48
                        flex-col
                        items-center
                        justify-center
                        rounded-lg
                        border-2
                        border-dashed
                        border-indigo-300
                        p-4
                        text-center
                        hover:border-indigo-400
                        transition
                        duration-150
                        ease-in-out
                      "
                    buttonClassName="flex flex-col items-center"
                  >
                    <ImageIcon className="h-5 w-5 text-indigo-600" />
                    <p className="mt-1 text-xs font-medium text-indigo-600">
                      Click to replace
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or SVG</p>
                  </FileUploader>
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Basic Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    {...register('name')}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    maxLength={100}
                    minLength={3}
                    required
                    placeholder="Enter company name"
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">
                    Company name should be between 3 and 100 characters
                  </p>
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Industry
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    {...register('industry')}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    required
                    placeholder="e.g. Technology, Healthcare, etc."
                  />
                  {errors.industry && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.industry.message}
                    </p>
                  )}
                </div>

                {/* Founded Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Founded Date
                  </label>
                  <input
                    type="date"
                    {...register('founded')}
                    max={getCurrentDate()}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {errors.founded && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.founded.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Contact Information
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Website
                  </label>
                  <input
                    {...register('website')}
                    className={`mt-1.5 block w-full rounded-lg border bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:ring-2 focus:ring-indigo-500/20 ${errors.website ? 'border-red-500' : ''}`}
                    placeholder="e.g. company.com"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.website.message}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">
                    If protocol is not specified, https:// will be added
                    automatically
                  </p>
                </div>

                {/* Number of Employees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Employees
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    {...register('employees')}
                    className={`mt-1.5 block w-full rounded-lg border bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:ring-2 focus:ring-indigo-500/20 ${
                      employeesError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    type="number"
                    min="10"
                    required
                    placeholder="e.g. 100"
                    onKeyDown={(e) => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < 10) {
                        setEmployeesError(
                          'Company must have at least 10 employees',
                        );
                      } else {
                        setEmployeesError('');
                      }
                    }}
                  />
                  {employeesError && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {employeesError}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">
                    Minimum 10 employees required
                  </p>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <LocationInput
                    value={locationValue}
                    onChange={(value) => setValue('location', value)}
                    placeholder="Search for a location..."
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  />
                  {errors.location && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                  <p className="mt-1.5 text-xs text-gray-500">
                    Use the search to find accurate addresses
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 px-6 text-white hover:bg-indigo-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Company Promotion Modal */}
      <CompanyPromotionModal
        company={company}
        isOpen={isPromotionModalOpen}
        onClose={() => setIsPromotionModalOpen(false)}
        onUpdateCompany={onUpdateCompany}
      />
    </>
  );
}
