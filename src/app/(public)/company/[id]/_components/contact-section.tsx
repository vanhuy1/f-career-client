'use client';

import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Company } from '@/types/Company';

interface ContactSectionProps {
  company: Company;
}

export default function ContactSection({ company }: ContactSectionProps) {
  const contactInfo = {
    email: company?.email || null,
    phone: company?.phone?.toString() || null,
    address: company?.address?.[0] || null,
    website: company?.website || null,
  };

  if (
    !contactInfo.email &&
    !contactInfo.phone &&
    !contactInfo.address &&
    !contactInfo.website
  ) {
    return null;
  }

  return (
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold">Contact</h2>
      <div className="flex flex-col gap-4">
        {/* Email */}
        {contactInfo.email && (
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
        )}

        {/* Phone */}
        {contactInfo.phone && (
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
        )}

        {/* Address */}
        {contactInfo.address && (
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
        )}

        {/* Website */}
        {contactInfo.website && (
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
        )}
      </div>
    </div>
  );
}
