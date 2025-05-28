'use client';

import { Location } from '@/types/Company';
import { useEffect, useState } from 'react';

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
    <div className="rounded-lg border-b border-gray-200 p-6">
      <h2 className="mb-4 text-lg font-semibold text-blue-900">
        Office Locations
      </h2>
      <div className="space-y-3">
        {locations.map((location, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="text-2xl">{location.emoji}</div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {location.country}
              </span>
              {location.isHQ && (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                  Head Quarters
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
