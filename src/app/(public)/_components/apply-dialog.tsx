'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Paperclip, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Validation schema
const applicationSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  cvFile: z
    .instanceof(File, { message: 'CV file is required' })
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      'File size must be less than 5MB',
    )
    .refine(
      (file) =>
        [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ].includes(file.type),
      'Only PDF, DOC, and DOCX files are allowed',
    ),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  jobId?: string;
}

// Fake API call function
const submitApplication = async (
  data: ApplicationFormData & { jobId?: string },
): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  console.log('Submitting application data:', data);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Simulate random success/failure for demo
  const isSuccess = Math.random() > 0.2; // 80% success rate

  if (isSuccess) {
    return {
      success: true,
      message: 'Application submitted successfully!',
    };
  } else {
    throw new Error('Failed to submit application. Please try again.');
  }
};

export default function ApplyDialog({
  isOpen,
  onClose,
  jobTitle,
  company,
  location,
  jobType,
  jobId,
}: ApplyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const watchedDescription = form.watch('description');
  const charCount = watchedDescription?.length || 0;
  const maxChars = 500;

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const result = await submitApplication({ ...data, jobId });
      setSubmitMessage({ type: 'success', text: result.message });

      // Close dialog after successful submission
      setTimeout(() => {
        onClose();
        form.reset();
        setSubmitMessage(null);
      }, 2000);
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      form.reset();
      setSubmitMessage(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-[600px]">
        <div className="relative">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="border-b p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-md bg-emerald-100 p-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-500 text-white">
                  {company.charAt(0)}
                </div>
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {jobTitle}
                </DialogTitle>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                  <span>{company}</span>
                  <span>•</span>
                  <span>{location}</span>
                  <span>•</span>
                  <span>{jobType}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="mb-4 text-xl font-semibold">
              Submit your application
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              The following is required and will only be shared with {company}
            </p>

            {submitMessage && (
              <div
                className={`mb-4 rounded-md p-3 ${
                  submitMessage.type === 'success'
                    ? 'border border-green-200 bg-green-50 text-green-800'
                    : 'border border-red-200 bg-red-50 text-red-800'
                }`}
              >
                {submitMessage.text}
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Application Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your application title"
                          disabled={isSubmitting}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add a cover letter or anything else you want to share"
                          className="min-h-[120px]"
                          disabled={isSubmitting}
                          maxLength={maxChars}
                          {...field}
                        />
                      </FormControl>
                      <div className="flex justify-end">
                        <div className="text-sm text-gray-500">
                          {charCount} / {maxChars}
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cvFile"
                  render={({ field: { onChange, value, ...field } }) => (
                    <FormItem>
                      <FormLabel>CV/Resume</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              Upload your CV or Resume
                            </span>
                            <div className="rounded-md border border-dashed border-indigo-300 px-4 py-2">
                              <label
                                htmlFor="cvFile"
                                className="flex cursor-pointer items-center gap-2 text-sm text-indigo-600"
                              >
                                <Paperclip className="h-4 w-4" />
                                <span>Attach CV/Resume</span>
                                <input
                                  id="cvFile"
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  disabled={isSubmitting}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      onChange(file);
                                    }
                                  }}
                                  className="hidden"
                                  {...field}
                                />
                              </label>
                            </div>
                          </div>
                          {value && (
                            <div className="text-sm text-gray-600">
                              Selected file: {value.name} (
                              {(value.size / 1024 / 1024).toFixed(2)} MB)
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 py-3 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <p>
                    By sending the request you confirm that you accept our{' '}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-indigo-600 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
