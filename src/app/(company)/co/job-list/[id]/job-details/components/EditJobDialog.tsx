'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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

  // Required skills input like post-job
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [newSkillInput, setNewSkillInput] = useState('');
  const skillInputRef = useRef<HTMLInputElement>(null);
  const skillDropdownRef = useRef<HTMLDivElement>(null);
  const skillTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Number formatting helpers for salary inputs (e.g., 20.000)
  const formatWithDots = (value: number): string => {
    if (!Number.isFinite(value)) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const unformatToNumber = (text: string): number => {
    const digits = text.replace(/\D/g, '');
    return digits ? parseInt(digits, 10) : 0;
  };

  const [salaryMinText, setSalaryMinText] = useState<string>(
    formatWithDots(job.salaryMin),
  );
  const [salaryMaxText, setSalaryMaxText] = useState<string>(
    formatWithDots(job.salaryMax),
  );

  // Fetch skills suggestions from StackOverflow (same as post-job)
  const fetchSkillsSuggestions = async (query: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&inname=${encodeURIComponent(
          query,
        )}&site=stackoverflow&pagesize=20`,
      );
      const data = await response.json();
      const skills =
        data.items?.map((item: { name: string }) => {
          return item.name
            .split(/[-_]/)
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }) || [];
      return skills;
    } catch (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
  };

  const getCombinedSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();

    // DB suggestions (exclude already selected)
    const dbSuggestions = availableSkills
      .filter(
        (skill) =>
          skill.name.toLowerCase().includes(lowerQuery) &&
          !selectedSkills.some((id) => id === skill.id),
      )
      .map((skill) => ({
        name: skill.name,
        id: skill.id,
        source: 'database' as const,
      }));

    // API suggestions (exclude skills already in DB by exact name)
    const apiSuggestions = skillSuggestions
      .filter(
        (s) =>
          !availableSkills.some(
            (sk) => sk.name.toLowerCase() === s.toLowerCase(),
          ),
      )
      .map((name) => ({
        name,
        id: null as string | null,
        source: 'api' as const,
      }));

    return [...dbSuggestions, ...apiSuggestions];
  };

  const fetchSkillsDebounced = useCallback((query: string) => {
    if (skillTimeoutRef.current) clearTimeout(skillTimeoutRef.current);
    skillTimeoutRef.current = setTimeout(async () => {
      if (query.length < 2) {
        setSkillSuggestions([]);
        return;
      }
      setIsLoadingSkills(true);
      try {
        const suggestions = await fetchSkillsSuggestions(query);
        setSkillSuggestions(suggestions);
      } catch (e) {
        setSkillSuggestions([]);
        console.error('Error fetching skills suggestions:', e);
      } finally {
        setIsLoadingSkills(false);
      }
    }, 300);
  }, []);

  useEffect(() => {
    return () => {
      if (skillTimeoutRef.current) clearTimeout(skillTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (newSkillInput) {
      fetchSkillsDebounced(newSkillInput);
      setShowSkillSuggestions(true);
    } else {
      setSkillSuggestions([]);
      setShowSkillSuggestions(false);
    }
    setSelectedSuggestionIndex(-1);
  }, [newSkillInput, fetchSkillsDebounced]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        skillDropdownRef.current &&
        !skillDropdownRef.current.contains(event.target as Node) &&
        !skillInputRef.current?.contains(event.target as Node)
      ) {
        setShowSkillSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSkillSelect = async (selectedSkill: string, skillId?: string) => {
    try {
      if (skillId) {
        // chọn skill có sẵn theo id
        if (!selectedSkills.includes(skillId)) {
          setSelectedSkills((prev) => [...prev, skillId]);
        }
      } else {
        // tạo mới skill và add ngay vào cả availableSkills lẫn selectedSkills
        const created = await skillService.create({ name: selectedSkill });
        setAvailableSkills((prev) => [
          { id: created.id, name: created.name } as Skill,
          ...prev,
        ]);
        setSelectedSkills((prev) => [...prev, created.id]);
      }

      setNewSkillInput('');
      setShowSkillSuggestions(false);
      setSelectedSuggestionIndex(-1);
      skillInputRef.current?.focus();
      toast.success(`Skill "${selectedSkill}" added successfully!`);
    } catch (err) {
      console.error('Error creating/selecting skill:', err);
      toast.error('Failed to add skill. Please try again.');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const combined = getCombinedSuggestions(newSkillInput);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < combined.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && combined[selectedSuggestionIndex]) {
        const suggestion = combined[selectedSuggestionIndex];
        handleSkillSelect(suggestion.name, suggestion.id || undefined);
      } else if (newSkillInput.trim()) {
        handleSkillSelect(newSkillInput.trim());
      }
    } else if (e.key === 'Escape') {
      setShowSkillSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

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
      ) as
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter job title"
                className="mt-2"
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
                <SelectTrigger className="mt-2 w-full">
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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
                <SelectTrigger className="mt-2 w-full">
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
                <SelectTrigger className="mt-2 w-full">
                  <SelectValue placeholder="Select employment type">
                    {employmentType[
                      watch('typeOfEmployment') as keyof typeof employmentType
                    ] || 'Select employment type'}
                  </SelectValue>
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

          {/* Status moved to separate dialog */}

          {/* Salary Range */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div>
              <Label htmlFor="salaryMin">Minimum Salary *</Label>
              <div className="mt-2 flex items-center">
                <span className="mr-1">$</span>
                <Input
                  id="salaryMin"
                  type="text"
                  value={salaryMinText}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = unformatToNumber(raw);
                    setSalaryMinText(formatWithDots(num));
                    setValue('salaryMin', num);
                  }}
                  placeholder="5000"
                  className="flex-1"
                />
                <input
                  type="hidden"
                  {...register('salaryMin', { valueAsNumber: true })}
                />
              </div>
              {errors.salaryMin && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.salaryMin.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="salaryMax">Maximum Salary *</Label>
              <div className="mt-2 flex items-center">
                <span className="mr-1">$</span>
                <Input
                  id="salaryMax"
                  type="text"
                  value={salaryMaxText}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const num = unformatToNumber(raw);
                    setSalaryMaxText(formatWithDots(num));
                    setValue('salaryMax', num);
                  }}
                  placeholder="22000"
                  className="flex-1"
                />
                <input
                  type="hidden"
                  {...register('salaryMax', { valueAsNumber: true })}
                />
              </div>
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
                step="1"
                {...register('experienceYears', { valueAsNumber: true })}
                placeholder="0"
                className="mt-2"
              />
              {errors.experienceYears && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.experienceYears.message}
                </p>
              )}
            </div>
          </div>

          {/* Deadline moved to separate dialog */}

          {/* Skills */}
          <div>
            <Label>Required Skills *</Label>
            <p className="mt-1 text-sm text-gray-500">
              Select the skills required for this position
            </p>
            {/* input with suggestions */}
            <div className="relative mt-3">
              <Input
                ref={skillInputRef}
                placeholder="Search and add skills..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => newSkillInput && setShowSkillSuggestions(true)}
                autoComplete="off"
              />
              {isLoadingSkills && (
                <span className="pointer-events-none absolute top-3 right-3 text-xs text-gray-400">
                  Loading...
                </span>
              )}
              {showSkillSuggestions && newSkillInput && (
                <div
                  ref={skillDropdownRef}
                  className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
                >
                  {getCombinedSuggestions(newSkillInput).map(
                    (suggestion, index) => (
                      <button
                        type="button"
                        key={`${suggestion.source}-${suggestion.id || suggestion.name}`}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          index === selectedSuggestionIndex
                            ? 'bg-gray-100'
                            : 'hover:bg-gray-50'
                        }`}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        onMouseLeave={() => setSelectedSuggestionIndex(-1)}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleSkillSelect(
                            suggestion.name,
                            suggestion.id || undefined,
                          );
                        }}
                      >
                        {suggestion.name}
                        <span className="ml-2 text-xs text-gray-400">
                          ({suggestion.source})
                        </span>
                      </button>
                    ),
                  )}
                  {getCombinedSuggestions(newSkillInput).length === 0 && (
                    <div className="px-3 py-2 text-sm text-gray-500">
                      Press Enter to add &quot;{newSkillInput}&quot;
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* selected skill chips (only show selected) */}
            <div className="mt-3 flex flex-wrap gap-2">
              {availableSkills
                .filter((s) => selectedSkills.includes(s.id))
                .map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="default"
                    className="cursor-pointer bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => handleSkillToggle(skill.id)}
                  >
                    {skill.name}
                  </Badge>
                ))}
            </div>
            {selectedSkills.length === 0 && (
              <p className="mt-2 text-sm text-red-500">
                Please select at least one skill
              </p>
            )}
          </div>

          {/* Benefits */}
          <div>
            <Label>Benefits & Perks *</Label>
            <p className="mt-1 text-sm text-gray-500">
              Add benefits and perks offered for this position
            </p>
            <div className="mt-3 space-y-3">
              {watch('benefit').map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border border-gray-200 bg-gray-50 p-3"
                >
                  <span className="flex-1 text-sm">{benefit}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBenefit(index)}
                    className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
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
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddBenefit}
                  disabled={!newBenefit.trim()}
                  className="px-4"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
            {errors.benefit && (
              <p className="mt-1 text-sm text-red-500">
                {errors.benefit.message}
              </p>
            )}
          </div>

          <DialogFooter className="mt-8 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
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
              className="flex-1"
            >
              {isLoading ? 'Updating...' : 'Update Job'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
