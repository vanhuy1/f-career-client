'use client';

import { useState } from 'react';
import {
  ChevronDown,
  FilterX,
  Filter,
  Users,
  Calendar,
  Award,
  Mail,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface ApplicantFilters {
  ageRange: [number, number];
  genderOptions: string[];
  scoreRange: [number, number];
  readStatus: string[];
}

interface ApplicantFilterSidebarProps {
  onFiltersChange: (filters: ApplicantFilters) => void;
  onClearFilters: () => void;
}

export function ApplicantFilterSidebar({
  onFiltersChange,
  onClearFilters,
}: ApplicantFilterSidebarProps) {
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 65]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [selectedReadStatus, setSelectedReadStatus] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<boolean[]>([
    true,
    true,
    true,
    true,
  ]);

  const genderOptions = [
    { value: 'male', label: 'Male', icon: '👨' },
    { value: 'female', label: 'Female', icon: '👩' },
    { value: 'other', label: 'Other', icon: '👤' },
  ];

  const readStatusOptions = [
    { value: 'read', label: 'Read', icon: '📖' },
    { value: 'unread', label: 'Unread', icon: '📧' },
  ];

  const filters = [
    {
      title: 'Age Range',
      type: 'slider',
      key: 'age',
      icon: Calendar,
      description: 'Filter candidates by age',
    },
    {
      title: 'Gender',
      type: 'checkbox',
      key: 'gender',
      icon: Users,
      description: 'Filter by gender identity',
      options: genderOptions,
    },
    {
      title: 'AI Score',
      type: 'slider',
      key: 'score',
      icon: Award,
      description: 'Filter by AI assessment score',
    },
    {
      title: 'Read Status',
      type: 'checkbox',
      key: 'readStatus',
      icon: Mail,
      description: 'Filter by read/unread status',
      options: readStatusOptions,
    },
  ];

  const handleAgeRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setAgeRange(newRange);
  };

  const handleAgeInputChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange: [number, number] = [...ageRange];
    newRange[index] = Math.max(18, Math.min(65, numValue));

    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }

    setAgeRange(newRange);
  };

  const handleScoreRangeChange = (value: number[]) => {
    const newRange: [number, number] = [value[0], value[1]];
    setScoreRange(newRange);
  };

  const handleScoreInputChange = (index: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange: [number, number] = [...scoreRange];
    newRange[index] = Math.max(0, Math.min(100, numValue));

    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }

    setScoreRange(newRange);
  };

  const handleGenderChange = (genderValue: string) => {
    setSelectedGenders((prev) => {
      if (prev.includes(genderValue)) {
        return prev.filter((g) => g !== genderValue);
      } else {
        return [...prev, genderValue];
      }
    });
  };

  const handleReadStatusChange = (readStatusValue: string) => {
    setSelectedReadStatus((prev) => {
      if (prev.includes(readStatusValue)) {
        return prev.filter((r) => r !== readStatusValue);
      } else {
        return [...prev, readStatusValue];
      }
    });
  };

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.map((expanded, i) => (i === index ? !expanded : expanded)),
    );
  };

  const applyFilters = () => {
    const appliedFilters: ApplicantFilters = {
      ageRange,
      genderOptions: selectedGenders,
      scoreRange,
      readStatus: selectedReadStatus,
    };
    onFiltersChange(appliedFilters);
  };

  const clearAllFilters = () => {
    setAgeRange([18, 65]);
    setSelectedGenders([]);
    setScoreRange([0, 100]);
    setSelectedReadStatus([]);
    onClearFilters();
  };

  const getAppliedFiltersCount = () => {
    let count = 0;
    if (ageRange[0] > 18 || ageRange[1] < 65) count++;
    if (selectedGenders.length > 0) count++;
    if (scoreRange[0] > 0 || scoreRange[1] < 100) count++;
    if (selectedReadStatus.length > 0) count++;
    return count;
  };

  const appliedFiltersCount = getAppliedFiltersCount();

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Filter Applicants
              </h2>
              <p className="text-sm text-gray-500">
                Refine your candidate search
              </p>
            </div>
          </div>
          {appliedFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                {appliedFiltersCount} active
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 text-xs text-gray-500 hover:bg-red-50 hover:text-red-600"
              >
                <FilterX className="mr-1 h-3 w-3" />
                Clear
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-6">
        {filters.map((filter, index) => {
          const IconComponent = filter.icon;
          return (
            <div
              key={index}
              className="rounded-lg border border-gray-100 bg-white shadow-sm"
            >
              <div
                className="flex cursor-pointer items-center justify-between p-4 transition-colors hover:bg-gray-50"
                onClick={() => toggleSection(index)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                    <IconComponent className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {filter.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {filter.description}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    expandedSections[index] ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {expandedSections[index] && (
                <div className="border-t border-gray-100 p-4">
                  {filter.type === 'slider' && filter.key === 'age' && (
                    <div className="space-y-6">
                      <div className="px-2">
                        <Slider
                          value={ageRange}
                          onValueChange={handleAgeRangeChange}
                          max={65}
                          min={18}
                          step={1}
                          className="w-full"
                        />
                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                          <span>18 years</span>
                          <span>65 years</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-700">
                            Min Age
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Input
                              type="number"
                              value={ageRange[0]}
                              onChange={(e) =>
                                handleAgeInputChange(0, e.target.value)
                              }
                              className="h-9 text-sm"
                              min={18}
                              max={65}
                            />
                            <span className="text-xs text-gray-500">years</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-700">
                            Max Age
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Input
                              type="number"
                              value={ageRange[1]}
                              onChange={(e) =>
                                handleAgeInputChange(1, e.target.value)
                              }
                              className="h-9 text-sm"
                              min={18}
                              max={65}
                            />
                            <span className="text-xs text-gray-500">years</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {filter.type === 'slider' && filter.key === 'score' && (
                    <div className="space-y-6">
                      <div className="px-2">
                        <Slider
                          value={scoreRange}
                          onValueChange={handleScoreRangeChange}
                          max={100}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                        <div className="mt-2 flex justify-between text-xs text-gray-400">
                          <span>0 points</span>
                          <span>100 points</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-700">
                            Min Score
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Input
                              type="number"
                              value={scoreRange[0]}
                              onChange={(e) =>
                                handleScoreInputChange(0, e.target.value)
                              }
                              className="h-9 text-sm"
                              min={0}
                              max={100}
                            />
                            <span className="text-xs text-gray-500">pts</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-gray-700">
                            Max Score
                          </label>
                          <div className="mt-1 flex items-center gap-2">
                            <Input
                              type="number"
                              value={scoreRange[1]}
                              onChange={(e) =>
                                handleScoreInputChange(1, e.target.value)
                              }
                              className="h-9 text-sm"
                              min={0}
                              max={100}
                            />
                            <span className="text-xs text-gray-500">pts</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {filter.type === 'checkbox' && filter.key === 'gender' && (
                    <div className="space-y-3">
                      {genderOptions.map((option) => (
                        <div
                          key={option.value}
                          className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                            selectedGenders.includes(option.value)
                              ? 'border-blue-200 bg-blue-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Checkbox
                            id={`gender-${option.value}`}
                            checked={selectedGenders.includes(option.value)}
                            onCheckedChange={() =>
                              handleGenderChange(option.value)
                            }
                            className="data-[state=checked]:bg-blue-600"
                          />
                          <div className="flex flex-1 items-center gap-3">
                            <span className="text-lg">{option.icon}</span>
                            <Label
                              htmlFor={`gender-${option.value}`}
                              className="flex-1 cursor-pointer text-sm font-medium text-gray-700"
                            >
                              {option.label}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {filter.type === 'checkbox' &&
                    filter.key === 'readStatus' && (
                      <div className="space-y-3">
                        {readStatusOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                              selectedReadStatus.includes(option.value)
                                ? 'border-blue-200 bg-blue-50'
                                : 'border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <Checkbox
                              id={`readStatus-${option.value}`}
                              checked={selectedReadStatus.includes(
                                option.value,
                              )}
                              onCheckedChange={() =>
                                handleReadStatusChange(option.value)
                              }
                              className="data-[state=checked]:bg-blue-600"
                            />
                            <div className="flex flex-1 items-center gap-3">
                              <span className="text-lg">{option.icon}</span>
                              <Label
                                htmlFor={`readStatus-${option.value}`}
                                className="flex-1 cursor-pointer text-sm font-medium text-gray-700"
                              >
                                {option.label}
                              </Label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-6">
        <Button
          onClick={applyFilters}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg"
        >
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
        {appliedFiltersCount > 0 && (
          <p className="mt-2 text-center text-xs text-gray-500">
            {appliedFiltersCount} filter{appliedFiltersCount > 1 ? 's' : ''}{' '}
            will be applied
          </p>
        )}
      </div>
    </div>
  );
}
