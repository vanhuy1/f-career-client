'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { EmploymentType, StepProps } from '@/types/Job';
import { useEffect, useState } from 'react';
import { Category } from '@/types/Category';
import { categoryService } from '@/services/api/category/category-api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Step1({
  skills,
  salaryRange,
  setSalaryRange,
  handleAddSkill,
  handleRemoveSkill,
  jobTitle,
  setJobTitle,
  typeOfEmployment,
  setTypeOfEmployment,
  categoryId,
  setCategoryId,
  location,
  setLocation,
  experienceYears,
  setExperienceYears,
  deadline,
  setDeadline,
  availableSkills,
}: StepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await categoryService.findAll();
        setCategories(response);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEmploymentTypeChange = (type: EmploymentType) => {
    setTypeOfEmployment(type);
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-lg font-medium">Basic Information</h2>
        <p className="text-sm text-gray-500">
          This information will be displayed publicly
        </p>
      </div>

      <div className="space-y-8 divide-y divide-gray-100">
        {/* Job Title */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Job Title</h3>
            <p className="mt-1 text-sm text-gray-500">
              Job titles must describe one position
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Input
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
            <p className="mt-1 text-xs text-gray-500">At least 80 characters</p>
          </div>
        </div>

        {/* Type of Employment */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Type of Employment</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select the type of employment
            </p>
          </div>
          <div className="w-full space-y-2 md:col-span-2 md:w-[70%]">
            <RadioGroup
              value={typeOfEmployment || ''}
              onValueChange={handleEmploymentTypeChange}
              className="space-y-3"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="FullTime" id="fullTime" />
                <Label htmlFor="fullTime" className="font-normal">
                  Full-Time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PartTime" id="partTime" />
                <Label htmlFor="partTime" className="font-normal">
                  Part-Time
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Remote" id="remote" />
                <Label htmlFor="remote" className="font-normal">
                  Remote
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Internship" id="internship" />
                <Label htmlFor="internship" className="font-normal">
                  Internship
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Contract" id="contract" />
                <Label htmlFor="contract" className="font-normal">
                  Contract
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Salary</h3>
            <p className="mt-1 text-sm text-gray-500">
              Please specify the estimated salary range for the role. You can
              leave this blank
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <div className="mb-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <div className="flex w-full items-center sm:w-auto">
                <span className="mr-1">$</span>
                <Input
                  value={salaryRange[0]}
                  onChange={(e) =>
                    setSalaryRange([
                      Number.parseInt(e.target.value),
                      salaryRange[1],
                    ])
                  }
                  className="w-full sm:w-24"
                />
              </div>
              <span className="hidden sm:inline">to</span>
              <div className="flex w-full items-center sm:w-auto">
                <span className="mr-1">$</span>
                <Input
                  value={salaryRange[1]}
                  onChange={(e) =>
                    setSalaryRange([
                      salaryRange[0],
                      Number.parseInt(e.target.value),
                    ])
                  }
                  className="w-full sm:w-24"
                />
              </div>
            </div>
            <div className="py-4">
              <Slider
                defaultValue={salaryRange}
                min={0}
                max={50000}
                step={1000}
                value={salaryRange}
                onValueChange={setSalaryRange}
                className="my-2"
              />
            </div>
          </div>
        </div>

        {/* Experience Years */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Experience Years</h3>
            <p className="mt-1 text-sm text-gray-500">
              Required years of experience
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Input
              type="number"
              min={0}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              placeholder="e.g. 5"
            />
          </div>
        </div>

        {/* Deadline */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Application Deadline</h3>
            <p className="mt-1 text-sm text-gray-500">
              When should applications close?
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Input
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              You can select multiple job categories
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    loading ? 'Loading categories...' : 'Select Job Categories'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-category" disabled>
                    {loading ? 'Loading...' : 'No categories found'}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Location</h3>
            <p className="mt-1 text-sm text-gray-500">
              Where is this job located?
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Input
              placeholder="e.g. New York, NY"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* Required Skills */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Required Skills</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add required skills for the job
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Dialog
              open={isSkillDialogOpen}
              onOpenChange={setIsSkillDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="mb-4 flex items-center gap-1"
                >
                  <span>+</span> Add Skills
                </Button>
              </DialogTrigger>
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Select Skills</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableSkills.map((skill) => (
                    <Button
                      key={skill.id}
                      variant={
                        skills.includes(skill.name) ? 'default' : 'outline'
                      }
                      className="justify-start"
                      onClick={(e) => {
                        e.preventDefault();
                        if (skills.includes(skill.name)) {
                          handleRemoveSkill(skill.name);
                        } else {
                          handleAddSkill(skill.id);
                        }
                      }}
                    >
                      {skill.name}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveSkill(skill);
                    }}
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-gray-500">No skills selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
