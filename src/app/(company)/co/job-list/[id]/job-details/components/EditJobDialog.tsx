'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, AlertTriangle } from 'lucide-react';

import { jobService } from '@/services/api/jobs/job-api';
import { categoryService } from '@/services/api/category/category-api';
import { skillService } from '@/services/api/skills/skill-api';
import { companyService } from '@/services/api/company/company-api';
import { Job, EmploymentType } from '@/types/Job';
import { Category } from '@/types/Job';
import { Skill } from '@/services/api/skills/skill-api';
import { employmentType } from '@/enums/employmentType';

// Helper function to convert between frontend and backend employment type formats
const convertEmploymentTypeToBackend = (frontendType: string): string => {
  return frontendType; // No conversion needed, use the enum key directly
};

const convertEmploymentTypeToFrontend = (backendType: string): string => {
  return backendType; // No conversion needed, use the enum key directly
};

// Form validation schema
const editJobSchema = z
  .object({
    title: z.string().min(1, 'Job title is required').trim(),
    location: z.string().min(1, 'Location is required').trim(),
    salaryMin: z.number().min(0, 'Minimum salary must be positive'),
    salaryMax: z.number().min(0, 'Maximum salary must be positive'),
    experienceYears: z.number().min(0, 'Experience years must be positive'),
    deadline: z.string().min(1, 'Deadline is required'),
    typeOfEmployment: z.enum([
      'FULL_TIME',
      'PART_TIME',
      'CONTRACT',
      'INTERN',
      'FREELANCE',
      'TEMPORARY',
      'VOLUNTEER',
      'APPRENTICESHIP',
      'CO_OP',
      'SEASONAL',
      'REMOTE',
      'HYBRID',
    ] as const),
    categoryId: z.string().min(1, 'Category is required'),
    status: z.enum(['OPEN', 'CLOSED'] as const),
    benefit: z.array(z.string()).min(1, 'At least one benefit is required'),
  })
  .refine((data) => data.salaryMin <= data.salaryMax, {
    message: 'Minimum salary cannot be greater than maximum salary',
    path: ['salaryMax'],
  })
  .refine(
    (data) => {
      if (!data.deadline) return true;
      const selectedDate = new Date(data.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    },
    {
      message: 'Application deadline must be in the future',
      path: ['deadline'],
    },
  );

type EditJobFormData = z.infer<typeof editJobSchema>;

interface EditJobDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditJobDialog({
  job,
  isOpen,
  onClose,
  onSuccess,
}: EditJobDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    job.skills?.map((skill) => skill.id) || [],
  );
  const [newBenefit, setNewBenefit] = useState('');
  const [companyLocations, setCompanyLocations] = useState<string[]>([]);
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);

  // Check if job is within 24 hours of creation
  const isWithin24Hours = () => {
    if (!job.createdAt) return true; // If no creation date, allow editing
    const createdAt = new Date(job.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EditJobFormData>({
    resolver: zodResolver(editJobSchema),
    defaultValues: {
      title: job.title,
      location: job.location,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      experienceYears: job.experienceYears,
      deadline: job.deadline
        ? (() => {
            // Handle timezone issue by creating date in local timezone
            const date = new Date(job.deadline);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
          })()
        : '',
      typeOfEmployment: convertEmploymentTypeToFrontend(
        job.typeOfEmployment,
      ) as 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERN' | 'FREELANCE' | 'TEMPORARY' | 'VOLUNTEER' | 'APPRENTICESHIP' | 'CO_OP' | 'SEASONAL' | 'REMOTE' | 'HYBRID',
      categoryId: job.category?.id || '',
      status: job.status as 'OPEN' | 'CLOSED',
      benefit: job.benefit || [],
    },
  });

  // Load categories, skills, and company locations on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsCompanyLoading(true);
        const [categoriesData, skillsData, companyData] = await Promise.all([
          categoryService.findAll(),
          skillService.findAll(),
          companyService.findOne(job.company.id),
        ]);
        setCategories(categoriesData);
        setAvailableSkills(skillsData);
        setCompanyLocations(companyData.address || []);
      } catch (error) {
        console.error('Failed to load form data:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsCompanyLoading(false);
      }
    };
    loadData();
  }, [job.company.id]);

  const onSubmit = async (data: EditJobFormData) => {
    // Validation logic similar to post-job
    const errors: string[] = [];

    // Required field validations
    if (!data.title?.trim()) errors.push('Job title is required');
    if (!data.location?.trim()) errors.push('Location is required');
    if (!data.deadline) errors.push('Application deadline is required');
    if (!data.categoryId) errors.push('Job category is required');
    if (data.benefit.length === 0)
      errors.push('At least one benefit is required');
    if (selectedSkills.length === 0)
      errors.push('At least one skill is required');

    // Salary validation
    if (data.salaryMin > data.salaryMax) {
      errors.push('Minimum salary cannot be greater than maximum salary');
    }

    // Experience years validation
    if (data.experienceYears < 0) {
      errors.push('Experience years cannot be negative');
    }

    // Deadline validation - must be in the future
    if (data.deadline) {
      const selectedDate = new Date(data.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        errors.push('Application deadline must be in the future');
      }
    }

    if (errors.length > 0) {
      // Display all errors
      toast.error(
        <div>
          <p className="mb-2 font-medium">Please fix the following errors:</p>
          <ul className="list-disc pl-4">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>,
      );
      return;
    }

    setIsLoading(true);
    try {
      // Handle deadline format for BE
      const formattedDeadline = data.deadline
        ? (() => {
            const date = new Date(data.deadline);
            // Ensure the date is set to midnight in local timezone
            date.setHours(0, 0, 0, 0);
            return date.toISOString();
          })()
        : undefined;

      const updateData = {
        ...data,
        deadline: formattedDeadline,
        skillIds: selectedSkills,
        companyId: job.company.id,
        status: data.status,
        isVip: job.isVip,
        typeOfEmployment: convertEmploymentTypeToBackend(
          data.typeOfEmployment,
        ) as EmploymentType,
      };

      console.log('Original job deadline:', job.deadline);
      console.log('Form deadline value:', data.deadline);
      console.log('Formatted deadline for BE:', formattedDeadline);
      console.log('Updating job with data:', updateData);
      await jobService.update(job.id!, updateData);

      toast.success('Job updated successfully');
      onSuccess();
      onClose();
      reset();
    } catch (error: unknown) {
      console.error('Failed to update job:', error);

      // Extract error message from BE response
      let errorMessage = 'Failed to update job. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as {
          response?: { data?: { message?: string } };
        };
        if (responseError.response?.data?.message) {
          // BE error message
          errorMessage = responseError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        // General error message
        const messageError = error as { message: string };
        errorMessage = messageError.message;
      }

      // Show specific error message to user
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      const currentBenefits = watch('benefit');
      setValue('benefit', [...currentBenefits, newBenefit.trim()]);
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index: number) => {
    const currentBenefits = watch('benefit');
    setValue(
      'benefit',
      currentBenefits.filter((_, i) => i !== index),
    );
  };

  const handleSkillToggle = (skillId: string) => {
    setSelectedSkills((prev) => {
      const newSkills = prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId];
      console.log('Skills changed to:', newSkills);
      return newSkills;
    });
  };

  const handleClose = () => {
    reset();
    setSelectedSkills(job.skills?.map((skill) => skill.id) || []);
    setNewBenefit('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] !w-[90vw] !max-w-[1200px] overflow-y-auto sm:!max-w-[1200px]">
        <DialogHeader>
          <DialogTitle>Edit Job Information</DialogTitle>
          <div
            className={`mt-2 rounded-md border p-3 ${
              isWithin24Hours()
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start">
              <AlertTriangle
                className={`mt-0.5 mr-2 h-4 w-4 flex-shrink-0 ${
                  isWithin24Hours() ? 'text-yellow-600' : 'text-red-600'
                }`}
              />
              <div
                className={`text-sm ${
                  isWithin24Hours() ? 'text-yellow-800' : 'text-red-800'
                }`}
              >
                <p className="font-medium">
                  {isWithin24Hours() ? 'Important:' : 'Editing Disabled:'}
                </p>
                <p>
                  {isWithin24Hours()
                    ? 'Jobs can only be modified within 24 hours of creation. After 24 hours, job details become read-only.'
                    : 'This job was created more than 24 hours ago and can no longer be modified.'}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter job title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <input type="hidden" {...register('location')} />
              <Select
                value={watch('location')}
                onValueChange={(value) => setValue('location', value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      isCompanyLoading
                        ? 'Loading locations...'
                        : 'Select office location'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {isCompanyLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading office locations...
                    </SelectItem>
                  ) : companyLocations.length > 0 ? (
                    companyLocations.map((addr, index) => (
                      <SelectItem key={index} value={addr}>
                        {addr} {index === 0 && '(Head Quarters)'}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-locations" disabled>
                      No office locations found. Please add locations in company
                      profile.
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Category and Employment Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <input type="hidden" {...register('categoryId')} />
              <Select
                value={watch('categoryId')}
                onValueChange={(value) => {
                  setValue('categoryId', value);
                  console.log('Category changed to:', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="typeOfEmployment">Employment Type *</Label>
              <Select
                value={watch('typeOfEmployment')}
                onValueChange={(value) =>
                  setValue(
                    'typeOfEmployment',
                    value as
                      | 'FULL_TIME'
                      | 'PART_TIME'
                      | 'CONTRACT'
                      | 'INTERN'
                      | 'FREELANCE'
                      | 'TEMPORARY'
                      | 'VOLUNTEER'
                      | 'APPRENTICESHIP'
                      | 'CO_OP'
                      | 'SEASONAL'
                      | 'REMOTE'
                      | 'HYBRID',
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(employmentType).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.typeOfEmployment && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.typeOfEmployment.message}
                </p>
              )}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Job Status *</Label>
            <input type="hidden" {...register('status')} />
            <Select
              value={watch('status')}
              onValueChange={(value) =>
                setValue('status', value as 'OPEN' | 'CLOSED')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select job status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Salary Range */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="salaryMin">Minimum Salary *</Label>
              <Input
                id="salaryMin"
                type="number"
                min={0}
                {...register('salaryMin', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.salaryMin && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.salaryMin.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salaryMax">Maximum Salary *</Label>
              <Input
                id="salaryMax"
                type="number"
                min={0}
                {...register('salaryMax', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.salaryMax && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.salaryMax.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="experienceYears">Experience (Years) *</Label>
              <Input
                id="experienceYears"
                type="number"
                min={0}
                {...register('experienceYears', { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.experienceYears && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>
          </div>

          {/* Deadline */}
          <div>
            <Label htmlFor="deadline">Application Deadline *</Label>
            <Input
              id="deadline"
              type="date"
              {...register('deadline')}
              min={(() => {
                // Set minimum date to today
                const minDate = new Date();
                return minDate.toISOString().split('T')[0];
              })()}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // If selected date is in the past
                if (selectedDate < today) {
                  toast.error('Please select a future date');
                  return;
                }
              }}
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-500">
                {errors.deadline.message}
              </p>
            )}
          </div>

          {/* Skills */}
          <div>
            <Label>Required Skills</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableSkills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant={
                    selectedSkills.includes(skill.id) ? 'default' : 'outline'
                  }
                  className={`cursor-pointer ${
                    selectedSkills.includes(skill.id)
                      ? 'bg-blue-500 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                  onClick={() => handleSkillToggle(skill.id)}
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label>Benefits & Perks *</Label>
            <div className="mt-2 space-y-2">
              {watch('benefit').map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm">{benefit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBenefit(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddBenefit())
                  }
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBenefit}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {errors.benefit && (
              <p className="mt-1 text-sm text-red-500">
                {errors.benefit.message}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isWithin24Hours()}
              title={
                !isWithin24Hours()
                  ? 'Job can only be modified within 24 hours of creation'
                  : ''
              }
            >
              {isLoading ? 'Updating...' : 'Update Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
