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
  description?: string | null;
  industry?: string;
  foundedAt?: string;
  employees?: number;
}

export default function CompanyProfileSection({
  company,
  onUpdateCompany,
  description,
}: CompanyProfileSectionProps) {
  // Sử dụng thông tin từ database hoặc dữ liệu mẫu nếu không có
  const [profile, setProfile] = useState<string>(
    description ||
      "(default) Nomad is a software platform for starting and running internet businesses. Millions of businesses rely on Stripe's software tools to accept payments, expand globally, and manage their businesses online. Stripe has been at the forefront of expanding internet commerce, powering new business models, and supporting the latest platforms, from marketplaces to mobile commerce sites. We believe that growing the GDP of the internet is a problem rooted in code and design, not finance. Stripe is built for developers, makers, and creators. We work on solving the hard technical problems necessary to build global economic infrastructure—from designing highly reliable systems to developing advanced machine learning algorithms to prevent fraud.",
  );

  // Cập nhật profile khi company thay đổi
  useEffect(() => {
    if (description) {
      setProfile(description);
    }
  }, [description]);

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
      // Sử dụng hàm onUpdateCompany để cập nhật
      await onUpdateCompany({
        description: data.profile,
      });

      // Cập nhật state local
      setProfile(data.profile);

      // Hiển thị thông báo thành công
      toast.success('Description updated successfully');
    } catch (error) {
      console.error('Failed to update description:', error);
      // Hiển thị thông báo lỗi
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
