'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import type { z } from 'zod';
import { ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import { ProfileFormSchema } from '@/schemas/CandidateSettings';
import { useDispatch } from 'react-redux';
import {
  updateUserFailure,
  updateUserSuccess,
  useUser,
} from '@/services/state/userSlice';
import { userService } from '@/services/api/auth/user-api';

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const user = useUser();
  const [formattedDob, setFormattedDob] = useState('');

  // Define form with react-hook-form and zod validation
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user?.data.name,
      phone: user?.data.phone,
      email: user?.data.email,
      dob: user?.data.dob ? new Date(user.data.dob).toISOString() : '',
      gender: user?.data.gender,
      avatar: user?.data.avatar || '',
    },
  });

  // Format the date for display
  useEffect(() => {
    if (form.watch('dob')) {
      try {
        const date = new Date(form.watch('dob'));
        if (!isNaN(date.getTime())) {
          setFormattedDob(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }
  }, [form.watch('dob')]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    try {
      // If it's a valid date string, convert to ISO
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        form.setValue('dob', date.toISOString());
        setFormattedDob(value);
      } else {
        // Keep the input value as is for user typing
        setFormattedDob(value);
      }
    } catch (error) {
      setFormattedDob(value);
      console.error('Invalid date format:', error);
    }
  };

  const onSubmit = async (data: z.infer<typeof ProfileFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Map form data to ProfileUpdateRequest DTO
      const requestData = {
        name: data.name,
        phone: data.phone,
        email: data.email,
        gender: data.gender,
        dob: data.dob, // ISO string
      };

      // Call API to update profile
      const response = await userService.updateMe(requestData);

      toast.success('Success', {});
      dispatch(updateUserSuccess(response));
    } catch (error) {
      toast.error('Error failed', {});
      dispatch(updateUserFailure(error as string));
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
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Full Name
            </Label>
            <Input id="name" {...form.register('name')} className="mt-1" />
            {form.formState.errors.name && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="col-span-1"></div>

          <div className="col-span-1">
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Phone Number
            </Label>
            <Input id="phone" {...form.register('phone')} className="mt-1" />
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.phone.message}
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
              htmlFor="dob"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Date of Birth
            </Label>
            <div className="mt-1">
              <Input
                id="dob"
                type="date"
                value={formattedDob}
                onChange={handleDateChange}
                className="w-full"
              />
            </div>
            {form.formState.errors.dob && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.dob.message}
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
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
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
