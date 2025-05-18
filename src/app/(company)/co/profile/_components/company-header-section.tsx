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
  companyDetailsSchema,
  type CompanyDetails,
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
import { useRouter } from 'next/navigation';
import ROUTES from '@/constants/navigation';
import { Company } from '@/types/Company';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { CreateCompanyReq } from '@/types/Company';

interface CompanyHeaderSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<CreateCompanyReq>) => Promise<void>;
  logoUrl?: string | null;
  companyName: string;
  industry?: string;
  foundedAt?: string;
  employees?: number;
}

export default function CompanyHeaderSection({
  company,
  onUpdateCompany,
  logoUrl,
  companyName,
}: CompanyHeaderSectionProps) {
  const router = useRouter();
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: company?.companyName || 'Nomad default',
    website: company?.website || 'https://nomad.com (default)',
    founded: new Date(company?.foundedAt || '2011-07-31 (default)'),
    employees: company?.employees
      ? company.employees.toString()
      : '4000+ (default)',
    location: company?.address?.[0] || '20 countries (default) ',
    industry: company?.industry || 'Social & Non-Profit (default)',
  });

  // Cập nhật khi company data thay đổi
  useEffect(() => {
    if (company) {
      setCompanyDetails({
        ...companyDetails,
        name: company.companyName,
        website: company.website || companyDetails.website,
        founded: new Date(company.foundedAt || company.createdAt || Date.now()),
        employees: company.employees
          ? company.employees.toString()
          : companyDetails.employees,
        location: company.address?.[0] || companyDetails.location,
        industry: company.industry || companyDetails.industry,
      });
    }
  }, [company]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanyDetailsInput>({
    resolver: zodResolver(companyDetailsSchemaInput),
    defaultValues: {
      ...companyDetails,
      founded: companyDetails.founded.toISOString().split('T')[0],
    },
  });

  // Cập nhật form khi companyDetails thay đổi
  useEffect(() => {
    reset({
      ...companyDetails,
      founded: companyDetails.founded.toISOString().split('T')[0],
    });
  }, [companyDetails, reset]);

  const onSubmit: SubmitHandler<CompanyDetailsInput> = async (data) => {
    if (!company) return;

    try {
      // Tạo mảng address mới, chỉ thay đổi phần tử đầu tiên (HQ)
      const newAddresses =
        company.address && Array.isArray(company.address)
          ? [data.location, ...company.address.slice(1)]
          : [data.location];

      await onUpdateCompany({
        companyName: data.name,
        website: data.website,
        foundedAt: new Date(data.founded).toISOString(),
        employees: parseInt(data.employees),
        address: newAddresses,
        industry: data.industry,
      });

      // Cập nhật state local
      const transformedData = companyDetailsSchema.parse(
        data,
      ) as CompanyDetails;
      setCompanyDetails(transformedData);
      setIsModalOpen(false);

      // Hiển thị thông báo thành công
      toast.success('Company information updated successfully');
    } catch (error) {
      console.error('Failed to update company details:', error);
      toast.error('Failed to update company information');
    }
  };

  return (
    <>
      <div className="mb-8 flex items-start gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-emerald-100">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={companyName}
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
            <h1 className="text-2xl font-bold">{companyDetails.name}</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-sm text-indigo-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit Company Info
              </Button>
              <div className="flex items-center gap-1.5 border-none text-sm font-bold text-indigo-700">
                <Eye className="h-4 w-4" />
                Public View
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-sm text-indigo-700"
                onClick={() => router.push(ROUTES.CO.HOME.SETTINGS.path)}
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Button>
            </div>
          </div>
          <a
            href={companyDetails.website}
            className="mt-1 block text-sm text-indigo-600 hover:underline"
          >
            {companyDetails.website}
          </a>
          <div className="mt-6 grid grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-50 p-2">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Founded</div>
                <div className="text-sm font-medium">
                  {format(companyDetails.founded, 'MMMM d, yyyy')}
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
                  {companyDetails.employees}
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
                  {companyDetails.location}
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
                  {companyDetails.industry}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Profile Settings</DialogTitle>
            <DialogDescription>
              Update your companys profile information below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                {...register('website')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.website.message}
                </p>
              )}
            </div>

            {/* Founded */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Founded
              </label>
              <input
                type="date"
                {...register('founded')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.founded && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.founded.message}
                </p>
              )}
            </div>

            {/* Employees */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Employees
              </label>
              <input
                {...register('employees')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.employees && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.employees.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                {...register('location')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Industry
              </label>
              <input
                {...register('industry')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.industry.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
