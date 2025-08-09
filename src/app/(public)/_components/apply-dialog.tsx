'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
  FileText,
  Trash2,
  FileCheck,
  Eye,
  Clock,
  AlertCircle,
  Edit,
  Save,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FileUploader from '@/components/common/FileUploader';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import { applicationService } from '@/services/api/applications/application-api';
import { cvService } from '@/services/api/cv/cv-api';
import { uploadFile } from '@/lib/storage';
import type { Cv } from '@/types/Cv';
import { useRouter } from 'next/navigation';
import { useUser } from '@/services/state/userSlice';

// Schema validation
const applicationSchema = z.object({
  coverLetter: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description must not exceed 500 characters'),
  cvId: z.string().optional(),
  cvSource: z.enum(['upload', 'system']),
  existingCvId: z.string().optional(),
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

// Helper functions
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

const formatFileSize = (bytes?: number) => {
  if (!bytes) return 'Unknown size';
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return 'Unknown date';
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return date.toLocaleDateString();
};

// Check if CV is unsaved (no URL)
const isUnsavedCV = (cv: Cv): boolean => {
  return !cv.url || cv.url === '';
};

// Check if CV was created within last 24 hours
const isRecentlyCreatedCV = (cv: Cv): boolean => {
  if (!cv.createdAt) return false;
  const createdDate = new Date(cv.createdAt);
  const now = new Date();
  const hoursDiff = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
  return hoursDiff < 24;
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
  const router = useRouter();
  const user = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>('');
  const [selectedCvId, setSelectedCvId] = useState<string>('');
  const [userCvs, setUserCvs] = useState<Cv[]>([]);
  const [isLoadingCvs, setIsLoadingCvs] = useState(false);
  const [unsavedCvsCount, setUnsavedCvsCount] = useState(0);

  const form = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      coverLetter: '',
      cvId: '',
      cvSource: 'upload',
      existingCvId: '',
    },
  });

  const watchedDescription = form.watch('coverLetter');
  const cvSource = form.watch('cvSource');
  const existingCvId = form.watch('existingCvId');
  const charCount = watchedDescription?.length || 0;
  const maxChars = 500;

  useEffect(() => {
    const fetchUserCvs = async () => {
      if (!isOpen || !user?.data?.id) return;
      setIsLoadingCvs(true);
      try {
        const userId = user.data.id;
        const response = await cvService.findAll(Number(userId));
        console.log('Fetched user CVs:', response);
        const cvs = response.items || [];
        setUserCvs(cvs);

        // Count unsaved CVs
        const unsaved = cvs.filter(isUnsavedCV).length;
        setUnsavedCvsCount(unsaved);
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setIsLoadingCvs(false);
      }
    };

    fetchUserCvs();
  }, [isOpen, user?.data?.id]);

  const handleCvFileSelect = (file: File) => {
    setCvFile(file);
    setCvFileName(file.name);
  };

  const clearCvFile = () => {
    setCvFile(null);
    setCvFileName('');
    form.setValue('cvId', '');
  };

  const handleCvSelect = (cvId: string) => {
    setSelectedCvId(cvId);
    form.setValue('existingCvId', cvId);
  };

  const handlePreviewCv = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(url, '_blank');
  };

  const handleEditCv = (cvId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/ca/cv-builder/${cvId}`);
    onClose();
  };

  const handleCreateCv = () => {
    router.push('/ca/cv-builder');
    onClose();
  };

  const handleSignIn = () => {
    router.push('/signin');
    onClose();
  };

  const handleSignUp = () => {
    router.push('/signup');
    onClose();
  };

  const onSubmit: SubmitHandler<ApplicationFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      if (!jobId) {
        throw new Error('Job ID is missing');
      }

      let cvUrl = '';

      // Handle CV based on source selection
      if (data.cvSource === 'upload') {
        if (!cvFile) {
          throw new Error('Please select a CV/Resume file');
        }

        // Upload CV file to Supabase
        const { publicUrl, error } = await uploadFile({
          file: cvFile,
          bucket: SupabaseBucket.CV_UPLOADS,
          folder: SupabaseFolder.application,
        });

        if (error || !publicUrl) {
          throw new Error(
            `Failed to upload CV: ${error?.message || 'Unknown error'}`,
          );
        }

        cvUrl = publicUrl;
      } else if (data.cvSource === 'system') {
        if (!data.existingCvId) {
          throw new Error('Please select a CV from your saved CVs');
        }

        // Find the selected CV
        const selectedCv = userCvs.find((cv) => cv.id === data.existingCvId);

        if (!selectedCv) {
          throw new Error('Selected CV not found');
        }

        // Check if CV has URL
        if (!selectedCv.url || selectedCv.url === '') {
          throw new Error(
            'This CV is incomplete. Please edit and save it before applying.',
          );
        }

        cvUrl = selectedCv.url;
      }

      // Update form data with the CV URL
      const submissionData = {
        ...data,
        cvId: cvUrl,
      };

      // Call API service
      await applicationService.applyJob(submissionData, Number(jobId));
      setSubmitMessage({
        type: 'success',
        text: 'Application submitted successfully!',
      });

      // Close dialog after successful submission
      setTimeout(() => {
        onClose();
        form.reset();
        setCvFile(null);
        setCvFileName('');
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
      setCvFile(null);
      setCvFileName('');
      setSubmitMessage(null);
    }
  };

  // Check if form is valid for submission
  const isCvValid = () => {
    if (cvSource === 'upload') {
      return !!cvFile;
    } else {
      // Check if selected CV has URL
      const selectedCv = userCvs.find((cv) => cv.id === existingCvId);
      return selectedCv && !!selectedCv.url;
    }
  };

  // Component to display CV item
  const CVItem = ({ cv }: { cv: Cv }) => {
    const isUnsaved = isUnsavedCV(cv);
    const isRecent = isRecentlyCreatedCV(cv);
    const isSelected = selectedCvId === cv.id;

    return (
      <Card
        className={`group cursor-pointer border py-0 transition-all duration-200 ${
          isUnsaved
            ? 'border-orange-200 bg-orange-50/50 hover:border-orange-300'
            : 'hover:border-indigo-200 hover:shadow-md'
        } ${
          isSelected && !isUnsaved
            ? 'bg-indigo-50/80 ring-2 ring-indigo-500'
            : isSelected && isUnsaved
              ? 'bg-orange-100/50 ring-2 ring-orange-400'
              : 'hover:bg-gray-50/80'
        }`}
        onClick={() => !isUnsaved && handleCvSelect(cv.id || '')}
      >
        <CardContent className="p-4">
          {isUnsaved && (
            <div className="mb-3 flex flex-col gap-2 rounded-md bg-orange-100 p-2 text-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-orange-600" />
                <div className="text-orange-700">
                  <span className="font-medium">Incomplete CV:</span> This CV
                  needs to be edited and saved before it can be used
                </div>
              </div>
              <div className="ml-5 text-orange-600 italic">
                To complete: Edit the CV and click the &ldquo;save&rdquo; icon
                on the right side of the CV layout
              </div>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              <div
                className={`rounded-lg p-2.5 transition-colors ${
                  isUnsaved
                    ? 'bg-orange-100'
                    : isSelected
                      ? 'bg-indigo-100'
                      : 'bg-gray-100 group-hover:bg-indigo-50'
                }`}
              >
                <FileText
                  className={`h-5 w-5 transition-colors ${
                    isUnsaved
                      ? 'text-orange-500'
                      : isSelected
                        ? 'text-indigo-600'
                        : 'text-gray-500 group-hover:text-indigo-500'
                  }`}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-medium text-gray-900">
                    {cv.title || cv.name || `CV #${cv.id}`}
                  </h4>
                  {isUnsaved && (
                    <Badge
                      variant="outline"
                      className="border-orange-300 bg-orange-100 text-orange-700"
                    >
                      Unsaved
                    </Badge>
                  )}
                  {!isUnsaved && isRecent && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700"
                    >
                      New
                    </Badge>
                  )}
                  {isSelected && !isUnsaved && (
                    <Badge
                      variant="secondary"
                      className="animate-in fade-in bg-indigo-100 text-indigo-700 duration-200"
                    >
                      Selected
                    </Badge>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5 rounded-full bg-gray-100/80 px-2 py-1">
                    <Clock className="h-3 w-3" />
                    {formatRelativeTime(cv.updatedAt || cv.createdAt)}
                  </span>
                  {!isUnsaved && (
                    <span className="flex items-center gap-1.5 rounded-full bg-gray-100/80 px-2 py-1">
                      <FileText className="h-3 w-3" />
                      {cv.fileType || 'PDF'}
                    </span>
                  )}
                  {isUnsaved && (
                    <span className="flex items-center gap-1.5 rounded-full bg-orange-100 px-2 py-1 text-orange-600">
                      <Save className="h-3 w-3" />
                      Needs saving
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isUnsaved ? (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex h-8 items-center gap-1.5 border-orange-300 px-3 text-orange-600 transition-colors hover:bg-orange-100"
                        onClick={(e) => handleEditCv(cv.id || '', e)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-gray-900 text-xs">
                      Edit and save this CV
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                cv.url && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="flex h-8 items-center gap-1.5 px-3 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                          onClick={(e) => handlePreviewCv(cv.url!, e)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="left"
                        className="bg-gray-900 text-xs"
                      >
                        Open CV in new tab
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
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

          {!user ? (
            <div className="p-6 text-center">
              <div className="mb-6">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                  <User className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  Sign in to apply
                </h3>
                <p className="text-gray-600">
                  You need to sign in to your account to apply for this job.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleSignIn}
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUp}
                  variant="outline"
                  className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  Create Account
                </Button>
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Don&apos;t have an account? Create one to start applying for
                jobs.
              </p>
            </div>
          ) : (
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
                                <p className="text-xs text-gray-500">
                                  Full Name
                                </p>
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
                          CV/Resume
                        </AccordionTrigger>
                        <AccordionContent>
                          <FormField
                            control={form.control}
                            name="cvSource"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CV Source</FormLabel>
                                <Tabs
                                  defaultValue="upload"
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="w-full space-y-6"
                                >
                                  <TabsList className="grid w-full grid-cols-2 bg-indigo-50/50 p-1">
                                    <TabsTrigger
                                      value="upload"
                                      className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
                                    >
                                      <Paperclip className="mr-2 h-4 w-4" />
                                      Upload New CV
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="system"
                                      className="data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
                                    >
                                      <FileText className="mr-2 h-4 w-4" />
                                      Use Saved CV
                                    </TabsTrigger>
                                  </TabsList>
                                  <TabsContent
                                    value="upload"
                                    className="mt-4 space-y-4"
                                  >
                                    <FormField
                                      control={form.control}
                                      name="cvId"
                                      render={() => (
                                        <FormItem>
                                          <FormControl>
                                            <div className="space-y-3">
                                              {!cvFile ? (
                                                <div className="group rounded-lg border-2 border-dashed border-indigo-300 bg-white transition-all hover:border-indigo-400 hover:bg-indigo-50/50">
                                                  <FileUploader
                                                    bucket={
                                                      SupabaseBucket.CV_UPLOADS
                                                    }
                                                    folder={
                                                      SupabaseFolder.application
                                                    }
                                                    onFileSelect={
                                                      handleCvFileSelect
                                                    }
                                                    wrapperClassName="
                                                      flex
                                                      h-32
                                                      flex-col
                                                      items-center
                                                      justify-center
                                                      p-4
                                                      text-center
                                                      cursor-pointer
                                                      hover:bg-indigo-50
                                                      transition
                                                      duration-150
                                                      ease-in-out
                                                    "
                                                    buttonClassName="flex flex-col items-center"
                                                  >
                                                    <div className="rounded-full bg-indigo-100 p-3">
                                                      <Paperclip className="h-6 w-6 text-indigo-600" />
                                                    </div>
                                                    <p className="mt-2 font-medium text-indigo-600">
                                                      Click to upload or drag
                                                      and drop
                                                    </p>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                      PDF, DOC, or DOCX (max
                                                      5MB)
                                                    </p>
                                                  </FileUploader>
                                                </div>
                                              ) : (
                                                <div className="flex flex-col space-y-2 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
                                                  <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                      <div className="rounded-md bg-indigo-100 p-2">
                                                        <FileText className="h-4 w-4 text-indigo-600" />
                                                      </div>
                                                      <div className="flex flex-col">
                                                        <span className="text-sm font-medium text-gray-900">
                                                          {cvFileName}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                          {formatFileSize(
                                                            cvFile?.size,
                                                          )}
                                                        </span>
                                                      </div>
                                                    </div>
                                                    <Button
                                                      type="button"
                                                      variant="ghost"
                                                      className="h-8 w-8 p-0"
                                                      onClick={clearCvFile}
                                                    >
                                                      <Trash2 className="h-4 w-4 text-gray-500" />
                                                      <span className="sr-only">
                                                        Remove file
                                                      </span>
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}

                                              {cvFile && !isSubmitting && (
                                                <div className="text-sm text-indigo-600">
                                                  File selected and ready for
                                                  upload
                                                </div>
                                              )}
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </TabsContent>
                                  <TabsContent
                                    value="system"
                                    className="mt-4 space-y-4"
                                  >
                                    <FormField
                                      control={form.control}
                                      name="existingCvId"
                                      render={() => (
                                        <FormItem>
                                          <FormLabel>
                                            Select from your saved CVs
                                          </FormLabel>
                                          <FormControl>
                                            <div className="space-y-4">
                                              {unsavedCvsCount > 0 && (
                                                <Alert className="border-orange-200 bg-orange-50">
                                                  <AlertCircle className="h-4 w-4 text-orange-600" />
                                                  <AlertTitle className="text-orange-800">
                                                    {unsavedCvsCount} incomplete
                                                    CV
                                                    {unsavedCvsCount !== 1
                                                      ? 's'
                                                      : ''}
                                                  </AlertTitle>
                                                  <AlertDescription className="text-orange-700">
                                                    These CVs need to be edited
                                                    and saved before they can be
                                                    used for applications.
                                                    <span className="mt-1 block font-medium">
                                                      To complete: Edit the CV
                                                      and click the
                                                      &ldquo;save&rdquo; icon on
                                                      the right side of the CV
                                                      layout.
                                                    </span>
                                                  </AlertDescription>
                                                </Alert>
                                              )}

                                              {isLoadingCvs ? (
                                                <div className="flex items-center justify-center rounded-lg border border-dashed border-indigo-300 bg-white py-8">
                                                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                                                  <span className="ml-3 text-sm text-gray-600">
                                                    Loading your CVs...
                                                  </span>
                                                </div>
                                              ) : userCvs.length === 0 ? (
                                                <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-indigo-300 bg-white p-8 text-center transition-all hover:border-indigo-400">
                                                  <FileCheck className="h-12 w-12 text-indigo-600" />
                                                  <p className="mt-4 text-lg font-medium text-gray-900">
                                                    No saved CVs found
                                                  </p>
                                                  <p className="mt-2 text-sm text-gray-500">
                                                    Create a professional CV
                                                    using our CV Builder
                                                  </p>
                                                  <Button
                                                    type="button"
                                                    onClick={handleCreateCv}
                                                    className="mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
                                                  >
                                                    Create New CV
                                                  </Button>
                                                </div>
                                              ) : (
                                                <div className="space-y-4">
                                                  {/* Helper text for saved CVs */}
                                                  {userCvs.filter(
                                                    (cv) => !isUnsavedCV(cv),
                                                  ).length > 0 && (
                                                    <div className="flex items-start gap-2 rounded-md bg-blue-50 p-3 text-xs">
                                                      <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-blue-600" />
                                                      <div className="text-blue-700">
                                                        <span className="font-medium">
                                                          Tip:
                                                        </span>{' '}
                                                        Please review your CV
                                                        before submitting. If
                                                        you don&apos;t see
                                                        recent changes, click
                                                        the &ldquo;save&rdquo;
                                                        icon on the right side
                                                        of the CV layout to save
                                                        your data.
                                                      </div>
                                                    </div>
                                                  )}

                                                  <div className="grid gap-3 p-2">
                                                    {userCvs.map((cv) => (
                                                      <CVItem
                                                        key={cv.id}
                                                        cv={cv}
                                                      />
                                                    ))}
                                                  </div>

                                                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                                                    <p className="text-sm text-gray-600">
                                                      {userCvs.length} CV
                                                      {userCvs.length !== 1
                                                        ? 's'
                                                        : ''}{' '}
                                                      {userCvs.filter(
                                                        (cv) =>
                                                          !isUnsavedCV(cv),
                                                      ).length > 0 &&
                                                        `(${userCvs.filter((cv) => !isUnsavedCV(cv)).length} available)`}
                                                    </p>
                                                    <Button
                                                      type="button"
                                                      variant="outline"
                                                      onClick={handleCreateCv}
                                                      className="text-sm font-medium hover:bg-indigo-50 hover:text-indigo-600"
                                                    >
                                                      <FileText className="mr-1.5 h-4 w-4" />
                                                      Create New CV
                                                    </Button>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </TabsContent>
                                </Tabs>
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
                          English proficiency? (1 = Beginner, 10 = Fluent){' '}
                          <br />
                          2. Which position level are you applying for?
                          (Fresher, Junior, Standard, Standard++, Senior,
                          Senior++, or Lead)
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
                    disabled={isSubmitting || !isCvValid()}
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
