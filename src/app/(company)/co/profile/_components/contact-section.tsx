'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Company } from '@/types/Company';
import EditButton from './edit-button';
import type { FormField } from '../../../_components/edit-form-dialog';
import { toast } from 'react-toastify';
import { CreateCompanyReq } from '@/types/Company';

interface ContactSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<CreateCompanyReq>) => Promise<void>;
  phone?: number;
  email?: string;
  website?: string;
  socialMedia?: string[];
}

export default function ContactSection({
  company,
  onUpdateCompany,
}: ContactSectionProps) {
  const defaultContactInfo = {
    email: 'info@nomad.com (default)',
    phone: '+1 (555) 123-4567 (default)',
    address:
      company?.address?.[0] ||
      '123 Tech Lane, San Francisco, CA 94107 (default)',
    website: company?.website || 'https://www.nomad.com (default)',
  };

  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  // Cập nhật khi company thay đổi
  useEffect(() => {
    if (company) {
      setContactInfo({
        ...contactInfo,
        address: company.address?.[0] || contactInfo.address,
        website: company.website || contactInfo.website,
      });
    }
  }, [company, contactInfo]);

  const contactFields: FormField[] = [
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      defaultValue: contactInfo.address,
      placeholder: 'Enter company address',
    },
    {
      id: 'website',
      label: 'Website',
      type: 'url',
      defaultValue: contactInfo.website,
      placeholder: 'Enter company website',
    },
  ];

  const handleContactSubmit = async (data: Record<string, string>) => {
    if (!company) return;

    try {
      // Tạo mảng address mới, chỉ thay đổi phần tử đầu tiên (HQ)
      const newAddresses =
        company.address && Array.isArray(company.address)
          ? [data.address, ...company.address.slice(1)]
          : [data.address];

      // Sử dụng hàm onUpdateCompany để cập nhật
      await onUpdateCompany({
        address: newAddresses,
        website: data.website,
      });

      // Cập nhật state local (giữ nguyên email và phone)
      setContactInfo((prev) => ({
        ...prev,
        address: data.address,
        website: data.website,
      }));

      toast.success('Contact information updated successfully');
    } catch (error) {
      console.error('Failed to update contact information:', error);
      toast.error('Failed to update contact information');
    }
  };

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contact</h2>
        <EditButton
          title="Edit Contact Information"
          description="Update your contact details"
          fields={contactFields}
          onSubmit={handleContactSubmit}
        />
      </div>
      <div className="rounded-lg border bg-white p-4">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Email</div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block truncate text-sm font-medium text-indigo-600 hover:underline"
                title={contactInfo.email}
              >
                {contactInfo.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Phone</div>
              <a
                href={`tel:${contactInfo.phone}`}
                className="block truncate text-sm font-medium"
                title={contactInfo.phone}
              >
                {contactInfo.phone}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Address</div>
              <div
                className="text-sm font-medium break-words"
                title={contactInfo.address}
              >
                {contactInfo.address}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Website</div>
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-medium text-indigo-600 hover:underline"
                title={contactInfo.website}
              >
                {contactInfo.website}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
