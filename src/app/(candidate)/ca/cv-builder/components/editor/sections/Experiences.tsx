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
import { Pencil, Trash2, Calendar } from 'lucide-react';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'react-toastify';
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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isCurrentJob, setIsCurrentJob] = useState(false);
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dateError, setDateError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !company || !startDate || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate dates
    if (!isCurrentJob && endDate && startDate > endDate) {
      setDateError('End date must be after start date');
      return;
    }

    const experience: Experience = {
      role: title,
      company,
      employmentType,
      location,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: isCurrentJob
        ? 'Present'
        : endDate
          ? format(endDate, 'yyyy-MM-dd')
          : '',
      description,
    };

    if (editIndex !== null) {
      onUpdateExperience(editIndex, experience);
      setEditIndex(null);
    } else {
      onAddExperience(experience);
    }

    resetForm();
    setShowEditDialog(false);
  };

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setEmploymentType('');
    setLocation('');
    setStartDate(undefined);
    setEndDate(undefined);
    setIsCurrentJob(false);
    setDescription('');
    setEditIndex(null);
    setDateError('');
  };

  const handleEdit = (experience: Experience, index: number) => {
    setTitle(experience.role);
    setCompany(experience.company);
    setEmploymentType(experience.employmentType);
    setLocation(experience.location);

    // Parse dates
    if (experience.startDate) {
      setStartDate(new Date(experience.startDate));
    }

    if (experience.endDate === 'Present') {
      setIsCurrentJob(true);
      setEndDate(undefined);
    } else if (experience.endDate) {
      setEndDate(new Date(experience.endDate));
      setIsCurrentJob(false);
    }

    setDescription(experience.description || '');
    setEditIndex(index);
    setShowEditDialog(true);
  };

  const handleDelete = (index: number) => {
    onDeleteExperience(index);
    setDeleteIndex(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowEditDialog(false);
    setDateError('');
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
                <select
                  id="employmentType"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Select type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="FREELANCE">Freelance</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'mt-1 w-full justify-start text-left font-normal',
                          !startDate && 'text-muted-foreground',
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          disabled={isCurrentJob}
                          className={cn(
                            'mt-1 w-full justify-start text-left font-normal',
                            !endDate &&
                              !isCurrentJob &&
                              'text-muted-foreground',
                            isCurrentJob && 'cursor-not-allowed opacity-50',
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {isCurrentJob
                            ? 'Present'
                            : endDate
                              ? format(endDate, 'PPP')
                              : 'Select date'}
                        </Button>
                      </PopoverTrigger>
                      {!isCurrentJob && (
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={endDate}
                            onSelect={(date) => {
                              setEndDate(date);
                              if (date && startDate && date < startDate) {
                                setDateError(
                                  'End date must be after start date',
                                );
                              } else {
                                setDateError('');
                              }
                            }}
                            disabled={(date) =>
                              startDate ? date < startDate : false
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      )}
                    </Popover>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="currentJob"
                        checked={isCurrentJob}
                        onChange={(e) => {
                          setIsCurrentJob(e.target.checked);
                          if (e.target.checked) {
                            setEndDate(undefined);
                            setDateError('');
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="currentJob" className="text-sm">
                        I currently work here
                      </Label>
                    </div>
                    {dateError && (
                      <p className="text-xs text-red-500">{dateError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Job Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-32"
                  placeholder="Describe your responsibilities, achievements, and skills used..."
                  required
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!!dateError}>
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
