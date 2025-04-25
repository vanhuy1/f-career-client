'use client';

import type React from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CompanyInfoFormValues,
  companyInfoSchema,
  SignUpRequest,
} from '@/schemas/Auth';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Props {
  open: boolean;
  onClose: () => void;
  hrData: SignUpRequest | null;
}

export const CompanyInfoModal: React.FC<Props> = ({
  open,
  onClose,
  hrData,
}) => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: '',
      company_website: '',
      tax_code: '',
      business_license_url: '',
      company_email: '',
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    setTimeout(() => {
      const mockUploadedUrl = `https://storage.example.com/${file.name}`;
      setValue('business_license_url', mockUploadedUrl);
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      setIsUploading(false);
    }, 1000);
  };

  const removeUploadedFile = () => {
    setFilePreview(null);
    setUploadedFile(null);
    setValue('business_license_url', '');
  };

  const onSubmit = async (companyData: CompanyInfoFormValues) => {
    try {
      // map api here
      const fullData = {
        ...hrData,
        ...companyData,
        role: 'RECRUITER',
      };

      console.log('Company Data:', fullData);
      // await authService.signUp(fullData)
      setSubmittedEmail(companyData.company_email);
      setIsSubmitted(true);
      toast.success('Company account created successfully!');
    } catch (error) {
      toast.error(`Error: ${error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        {isSubmitted ? (
          <div className="py-8 text-center">
            <h2 className="text-lg font-semibold">
              Thank you for registering!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We’ve received your company info. You’ll get an email at{' '}
              <strong>{submittedEmail}</strong> once the process is complete.
            </p>
            <div className="mt-4">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Company Information
              </DialogTitle>
              <DialogDescription>
                Please provide your company details to complete registration
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="company_name" className="font-medium">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  {...register('company_name')}
                  placeholder="Enter your company name"
                  className="w-full"
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.company_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_email" className="font-medium">
                  Company Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_email"
                  {...register('company_email')}
                  placeholder="e.g. contact@company.com"
                  className="w-full"
                />
                {errors.company_email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.company_email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_website" className="font-medium">
                  Company Website <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_website"
                  {...register('company_website')}
                  placeholder="https://yourcompany.com"
                  className="w-full"
                />
                {errors.company_website && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.company_website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_code" className="font-medium">
                  Tax Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="tax_code"
                  {...register('tax_code')}
                  placeholder="Enter your tax code"
                  className="w-full"
                />
                {errors.tax_code && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.tax_code.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="business_license" className="font-medium">
                  Business License
                </Label>

                {!filePreview ? (
                  <div className="mt-1">
                    <Label
                      htmlFor="business_license_upload"
                      className="flex h-32 w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-white px-4 transition hover:border-gray-400 focus:outline-none"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="h-6 w-6 text-gray-500" />
                        <span className="font-medium text-gray-600">
                          Click to upload business license
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, JPG, PNG up to 5MB
                        </span>
                      </div>
                      <input
                        id="business_license_upload"
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                    </Label>
                  </div>
                ) : (
                  <div className="relative mt-2 rounded-md border border-gray-200 bg-gray-50 p-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-gray-100">
                        {filePreview.startsWith('data:image') ? (
                          <Image
                            src={filePreview || '/placeholder.svg'}
                            alt="License preview"
                            width={32}
                            height={32}
                            className="rounded object-cover"
                          />
                        ) : (
                          <div className="text-xs text-gray-500">File</div>
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">
                          {uploadedFile?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {uploadedFile &&
                            (uploadedFile.size / 1024).toFixed(2)}{' '}
                          KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={removeUploadedFile}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting
                    ? 'Creating Account...'
                    : 'Create Company Account'}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
