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
                Location
              </label>
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter office location"
                className="mt-1"
              />
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

      {/* Edit Locations Dialog */}
      <Dialog open={isEditPopupOpen} onOpenChange={setIsEditPopupOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Office Locations</DialogTitle>
            <DialogDescription>
              Manage your companys office locations.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] space-y-4 overflow-y-auto">
            {editingLocations.map((location, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-lg border p-3"
              >
                <div className="text-2xl">{location.emoji}</div>
                <div className="flex-1">
                  <Input
                    value={location.country}
                    onChange={(e) => handleEditLocation(index, e.target.value)}
                    className="mb-2"
                  />
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={location.isHQ}
                        onChange={() => handleToggleHQ(index)}
                        className="h-4 w-4 text-indigo-600"
                      />
                      <label className="text-sm text-gray-600">
                        Head Quarters
                      </label>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteLocation(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditPopupOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-indigo-600 text-white hover:bg-indigo-700"
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
