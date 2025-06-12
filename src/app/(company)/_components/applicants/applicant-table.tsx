'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fakeApplicants } from '@/data/applicants/fake-applicants';

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Hired':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Shortlisted':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Interview':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Interviewed':
      return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    case 'Declined':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const StarRating = ({ score }: { score: number }) => {
  if (score === 0) return <span className="text-gray-400">0.0</span>;

  return (
    <div className="flex items-center gap-1">
      <span className="text-yellow-500">★</span>
      <span className="font-medium">{score}</span>
    </div>
  );
};

export default function ApplicantTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('table');

  const filteredApplicants = fakeApplicants.filter(
    (applicant) =>
      applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      applicant.jobRole.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredApplicants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedApplicants = filteredApplicants.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplicants(paginatedApplicants.map((a) => a.id));
    } else {
      setSelectedApplicants([]);
    }
  };

  const handleSelectApplicant = (applicantId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplicants([...selectedApplicants, applicantId]);
    } else {
      setSelectedApplicants(
        selectedApplicants.filter((id) => id !== applicantId),
      );
    }
  };

  return (
    <div className="bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Total Applicants : {filteredApplicants.length}
        </h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Search Applicants"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <div className="flex rounded-lg bg-gray-100 p-1">
            <Button
              variant={viewMode === 'pipeline' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('pipeline')}
              className="text-sm"
            >
              Pipeline View
            </Button>
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="text-sm"
            >
              Table View
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedApplicants.length === paginatedApplicants.length &&
                    paginatedApplicants.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Full Name
              </TableHead>
              <TableHead className="font-medium text-gray-600">Score</TableHead>
              <TableHead className="font-medium text-gray-600">
                Hiring Stage
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Applied Date
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Job Role
              </TableHead>
              <TableHead className="font-medium text-gray-600">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplicants.map((applicant) => (
              <TableRow key={applicant.id} className="hover:bg-gray-50">
                <TableCell>
                  <Checkbox
                    checked={selectedApplicants.includes(applicant.id)}
                    onCheckedChange={(checked) =>
                      handleSelectApplicant(applicant.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={applicant.avatar || '/placeholder.svg'}
                        alt={applicant.fullName}
                      />
                      <AvatarFallback>
                        {applicant.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{applicant.fullName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <StarRating score={applicant.score} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={getStageColor(applicant.hiringStage)}
                  >
                    {applicant.hiringStage}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">
                  {applicant.appliedDate}
                </TableCell>
                <TableCell className="text-gray-600">
                  {applicant.jobRole}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      See Application
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">View</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => setItemsPerPage(Number(value))}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-600">Applicants per page</span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className="h-8 w-8"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
