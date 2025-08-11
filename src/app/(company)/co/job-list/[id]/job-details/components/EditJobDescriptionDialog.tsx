'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RichTextEditor } from '@/components/common/RichTextEditor';
import { AlertTriangle } from 'lucide-react';
import { jobService } from '@/services/api/jobs/job-api';
import { Job } from '@/types/Job';

interface EditJobDescriptionDialogProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditJobDescriptionDialog({
  job,
  isOpen,
  onClose,
  onSuccess,
}: EditJobDescriptionDialogProps) {
  const [description, setDescription] = useState(job.description);
  const [isLoading, setIsLoading] = useState(false);

  // Check if job is within 24 hours of creation
  const isWithin24Hours = () => {
    if (!job.createdAt) return true; // If no creation date, allow editing
    const createdAt = new Date(job.createdAt);
    const now = new Date();
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
    return hoursDiff <= 24;
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error('Job description is required');
      return;
    }

    setIsLoading(true);
    try {
      await jobService.update(job.id!, {
        description: description,
      });

      toast.success('Job description updated successfully');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to update job description:', error);

      // Extract error message from BE response
      let errorMessage = 'Failed to update job description. Please try again.';

      if (error && typeof error === 'object' && 'response' in error) {
        const responseError = error as {
          response?: { data?: { message?: string } };
        };
        if (responseError.response?.data?.message) {
          // BE error message
          errorMessage = responseError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        // General error message
        const messageError = error as { message: string };
        errorMessage = messageError.message;
      }

      // Show specific error message to user
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setDescription(job.description); // Reset to original value
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[95vh] !w-[95vw] !max-w-[1400px] overflow-y-auto sm:!max-w-[1400px]">
        <DialogHeader>
          <DialogTitle>Edit Job Description</DialogTitle>
          <div
            className={`mt-2 rounded-md border p-3 ${
              isWithin24Hours()
                ? 'border-yellow-200 bg-yellow-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-start">
              <AlertTriangle
                className={`mt-0.5 mr-2 h-4 w-4 flex-shrink-0 ${
                  isWithin24Hours() ? 'text-yellow-600' : 'text-red-600'
                }`}
              />
              <div
                className={`text-sm ${
                  isWithin24Hours() ? 'text-yellow-800' : 'text-red-800'
                }`}
              >
                <p className="font-medium">
                  {isWithin24Hours() ? 'Important:' : 'Editing Disabled:'}
                </p>
                <p>
                  {isWithin24Hours()
                    ? 'Jobs can only be modified within 24 hours of creation. After 24 hours, job details become read-only.'
                    : 'This job was created more than 24 hours ago and can no longer be modified.'}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Job Description *</Label>
            <div className="mt-2">
              <RichTextEditor
                content={description}
                onChange={setDescription}
                placeholder="Describe the role in detail..."
                minHeight="min-h-[500px]"
              />
            </div>
            {!description.trim() && (
              <p className="mt-1 text-sm text-red-500">
                Please provide a detailed job description
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              <p>Tips for a great job description:</p>
              <ul className="ml-4 list-disc">
                <li>Start with a brief, engaging overview of the role</li>
                <li>List key responsibilities and day-to-day activities</li>
                <li>Include required qualifications and skills</li>
                <li>Mention growth opportunities and team culture</li>
                <li>Keep it clear, concise, and well-structured</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !description.trim() || !isWithin24Hours()}
            title={
              !isWithin24Hours()
                ? 'Job can only be modified within 24 hours of creation'
                : ''
            }
          >
            {isLoading ? 'Updating...' : 'Update Description'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
