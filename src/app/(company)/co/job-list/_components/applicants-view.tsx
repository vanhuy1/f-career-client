'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PipelineView } from '../_components/pipeline-view';
import { TableView } from '../_components/table-view';
import {
  ApplicantFilterSidebar,
  ApplicantFilters,
} from './applicant-filter-sidebar';
import type { Candidate } from '../_components/types/candidate';

interface ApplicantsViewProps {
  applicants: Candidate[];
  getScoreColor: (score: number) => string;
  getScoreBackgroundColor: (score: number) => string;
  onApplicationUpdate?: () => void;
}

export function ApplicantsView({
  applicants,
  getScoreColor,
  getScoreBackgroundColor,
  onApplicationUpdate,
}: ApplicantsViewProps) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<ApplicantFilters>({
    ageRange: [18, 65],
    genderOptions: [],
    scoreRange: [0, 100],
    readStatus: [],
  });

  const applyFilters = (candidate: Candidate): boolean => {
    if (
      candidate.age < activeFilters.ageRange[0] ||
      candidate.age > activeFilters.ageRange[1]
    ) {
      return false;
    }

    if (
      activeFilters.genderOptions.length > 0 &&
      !activeFilters.genderOptions.includes(candidate.gender)
    ) {
      return false;
    }

    if (
      candidate.score < activeFilters.scoreRange[0] ||
      candidate.score > activeFilters.scoreRange[1]
    ) {
      return false;
    }

    if (activeFilters.readStatus.length > 0) {
      const candidateReadStatus = candidate.isRead ? 'read' : 'unread';
      if (!activeFilters.readStatus.includes(candidateReadStatus)) {
        return false;
      }
    }

    return true;
  };

  const filteredApplicants = applicants.filter((candidate) => {
    const matchesSearch = candidate.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilters = applyFilters(candidate);

    return matchesSearch && matchesFilters;
  });

  const handleFiltersChange = (filters: ApplicantFilters) => {
    setActiveFilters(filters);
    setIsFilterSidebarOpen(false);
  };

  const handleClearFilters = () => {
    setActiveFilters({
      ageRange: [18, 65],
      genderOptions: [],
      scoreRange: [0, 100],
      readStatus: [],
    });
    setIsFilterSidebarOpen(false);
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (activeFilters.ageRange[0] > 18 || activeFilters.ageRange[1] < 65)
      count++;
    if (activeFilters.genderOptions.length > 0) count++;
    if (activeFilters.scoreRange[0] > 0 || activeFilters.scoreRange[1] < 100)
      count++;
    if (activeFilters.readStatus.length > 0) count++;
    return count;
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Total Applicants: {filteredApplicants.length}{' '}
          {applicants.length !== filteredApplicants.length &&
            `of ${applicants.length}`}
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search Applicants"
              className="w-80 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Sheet
            open={isFilterSidebarOpen}
            onOpenChange={setIsFilterSidebarOpen}
          >
            <SheetTitle></SheetTitle>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="relative border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filter
                {appliedFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-xs font-medium text-white shadow-md">
                    {appliedFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[420px] p-0">
              <div className="flex h-full flex-col">
                <ApplicantFilterSidebar
                  onFiltersChange={handleFiltersChange}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="flex rounded-lg bg-gray-100 p-1">
            <Button
              variant={viewMode === 'pipeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pipeline')}
              className={
                viewMode === 'pipeline'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600'
              }
            >
              Pipeline View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className={
                viewMode === 'table'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600'
              }
            >
              Table View
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'pipeline' ? (
        <PipelineView
          applicants={filteredApplicants}
          getScoreColor={getScoreColor}
          getScoreBackgroundColor={getScoreBackgroundColor}
          onApplicationUpdate={onApplicationUpdate}
        />
      ) : (
        <TableView
          applicants={filteredApplicants}
          getScoreColor={getScoreColor}
          getScoreBackgroundColor={getScoreBackgroundColor}
          onApplicationUpdate={onApplicationUpdate}
        />
      )}
    </div>
  );
}
