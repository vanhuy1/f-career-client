'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
            onClick={() => {
              setEditingLocations(locations);
              setIsEditPopupOpen(true);
            }}
          >
            <Edit className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Office Locations List */}
      <div className="space-y-3">
        {locations.length > 0 ? (
          locations.map((location, index) => (
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
          ))
        ) : (
          <div className="text-sm text-gray-500">
            Không có địa chỉ văn phòng nào được thêm vào.
          </div>
        )}
      </div>

      {/* Add Location Dialog */}
      <Dialog open={isAddPopupOpen} onOpenChange={setIsAddPopupOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Add New Location
            </DialogTitle>
            <DialogDescription className="mt-2 text-gray-500">
              Add a new office location for your company.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="grid gap-4">
              <div>
                <Label
                  htmlFor="location"
                  className="text-sm font-medium text-gray-700"
                >
                  Location
                  <span className="ml-1 text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Enter office location"
                  className="mt-1.5"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isHQ}
                  onChange={(e) => setIsHQ(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
              onClick={() => setIsAddPopupOpen(false)}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-indigo-600 px-6 text-white hover:bg-indigo-700"
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
              Manage your company office locations. At least one location must
              be marked as Head Quarters.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[400px] space-y-4 overflow-y-auto pr-2">
            {editingLocations.map((location, index) => (
              <div
                key={index}
                className="group relative flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-gray-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-2xl">
                  {location.emoji}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="relative">
                    <Input
                      value={location.country}
                      onChange={(e) =>
                        handleEditLocation(index, e.target.value)
                      }
                      className="w-full border-gray-200 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Enter office location"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={location.isHQ}
                          onChange={() => handleToggleHQ(index)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
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
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                          Primary Location
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLocation(index)}
                      className="text-gray-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {editingLocations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="rounded-full bg-gray-100 p-3">
                <Plus className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No locations
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Add your first office location to get started
              </p>
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
              className="bg-indigo-600 px-6 text-white hover:bg-indigo-700"
              onClick={handleSaveLocations}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
