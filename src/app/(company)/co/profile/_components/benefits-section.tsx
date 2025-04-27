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

export default function BenefitsSection() {
  const [benefits, setBenefits] = useState<Benefit[]>([
    {
      title: 'Full Healthcare',
      description:
        'We believe in thriving communities and that starts with our team being happy and healthy.',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
    {
      title: 'Unlimited Vacation',
      description:
        'We believe you should have a flexible schedule that makes space for family, wellness, and fun.',
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M2 12h20M16 6l-10 12M8 6l10 12" />
        </svg>
      ),
    },
    {
      title: 'Skill Development',
      description:
        "We believe in always learning and leveling up our skills. Whether it's a conference or online course.",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      ),
    },
  ]);

  const [open, setOpen] = useState(false);
  const [newBenefit, setNewBenefit] = useState({ title: '', description: '' });

  const benefitsFields: FormField[] = [
    {
      id: 'benefits',
      label: 'Benefits',
      type: 'textarea',
      defaultValue: benefits.map((benefit) => benefit.title).join(', '),
      placeholder: 'Enter company benefits (comma separated)',
    },
  ];

  const handleBenefitsSubmit = (data: Record<string, string>) => {
    const benefitTitles = data.benefits.split(',').map((item) => item.trim());

    const newBenefits = benefitTitles.map((title) => {
      const existingBenefit = benefits.find((b) => b.title === title);

      if (existingBenefit) {
        return existingBenefit;
      }

      return {
        title,
        description: 'A great benefit for all employees.',
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
      };
    });

    setBenefits(newBenefits);
  };

  const handleAddBenefit = () => {
    setOpen(true);
  };

  const handleSaveNewBenefit = () => {
    if (!newBenefit.title.trim() || !newBenefit.description.trim()) {
      alert('Both Title and Description are required');
      return;
    }

    const updatedBenefits = [
      ...benefits,
      {
        title: newBenefit.title.trim(),
        description: newBenefit.description.trim(),
        icon: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ),
      },
    ];

    setBenefits(updatedBenefits);
    setNewBenefit({ title: '', description: '' });
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
        {benefits.map((benefit, index) => (
          <div key={index} className="rounded-lg border bg-white p-4">
            <div className="mb-3 flex justify-center">
              <div className="text-indigo-600">{benefit.icon}</div>
            </div>
            <h3 className="mb-2 text-center font-medium">{benefit.title}</h3>
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
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newBenefit.title}
                onChange={(e) =>
                  setNewBenefit({ ...newBenefit, title: e.target.value })
                }
                placeholder="Enter benefit title"
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
