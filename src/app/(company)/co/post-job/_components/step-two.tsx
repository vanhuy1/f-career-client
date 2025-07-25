'use client';

import { StepProps } from '@/types/Job';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, X, Heart, Waves, Video } from 'lucide-react';
import { RichTextEditor } from '@/components/common/RichTextEditor';
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

const RequiredIndicator = () => <span className="ml-1 text-red-500">*</span>;

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

export default function Step2({
  jobDescription,
  setJobDescription,
  benefits = [],
  setBenefits,
}: StepProps) {
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

  const handleAddItem = (list: string[], setList: (list: string[]) => void) => {
    setList([...list, '']);
  };

  const handleRemoveItem = (
    index: number,
    list: string[],
    setList: (list: string[]) => void,
  ) => {
    if (list.length > 1) {
      const newList = [...list];
      newList.splice(index, 1);
      setList(newList);
    }
  };

  const handleItemChange = (
    index: number,
    value: string,
    list: string[],
    setList: (list: string[]) => void,
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

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

  // This function is not used but kept for future reference
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const renderInputList = (
    title: string,
    description: string,
    list: string[],
    setList: (list: string[]) => void,
  ) => (
    <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="w-full space-y-4 md:col-span-2">
        {list.map((item, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={item}
              onChange={(e) =>
                handleItemChange(index, e.target.value, list, setList)
              }
              placeholder={`Enter ${title.toLowerCase()} item`}
            />
            {list.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveItem(index, list, setList)}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => handleAddItem(list, setList)}
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add More
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="mb-1 text-lg font-medium">Details</h2>
      <p className="mb-4 text-sm text-gray-500">
        Add the description of the job, responsibilities, who you are, and
        nice-to-haves.
      </p>

      <div className="space-y-8 divide-y divide-gray-100">
        {/* Job Description */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">
              Job Description
              <RequiredIndicator />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Describe the role in detail
            </p>
          </div>
          <div className="w-full md:col-span-2">
            <div
              className={`rounded-md ${!jobDescription ? 'border-2 border-red-500' : ''}`}
            >
              <RichTextEditor
                content={jobDescription}
                onChange={(value) => {
                  // Kiểm tra nếu content chỉ chứa khoảng trắng hoặc HTML tags rỗng
                  const cleanContent = value.replace(/<[^>]*>/g, '').trim();
                  if (!cleanContent) {
                    // Nếu rỗng, vẫn set giá trị nhưng sẽ hiển thị error
                    setJobDescription(value);
                  } else {
                    setJobDescription(value);
                  }
                }}
                placeholder="Describe the role in detail"
              />
            </div>
            {!jobDescription && (
              <p className="mt-2 text-sm text-red-500">
                Please provide a detailed job description
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>Tips for a great job description:</p>
              <ul className="ml-4 list-disc">
                <li>Start with a brief, engaging overview of the role</li>
                <li>List key responsibilities and day-to-day activities</li>
                <li>Include required qualifications and skills</li>
                <li>Mention growth opportunities and team culture</li>
                <li>Keep it clear, concise, and well-structured</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="py-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-3">
            <div>
              <h3 className="font-medium">Perks and Benefits</h3>
              <p className="mt-1 text-sm text-gray-500">
                Encourage more people to apply by sharing the attractive rewards
                and benefits you offer
              </p>
            </div>
            <div className="col-span-2">
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
                            <SelectItem value="healthcare">
                              Healthcare
                            </SelectItem>
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
    </div>
  );
}
