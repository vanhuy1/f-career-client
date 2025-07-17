'use client';

import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useCategories,
  useCategoryLoadingState,
  fetchCategories,
} from '@/services/state/categorySlice';
import { LoadingState } from '@/store/store.model';
import { employmentType } from '@/enums/employmentType';
import { useAppDispatch } from '@/store/hooks';
import { clearJob } from '@/services/state/jobSlice';

export default function FilterSummary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const categoriesFromStore = useCategories();
  const categoryLoadingState = useCategoryLoadingState();

  const [categories, setCategories] = useState<Record<string, string>>({});
  const [activeFilters, setActiveFilters] = useState<
    { type: string; value: string; label: string }[]
  >([]);

  // Load categories from Redux store
  useEffect(() => {
    // Fetch categories if not already loaded
    if (categoryLoadingState === LoadingState.init) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categoryLoadingState]);

  // Convert categories array to map for easy lookup
  useEffect(() => {
    if (categoriesFromStore) {
      const categoryMap: Record<string, string> = {};
      categoriesFromStore.forEach((category) => {
        categoryMap[category.id] = category.name;
      });
      setCategories(categoryMap);
    }
  }, [categoriesFromStore]);

  // Update active filters whenever searchParams or categories change
  useEffect(() => {
    const filters: { type: string; value: string; label: string }[] = [];

    // Category filters
    const categoryIds = searchParams?.get('categoryIds')?.split(',') || [];
    categoryIds.forEach((id) => {
      filters.push({
        type: 'categoryIds',
        value: id,
        label: categories[id] || 'Category',
      });
    });

    // Employment type filters
    const employmentTypes =
      searchParams?.get('employmentTypes')?.split(',') || [];
    employmentTypes.forEach((type) => {
      // Get the display value from employmentType enum
      const displayValue =
        Object.entries(employmentType).find(([key]) => key === type)?.[1] ||
        type;

      filters.push({
        type: 'employmentTypes',
        value: type,
        label: displayValue as string,
      });
    });

    // Salary range filter
    const salaryMin = searchParams?.get('salaryMin');
    const salaryMax = searchParams?.get('salaryMax');

    if (salaryMin || salaryMax) {
      const formatSalary = (value: string | null) => {
        if (!value) return '';
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(parseInt(value));
      };

      let salaryLabel = 'Salary: ';

      if (salaryMin && salaryMax) {
        salaryLabel += `${formatSalary(salaryMin)} - ${formatSalary(salaryMax)}`;
      } else if (salaryMin) {
        salaryLabel += `Min ${formatSalary(salaryMin)}`;
      } else if (salaryMax) {
        salaryLabel += `Max ${formatSalary(salaryMax)}`;
      }

      filters.push({
        type: 'salary',
        value: 'salary',
        label: salaryLabel,
      });
    }

    setActiveFilters(filters);
  }, [dispatch, searchParams, categories]);

  // No filters applied
  if (activeFilters.length === 0) {
    return null;
  }

  // Handler to remove a filter
  const removeFilter = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (type === 'salary') {
      // Remove both salary parameters
      params.delete('salaryMin');
      params.delete('salaryMax');
    } else if (type === 'categoryIds' || type === 'employmentTypes') {
      // Remove specific ID from comma-separated list
      const current = params.get(type)?.split(',') || [];
      const updated = current.filter((item) => item !== value);

      if (updated.length > 0) {
        params.set(type, updated.join(','));
      } else {
        params.delete(type);
      }
    }
    dispatch(clearJob());
    setActiveFilters([]);

    // Reset to page 1 when changing filters
    params.set('page', '1');

    router.push(`/job?${params.toString()}`);
  };

  // Handler to clear all filters
  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams?.toString());

    params.forEach((_, key) => {
      if (key !== 'q' && key !== 'location') {
        params.delete(key);
      }
    });
    dispatch(clearJob());
    setActiveFilters([]);
    router.push(`/job?${params.toString()}`);
  };

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="text-sm font-medium text-gray-500">Active filters:</div>

      {activeFilters.map((filter, index) => (
        <Button
          key={`${filter.type}-${filter.value}-${index}`}
          variant="outline"
          size="sm"
          className="h-7 rounded-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
          onClick={() => removeFilter(filter.type, filter.value)}
        >
          {filter.label}
          <X className="ml-1 h-3 w-3" />
        </Button>
      ))}

      {activeFilters.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-gray-500 hover:text-red-500"
          onClick={clearAllFilters}
        >
          Clear all
        </Button>
      )}
    </div>
  );
}
