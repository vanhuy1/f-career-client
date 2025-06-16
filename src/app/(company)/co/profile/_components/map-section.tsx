'use client';

import { Company } from '@/types/Company';
import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import the map components with no SSR
const Map = dynamic(() => import('./map'), { ssr: false });

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

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error || !coordinates) {
    return (
      <div className="flex h-[400px] items-center justify-center bg-gray-100">
        <p className="text-gray-600">{error || 'Unable to load map'}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900">Company Location</h2>
        <div className="mt-4 h-[400px] w-full">
          <Map coordinates={coordinates} address={address} />
        </div>
      </div>
    </div>
  );
};

export default MapSection;
