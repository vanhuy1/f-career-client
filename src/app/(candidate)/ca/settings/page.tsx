'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import type { z } from 'zod';
import { Calendar, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { updateProfile } from '@/app/(candidate)/_components/settings/user-info/api';
import { ProfileFormSchema } from '@/schemas/CandidateSettings';
import type { ProfileUpdateRequest } from '@/types/CandidateSettings';

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Define form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      fullName: 'Jake Gyll',
      phoneNumber: '+44 1245 572 135',
      email: 'Jakegyll@gmail.com',
      dateOfBirth: '09/08/1997',
      gender: 'Male',
      accountType: 'jobSeeker',
    },
  });

  const onSubmit = async (data: z.infer<typeof ProfileFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Create request DTO from form data
      const requestData: ProfileUpdateRequest = {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        accountType: data.accountType,
      };

      // Call API to update profile
      const response = await updateProfile(requestData);

      toast.success('Success', {});

      console.log('Profile updated:', response);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error failed', {});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <section className="py-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="mt-1 text-gray-600">
          This is your personal information that you can update anytime.
        </p>
        <div className="mt-4 border-t border-gray-200"></div>
      </section>

      <section className="py-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>
            <p className="mt-1 text-gray-600">
              This image will be shown publicly
              <br />
              as your profile picture, it will
              <br />
              help recruiters recognize you!
            </p>
          </div>
          <div className="flex flex-1 items-start gap-6">
            <div className="relative">
              <Image
                src="/Auth/authbg-bear.jpg"
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>
            <div className="flex h-36 w-60 flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 p-6 text-center">
              <ImageIcon className="h-6 w-6 text-indigo-600" />
              <p className="mt-2 font-medium text-indigo-600">
                Click to replace
              </p>
              <p className="mt-1 text-sm text-gray-500">or drag and drop</p>
              <p className="mt-1 text-xs text-gray-500">
                SVG, PNG, JPG or GIF (max. 400 x 400px)
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200"></div>
      </section>

      <section className="py-6">
        <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div className="col-span-1">
            <Label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Full Name
            </Label>
            <Input
              id="fullName"
              {...form.register('fullName')}
              className="mt-1"
            />
            {form.formState.errors.fullName && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="col-span-1"></div>

          <div className="col-span-1">
            <Label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
              {...form.register('phoneNumber')}
              className="mt-1"
            />
            {form.formState.errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Date of Birth
            </Label>
            <div className="relative mt-1">
              <Input
                id="dateOfBirth"
                {...form.register('dateOfBirth')}
                className="pr-10"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            {form.formState.errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.dateOfBirth.message}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <Label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Gender
            </Label>
            <Select
              value={form.watch('gender')}
              onValueChange={(value) => form.setValue('gender', value)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Prefer not to say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.gender && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.gender.message}
              </p>
            )}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200"></div>
      </section>

      <section className="py-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Account Type</h3>
            <p className="mt-1 text-gray-600">
              You can update your account type
            </p>
          </div>
          <div className="flex-1">
            <RadioGroup
              value={form.watch('accountType')}
              onValueChange={(value) =>
                form.setValue(
                  'accountType',
                  value === 'jobSeeker' ? 'jobSeeker' : 'employer',
                )
              }
              className="space-y-6"
            >
              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="jobSeeker"
                  id="jobSeeker"
                  className="mt-1"
                />
                <div>
                  <Label
                    htmlFor="jobSeeker"
                    className="text-base font-medium text-gray-900"
                  >
                    Job Seeker
                  </Label>
                  <p className="text-sm text-gray-500">Looking for a job</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <RadioGroupItem
                  value="employer"
                  id="employer"
                  className="mt-1"
                />
                <div>
                  <Label
                    htmlFor="employer"
                    className="text-base font-medium text-gray-900"
                  >
                    Employer
                  </Label>
                  <p className="text-sm text-gray-500">
                    Hiring, sourcing candidates, or posting a jobs
                  </p>
                </div>
              </div>
            </RadioGroup>
            {form.formState.errors.accountType && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.accountType.message}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8 flex justify-end">
        <Button
          type="submit"
          className="bg-indigo-600 px-8 text-white hover:bg-indigo-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Profile'
          )}
        </Button>
      </div>
    </form>
  );
}
