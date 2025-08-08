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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { cn } from '@/lib/utils';
import type { Cv, Education } from '@/types/Cv';

interface EducationsProps {
  cv: Cv;
  onAddEducation: (education: Education) => void;
  onUpdateEducation: (index: number, education: Education) => void;
  onDeleteEducation: (index: number) => void;
}

const Educations = ({
  cv,
  onAddEducation,
  onUpdateEducation,
  onDeleteEducation,
}: EducationsProps) => {
  const [degree, setDegree] = useState('');
  const [institution, setInstitution] = useState('');
  const [field, setField] = useState('');
  const [startYear, setStartYear] = useState('');
  const [endYear, setEndYear] = useState('');
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [yearError, setYearError] = useState<string>('');

  // Generate year options (current year to 50 years ago)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!degree || !institution || !startYear) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Validate years
    if (
      !isCurrentlyStudying &&
      endYear &&
      parseInt(endYear) < parseInt(startYear)
    ) {
      setYearError('End year must be after start year');
      return;
    }

    const education: Education = {
      degree,
      institution,
      field,
      startYear,
      endYear: isCurrentlyStudying ? 'Present' : endYear,
      description,
    };

    if (editIndex !== null) {
      onUpdateEducation(editIndex, education);
      setEditIndex(null);
    } else {
      onAddEducation(education);
    }

    resetForm();
    setShowEditDialog(false);
  };

  const resetForm = () => {
    setDegree('');
    setInstitution('');
    setField('');
    setStartYear('');
    setEndYear('');
    setIsCurrentlyStudying(false);
    setDescription('');
    setEditIndex(null);
    setYearError('');
  };

  const handleEdit = (education: Education, index: number) => {
    setDegree(education.degree);
    setInstitution(education.institution);
    setField(education.field);
    setStartYear(education.startYear);

    if (education.endYear === 'Present') {
      setIsCurrentlyStudying(true);
      setEndYear('');
    } else {
      setIsCurrentlyStudying(false);
      setEndYear(education.endYear || '');
    }

    setDescription(education.description);
    setEditIndex(index);
    setShowEditDialog(true);
  };

  const handleDelete = (index: number) => {
    onDeleteEducation(index);
    setDeleteIndex(null);
  };

  const handleCancel = () => {
    resetForm();
    setShowEditDialog(false);
    setYearError('');
  };

  const handleEndYearChange = (value: string) => {
    setEndYear(value);
    if (startYear && value && parseInt(value) < parseInt(startYear)) {
      setYearError('End year must be after start year');
    } else {
      setYearError('');
    }
  };

  return (
    <div className="space-y-6">
      <ScrollArea className="h-[400px] pr-4">
        {cv.education.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-medium">Existing Education</h3>
            {cv.education.map((edu, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm text-gray-500">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.field}</p>
                      <p className="text-sm text-gray-500">
                        {edu.startYear} - {edu.endYear || 'Present'}
                      </p>
                      <p className="text-sm text-gray-600">{edu.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(edu, index)}
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
        Add New Education
      </Button>

      <Dialog
        open={showEditDialog}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="max-h-[90vh] max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? 'Edit Education' : 'Add New Education'}
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="degree">Degree Type *</Label>
                <Select value={degree} onValueChange={setDegree}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select degree type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate">Associate Degree</SelectItem>
                    <SelectItem value="Bachelor">
                      Bachelor&apos;s Degree
                    </SelectItem>
                    <SelectItem value="Master">Master&apos;s Degree</SelectItem>
                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Diploma">Diploma</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="institution">Institution Name *</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1"
                  required
                  placeholder="e.g., Harvard University"
                />
              </div>

              <div>
                <Label htmlFor="field">Field of Study</Label>
                <Input
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startYear">Start Year *</Label>
                  <Select value={startYear} onValueChange={setStartYear}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endYear">End Year</Label>
                  <div className="space-y-2">
                    <Select
                      value={isCurrentlyStudying ? '' : endYear}
                      onValueChange={handleEndYearChange}
                      disabled={isCurrentlyStudying}
                    >
                      <SelectTrigger
                        className={cn(
                          'mt-1',
                          isCurrentlyStudying &&
                            'cursor-not-allowed opacity-50',
                        )}
                      >
                        <SelectValue
                          placeholder={
                            isCurrentlyStudying ? 'Present' : 'Select year'
                          }
                        />
                      </SelectTrigger>
                      {!isCurrentlyStudying && (
                        <SelectContent>
                          {yearOptions
                            .filter(
                              (year) =>
                                !startYear || year >= parseInt(startYear),
                            )
                            .map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      )}
                    </Select>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="currentlyStudying"
                        checked={isCurrentlyStudying}
                        onChange={(e) => {
                          setIsCurrentlyStudying(e.target.checked);
                          if (e.target.checked) {
                            setEndYear('');
                            setYearError('');
                          }
                        }}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="currentlyStudying" className="text-sm">
                        Currently studying here
                      </Label>
                    </div>
                    {yearError && (
                      <p className="text-xs text-red-500">{yearError}</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-32"
                  placeholder="Describe your achievements, activities, GPA, relevant courses, etc."
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!!yearError}>
              {editIndex !== null ? 'Update Education' : 'Add Education'}
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
              education entry.
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

export default Educations;
