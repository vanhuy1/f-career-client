'use client';

import { useState, useEffect, useCallback } from 'react';
import { Mail, Phone, MapPin, Globe, Loader2 } from 'lucide-react';
import { Company } from '@/types/Company';
import { toast } from 'react-toastify';
import { CreateCompanyReq } from '@/types/Company';
import { ContactIcon, Settings } from 'lucide-react';
import debounce from 'lodash/debounce';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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

interface ContactSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<CreateCompanyReq>) => Promise<void>;
}
interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

// Component riêng cho address input với suggestions
function AddressInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddressSuggestions = async (q: string) => {
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`,
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch address suggestions:', error);
      toast.error('Failed to fetch address suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetch = useCallback(
    debounce(fetchAddressSuggestions, 300),
    [],
  );

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          debouncedFetch(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder || 'Search for a location...'}
        className="pr-8"
      />
      {isLoading && (
        <div className="absolute top-1/2 right-2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}

      {/* Address Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {suggestions.map((suggestion) => {
            const addressParts = [
              suggestion.address.city,
              suggestion.address.state,
              suggestion.address.country,
            ].filter(Boolean);

            return (
              <div
                key={`${suggestion.lat}-${suggestion.lon}`}
                className="cursor-pointer px-4 py-2 hover:bg-gray-50"
                onClick={() => {
                  onChange(suggestion.display_name);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                <div className="text-sm font-medium">
                  {suggestion.display_name}
                </div>
                {addressParts.length > 0 && (
                  <div className="text-xs text-gray-500">
                    {addressParts.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    email: contactInfo.email || '',
    phone: contactInfo.phone || '',
    address: contactInfo.address || '',
    website: contactInfo.website || '',
  });
  const [websiteError, setWebsiteError] = useState('');

  // Update contact info when the `company` object changes
  useEffect(() => {
    if (company) {
      const newContactInfo = {
        email: company.email || null,
        phone: company.phone?.toString() || null,
        address: company.address?.[0] || null,
        website: company.website || null,
      };
      setContactInfo(newContactInfo);
      setEditFormData({
        email: newContactInfo.email || '',
        phone: newContactInfo.phone || '',
        address: newContactInfo.address || '',
        website: newContactInfo.website || '',
      });
    }
  }, [company]);

  const handleEditSubmit = async () => {
    if (!company) return;

    try {
      // Validate email format
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (editFormData.email && !emailRegex.test(editFormData.email)) {
        toast.error('Please enter a valid email address');
        return;
      }

      // Validate phone format (at least 8 digits, can contain +, -, (, ), and spaces)
      const phoneRegex = /^[0-9+\-\s()]{8,}$/;
      if (editFormData.phone && !phoneRegex.test(editFormData.phone)) {
        toast.error('Please enter a valid phone number');
        return;
      }

      // Validate website URL
      if (editFormData.website) {
        const formattedUrl = formatUrl(editFormData.website);
        if (!isValidUrl(formattedUrl)) {
          setWebsiteError('Please enter a valid website URL');
          return;
        }
        editFormData.website = formattedUrl;
      }

      // Create a new address array, updating only the first element (HQ)
      const newAddresses =
        company.address && Array.isArray(company.address)
          ? [editFormData.address, ...company.address.slice(1)]
          : [editFormData.address];

      // Use the `onUpdateCompany` function to update the company data
      await onUpdateCompany({
        address: newAddresses,
        website: editFormData.website,
        email: editFormData.email,
        phone: Number(editFormData.phone.replace(/\D/g, '')), // Convert to number by removing non-digits
      });

      // Update local state with all fields
      setContactInfo((prev) => ({
        ...prev,
        address: editFormData.address,
        website: editFormData.website,
        email: editFormData.email,
        phone: editFormData.phone,
      }));

      setIsEditDialogOpen(false);
      toast.success('Contact information updated successfully');
    } catch (error) {
      console.error('Failed to update contact information:', error);
      toast.error('Failed to update contact information');
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-emerald-50 to-teal-50 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 p-3 shadow-lg">
            <ContactIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Contact Information
            </h2>
            <p className="mt-0.5 text-sm text-gray-600">
              Manage your contact details
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Settings className="h-4 w-4" />
          Edit
        </Button>
      </div>

      {/* Contact Items */}
      <div className="relative space-y-4">
        {/* Email */}
        <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
          <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Email Address
            </div>
            {contactInfo.email ? (
              <a
                href={`mailto:${contactInfo.email}`}
                className="block truncate text-sm font-medium text-indigo-600 transition-colors duration-200 group-hover/item:underline hover:text-indigo-700"
                title={contactInfo.email}
              >
                {contactInfo.email}
              </a>
            ) : (
              <div className="text-sm font-medium text-gray-500 italic">
                Not specified
              </div>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
          <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
            <Phone className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Phone Number
            </div>
            {contactInfo.phone ? (
              <a
                href={`tel:${contactInfo.phone}`}
                className="block truncate text-sm font-medium text-gray-900 transition-colors duration-200 hover:text-emerald-600"
                title={contactInfo.phone}
              >
                0{contactInfo.phone}
              </a>
            ) : (
              <div className="text-sm font-medium text-gray-500 italic">
                Not specified
              </div>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
          <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
            <MapPin className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Address
            </div>
            {contactInfo.address ? (
              <div
                className="text-sm leading-relaxed font-medium break-words text-gray-900"
                title={contactInfo.address}
              >
                {contactInfo.address}
              </div>
            ) : (
              <div className="text-sm font-medium text-gray-500 italic">
                Not specified
              </div>
            )}
          </div>
        </div>

        {/* Website */}
        <div className="group/item flex items-start gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md">
          <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 p-2.5 shadow-md transition-transform duration-300 group-hover/item:scale-110">
            <Globe className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
              Website
            </div>
            {contactInfo.website ? (
              <a
                href={contactInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-sm font-medium text-indigo-600 transition-colors duration-200 group-hover/item:underline hover:text-indigo-700"
                title={contactInfo.website}
              >
                {contactInfo.website}
              </a>
            ) : (
              <div className="text-sm font-medium text-gray-500 italic">
                Not specified
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Contact Information
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-500">
              Update your company contact details.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="grid gap-4">
              {/* Email */}
              <div>
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={editFormData.email}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Enter company email"
                  className="mt-1.5"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  eg. abc@gmail.com
                </p>
              </div>

              {/* Phone */}
              <div>
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Enter company phone number"
                  className="mt-1.5"
                />
              </div>

              {/* Address */}
              <div>
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Address
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="mt-1.5">
                  <AddressInput
                    value={editFormData.address}
                    onChange={(value) =>
                      setEditFormData((prev) => ({ ...prev, address: value }))
                    }
                    placeholder="Search for a location..."
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Use the search to find accurate addresses
                  </p>
                </div>
              </div>

              {/* Website */}
              <div>
                <Label
                  htmlFor="website"
                  className="text-sm font-medium text-gray-700"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={editFormData.website}
                  onChange={(e) => {
                    setEditFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }));
                    // Real-time validation
                    if (
                      e.target.value &&
                      !isValidUrl(formatUrl(e.target.value))
                    ) {
                      setWebsiteError('Please enter a valid website URL');
                    } else {
                      setWebsiteError('');
                    }
                  }}
                  placeholder="e.g. company.com"
                  className={`mt-1.5 block w-full rounded-lg border bg-white px-4 py-2.5 shadow-sm transition-colors hover:border-gray-300 focus:ring-2 focus:ring-indigo-500/20 ${
                    websiteError
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-200 focus:border-indigo-500'
                  }`}
                />
                {websiteError && (
                  <p className="mt-1.5 text-sm text-red-500">{websiteError}</p>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  If protocol is not specified, https:// will be added
                  automatically
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 text-white transition-all duration-300 hover:from-emerald-700 hover:to-teal-700"
              onClick={handleEditSubmit}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500"></div>
    </div>
  );
}
