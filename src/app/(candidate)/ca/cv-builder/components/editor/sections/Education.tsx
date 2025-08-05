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
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !institution || !startYear) return;

    const education: Education = {
      degree,
      institution,
      field,
      startYear,
      endYear,
      description,
    };

    if (editIndex !== null) {
      onUpdateEducation(editIndex, education);
      setEditIndex(null);
    } else {
      onAddEducation(education);
    }

    setDegree('');
    setInstitution('');
    setField('');
    setStartYear('');
    setEndYear('');
    setDescription('');
    setShowEditDialog(false);
  };

  const handleEdit = (education: Education, index: number) => {
    setDegree(education.degree);
    setInstitution(education.institution);
    setField(education.field);
    setStartYear(education.startYear);
    setEndYear(education.endYear || '');
    setDescription(education.description);
    setEditIndex(index);
    setShowEditDialog(true);
  };

  const handleDelete = (index: number) => {
    onDeleteEducation(index);
    setDeleteIndex(null);
  };

  const handleCancel = () => {
    setDegree('');
    setInstitution('');
    setField('');
    setStartYear('');
    setEndYear('');
    setDescription('');
    setEditIndex(null);
    setShowEditDialog(false);
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
                <Label htmlFor="degree">Types of Degrees</Label>
                <Input
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="institution">University name</Label>
                <Input
                  id="institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="field">Major name</Label>
                <Input
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startYear">Start Year</Label>
                  <Input
                    id="startYear"
                    value={startYear}
                    onChange={(e) => setStartYear(e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="endYear">End Year</Label>
                  <Input
                    id="endYear"
                    value={endYear}
                    onChange={(e) => setEndYear(e.target.value)}
                    className="mt-1"
                    placeholder="Present"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 h-32"
                />
              </div>
            </form>
          </ScrollArea>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
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
