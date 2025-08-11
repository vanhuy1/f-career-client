'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Pencil, Gift, ImageIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Benefit, Company } from '@/types/Company';
import Image from 'next/image';
import { benefitService } from '@/services/api/benefits/benefit-api';
import { toast } from 'react-toastify';

interface BenefitsSectionProps {
  company: Company;
}

export default function BenefitsSection({ company }: BenefitsSectionProps) {
  const [benefits, setBenefits] = useState<Benefit[]>(company.benefits || []);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentBenefitId, setCurrentBenefitId] = useState<string | null>(null);
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    description: '',
    iconUrl: '',
  });

  useEffect(() => {
    if (company.benefits) {
      setBenefits(company.benefits);
    }
  }, [company.benefits]);

  const handleAddBenefit = () => {
    setIsEditing(false);
    setNewBenefit({ name: '', description: '', iconUrl: '' });
    setCurrentBenefitId(null);
    setOpen(true);
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setIsEditing(true);
    setNewBenefit({
      name: benefit.name,
      description: benefit.description,
      iconUrl: benefit.iconUrl,
    });
    setCurrentBenefitId(benefit.id.toString());
    setOpen(true);
  };

  const handleSaveBenefit = async () => {
    if (!newBenefit.name.trim() || !newBenefit.description.trim()) {
      toast.error('Both Name and Description are required');
      return;
    }

    const newBenefitData: Partial<Benefit> = {
      name: newBenefit.name.trim(),
      description: newBenefit.description.trim(),
      iconUrl: newBenefit.iconUrl || '/globe.svg',
    };

    if (isEditing && currentBenefitId) {
      // Optimistically update local state
      setBenefits((prev) =>
        prev.map((benefit) =>
          benefit.id === currentBenefitId
            ? { ...benefit, ...newBenefitData }
            : benefit,
        ),
      );

      setNewBenefit({ name: '', description: '', iconUrl: '' });
      setOpen(false);
      setCurrentBenefitId(null);

      try {
        const updatedBenefit = await benefitService.updateBenefit(
          company.id,
          currentBenefitId,
          newBenefitData,
        );

        setBenefits((prev) =>
          prev.map((benefit) =>
            benefit.id === currentBenefitId
              ? { ...updatedBenefit, id: updatedBenefit.id.toString() }
              : benefit,
          ),
        );

        toast.success('Benefit updated successfully');
      } catch (error) {
        console.error('Failed to update benefit:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to update benefit. Please try again.',
        );

        // Revert local state on error
        setBenefits((prev) => [
          ...prev,
          ...(company.benefits?.filter((b) => b.id === currentBenefitId) || []),
        ]);
      }
    } else {
      // Add new benefit
      const tempBenefit: Benefit = {
        id: `temp-${Date.now()}`,
        ...newBenefitData,
      } as Benefit;

      setBenefits((prev) => [...prev, tempBenefit]);
      setNewBenefit({ name: '', description: '', iconUrl: '' });
      setOpen(false);

      try {
        const createdBenefit = await benefitService.createBenefit(
          company.id,
          newBenefitData,
        );

        setBenefits((prev) =>
          prev.map((benefit) =>
            benefit.id === tempBenefit.id
              ? { ...createdBenefit, id: createdBenefit.id.toString() }
              : benefit,
          ),
        );

        toast.success('Benefit added successfully');
      } catch (error) {
        console.error('Failed to add new benefit:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to add new benefit. Please try again.',
        );

        setBenefits((prev) =>
          prev.filter((benefit) => benefit.id !== tempBenefit.id),
        );
      }
    }
  };

  const handleDeleteBenefit = async (benefitId: string) => {
    const deletedBenefit = benefits.find((b) => b.id === benefitId);
    setBenefits((prev) => prev.filter((benefit) => benefit.id !== benefitId));

    try {
      await benefitService.deleteBenefit(company.id, Number(benefitId));
      toast.success('Benefit deleted successfully');
    } catch (error) {
      console.error('Failed to delete benefit:', error);
      toast.error('Failed to delete benefit. Please try again.');

      if (deletedBenefit) {
        setBenefits((prev) => [...prev, deletedBenefit]);
      }
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8 shadow-xl transition-all duration-500 hover:shadow-2xl">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 opacity-60 transition-transform duration-700 group-hover:scale-110"></div>

      {/* Header */}
      <div className="relative mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 shadow-lg">
            <Gift className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Company Benefits
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Showcase what makes your company special
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1.5 text-sm font-medium text-purple-700 hover:bg-purple-50"
          onClick={handleAddBenefit}
        >
          <Plus className="h-4 w-4" />
          Add Benefit
        </Button>
      </div>

      {/* Benefit Cards */}
      {benefits.length > 0 ? (
        <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.id}
              className="group/card relative overflow-hidden rounded-xl border border-white/50 bg-white/70 p-6 shadow-md backdrop-blur-sm transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
            >
              {/* Card decoration */}
              <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-purple-100/50 to-pink-100/50 opacity-0 transition-all duration-700 group-hover/card:opacity-100"></div>

              <div className="relative flex flex-col items-center">
                <div className="relative mb-4 h-16 w-16 overflow-hidden rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 p-0.5 shadow-lg transition-transform duration-300 group-hover/card:scale-110">
                  <div className="relative h-full w-full overflow-hidden rounded-[0.875rem] bg-white">
                    <Image
                      src={benefit.iconUrl || '/globe.svg'}
                      alt={benefit.name}
                      fill
                      className="object-cover p-2"
                    />
                  </div>
                </div>

                <div className="text-center">
                  <div className="mb-1 text-base font-semibold text-gray-900">
                    {benefit.name}
                  </div>
                  <div className="text-sm leading-relaxed text-gray-600">
                    {benefit.description}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute top-0 -right-1 flex flex-col gap-1 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-purple-50 p-0 hover:bg-purple-100"
                    onClick={() => handleEditBenefit(benefit)}
                  >
                    <Pencil className="h-4 w-4 text-purple-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 rounded-full bg-red-50 p-0 hover:bg-red-100"
                    onClick={() => handleDeleteBenefit(benefit.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center rounded-2xl border border-gray-200 bg-white/50 p-12 backdrop-blur-sm">
          <div className="text-center">
            <ImageIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <p className="text-gray-600">No benefits added yet</p>
            {/* // eslint-disable-next-line react/no-unescaped-entities */}
            <p className="mt-1 text-sm text-gray-500">
              Click the &quot;Add Benefit&quot; button to showcase your company
              benefits
            </p>
          </div>
        </div>
      )}

      {/* Dialog for Adding/Editing Benefit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Benefit' : 'Add New Benefit'}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update the details of this benefit'
                : 'Add a new benefit to showcase to potential candidates'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Benefit Name</Label>
              <Input
                id="name"
                value={newBenefit.name}
                onChange={(e) =>
                  setNewBenefit({ ...newBenefit, name: e.target.value })
                }
                placeholder="e.g., Health Insurance, Remote Work, etc."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newBenefit.description}
                onChange={(e) =>
                  setNewBenefit({ ...newBenefit, description: e.target.value })
                }
                placeholder="Describe this benefit in detail..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="iconUrl">Icon URL (optional)</Label>
              <Input
                id="iconUrl"
                value={newBenefit.iconUrl}
                onChange={(e) =>
                  setNewBenefit({ ...newBenefit, iconUrl: e.target.value })
                }
                placeholder="https://example.com/icon.svg"
                className="mt-1.5"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Leave blank to use the default icon
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setOpen(false);
                setCurrentBenefitId(null);
                setIsEditing(false);
                setNewBenefit({ name: '', description: '', iconUrl: '' });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBenefit}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white transition-all duration-300 hover:from-purple-700 hover:to-pink-700"
            >
              {isEditing ? 'Update Benefit' : 'Add Benefit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decorative bottom accent */}
      <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500"></div>
    </div>
  );
}
