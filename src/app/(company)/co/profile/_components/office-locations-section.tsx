'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Country, CountryOption } from '@/types/Company';
import { Location } from '@/types/Company';

export default function OfficeLocationsSection() {
  const [locations, setLocations] = useState<Location[]>([
    {
      country: 'United States',
      emoji: '🇺🇸',
      isHQ: true,
      name: {
        common: 'United States',
        official: 'United States of America',
        nativeName: {},
      },
      flag: '🇺🇸',
    },
    {
      country: 'England',
      emoji: '🏴',
      name: { common: 'England', official: 'England', nativeName: {} },
      flag: '🏴',
    },
    {
      country: 'Japan',
      emoji: '🇯🇵',
      name: { common: 'Japan', official: 'Japan', nativeName: {} },
      flag: '🇯🇵',
    },
    {
      country: 'Australia',
      emoji: '🇦🇺',
      name: {
        common: 'Australia',
        official: 'Commonwealth of Australia',
        nativeName: {},
      },
      flag: '🇦🇺',
    },
    {
      country: 'China',
      emoji: '🇨🇳',
      name: {
        common: 'China',
        official: "People's Republic of China",
        nativeName: {},
      },
      flag: '🇨🇳',
    },
  ]);

  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [newCountry, setNewCountry] = useState('');
  const [newEmoji, setNewEmoji] = useState('🏳️');
  const [isHQ, setIsHQ] = useState(false);
  const [countryOptions, setCountryOptions] = useState<CountryOption[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          'https://restcountries.com/v3.1/all?fields=name,flag',
        );
        const data = await response.json();
        const countries: CountryOption[] = data
          .map((country: Country) => ({
            name: country.name.common,
            emoji: country.flag,
          }))
          .sort((a: CountryOption, b: CountryOption) =>
            a.name.localeCompare(b.name),
          );
        setCountryOptions(countries);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
        setCountryOptions([
          { name: 'United States', emoji: '🇺🇸' },
          { name: 'England', emoji: '🏴' },
          { name: 'Japan', emoji: '🇯🇵' },
          { name: 'Australia', emoji: '🇦🇺' },
          { name: 'China', emoji: '🇨🇳' },
        ]);
      }
    };

    fetchCountries();
  }, []);

  const handleAddLocationSubmit = () => {
    if (newCountry.trim()) {
      const newLocation: Location = {
        country: newCountry.trim(),
        emoji: newEmoji,
        isHQ,
        name: {
          common: newCountry.trim(),
          official: newCountry.trim(),
          nativeName: {},
        },
        flag: newEmoji,
      };

      const updatedLocations = isHQ
        ? locations.map((loc) => ({ ...loc, isHQ: false }))
        : locations;

      setLocations([...updatedLocations, newLocation]);
      setNewCountry('');
      setNewEmoji('🏳️');
      setIsHQ(false);
      setIsAddPopupOpen(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = e.target.value;
    setNewCountry(selectedCountry);
    const countryOption = countryOptions.find(
      (option) => option.name === selectedCountry,
    );
    setNewEmoji(countryOption ? countryOption.emoji : '🏳️');
  };

  return (
    <div className="mb-8">
      {/* Header and buttons */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-blue-900">
          Office Locations
        </h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={() => setIsAddPopupOpen(true)}
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={() => setIsAddPopupOpen(true)}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Office Locations List */}
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

      {/* Add Location Dialog */}
      <Dialog open={isAddPopupOpen} onOpenChange={setIsAddPopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Location</DialogTitle>
            <DialogDescription>
              Add a new office location for your company.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                value={newCountry}
                onChange={handleCountryChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a country</option>
                {countryOptions.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name} ({country.emoji})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isHQ}
                onChange={(e) => setIsHQ(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Mark as Head Quarters
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={handleAddLocationSubmit}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
