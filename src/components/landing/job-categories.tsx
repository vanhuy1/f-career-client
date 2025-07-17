'use client';

import React, { useEffect } from 'react';
import {
  ArrowRight,
  Code,
  Computer,
  Megaphone,
  Users,
  Briefcase,
  Clock,
  Wallet,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import {
  useCategories,
  useCategoryLoadingState,
  useCategoryErrors,
  fetchCategories,
} from '@/services/state/categorySlice';
import { LoadingState } from '@/store/store.model';
import { useAppDispatch } from '@/store/hooks';

// Icon mapping for categories
const getCategoryIcon = (categoryName: string, isActive: boolean = false) => {
  const iconClass = isActive ? 'h-6 w-6 text-white' : 'h-6 w-6 text-blue-600';

  const iconMap: Record<string, React.ReactElement> = {
    Design: <Wrench className={iconClass} />,
    Sales: <Clock className={iconClass} />,
    Marketing: <Megaphone className={iconClass} />,
    Finance: <Wallet className={iconClass} />,
    Technology: <Computer className={iconClass} />,
    Engineering: <Code className={iconClass} />,
    Business: <Briefcase className={iconClass} />,
    'Human Resource': <Users className={iconClass} />,
  };

  return iconMap[categoryName] || <Briefcase className={iconClass} />;
};

export default function JobCategories() {
  const dispatch = useAppDispatch();
  const categories = useCategories();
  const loadingState = useCategoryLoadingState();
  const error = useCategoryErrors();

  const isLoading =
    loadingState === LoadingState.loading || loadingState === LoadingState.init;

  useEffect(() => {
    // Fetch categories only if not already loaded
    if (loadingState === LoadingState.init) {
      dispatch(fetchCategories());
    }
  }, [dispatch, loadingState]);

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="block rounded-lg border-1 bg-gray-200 p-6">
            <div className="mb-4 h-6 w-6 rounded bg-gray-300"></div>
            <div className="mb-2 h-6 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 rounded bg-gray-300"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-4xl font-bold text-gray-800">
              Explore by <span className="text-blue-500">category</span>
            </h2>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffffff] px-4 py-12 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-4xl font-bold text-gray-800">
            Explore by <span className="text-blue-500">category</span>
          </h2>
          <Link
            href="/job"
            className="group flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            Show all jobs
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((category, index) => (
              <Link
                key={category.id}
                href={`/job?categoryIds=${category.id}`}
                className={`block rounded-lg border-1 p-6 transition-transform hover:scale-[1.02] ${
                  index === 2 ? 'bg-blue-600' : 'bg-white'
                }`}
              >
                <div className="mb-4">
                  {getCategoryIcon(category.name, index === 2)}
                </div>
                <h3
                  className={`mb-2 text-xl font-bold ${
                    index === 2 ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {category.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span
                    className={`${
                      index === 2 ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    Browse jobs
                  </span>
                  <ArrowRight
                    className={`h-4 w-4 ${
                      index === 2 ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
