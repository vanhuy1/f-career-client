'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { authService } from '@/services/api/auth/auth-api';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<CompanyInfoFormValues>({
    resolver: zodResolver(companyInfoSchema),
    defaultValues: {
      company_name: '',
      company_website: '',
      taxCode: '',
      company_email: '',
    },
  });

  const handleRegisterClick = async () => {
    try {
      if (
        !hrData?.email ||
        !hrData?.password ||
        !hrData?.name ||
        !hrData?.username
      ) {
        throw new Error('Missing required registration data');
      }

      const companyData = getValues();
      const fullData = {
        email: hrData.email,
        password: hrData.password,
        name: hrData.name,
        username: hrData.username,
        taxCode: companyData.taxCode,
        companyName: companyData.company_name,
        companyWebsite: companyData.company_website,
        companyEmail: companyData.company_email,
        roles: ['ADMIN_RECRUITER'],
      };

      setIsSubmitting(true);
      const response = await authService.registerCompany(fullData);
      setSubmittedEmail(companyData.company_email);
      setIsSubmitted(true);
      toast.success(response.message);
    } catch (error) {
      toast.error(`${error}`);
    } finally {
      setIsSubmitting(false);
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
              We’ve received your company information. Please check your email
              at <strong>{submittedEmail}</strong> to verify your account.
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
                Please provide your company details to complete registration.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-4">
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
                <Label htmlFor="taxCode" className="font-medium">
                  Tax Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="taxCode"
                  {...register('taxCode')}
                  placeholder="Enter your tax code"
                  className="w-full"
                />
                {errors.taxCode && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.taxCode.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-emerald-600 text-white hover:bg-emerald-700"
                onClick={handleRegisterClick}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
