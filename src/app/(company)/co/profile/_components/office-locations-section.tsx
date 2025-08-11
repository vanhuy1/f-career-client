'use client';

import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { Button } from '@/components/ui/button';
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Building2,
  Crown,
  MapPin,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Location } from '@/types/Company';
import { Company } from '@/types/Company';
import { toast } from 'react-toastify';
import { CreateCompanyReq } from '@/types/Company';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Thêm interface cho Nominatim response
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

interface OfficeLocationsSectionProps {
  company: Company;
  onUpdateCompany: (data: Partial<CreateCompanyReq>) => Promise<void>;
  address?: string[] | null;
}

export default function OfficeLocationsSection({
  company,
  onUpdateCompany,
}: OfficeLocationsSectionProps) {
  const defaultLocations: Location[] = [];
  const [locations, setLocations] = useState<Location[]>(defaultLocations);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [newLocation, setNewLocation] = useState('');
  const [isHQ, setIsHQ] = useState(false);
  const [editingLocations, setEditingLocations] = useState<Location[]>([]);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSuggestions, setEditingSuggestions] = useState<{
    [key: number]: NominatimResult[];
  }>({});
  const [editingLoading, setEditingLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [showEditingSuggestions, setShowEditingSuggestions] = useState<{
    [key: number]: boolean;
  }>({});

  // Cập nhật locations từ API nếu có
  useEffect(() => {
    if (company?.address) {
      try {
        if (Array.isArray(company.address)) {
          const apiLocations = company.address.map((addr, index) => ({
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

          if (apiLocations.length > 0) {
            setLocations(apiLocations);
            setEditingLocations(apiLocations);
          }
        } else if (typeof company.address === 'string') {
          const apiLocation = {
            country: company.address,
            emoji: '🏢',
            isHQ: true,
            name: {
              common: company.address,
              official: company.address,
              nativeName: {},
            },
            flag: '🏢',
          };
          setLocations([apiLocation]);
          setEditingLocations([apiLocation]);
        }
      } catch (error) {
        console.error('Failed to process company addresses:', error);
      }
    }
  }, [company]);

  // Hàm fetch suggestions từ Nominatim API
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=5&addressdetails=1`,
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      toast.error('Failed to fetch location suggestions');
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce fetch để tránh gọi API quá nhiều
  const debouncedFetch = useCallback(
    debounce((query: string) => fetchLocationSuggestions(query), 300),
    [],
  );

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = () => setShowSuggestions(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Thêm hàm fetch suggestions cho edit
  const fetchEditLocationSuggestions = async (query: string, index: number) => {
    if (query.length < 3) {
      setEditingSuggestions((prev) => ({ ...prev, [index]: [] }));
      return;
    }

    setEditingLoading((prev) => ({ ...prev, [index]: true }));
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query,
        )}&limit=5&addressdetails=1`,
      );
      const data = await response.json();
      setEditingSuggestions((prev) => ({ ...prev, [index]: data }));
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      toast.error('Failed to fetch location suggestions');
    } finally {
      setEditingLoading((prev) => ({ ...prev, [index]: false }));
    }
  };

  // Debounce fetch cho edit
  const debouncedEditFetch = useCallback(
    debounce(
      (query: string, index: number) =>
        fetchEditLocationSuggestions(query, index),
      300,
    ),
    [],
  );

  // Handle click outside cho edit suggestions
  useEffect(() => {
    const handleClickOutside = () => {
      setShowEditingSuggestions({});
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddLocationSubmit = async () => {
    if (!company) return;

    if (newLocation.trim()) {
      const locationToAdd: Location = {
        country: newLocation.trim(),
        emoji: '🏢',
        isHQ,
        name: {
          common: newLocation.trim(),
          official: newLocation.trim(),
          nativeName: {},
        },
        flag: '🏢',
      };

      try {
        let newLocations: Location[];
        if (isHQ) {
          newLocations = [
            locationToAdd,
            ...locations.map((loc) => ({ ...loc, isHQ: false })),
          ];
        } else {
          newLocations = [...locations, locationToAdd];
        }

        await onUpdateCompany({
          address: newLocations.map((loc) => loc.country),
        });

        setLocations(newLocations);
        setNewLocation('');
        setIsHQ(false);
        setIsAddPopupOpen(false);

        toast.success('Office location added successfully');
      } catch (error) {
        console.error('Failed to add office location:', error);
        toast.error('Failed to add office location');
      }
    }
  };

  const handleEditLocation = (index: number, newValue: string) => {
    const newLocations = [...editingLocations];
    newLocations[index] = {
      ...newLocations[index],
      country: newValue,
      name: {
        ...newLocations[index].name,
        common: newValue,
        official: newValue,
      },
    };
    setEditingLocations(newLocations);
  };

  const handleToggleHQ = (index: number) => {
    const newLocations = editingLocations.map((loc, i) => ({
      ...loc,
      isHQ: i === index,
    }));
    setEditingLocations(newLocations);
  };

  const handleDeleteLocation = (index: number) => {
    const newLocations = editingLocations.filter((_, i) => i !== index);
    // Nếu xóa HQ, đặt location đầu tiên làm HQ
    if (editingLocations[index].isHQ && newLocations.length > 0) {
      newLocations[0] = { ...newLocations[0], isHQ: true };
    }
    setEditingLocations(newLocations);
  };

  const handleSaveLocations = async () => {
    if (!company) return;

    try {
      // Đảm bảo luôn có một HQ
      const locationsToSave = [...editingLocations];
      if (
        !locationsToSave.some((loc) => loc.isHQ) &&
        locationsToSave.length > 0
      ) {
        locationsToSave[0] = { ...locationsToSave[0], isHQ: true };
      }

      // Sắp xếp để HQ luôn ở đầu
      locationsToSave.sort((a, b) => (a.isHQ ? -1 : b.isHQ ? 1 : 0));

      await onUpdateCompany({
        address: locationsToSave.map((loc) => loc.country),
      });

      setLocations(locationsToSave);
      setIsEditPopupOpen(false);
      toast.success('Office locations updated successfully');
    } catch (error) {
      console.error('Failed to update office locations:', error);
      toast.error('Failed to update office locations');
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-6 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-3 shadow-lg">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Office Locations
            </h2>
            <p className="mt-0.5 text-sm text-gray-600">
              Where you can find us
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
            onClick={() => setIsAddPopupOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
            onClick={() => {
              setEditingLocations(locations);
              setIsEditPopupOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Locations List */}
      <div className="relative space-y-3">
        {locations.length > 0 ? (
          locations.map((location, index) => (
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
          ))
        ) : (
          <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white/50 p-12 backdrop-blur-sm">
            <div className="text-center">
              <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-600">No office locations added yet</p>
              {/* // eslint-disable-next-line react/no-unescaped-entities */}
              <p className="mt-1 text-sm text-gray-500">
                Click the &quot;Add Location&quot; button to get started
              </p>
            </div>
          </div>
        )}
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

      {/* Add Location Dialog */}
      <Dialog open={isAddPopupOpen} onOpenChange={setIsAddPopupOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Add New Location
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-500">
              Add a new office location for your company. Use the search to find
              accurate addresses.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            <div className="grid gap-4">
              <div className="relative">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <Input
                    id="location"
                    value={newLocation}
                    onChange={(e) => {
                      setNewLocation(e.target.value);
                      debouncedFetch(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search for a location..."
                    className="pr-8"
                  />
                  {isLoading && (
                    <div className="absolute top-1/2 right-2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Location Suggestions Dropdown */}
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
                            setNewLocation(suggestion.display_name);
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

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isHQ}
                  onChange={(e) => setIsHQ(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  id="isHQ"
                />
                <Label
                  htmlFor="isHQ"
                  className="text-sm font-medium text-gray-700"
                >
                  Mark as Head Quarters
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddPopupOpen(false);
                setSuggestions([]);
                setShowSuggestions(false);
              }}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleAddLocationSubmit}
            >
              Add Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Locations Dialog */}
      <Dialog open={isEditPopupOpen} onOpenChange={setIsEditPopupOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Edit Office Locations
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-500">
              Manage your company office locations. Use the search to find
              accurate addresses. At least one location must be marked as Head
              Quarters.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[400px] space-y-4 overflow-y-auto pr-2">
            {editingLocations.map((location, index) => (
              <div
                key={index}
                className="group/card relative flex items-start gap-4 rounded-xl border border-white/50 bg-white/80 p-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-2xl">
                  {location.emoji}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="relative">
                    <Input
                      value={location.country}
                      onChange={(e) => {
                        handleEditLocation(index, e.target.value);
                        debouncedEditFetch(e.target.value, index);
                        setShowEditingSuggestions((prev) => ({
                          ...prev,
                          [index]: true,
                        }));
                      }}
                      onFocus={() =>
                        setShowEditingSuggestions((prev) => ({
                          ...prev,
                          [index]: true,
                        }))
                      }
                      className="w-full pr-8"
                      placeholder="Search for a location..."
                    />
                    {editingLoading[index] && (
                      <div className="absolute top-1/2 right-2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                      </div>
                    )}

                    {/* Location Suggestions Dropdown for Edit */}
                    {showEditingSuggestions[index] &&
                      editingSuggestions[index]?.length > 0 && (
                        <div
                          className="absolute z-50 mt-1 w-full overflow-auto rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {editingSuggestions[index].map((suggestion) => {
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
                                  handleEditLocation(
                                    index,
                                    suggestion.display_name,
                                  );
                                  setEditingSuggestions((prev) => ({
                                    ...prev,
                                    [index]: [],
                                  }));
                                  setShowEditingSuggestions((prev) => ({
                                    ...prev,
                                    [index]: false,
                                  }));
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={location.isHQ}
                          onChange={() => handleToggleHQ(index)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          id={`hq-${index}`}
                        />
                        <label
                          htmlFor={`hq-${index}`}
                          className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                          Head Quarters
                        </label>
                      </div>
                      {location.isHQ && (
                        <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 px-2 py-1">
                          <Crown className="h-3 w-3 text-amber-600" />
                          <span className="text-xs font-medium text-amber-700">
                            Primary Location
                          </span>
                        </div>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLocation(index)}
                      className="text-gray-400 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingLocations.length === 0 && (
            <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white/50 p-12 backdrop-blur-sm">
              <div className="text-center">
                <Building2 className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-gray-600">No office locations added yet</p>
                {/* // eslint-disable-next-line react/no-unescaped-entities */}
                <p className="mt-1 text-sm text-gray-500">
                  Click the &quot;Add Location&quot; button to get started
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPopupOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-white transition-all duration-300 hover:from-blue-700 hover:to-indigo-700"
              onClick={handleSaveLocations}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
    </div>
  );
}
