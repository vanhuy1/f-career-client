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
}

export default function ContactSection({
  company,
  onUpdateCompany,
}: ContactSectionProps) {
  const defaultContactInfo = {
    email: company?.email || null,
    phone: company?.phone?.toString() || null,
    address: company?.address?.[0] || null,
    website: company?.website || null,
  };

  const [contactInfo, setContactInfo] = useState(defaultContactInfo);

  // Update contact info when the `company` object changes
  useEffect(() => {
    if (company) {
      setContactInfo({
        email: company.email || null,
        phone: company.phone?.toString() || null,
        address: company.address?.[0] || null,
        website: company.website || null,
      });
    }
  }, [company]);

  const contactFields: FormField[] = [
    {
      id: 'email',
      label: 'Email',
      type: 'email',
      defaultValue: contactInfo.email || '',
      placeholder: 'Enter company email',
    },
    {
      id: 'phone',
      label: 'Phone',
      type: 'text',
      defaultValue: contactInfo.phone || '',
      placeholder: 'Enter company phone number',
    },
    {
      id: 'address',
      label: 'Address',
      type: 'text',
      defaultValue: contactInfo.address || '',
      placeholder: 'Enter company address',
    },
    {
      id: 'website',
      label: 'Website',
      type: 'url',
      defaultValue: contactInfo.website || '',
      placeholder: 'Enter company website (e.g., https://example.com)',
    },
  ];

  const handleContactSubmit = async (data: Record<string, string>) => {
    if (!company) return;

    try {
      // Validate email format
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (data.email && !emailRegex.test(data.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone format (at least 8 digits, can contain +, -, (, ), and spaces)
      const phoneRegex = /^[0-9+\-\s()]{8,}$/;
      if (data.phone && !phoneRegex.test(data.phone)) {
        toast.error('Please enter a valid phone number');
        return;
      }

      // Create a new address array, updating only the first element (HQ)
      const newAddresses =
        company.address && Array.isArray(company.address)
          ? [data.address, ...company.address.slice(1)]
          : [data.address];

      // Use the `onUpdateCompany` function to update the company data
      await onUpdateCompany({
        address: newAddresses,
        website: data.website,
        email: data.email,
        phone: Number(data.phone.replace(/\D/g, '')), // Convert to number by removing non-digits
      });

      // Update local state with all fields
      setContactInfo((prev) => ({
        ...prev,
        address: data.address,
        website: data.website,
        email: data.email,
        phone: data.phone,
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
          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <Mail className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Email</div>
              {contactInfo.email ? (
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="block truncate text-sm font-medium text-indigo-600 hover:underline"
                  title={contactInfo.email}
                >
                  {contactInfo.email}
                </a>
              ) : (
                <div className="text-sm font-medium text-gray-500">N/A</div>
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <Phone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Phone</div>
              {contactInfo.phone ? (
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="block truncate text-sm font-medium"
                  title={contactInfo.phone}
                >
                  0{contactInfo.phone}
                </a>
              ) : (
                <div className="text-sm font-medium text-gray-500">N/A</div>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Address</div>
              {contactInfo.address ? (
                <div
                  className="text-sm font-medium break-words"
                  title={contactInfo.address}
                >
                  {contactInfo.address}
                </div>
              ) : (
                <div className="text-sm font-medium text-gray-500">N/A</div>
              )}
            </div>
          </div>

          {/* Website */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 rounded-full bg-blue-50 p-2">
              <Globe className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-gray-500">Website</div>
              {contactInfo.website ? (
                <a
                  href={contactInfo.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block truncate text-sm font-medium text-indigo-600 hover:underline"
                  title={contactInfo.website}
                >
                  {contactInfo.website}
                </a>
              ) : (
                <div className="text-sm font-medium text-gray-500">N/A</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
