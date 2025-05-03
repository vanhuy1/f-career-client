'use client';

import { Checkbox } from '@/components/ui/checkbox';
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
import type { StepProps } from '@/types/Job';
import { useEffect } from 'react';

export default function Step1({
  skills,
  newSkill,
  salaryRange,
  setSkills,
  setNewSkill,
  setSalaryRange,
  handleAddSkill,
  handleRemoveSkill,
}: StepProps) {
  useEffect(() => {
    setSkills('Graphic Design, Communication, Illustrator'.split(', '));
    setNewSkill('');
    console.log('Skills updated:', newSkill);
  }, [newSkill, setSkills, setNewSkill]);

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
            <Input placeholder="e.g. Software Engineer" />
            <p className="mt-1 text-xs text-gray-500">At least 80 characters</p>
          </div>
        </div>

        {/* Type of Employment */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Type of Employment</h3>
            <p className="mt-1 text-sm text-gray-500">
              You can select multiple types of employment
            </p>
          </div>
          <div className="w-full space-y-2 md:col-span-2 md:w-[70%]">
            <div className="flex items-center space-x-2">
              <Checkbox id="fullTime" />
              <Label htmlFor="fullTime" className="font-normal">
                Full-Time
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="partTime" />
              <Label htmlFor="partTime" className="font-normal">
                Part-Time
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remote" />
              <Label htmlFor="remote" className="font-normal">
                Remote
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="internship" />
              <Label htmlFor="internship" className="font-normal">
                Internship
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="contract" />
              <Label htmlFor="contract" className="font-normal">
                Contract
              </Label>
            </div>
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

        {/* Categories */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">Categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              You can select multiple job categories
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Job Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="customer-service">
                  Customer Service
                </SelectItem>
              </SelectContent>
            </Select>
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
            <Button
              type="button"
              variant="outline"
              onClick={handleAddSkill}
              className="mb-4 flex items-center gap-1"
            >
              <span>+</span> Add Skills
            </Button>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {skill}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveSkill(skill)}
                  />
                </Badge>
              ))}
              {skills.length === 0 && (
                <>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    Graphic Design
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    Communication
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    Illustrator
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
