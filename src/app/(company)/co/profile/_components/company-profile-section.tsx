'use client';

import { useState, useEffect } from 'react';
import EditButton from './edit-button';
import type { FormField } from '../../../_components/edit-form-dialog';
import { Company } from '@/types/Company';
import { toast } from 'react-toastify';
import { CreateCompanyReq } from '@/types/Company';
import { createSafeHtml } from '@/utils/html-sanitizer';
import { FileText, Info } from 'lucide-react';

interface CompanyProfileSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<CreateCompanyReq>) => Promise<void>;
}

export default function CompanyProfileSection({
  company,
  onUpdateCompany,
}: CompanyProfileSectionProps) {
  // Initialize profile with company description or a default value
  const [profile, setProfile] = useState<string>(
    company.description ||
      "(default) Nomad is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools to accept payments, expand globally, and manage their businesses online. Stripe has been at the forefront of expanding internet commerce, powering new business models, and supporting the latest platforms, from marketplaces to mobile commerce sites. We believe that growing the GDP of the internet is a problem rooted in code and design, not finance. Stripe is built for developers, makers, and creators. We work on solving the hard technical problems necessary to build global economic infrastructure—from designing highly reliable systems to developing advanced machine learning algorithms to prevent fraud.",
  );

  // Update profile when the company object changes
  useEffect(() => {
    if (company.description) {
      setProfile(company.description);
    }
  }, [company.description]);

  const companyProfileFields: FormField[] = [
    {
      id: 'profile',
      label: 'Company Profile',
      type: 'richtext',
      defaultValue: profile,
      placeholder: 'Enter company profile',
    },
  ];

  const handleCompanyProfileSubmit = async (data: Record<string, string>) => {
    if (!company) return;

    try {
      // Use onUpdateCompany to update the company description
      await onUpdateCompany({
        description: data.profile,
      });

      // Update local state
      setProfile(data.profile);

      toast.success('Company description updated successfully');
    } catch (error) {
      console.error('Failed to update description:', error);
      // Show error toast
      toast.error('Failed to update description');
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-gray-50 to-slate-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Company Profile
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Tell your story and share your mission
            </p>
          </div>
        </div>

        <EditButton
          title="Edit Company Profile"
          description="Update your company's profile information"
          className="border-2"
          fields={companyProfileFields}
          onSubmit={handleCompanyProfileSubmit}
        />
      </div>

      {/* Content */}
      <div className="relative">
        {profile ? (
          <div className="prose prose-gray max-w-none">
            <div
              className="text-base leading-relaxed text-gray-700"
              dangerouslySetInnerHTML={createSafeHtml(profile)}
            />
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-6">
            <Info className="h-5 w-5 flex-shrink-0 text-gray-400" />
            <p className="text-gray-600 italic">
              No company description available. Click the edit button to add
              your company profile.
            </p>
          </div>
        )}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </div>
  );
}
