'use client';

import { Input } from '@/components/ui/input';
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
import { useUser } from '@/services/state/userSlice';
import {
  useCompanyDetailById,
  useCompanyDetailLoadingState,
  setCompanyDetailStart,
  setCompanyDetailSuccess,
  setCompanyDetailFailure,
} from '@/services/state/companySlice';
import { companyService } from '@/services/api/company/company-api';
import { LoadingState } from '@/store/store.model';
import { useDispatch } from 'react-redux';
import { employmentType } from '@/enums/employmentType';

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
}: StepProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false);
  const [salaryType, setSalaryType] = useState<'range' | 'min' | 'max'>(
    'range',
  );
  const [skillSearch, setSkillSearch] = useState('');

  // Get company data from Redux store
  const dispatch = useDispatch();
  const user = useUser();
  const companyId = user?.data?.companyId;
  const company = useCompanyDetailById(companyId || '');
  const companyLoadingState = useCompanyDetailLoadingState();
  const isCompanyLoading = companyLoadingState === LoadingState.loading;
  const companyLocations = company?.address || [];

  // Fetch company data if not available
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId || company) return;

      try {
        dispatch(setCompanyDetailStart());
        const data = await companyService.findOne(companyId);
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

  const filteredSkills = availableSkills.filter((skill) =>
    skill.name.toLowerCase().includes(skillSearch.toLowerCase()),
  );

  const displayedSkills = filteredSkills.slice(0, 6);

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
            <Input
              type="date"
              value={deadline ? deadline.split('T')[0] : ''}
              onChange={(e) => {
                // Set time to 00:00:00
                const selectedDate = new Date(e.target.value);
                selectedDate.setUTCHours(0, 0, 0, 0);
                setDeadline(selectedDate.toISOString());
              }}
              min={(() => {
                // Set minimum date to 7 days from now
                const minDate = new Date();
                minDate.setDate(minDate.getDate() + 7);
                return minDate.toISOString().split('T')[0];
              })()}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Applications will close at 00:00 (midnight) on the selected date.
              Minimum deadline is 7 days from today.
            </p>
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
                <div className="mb-4">
                  <Input
                    placeholder="Search skills..."
                    value={skillSearch}
                    onChange={(e) => setSkillSearch(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {displayedSkills.map((skill) => (
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
                {filteredSkills.length === 0 && (
                  <p className="mt-4 text-center text-sm text-gray-500">
                    No skills found matching your search
                  </p>
                )}
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
