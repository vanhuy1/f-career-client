'use client';

import { ChevronDown, FilterX, Filter } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { employmentType } from '@/enums/employmentType';
import { useState, useEffect } from 'react';
import {
  useCategories,
  useCategoryLoadingState,
  useCategoryErrors,
  fetchCategories,
} from '@/services/state/categorySlice';
import { LoadingState } from '@/store/store.model';
import { useAppDispatch } from '@/store/hooks';
import { useSearchParams, useRouter } from 'next/navigation';

export default function JobFilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dispatch = useAppDispatch();
  const categories = useCategories();
  const categoryLoadingState = useCategoryLoadingState();
  const categoryError = useCategoryErrors();

  const isLoading =
    categoryLoadingState === LoadingState.loading ||
    categoryLoadingState === LoadingState.init;
  const error = categoryError;
  const [salaryRange, setSalaryRange] = useState<number[]>([0, 100000]);
  const [expandedSections, setExpandedSections] = useState<boolean[]>([
    true,
    true,
    true,
  ]);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedEmploymentTypes, setSelectedEmploymentTypes] = useState<
    string[]
  >([]);
  const [appliedFilters, setAppliedFilters] = useState<number>(0);

  useEffect(() => {
    // Fetch categories only if not already loaded
    if (categoryLoadingState === LoadingState.init) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryLoadingState]);

  // Initialize filter state from URL params
  useEffect(() => {
    // Get salary range from URL
    const minSalary = searchParams?.get('salaryMin')
      ? parseInt(searchParams.get('salaryMin')!)
      : 0;
    const maxSalary = searchParams?.get('salaryMax')
      ? parseInt(searchParams.get('salaryMax')!)
      : 100000;
    setSalaryRange([minSalary, maxSalary]);

    // Get selected employment types from URL
    const employmentTypesParam = searchParams?.get('employmentTypes');
    if (employmentTypesParam) {
      const types = employmentTypesParam.split(',');
      // Store the keys directly, not the values
      setSelectedEmploymentTypes(types);
    } else {
      setSelectedEmploymentTypes([]);
    }

    // Get selected categories from URL
    const categoriesParam = searchParams?.get('categoryIds');
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(','));
    } else {
      setSelectedCategories([]);
    }

    // Calculate total applied filters
    let filterCount = 0;
    if (employmentTypesParam)
      filterCount += employmentTypesParam.split(',').length;
    if (categoriesParam) filterCount += categoriesParam.split(',').length;
    if (searchParams?.get('salaryMin') || searchParams?.get('salaryMax'))
      filterCount += 1;
    setAppliedFilters(filterCount);
  }, [searchParams]);

  const JobFilter = [
    {
      title: 'Type of Employment',
      type: 'checkbox',
      options: Object.entries(employmentType).map(([key, value]) => ({
        key,
        label: value,
      })),
    },
    {
      title: 'Categories',
      type: 'checkbox',
      options: isLoading
        ? [{ label: 'Loading...' }]
        : (categories || []).map((category) => ({ label: category.name })),
    },
    {
      title: 'Salary Range',
      type: 'slider',
      options: [],
    },
  ];

  const handleSalaryRangeChange = (value: number[]) => {
    setSalaryRange(value);
  };

  const handleSalaryInputChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange = [...salaryRange];
    newRange[index] = Math.max(0, Math.min(100000, numValue));

    // Ensure min doesn't exceed max and max doesn't go below min
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }

    setSalaryRange(newRange);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.map((expanded, i) => (i === index ? !expanded : expanded)),
    );
  };

  // Handle employment type selection
  const handleEmploymentTypeChange = (key: string) => {
    setSelectedEmploymentTypes((prev) => {
      if (prev.includes(key)) {
        return prev.filter((t) => t !== key);
      } else {
        return [...prev, key];
      }
    });
  };

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Apply all filters
  const applyFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());

    // Handle salary range
    if (salaryRange[0] > 0) {
      params.set('salaryMin', salaryRange[0].toString());
    } else {
      params.delete('salaryMin');
    }

    if (salaryRange[1] < 100000) {
      params.set('salaryMax', salaryRange[1].toString());
    } else {
      params.delete('salaryMax');
    }

    // Handle employment types
    if (selectedEmploymentTypes.length > 0) {
      params.set('employmentTypes', selectedEmploymentTypes.join(','));
    } else {
      params.delete('employmentTypes');
    }

    // Handle categories
    if (selectedCategories.length > 0) {
      params.set('categoryIds', selectedCategories.join(','));
    } else {
      params.delete('categoryIds');
    }

    // Reset to page 1 when filters change
    params.set('page', '1');

    // Calculate applied filters for UI
    let filterCount = 0;
    filterCount += selectedEmploymentTypes.length;
    filterCount += selectedCategories.length;
    if (salaryRange[0] > 0 || salaryRange[1] < 100000) filterCount += 1;
    setAppliedFilters(filterCount);

    // Update URL with new parameters while preserving search query and location
    router.push(`/job?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());

    params.forEach((_, key) => {
      if (key !== 'q' && key !== 'location') {
        params.delete(key);
      }
    });

    // Reset filter states
    setSalaryRange([0, 100000]);
    setSelectedEmploymentTypes([]);
    setSelectedCategories([]);
    setAppliedFilters(0);

    router.push(`/job?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-blue-600" />
          <h2 className="font-semibold text-gray-800">Filters</h2>
          {appliedFilters > 0 && (
            <span className="mr-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
              {appliedFilters}
            </span>
          )}
        </div>
        {appliedFilters > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs text-gray-500 hover:text-red-500"
          >
            <FilterX className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      {JobFilter.map((filter, index) => (
        <div key={index} className="border-b pb-4">
          <div
            className="mb-2 flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-gray-50"
            onClick={() => toggleSection(index)}
          >
            <h3 className="font-medium text-gray-700">{filter.title}</h3>
            <ChevronDown
              className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                expandedSections[index] ? 'rotate-180' : ''
              }`}
            />
          </div>

          {expandedSections[index] &&
            (filter.type === 'slider' ? (
              <div className="space-y-4">
                <div className="px-2">
                  <Slider
                    value={salaryRange}
                    onValueChange={handleSalaryRangeChange}
                    max={100000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">
                      Min Salary
                    </label>
                    <Input
                      type="number"
                      value={salaryRange[0]}
                      onChange={(e) =>
                        handleSalaryInputChange(0, e.target.value)
                      }
                      min={0}
                      max={100000}
                      className="h-8 text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-gray-700">
                      Max Salary
                    </label>
                    <Input
                      type="number"
                      value={salaryRange[1]}
                      onChange={(e) =>
                        handleSalaryInputChange(1, e.target.value)
                      }
                      min={0}
                      max={100000}
                      className="h-8 text-sm"
                      placeholder="100000"
                    />
                  </div>
                </div>
                <div className="text-center text-sm text-gray-500">
                  {formatCurrency(salaryRange[0])} -{' '}
                  {formatCurrency(salaryRange[1])}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {filter.title === 'Categories' && isLoading ? (
                  <div className="py-1 text-sm text-gray-500">
                    Loading categories...
                  </div>
                ) : filter.title === 'Categories' && error ? (
                  <div className="py-1 text-sm text-red-500">{error}</div>
                ) : filter.title === 'Type of Employment' ? (
                  Object.entries(employmentType).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`employment-${key}`}
                        checked={selectedEmploymentTypes.includes(key)}
                        onCheckedChange={() => handleEmploymentTypeChange(key)}
                      />
                      <Label
                        htmlFor={`employment-${key}`}
                        className="flex w-full cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{value}</span>
                      </Label>
                    </div>
                  ))
                ) : filter.title === 'Categories' ? (
                  (categories || []).map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onCheckedChange={() =>
                          handleCategoryChange(category.id)
                        }
                      />
                      <Label
                        htmlFor={`category-${category.id}`}
                        className="flex w-full cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{category.name}</span>
                      </Label>
                    </div>
                  ))
                ) : (
                  filter.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox id={`${filter.title}-${option.label}`} />
                      <Label
                        htmlFor={`${filter.title}-${option.label}`}
                        className="flex w-full items-center justify-between text-sm"
                      >
                        <span>{option.label}</span>
                      </Label>
                    </div>
                  ))
                )}
              </div>
            ))}
        </div>
      ))}

      {/* Apply filters button */}
      <div className="pt-4">
        <Button
          onClick={applyFilters}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
