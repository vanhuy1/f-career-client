'use client';

import { useState } from 'react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EditButton from './edit-button';
import type { FormField } from '../../../_components/edit-form-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Benefit } from '@/types/Company';
import Image from 'next/image';

interface BenefitsSectionProps {
  benefits?: Benefit[];
}

export default function BenefitsSection({
  benefits = [],
}: BenefitsSectionProps) {
  const [benefitsState, setBenefits] = useState<Benefit[]>(benefits);
  const [open, setOpen] = useState(false);
  const [newBenefit, setNewBenefit] = useState({
    name: '',
    description: '',
    iconUrl: '',
  });

  const benefitsFields: FormField[] = [
    {
      id: 'benefits',
      label: 'Benefits',
      type: 'textarea',
      defaultValue: benefitsState.map((benefit) => benefit.name).join(', '),
      placeholder: 'Enter company benefits (comma separated)',
    },
  ];

  const handleBenefitsSubmit = (data: Record<string, string>) => {
    const benefitNames = data.benefits.split(',').map((item) => item.trim());

    const newBenefits = benefitNames.map((name, index) => {
      const existingBenefit = benefitsState.find((b) => b.name === name);

      if (existingBenefit) {
        return existingBenefit;
      }

      return {
        id: `new-${index}`,
        name,
        description: 'A great benefit for all employees.',
        iconUrl: '/icons/default-benefit.svg',
      };
    });

    setBenefits(newBenefits);
  };

  const handleAddBenefit = () => {
    setOpen(true);
  };

  const handleSaveNewBenefit = () => {
    if (!newBenefit.name.trim() || !newBenefit.description.trim()) {
      alert('Both Name and Description are required');
      return;
    }

    const updatedBenefits = [
      ...benefitsState,
      {
        id: `new-${benefitsState.length}`,
        name: newBenefit.name.trim(),
        description: newBenefit.description.trim(),
        iconUrl: newBenefit.iconUrl || '/icons/default-benefit.svg',
      },
    ];

    setBenefits(updatedBenefits);
    setNewBenefit({ name: '', description: '', iconUrl: '' });
    setOpen(false);
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
          <EditButton
            title="Edit Benefits"
            description="Update your company's benefits information"
            fields={benefitsFields}
            className="h-8 w-8 border-2 p-0"
            onSubmit={handleBenefitsSubmit}
          />
        </div>
      </div>

      {/* Benefit Cards */}
      <div className="grid grid-cols-3 gap-4">
        {benefitsState.map((benefit) => (
          <div key={benefit.id} className="rounded-lg border bg-white p-4">
            <div className="mb-3 flex justify-center">
              <Image
                src={benefit.iconUrl}
                alt={benefit.name}
                width={40}
                height={40}
                className="h-6 w-6"
              />
            </div>
            <h3 className="mb-2 text-center font-medium">{benefit.name}</h3>
            <p className="text-center text-xs text-gray-600">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {/* Dialog for Adding Benefit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Benefit</DialogTitle>
            <DialogDescription>
              Fill in the details below to add a new benefit.
            </DialogDescription>
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
              <Label htmlFor="iconUrl">Icon URL</Label>
              <Input
                id="iconUrl"
                value={newBenefit.iconUrl}
                onChange={(e) =>
                  setNewBenefit({ ...newBenefit, iconUrl: e.target.value })
                }
                placeholder="Enter icon URL (optional)"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewBenefit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
