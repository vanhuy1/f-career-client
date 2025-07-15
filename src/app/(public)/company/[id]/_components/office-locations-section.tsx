'use client';

import { Location } from '@/types/Company';
import { useEffect, useState } from 'react';
import { MapPin, Building2, Crown } from 'lucide-react';

interface OfficeLocationsSectionProps {
  address: string[];
}

export default function OfficeLocationsSection({
  address,
}: OfficeLocationsSectionProps) {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    if (address && address.length > 0) {
      const apiLocations = address.map((addr, index) => ({
        country: addr,
        emoji: '🏢',
        isHQ: index === 0,
        name: {
          common: addr,
          official: addr,
          nativeName: {},
        },
        flag: '🏢',
      }));
      setLocations(apiLocations);
    }
  }, [address]);

  if (!locations || locations.length === 0) return null;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center gap-3">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
          <Building2 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Office Locations</h2>
          <p className="mt-0.5 text-sm text-gray-600">Where you can find us</p>
        </div>
      </div>

      {/* Locations List */}
      <div className="relative space-y-3">
        {locations.map((location, index) => (
          <div
            key={index}
            className="group/item flex items-center gap-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md"
          >
            <div className="flex-shrink-0 text-2xl">{location.emoji}</div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-gray-900">
                  {location.country}
                </span>
                {location.isHQ && (
                  <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-1">
                    <Crown className="h-3 w-3 text-amber-600" />
                    <span className="text-xs font-medium text-amber-700">
                      Headquarters
                    </span>
                  </div>
                )}
              </div>

              {/* Location type indicator */}
              <div className="mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-500">
                  {location.isHQ ? 'Main Office' : 'Branch Office'}
                </span>
              </div>
            </div>

            {/* Hover indicator */}
            <div className="opacity-0 transition-opacity duration-300 group-hover/item:opacity-100">
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {locations.length > 1 && (
        <div className="relative mt-4 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
          <div className="text-center">
            <p className="text-sm font-medium text-blue-700">
              Operating in {locations.length} location
              {locations.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
    </div>
  );
}
