'use client';

import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { X, Calendar, Loader2 } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { EmploymentType, StepProps } from '@/types/Job';
import { useEffect, useState, useRef, useCallback } from 'react';
import {
  useCategories,
  useCategoryLoadingState,
  fetchCategories,
} from '@/services/state/categorySlice';
import { LoadingState } from '@/store/store.model';
import { useAppDispatch } from '@/store/hooks';
import { useUser } from '@/services/state/userSlice';
import {
  useCompanyDetailById,
  useCompanyDetailLoadingState,
  setCompanyDetailStart,
  setCompanyDetailSuccess,
  setCompanyDetailFailure,
} from '@/services/state/companySlice';
import { companyService } from '@/services/api/company/company-api';
import { skillService } from '@/services/api/skills/skill-api';

import { employmentType } from '@/enums/employmentType';
import { toast } from 'react-toastify';

const RequiredIndicator = () => <span className="ml-1 text-red-500">*</span>;

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
  refreshSkills,
  setSkills,
  selectedSkillIds,
  setSelectedSkillIds,
}: StepProps) {
  const categories = useCategories();
  const categoryLoadingState = useCategoryLoadingState();
  const loading = categoryLoadingState === LoadingState.loading;
  const [salaryType, setSalaryType] = useState<'range' | 'min' | 'max'>(
    'range',
  );
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [newSkillInput, setNewSkillInput] = useState('');

  const skillInputRef = useRef<HTMLInputElement>(null);
  const skillDropdownRef = useRef<HTMLDivElement>(null);
  const skillTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // API service for skills suggestions - using Stack Overflow API
  const fetchSkillsSuggestions = async (query: string): Promise<string[]> => {
    try {
      const response = await fetch(
        `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&inname=${encodeURIComponent(query)}&site=stackoverflow&pagesize=20`,
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

  // Combined suggestions from both API and database
  const getCombinedSuggestions = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Get suggestions from database
    const dbSuggestions = availableSkills
      .filter(skill => 
        skill.name.toLowerCase().includes(lowerQuery) &&
        !skills.includes(skill.name) // Not already selected
      )
      .map(skill => ({
        name: skill.name,
        id: skill.id,
        source: 'database' as const
      }));

    // Get suggestions from API (filtered)
    const apiSuggestions = skillSuggestions
      .filter(suggestion => 
        !availableSkills.some(skill => skill.name.toLowerCase() === suggestion.toLowerCase()) &&
        !skills.some(skill => skill.toLowerCase() === suggestion.toLowerCase())
      )
      .map(suggestion => ({
        name: suggestion,
        id: null,
        source: 'api' as const
      }));

    return [...dbSuggestions, ...apiSuggestions];
  };

  // Fetch skill suggestions with debounce
  const fetchSkillsDebounced = useCallback(
    (query: string) => {
      if (skillTimeoutRef.current) {
        clearTimeout(skillTimeoutRef.current);
      }

      skillTimeoutRef.current = setTimeout(async () => {
        if (query.length < 2) {
          setSkillSuggestions([]);
          return;
        }

        setIsLoadingSkills(true);
        try {
          const suggestions = await fetchSkillsSuggestions(query);
          setSkillSuggestions(suggestions);
        } catch (error) {
          console.error('Error fetching skills:', error);
          setSkillSuggestions([]);
        } finally {
          setIsLoadingSkills(false);
        }
      }, 300);
    },
    [],
  );

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (skillTimeoutRef.current) {
        clearTimeout(skillTimeoutRef.current);
      }
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

  // Handle click outside to close dropdowns
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
    // Check if skill already exists
    if (skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())) {
      toast.warning('This skill already exists');
      return;
    }

    try {
      if (skillId) {
        // Skill exists in database, just add it
        handleAddSkill(skillId);
      } else {
        // Skill doesn't exist, create new one
        const newSkill = await skillService.create({ name: selectedSkill });
        
        // Add to selected skills immediately with the new skill data
        setSkills([...skills, newSkill.name]);
        if (setSelectedSkillIds && selectedSkillIds) {
          setSelectedSkillIds([...selectedSkillIds, newSkill.id]);
        }
        
        // Refresh available skills from database
        if (refreshSkills) {
          await refreshSkills();
        }
      }
      
      toast.success(`Skill "${selectedSkill}" added successfully!`);
      
      setNewSkillInput('');
      setShowSkillSuggestions(false);
      setSelectedSuggestionIndex(-1);
      skillInputRef.current?.focus();
    } catch (error) {
      console.error('Error creating skill:', error);
      toast.error('Failed to add skill. Please try again.');
    }
  };

  const handleEmploymentTypeChange = (type: EmploymentType) => {
    setTypeOfEmployment(type);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const combinedSuggestions = getCombinedSuggestions(newSkillInput);
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < combinedSuggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestionIndex >= 0 && combinedSuggestions[selectedSuggestionIndex]) {
        const suggestion = combinedSuggestions[selectedSuggestionIndex];
        handleSkillSelect(suggestion.name, suggestion.id || undefined);
      } else if (newSkillInput.trim()) {
        handleSkillSelect(newSkillInput.trim());
      }
    } else if (e.key === 'Escape') {
      setShowSkillSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  // Get company data from Redux store
  const dispatch = useAppDispatch();
  const user = useUser();
  const companyId = user?.data?.companyId;
  const company = useCompanyDetailById(companyId as string);
  const companyLoadingState = useCompanyDetailLoadingState();
  const isCompanyLoading = companyLoadingState === LoadingState.loading;
  const companyLocations = company?.address || [];

  // Fetch company data if not available
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId || company) return;

      try {
        dispatch(setCompanyDetailStart());
        const data = await companyService.findOne(companyId as string);
        dispatch(setCompanyDetailSuccess(data));
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'Failed to load company data';
        dispatch(setCompanyDetailFailure(errorMessage));
      }
    };

    fetchCompanyData();
  }, [companyId, company, dispatch]);

  // Fetch categories from Redux store
  useEffect(() => {
    // Fetch categories only if not already loaded
    if (categoryLoadingState === LoadingState.init) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryLoadingState]);

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
            <h3 className="font-medium">
              Job Title
              <RequiredIndicator />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Job titles must be describe one position
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Input
              placeholder="e.g. Software Engineer"
              value={jobTitle}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 100) {
                  setJobTitle(value);
                }
              }}
              required
              className={
                jobTitle && (jobTitle.length < 5 || jobTitle.length > 100)
                  ? 'border-red-500'
                  : ''
              }
            />
            {jobTitle && jobTitle.length < 5 && (
              <p className="mt-1 text-xs text-red-500">
                Title must be at least 5 characters
              </p>
            )}
            {jobTitle && jobTitle.length > 100 && (
              <p className="mt-1 text-xs text-red-500">
                Title must not exceed 100 characters
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {jobTitle
                ? `${jobTitle.length}/100 characters`
                : 'At least 5 characters'}
            </p>
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
            <Select
              value={typeOfEmployment}
              onValueChange={handleEmploymentTypeChange}
              defaultValue="FULL_TIME"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select employment type">
                  {employmentType[
                    typeOfEmployment as keyof typeof employmentType
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
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">
              Salary
              <RequiredIndicator />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please specify the estimated salary for the role
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <div className="mb-4">
              <Select
                value={salaryType}
                onValueChange={(value: 'range' | 'min' | 'max') =>
                  setSalaryType(value)
                }
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select salary type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="range">Salary Range</SelectItem>
                  <SelectItem value="min">Minimum Salary</SelectItem>
                  <SelectItem value="max">Maximum Salary</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {salaryType === 'range' && (
              <>
                <div className="mb-2 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                  <div className="flex w-full items-center sm:w-auto">
                    <span className="mr-1">$</span>
                    <Input
                      value={salaryRange[0]}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        if (value >= 0) {
                          setSalaryRange([value, salaryRange[1]]);
                        }
                      }}
                      className="w-full sm:w-24"
                      type="number"
                      min={0}
                      required
                    />
                  </div>
                  <span className="hidden sm:inline">to</span>
                  <div className="flex w-full items-center sm:w-auto">
                    <span className="mr-1">$</span>
                    <Input
                      value={salaryRange[1]}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value);
                        if (value >= 0) {
                          setSalaryRange([salaryRange[0], value]);
                        }
                      }}
                      className="w-full sm:w-24"
                      type="number"
                      min={0}
                      required
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
              </>
            )}

            {salaryType === 'min' && (
              <div className="flex w-full items-center sm:w-auto">
                <span className="mr-1">From $</span>
                <Input
                  value={salaryRange[0]}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value);
                    if (value >= 0) {
                      setSalaryRange([value, 999999]);
                    }
                  }}
                  className="w-full sm:w-24"
                  type="number"
                  min={0}
                  required
                />
              </div>
            )}

            {salaryType === 'max' && (
              <div className="flex w-full items-center sm:w-auto">
                <span className="mr-1">Up to $</span>
                <Input
                  value={salaryRange[1]}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value);
                    if (value >= 0) {
                      setSalaryRange([0, value]);
                    }
                  }}
                  className="w-full sm:w-24"
                  type="number"
                  min={0}
                  required
                />
              </div>
            )}
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
            <h3 className="font-medium">
              Application Deadline
              <RequiredIndicator />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              When should applications close?
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <div className="relative">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'mt-1 w-full justify-start text-left font-normal',
                      !deadline && 'text-muted-foreground',
                      !deadline && 'border-red-500',
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {deadline ? format(new Date(deadline), 'PPP') : 'Select deadline date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={deadline ? new Date(deadline) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        // Check if selected date is in the past
                        if (date < today) {
                          toast.error('Please select a future date');
                          return;
                        }

                        // Check if selected date is more than 30 days from now
                        const maxDate = new Date();
                        maxDate.setDate(maxDate.getDate() + 30);
                        maxDate.setHours(0, 0, 0, 0);

                        if (date > maxDate) {
                          toast.error('Deadline cannot be more than 30 days from today');
                          return;
                        }

                        // Set time to 00:00:00
                        date.setUTCHours(0, 0, 0, 0);
                        setDeadline(date.toISOString());
                      }
                    }}
                    disabled={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      
                      // Disable past dates and dates less than 7 days from now
                      const minDate = new Date();
                      minDate.setDate(minDate.getDate() + 7);
                      minDate.setHours(0, 0, 0, 0);
                      
                      // Disable dates more than 30 days from now
                      const maxDate = new Date();
                      maxDate.setDate(maxDate.getDate() + 30);
                      maxDate.setHours(0, 0, 0, 0);
                      
                      return date < minDate || date > maxDate;
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="mt-1 text-xs">
              {!deadline && (
                <p className="text-red-500">
                  Please select an application deadline
                </p>
              )}
              <p className="text-gray-500">
                Applications will close at 00:00 (midnight) on the selected
                date. Deadline must be between 7 and 30 days from today.
              </p>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 gap-4 py-6 md:grid-cols-3 md:gap-8">
          <div>
            <h3 className="font-medium">
              Categories
              <RequiredIndicator />
            </h3>
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
                {(categories || []).length > 0 ? (
                  (categories || []).map((category) => (
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
            <h3 className="font-medium">
              Location
              <RequiredIndicator />
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Select the office location for this job
            </p>
          </div>
          <div className="w-full md:col-span-2 md:w-[70%]">
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger className="w-full">
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
            {/* Combined skills input */}
                <div className="mb-4">
              <div className="relative">
                  <Input
                  ref={skillInputRef}
                  placeholder="Search and add skills..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => newSkillInput && setShowSkillSuggestions(true)}
                    className="w-full"
                  autoComplete="off"
                />
                {isLoadingSkills && (
                  <Loader2 className="absolute top-3 right-3 h-4 w-4 animate-spin text-gray-400" />
                )}

                {/* Combined suggestions dropdown */}
                {showSkillSuggestions && newSkillInput && (
                  <div
                    ref={skillDropdownRef}
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-lg"
                  >
                    {getCombinedSuggestions(newSkillInput).map((suggestion, index) => (
                      <button
                        key={`${suggestion.source}-${suggestion.id || suggestion.name}`}
                        className={`w-full px-3 py-2 text-left text-sm transition-colors ${
                          index === selectedSuggestionIndex
                            ? 'bg-blue-100 text-blue-900'
                            : 'hover:bg-gray-100'
                        }`}
                        onMouseEnter={() => setSelectedSuggestionIndex(index)}
                        onClick={() => handleSkillSelect(suggestion.name, suggestion.id || undefined)}
                      >
                        {suggestion.name}
                      </button>
                    ))}
                    
                    {getCombinedSuggestions(newSkillInput).length === 0 && (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        Press Enter to add &quot;{newSkillInput}&quot;
                      </div>
                  )}
                </div>
                )}
              </div>
            </div>

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
