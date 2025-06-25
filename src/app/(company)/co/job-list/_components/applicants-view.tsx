'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PipelineView } from '../_components/pipeline-view';
import { TableView } from '../_components/table-view';
import type { Candidate } from '../_components/types/candidate';

interface ApplicantsViewProps {
  applicants: Candidate[];
}

export function ApplicantsView({ applicants }: ApplicantsViewProps) {
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApplicants = applicants.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Total Applicants: {applicants.length}
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
          <Button variant="outline" className="bg-white text-gray-700">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
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
        <PipelineView applicants={filteredApplicants} />
      ) : (
        <TableView applicants={filteredApplicants} />
      )}
    </div>
  );
}
