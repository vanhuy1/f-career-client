'use client';

import { useState } from 'react';
import { Edit2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExperienceForm } from './experience-form';
import type { Experience } from '@/types/CandidateProfile';
import { createSafeHtml } from '@/utils/html-sanitizer';

// Function to calculate duration between two dates
const calculateDuration = (startDate: string, endDate?: string): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  // Calculate years
  let years = end.getFullYear() - start.getFullYear();

  // Adjust years if needed based on months
  if (
    end.getMonth() < start.getMonth() ||
    (end.getMonth() === start.getMonth() && end.getDate() < start.getDate())
  ) {
    years--;
  }

  // Calculate months
  let months = end.getMonth() - start.getMonth();
  if (end.getDate() < start.getDate()) {
    months--;
  }

  // Correct negative months
  if (months < 0) {
    months += 12;
  }

  // Format the output
  let result = '';
  if (years > 0) {
    result += `${years}y `;
  }
  if (months > 0 || years === 0) {
    result += `${months}m`;
  }

  return result.trim();
};

interface ExperienceSectionProps {
  experiences: Experience[];
  onAddExperience?: (experience: Experience) => void;
  onUpdateExperience?: (experience: Experience) => void;
  readOnly?: boolean;
}

export function ExperienceSection({
  experiences,
  onAddExperience,
  onUpdateExperience,
  readOnly = false,
}: ExperienceSectionProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(
    null,
  );
  const [showAll, setShowAll] = useState(false); // State to toggle show more

  const maxInitialDisplay = 2; // Maximum initial experiences to display

  const handleAddExperience = (experience: Experience) => {
    if (onAddExperience) {
      onAddExperience(experience);
    }
    setAddDialogOpen(false);
  };

  const handleEditExperience = (experience: Experience) => {
    setCurrentExperience(experience);
    setEditDialogOpen(true);
  };

  const handleUpdateExperience = (updatedExperience: Experience) => {
    if (onUpdateExperience) {
      onUpdateExperience(updatedExperience);
    }
    setEditDialogOpen(false);
    setCurrentExperience(null);
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setCurrentExperience(null);
  };

  // Determine which experiences to display
  const displayedExperiences = showAll
    ? experiences
    : experiences.slice(0, maxInitialDisplay);

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Experiences</CardTitle>
        {!readOnly && (
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add New Experience</DialogTitle>
              </DialogHeader>
              <ExperienceForm
                mode="add"
                onSubmit={handleAddExperience}
                onCancel={() => setAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {displayedExperiences.map((experience, index) => (
          <div
            key={experience.id}
            className={`${
              index < displayedExperiences.length - 1
                ? 'mb-8 border-b pb-8'
                : 'mb-4'
            } relative`}
          >
            {!readOnly && (
              <Button
                variant="outline"
                size="icon"
                className="absolute top-0 right-0 h-8 w-8"
                onClick={() => handleEditExperience(experience)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <div className="flex gap-4">
              {/* Removed logo/avatar section */}
              <div>
                <h3 className="text-lg font-semibold">{experience.role}</h3>
                <div className="mb-2 text-gray-500">
                  {experience.company} • {experience.employmentType} •{' '}
                  {experience.startDate} - {experience.endDate || 'Present'}
                  {' ('}
                  {calculateDuration(
                    experience.startDate,
                    experience.endDate ?? undefined,
                  )}
                  {')'}
                </div>
                <div className="mb-3 text-gray-500">{experience.location}</div>
                <div
                  className="prose max-w-none text-gray-600"
                  dangerouslySetInnerHTML={createSafeHtml(
                    experience.description,
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        {experiences.length > maxInitialDisplay && !showAll && (
          <button
            className="font-medium text-indigo-600"
            onClick={() => setShowAll(true)}
          >
            Show more experiences
          </button>
        )}

        {/* Edit Experience Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Experience</DialogTitle>
            </DialogHeader>
            {currentExperience && (
              <ExperienceForm
                mode="edit"
                experience={currentExperience}
                onSubmit={handleUpdateExperience}
                onCancel={handleCancelEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
