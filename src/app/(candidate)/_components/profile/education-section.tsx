'use client';

import { useState } from 'react';
import Image from 'next/image';
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
import { EducationForm } from './education-form';
import type { Education } from '@/types/CandidateProfile';

interface EducationSectionProps {
  education: Education[];
  showMoreCount?: number;
  onAddEducation?: (education: Education) => void;
  onUpdateEducation?: (education: Education) => void;
}

export function EducationSection({
  education,
  onAddEducation,
  onUpdateEducation,
}: EducationSectionProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(
    null,
  );

  const handleAddEducation = (education: Education) => {
    if (onAddEducation) {
      onAddEducation(education);
    }
    setAddDialogOpen(false);
  };

  const handleEditEducation = (education: Education) => {
    setCurrentEducation(education);
    setEditDialogOpen(true);
  };

  const handleUpdateEducation = (updatedEducation: Education) => {
    if (onUpdateEducation) {
      onUpdateEducation(updatedEducation);
    }
    setEditDialogOpen(false);
    setCurrentEducation(null);
  };

  const handleCancelEdit = () => {
    setEditDialogOpen(false);
    setCurrentEducation(null);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Educations</CardTitle>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Education</DialogTitle>
            </DialogHeader>
            <EducationForm
              mode="add"
              onSubmit={handleAddEducation}
              onCancel={() => setAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {education.map((edu, index) => (
          <div
            key={edu.id}
            className={`${index < education.length - 1 ? 'mb-8 border-b pb-8' : 'mb-4'} relative`}
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute top-0 right-0 h-8 w-8"
              onClick={() => handleEditEducation(edu)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <div className="flex gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full border bg-white">
                <Image
                  src={edu.logo || '/placeholder.svg'}
                  alt={edu.institution}
                  width={48}
                  height={48}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{edu.institution}</h3>
                <div className="mb-2 text-gray-500">
                  {edu.degree}, {edu.field}
                </div>
                <div className="mb-3 text-gray-500">
                  {edu.startYear} - {edu.endYear || 'Present'}
                </div>
                {edu.description && (
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: edu.description }}
                  />
                )}
              </div>
            </div>
          </div>
        ))}

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Edit Education</DialogTitle>
            </DialogHeader>
            {currentEducation && (
              <EducationForm
                mode="edit"
                education={currentEducation}
                onSubmit={handleUpdateEducation}
                onCancel={handleCancelEdit}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
