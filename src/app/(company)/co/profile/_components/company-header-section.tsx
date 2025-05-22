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

interface CompanyHeaderSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<Company>) => Promise<void>;
}

export default function CompanyHeaderSection({
  company,
  onUpdateCompany,
}: CompanyHeaderSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <div className="flex items-center gap-1.5 border-none text-sm font-bold text-indigo-700">
                <Eye className="h-4 w-4" />
                Public View
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-sm text-indigo-700"
                onClick={() => setIsModalOpen(true)}
              >
                <Settings className="mr-2 h-4 w-4" />
                Edit Company Info
              </Button>
              {/* <Button
                variant="outline"
                size="sm"
                className="text-sm text-indigo-700"
                onClick={() => router.push(ROUTES.CO.HOME.SETTINGS.path)}
              >
                <Settings className="h-4 w-4" />
                Profile Settings
              </Button> */}
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
                Number Employees
              </label>
              <input
                {...register('employees')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                type="number"
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
