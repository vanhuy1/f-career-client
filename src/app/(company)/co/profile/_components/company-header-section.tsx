'use client';

import { useState, useEffect } from 'react';
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
  Clock,
  Users,
  MapPin,
  Layers,
  Building,
} from 'lucide-react';
import { Company } from '@/types/Company';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

// Thêm hàm helper để lấy ngày hiện tại ở định dạng YYYY-MM-DD
const getCurrentDate = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Thêm hàm helper để validate URL
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Thêm hàm helper để format URL
const formatUrl = (url: string) => {
  if (!url) return '';
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return `https://${url}`;
  }
  return url;
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
  const [websiteError, setWebsiteError] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyDetailsInput>({
    resolver: zodResolver(companyDetailsSchemaInput),
    defaultValues: {
      name: company.companyName || '',
      website: company.website || '',
      founded: company.foundedAt || '',
      employees: company.employees?.toString() || '',
      location: company.address?.[0] || '',
      industry: company.industry || '',
    },
  });

  useEffect(() => {
    reset({
      name: company.companyName || '',
      website: company.website || '',
      founded: company.foundedAt || '',
      employees: company.employees?.toString() || '',
      location: company.address?.[0] || '',
      industry: company.industry || '',
    });
  }, [company, reset]);

  const onSubmit: SubmitHandler<CompanyDetailsInput> = async (data) => {
    try {
      // Validate website URL
      if (data.website) {
        const formattedUrl = formatUrl(data.website);
        if (!isValidUrl(formattedUrl)) {
          setWebsiteError('Please enter a valid website URL');
          return;
        }
        data.website = formattedUrl;
      }

      const newAddresses = company.address
        ? [data.location, ...company.address.slice(1)]
        : [data.location];

      await onUpdateCompany({
        companyName: data.name,
        website: data.website,
        foundedAt: data.founded,
        employees: parseInt(data.employees, 10),
        address: newAddresses,
        industry: data.industry,
      });

      toast.success('Company information updated successfully');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to update company details:', error);
      toast.error('Failed to update company information');
    }
  };

  const handlePublicView = () => {
    router.push(`/company/${company.id}`);
  };

  return (
    <>
      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-emerald-100">
          {company.logoUrl ? (
            <Image
              src={company.logoUrl}
              alt={company.companyName}
              width={96}
              height={96}
              className="h-full w-full rounded-lg object-cover"
            />
          ) : (
            <Building className="h-16 w-16 text-emerald-600" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{company.companyName}</h1>
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
            </div>
          </div>
          <a
            href={company.website || '#'}
            className="mt-1 block text-sm text-indigo-600 hover:underline"
          >
            {company.website || 'No website available'}
          </a>
          <div className="mt-6 grid grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Founded</div>
                <div className="text-sm font-medium">
                  {company.foundedAt
                    ? format(new Date(company.foundedAt), 'MMMM d, yyyy')
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Employees</div>
                <div className="text-sm font-medium">
                  {company.employees || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Location</div>
                <div className="text-sm font-medium">
                  {company.address?.[0] || 'N/A'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <Layers className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Industry</div>
                <div className="text-sm font-medium">
                  {company.industry || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
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
                    className={`mt-1.5 block w-full rounded-lg border bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:ring-2 focus:ring-indigo-500/20 ${
                      websiteError
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-200 focus:border-indigo-500'
                    }`}
                    placeholder="e.g. www.company.com"
                    onChange={(e) => {
                      const { value } = e.target;
                      if (value && !isValidUrl(formatUrl(value))) {
                        setWebsiteError('Please enter a valid website URL');
                      } else {
                        setWebsiteError('');
                      }
                    }}
                  />
                  {websiteError && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {websiteError}
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
                  </label>
                  <input
                    {...register('employees')}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    type="number"
                    min="0"
                    placeholder="e.g. 100"
                    onKeyDown={(e) => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value < 0) {
                        e.target.value = '0';
                      }
                    }}
                  />
                  {errors.employees && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.employees.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Location
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    {...register('location')}
                    className="mt-1.5 block w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    required
                    placeholder="e.g. Ho Chi Minh City, Vietnam"
                  />
                  {errors.location && (
                    <p className="mt-1.5 text-sm text-red-500">
                      {errors.location.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter className="mt-8 flex items-center justify-end gap-3 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
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
    </>
  );
}
