'use client';

import { Mail, Phone, MapPin, Globe, ContactIcon } from 'lucide-react';
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
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-emerald-50 to-teal-50 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
          <ContactIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Contact Information
          </h2>
          <p className="mt-0.5 text-sm text-gray-600">Get in touch with us</p>
        </div>
      </div>

      {/* Contact Items */}
      <div className="relative space-y-4">
        {/* Email */}
        {contactInfo.email && (
          <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
            <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Email Address
              </div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="block truncate text-sm font-medium text-indigo-600 transition-colors duration-200 group-hover/item:underline hover:text-indigo-700"
                title={contactInfo.email}
              >
                {contactInfo.email}
              </a>
            </div>
          </div>
        )}

        {/* Phone */}
        {contactInfo.phone && (
          <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
            <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
              <Phone className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Phone Number
              </div>
              <a
                href={`tel:${contactInfo.phone}`}
                className="block truncate text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-emerald-600"
                title={contactInfo.phone}
              >
                {contactInfo.phone}
              </a>
            </div>
          </div>
        )}

        {/* Address */}
        {contactInfo.address && (
          <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
            <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Address
              </div>
              <div
                className="text-sm leading-relaxed font-medium break-words text-gray-900"
                title={contactInfo.address}
              >
                {contactInfo.address}
              </div>
            </div>
          </div>
        )}

        {/* Website */}
        {contactInfo.website && (
          <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
            <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
              <Globe className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                Website
              </div>
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-medium text-indigo-600 transition-colors duration-200 group-hover/item:underline hover:text-indigo-700"
                title={contactInfo.website}
              >
                {contactInfo.website}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
    </div>
  );
}
