'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Cv, Experience } from '@/types/Cv';

interface ExperiencesProps {
  cv: Cv;
  onAddExperience: (experience: Experience) => void;
  onUpdateExperience: (index: number, experience: Experience) => void;
  onDeleteExperience: (index: number) => void;
}

const Experiences = ({
  cv,
  onAddExperience,
  onUpdateExperience,
  onDeleteExperience,
}: ExperiencesProps) => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !startDate || !description) return;

    const experience: Experience = {
      role: title,
      company,
      employmentType,
      location,
      startDate,
      endDate,
      description,
    };

    if (editIndex !== null) {
      onUpdateExperience(editIndex, experience);
      setEditIndex(null);
    } else {
      onAddExperience(experience);
    }

    setTitle('');
    setCompany('');
    setEmploymentType('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setShowEditDialog(false);
  };

  const handleEdit = (experience: Experience, index: number) => {
    setTitle(experience.role);
    setCompany(experience.company);
    setEmploymentType(experience.employmentType);
    setLocation(experience.location);
    setStartDate(experience.startDate);
    setEndDate(experience.endDate || '');
    setDescription(experience.description || '');
    setEditIndex(index);
    setShowEditDialog(true);
  };

  const handleDelete = (index: number) => {
    onDeleteExperience(index);
    setDeleteIndex(null);
  };

  const handleCancel = () => {
    setTitle('');
    setCompany('');
    setEmploymentType('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setEditIndex(null);
    setShowEditDialog(false);
  };

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[400px] pr-4">
        {cv.experience.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Existing Experience</h3>
            {cv.experience.map((exp, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{exp.role}</h4>
                      <p className="text-sm text-gray-500">{exp.company}</p>
                      <p className="text-sm text-gray-500">
                        {exp.employmentType}
                      </p>
                      <p className="text-sm text-gray-500">{exp.location}</p>
                      <p className="text-sm text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                      <p className="text-sm text-gray-600">{exp.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(exp, index)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteIndex(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

      <Button
        className="w-full"
        onClick={() => {
          setEditIndex(null);
          setShowEditDialog(true);
        }}
      >
        Add New Experience
      </Button>

      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="max-h-[90vh] max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? 'Edit Experience' : 'Add New Experience'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="employmentType">Employment Type</Label>
                <Input
                  id="employmentType"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., FULL_TIME"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mt-1"
                    placeholder="Present"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-32"
                  required
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              {editIndex !== null ? 'Update Experience' : 'Add Experience'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteIndex !== null}
        onOpenChange={() => setDeleteIndex(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              experience entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteIndex !== null && handleDelete(deleteIndex)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Experiences;
