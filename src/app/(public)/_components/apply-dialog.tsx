'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  X,
  Paperclip,
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import FileUploader from '@/components/common/FileUploader';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { applicationService } from '@/services/api/applications/application-api';

// Updated validation schema to use URL instead of File object
const applicationSchema = z.object({
  coverLetter: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  cvId: z.string().min(1, 'CV file is required'),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

interface ApplicantInfo {
  name: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
}

interface ApplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  company: string;
  location: string;
  jobType: string;
  jobId?: string;
  applicantInfo: ApplicantInfo;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatGender = (gender: string) => {
  const genderMap: { [key: string]: string } = {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHER: 'Other',
    'Prefer not to say': 'Prefer not to say',
  };
  return genderMap[gender] || gender;
};

export default function ApplyDialog({
  isOpen,
  onClose,
  jobTitle,
  company,
  location,
  jobType,
  jobId,
  applicantInfo,
}: ApplyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
      cvId: '',
    },
  });

  const watchedDescription = form.watch('coverLetter');
  const charCount = watchedDescription?.length || 0;
  const maxChars = 500;

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      if (!jobId) {
        throw new Error('Job ID is missing');
      }

      // Use the actual API service
      await applicationService.applyJob(data, Number(jobId));
      setSubmitMessage({
        type: 'success',
        text: 'Application submitted successfully!',
      });

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
                <div className="border-b bg-gray-50 p-6">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="applicant-info">
                      <AccordionTrigger className="text-lg font-semibold text-gray-900">
                        Applicant Information
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {applicantInfo.name}
                              </p>
                              <p className="text-xs text-gray-500">Full Name</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                              <Mail className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {applicantInfo.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Email Address
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                              <Phone className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {applicantInfo.phone}
                              </p>
                              <p className="text-xs text-gray-500">
                                Phone Number
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                              <Users className="h-4 w-4 text-orange-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatGender(applicantInfo.gender)}
                              </p>
                              <p className="text-xs text-gray-500">Gender</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 sm:col-span-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                              <Calendar className="h-4 w-4 text-red-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(applicantInfo.dateOfBirth)}
                              </p>
                              <p className="text-xs text-gray-500">
                                Date of Birth
                              </p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="cv-upload">
                      <AccordionTrigger className="text-lg font-semibold text-gray-900">
                        CV/Resume Upload
                      </AccordionTrigger>
                      <AccordionContent>
                        <FormField
                          control={form.control}
                          name="cvId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="space-y-2">
                                  {/* FileUploader Component */}
                                  <FileUploader
                                    bucket={SupabaseBucket.CV_UPLOADS}
                                    folder={SupabaseFolder.application}
                                    onComplete={(url) => {
                                      field.onChange(url);
                                    }}
                                    wrapperClassName="
                                      flex
                                      h-28
                                      flex-col
                                      items-center
                                      justify-center
                                      rounded-lg
                                      border-2
                                      border-dashed
                                      border-indigo-300
                                      p-4
                                      text-center
                                      hover:border-indigo-400
                                      transition
                                      duration-150
                                      ease-in-out
                                    "
                                    buttonClassName="flex flex-col items-center"
                                  >
                                    <Paperclip className="h-4 w-4 text-indigo-600" />
                                    <p className="mt-2 font-medium text-indigo-600">
                                      Attach CV/Resume
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                      PDF, DOC, or DOCX (max 5MB)
                                    </p>
                                  </FileUploader>

                                  {field.value && (
                                    <div className="text-sm text-green-600">
                                      CV uploaded successfully
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormDescription>
                        1. On a scale of 1 to 10, how would you rate your
                        English proficiency? (1 = Beginner, 10 = Fluent) 2.
                        Which position level are you applying for? (Fresher,
                        Junior, Standard, Standard++, Senior, Senior++, or Lead)
                      </FormDescription>
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
