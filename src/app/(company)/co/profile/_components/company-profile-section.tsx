'use client';

import { useState, useEffect } from 'react';
import EditButton from './edit-button';
import type { FormField } from '../../../_components/edit-form-dialog';
import { Company } from '@/types/Company';
import { toast } from 'react-toastify';
import { CreateCompanyReq } from '@/types/Company';

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
      type: 'textarea',
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

      // Show success toast
      toast.success('Description updated successfully');
    } catch (error) {
      console.error('Failed to update description:', error);
      // Show error toast
      toast.error('Failed to update description');
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Company Profile</h2>
        <EditButton
          title="Edit Company Profile"
          description="Update your company's profile information"
          className="border-2"
          fields={companyProfileFields}
          onSubmit={handleCompanyProfileSubmit}
        />
      </div>
      <div className="rounded-lg border bg-white p-5 text-sm leading-relaxed text-gray-700">
        <p>{profile}</p>
      </div>
    </div>
  );
}
