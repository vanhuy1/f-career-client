'use client';

import { Company } from '@/types/Company';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, AlertCircle, Loader2 } from 'lucide-react';

// Dynamically import the map components with no SSR
const Map = dynamic(
  () => import('@/app/(public)/company/[id]/_components/map'),
  { ssr: false },
);

interface MapSectionProps {
  company: Company;
}

const MapSection = ({ company }: MapSectionProps) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCoordinates = async () => {
      if (!company.address?.[0]) {
        setError('No address available');
        setIsLoading(false);
        return;
      }

      try {
        // Format address for better geocoding results
        const formattedAddress = company.address[0]
          .replace(/[,\s]+/g, ' ')
          .trim();

        // Add "Vietnam" to the address if not present
        const addressWithCountry = formattedAddress
          .toLowerCase()
          .includes('vietnam')
          ? formattedAddress
          : `${formattedAddress}, Vietnam`;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            addressWithCountry,
          )}&countrycodes=vn&limit=1`,
          {
            headers: {
              'Accept-Language': 'vi', // Vietnamese results
              'User-Agent': 'F-Career-Client',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }

        const data = await response.json();

        if (data && data[0]) {
          setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        } else {
          // Try with district/city search
          const districtMatch = company.address[0].match(
            /(Quận|Huyện|Thành phố|TP\.|Q\.) ([^,]+)/i,
          );
          if (districtMatch) {
            const districtSearch = `${districtMatch[0]}, Vietnam`;
            const districtResponse = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                districtSearch,
              )}&countrycodes=vn&limit=1`,
              {
                headers: {
                  'Accept-Language': 'vi',
                  'User-Agent': 'F-Career-Client',
                },
              },
            );
            const districtData = await districtResponse.json();

            if (districtData && districtData[0]) {
              setCoordinates([
                parseFloat(districtData[0].lat),
                parseFloat(districtData[0].lon),
              ]);
            } else {
              setError('Location not found');
            }
          } else {
            setError('Location not found');
          }
        }
      } catch (err) {
        setError('Failed to fetch location data');
        console.error('Error fetching coordinates:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getCoordinates();
  }, [company.address]);

  // Memoize the address to prevent unnecessary re-renders
  const address = useMemo(
    () => company.address?.[0] || 'Company Location',
    [company.address],
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-slate-50 to-gray-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-28 w-28 translate-x-14 -translate-y-14 rounded-full bg-gradient-to-br from-slate-100 to-gray-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center gap-4">
        <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 p-3 shadow-lg">
          <Navigation className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Company Location</h2>
          <p className="mt-1 text-sm text-gray-600">Find us on the map</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div className="overflow-hidden rounded-2xl bg-gray-100 shadow-2xl">
          {isLoading && (
            <div className="flex h-[400px] items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <Loader2 className="h-10 w-10 animate-spin text-slate-600" />
                  <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-2 border-slate-400 opacity-20" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900">
                    Loading map...
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Fetching location data
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex h-[400px] items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Unable to Load Map
                </h3>
                <p className="mb-1 text-red-600">{error}</p>
                <p className="text-sm text-gray-500">
                  Please check the address information
                </p>
              </div>
            </div>
          )}

          {!isLoading && !error && coordinates && (
            <div className="h-[400px] w-full">
              <Map coordinates={coordinates} address={address} />
            </div>
          )}
        </div>

        {/* Address Info */}
        {!isLoading && !error && (
          <div className="mt-4 rounded-xl border border-white/50 bg-white/70 p-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-lg bg-gradient-to-br from-slate-500 to-gray-600 p-2 shadow-md">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="mb-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Our Address
                </div>
                <p className="text-sm leading-relaxed font-medium text-gray-900">
                  {address}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-slate-500 via-gray-500 to-zinc-500"></div>
    </div>
  );
};

export default MapSection;
