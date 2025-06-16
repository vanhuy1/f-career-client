'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Heart, Waves, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { StepProps } from '@/types/Job';

const benefitIcons = {
  healthcare: <Heart className="h-6 w-6" />,
  vacation: <Waves className="h-6 w-6" />,
  development: <Video className="h-6 w-6" />,
};

const defaultBenefits = [
  {
    id: 1,
    title: 'Health Insurance',
    description: 'Comprehensive health coverage for you and your family',
    icon: 'healthcare',
  },
  {
    id: 2,
    title: 'Paid Time Off',
    description: '20 days of paid vacation and holidays per year',
    icon: 'vacation',
  },
  {
    id: 3,
    title: 'Learning & Development',
    description: 'Access to courses, workshops, and conferences',
    icon: 'development',
  },
  {
    id: 4,
    title: 'Flexible Work Hours',
    description: 'Work-life balance with flexible scheduling options',
    icon: 'vacation',
  },
  {
    id: 5,
    title: 'Professional Growth',
    description: 'Clear career path and growth opportunities',
    icon: 'development',
  },
];

export default function Step3({ benefits = [], setBenefits }: StepProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newBenefit, setNewBenefit] = useState({
    title: '',
    description: '',
    icon: 'healthcare',
  });

  // Initialize default benefits if none exist
  useEffect(() => {
    if (benefits.length === 0 && setBenefits) {
      setBenefits(defaultBenefits);
    }
  }, [benefits.length, setBenefits]);

  const handleAddBenefit = () => {
    if (setBenefits && newBenefit.title && newBenefit.description) {
      const newBenefitWithId = {
        ...newBenefit,
        id: Date.now(),
      };

      setBenefits([...benefits, newBenefitWithId]);
      setNewBenefit({
        title: '',
        description: '',
        icon: 'healthcare',
      });
      setIsDialogOpen(false);
    }
  };

  const handleRemoveBenefit = (id: number) => {
    if (setBenefits) {
      setBenefits(benefits.filter((benefit) => benefit.id !== id));
    }
  };

  return (
    <div className="px-4 md:px-0">
      <div className="mb-6">
        <h2 className="text-lg font-medium">Basic Information</h2>
        <p className="text-sm text-gray-500">
          List out your top perks and benefits.
        </p>
      </div>

      <div className="border-t border-gray-100 pt-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-10">
          <div className="col-span-1 md:col-span-3">
            <h3 className="font-medium">Perks and Benefits</h3>
            <p className="mt-1 text-sm text-gray-500">
              Encourage more people to apply by sharing the attractive rewards
              and benefits you offer your employees
            </p>
          </div>
          <div className="col-span-1 md:col-span-7">
            <div className="mb-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex w-full items-center gap-1 border-indigo-600 text-indigo-600 md:w-auto"
                  >
                    <Plus className="h-4 w-4" /> Add Benefit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Benefit</DialogTitle>
                    <DialogDescription>
                      Add a new benefit to attract potential candidates.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label htmlFor="icon" className="text-sm font-medium">
                        Benefit Type
                      </label>
                      <Select
                        value={newBenefit.icon}
                        onValueChange={(value) =>
                          setNewBenefit({ ...newBenefit, icon: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select benefit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="vacation">Vacation</SelectItem>
                          <SelectItem value="development">
                            Skill Development
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="title" className="text-sm font-medium">
                        Title
                      </label>
                      <Input
                        id="title"
                        value={newBenefit.title}
                        onChange={(e) =>
                          setNewBenefit({
                            ...newBenefit,
                            title: e.target.value,
                          })
                        }
                        placeholder="e.g. Full Healthcare"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="description"
                        className="text-sm font-medium"
                      >
                        Description
                      </label>
                      <Textarea
                        id="description"
                        value={newBenefit.description}
                        onChange={(e) =>
                          setNewBenefit({
                            ...newBenefit,
                            description: e.target.value,
                          })
                        }
                        placeholder="Describe the benefit"
                        rows={3}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddBenefit}>Add Benefit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {benefits.length > 0 ? (
                benefits.map((benefit) => (
                  <div
                    key={benefit.id}
                    className="relative rounded-md border p-4"
                  >
                    <button
                      onClick={() => handleRemoveBenefit(benefit.id)}
                      className="absolute top-2 right-2 rounded-full p-1 hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md text-indigo-600">
                        {benefit.icon === 'healthcare' &&
                          benefitIcons.healthcare}
                        {benefit.icon === 'vacation' && benefitIcons.vacation}
                        {benefit.icon === 'development' &&
                          benefitIcons.development}
                      </div>
                      <div>
                        <h4 className="font-medium">{benefit.title}</h4>
                        <p className="text-sm text-gray-500">
                          {benefit.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No benefits added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
