'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Pencil } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Benefits</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 border-2 p-0"
            onClick={handleAddBenefit}
          >
            <Plus className="h-4 w-4 text-blue-600" />
          </Button>
        </div>
      </div>

      {/* Benefit Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {benefits.map((benefit) => (
          <div
            key={benefit.id}
            className="group relative flex flex-col items-center rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative mb-3 h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={benefit.iconUrl || '/globe.svg'}
                alt={benefit.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">
                {benefit.name}
              </div>
              <div className="text-xs text-gray-500">{benefit.description}</div>
            </div>
            <div className="mt-2 flex justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full bg-gray-100 p-0 hover:bg-gray-200"
                onClick={() => handleEditBenefit(benefit)}
              >
                <Pencil className="h-3 w-3 text-gray-600" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 rounded-full bg-gray-100 p-0 hover:bg-gray-200"
                onClick={() => handleDeleteBenefit(benefit.id)}
              >
                <Trash2 className="h-3 w-3 text-gray-600" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Dialog for Adding/Editing Benefit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Benefit' : 'Add New Benefit'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newBenefit.name}
                onChange={(e) =>
                  setNewBenefit({ ...newBenefit, name: e.target.value })
                }
                placeholder="Enter benefit name"
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
                placeholder="Enter benefit description"
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
                placeholder="Enter icon URL or leave blank"
              />
            </div>
          </div>

          <DialogFooter>
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
            <Button onClick={handleSaveBenefit}>
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
