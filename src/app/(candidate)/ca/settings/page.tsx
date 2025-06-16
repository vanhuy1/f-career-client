'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import type { z } from 'zod';
import { ImageIcon, Loader2 } from 'lucide-react';

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

import FileUploader from '@/components/common/FileUploader';
import { SupabaseBucket, SupabaseFolder } from '@/enums/supabase';
import Image from 'next/image';

const countryCodes = [
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

export default function SettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const user = useUser();
  const [formattedDob, setFormattedDob] = useState('');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+84');

  // Set up React Hook Form with Zod
  const form = useForm<z.infer<typeof ProfileFormSchema>>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      name: user?.data.name,
      phone: user?.data.phone?.replace(/^\+84/, '') || '',
      email: user?.data.email,
      dob: user?.data.dob ? new Date(user.data.dob).toISOString() : '',
      gender: user?.data.gender,
      avatar: user?.data.avatar || '',
    },
  });

  // Whenever the raw ISO dob changes, format for the <input type="date">
  useEffect(() => {
    const raw = form.watch('dob');
    if (raw) {
      try {
        const date = new Date(raw);
        if (!isNaN(date.getTime())) {
          setFormattedDob(date.toISOString().split('T')[0]); // "YYYY-MM-DD"
        }
      } catch {
        // ignore formatting errors
      }
    }
  }, [form.watch('dob')]);

  // Handler for the date picker
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // e.g. "2025-06-02"
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        // Convert to ISO before storing in RHF
        form.setValue('dob', date.toISOString());
        setFormattedDob(value);
      } else {
        // If the user is still typing / not a full date yet
        setFormattedDob(value);
      }
    } catch {
      setFormattedDob(value);
    }
  };

  const onSubmit = async (data: z.infer<typeof ProfileFormSchema>) => {
    try {
      setIsSubmitting(true);

      // Remove any non-digit characters from phone number
      const cleanPhone = data.phone.replace(/\D/g, '');

      const requestData = {
        name: data.name,
        phone: selectedCountryCode + cleanPhone,
        email: data.email,
        gender: data.gender,
        dob: data.dob,
        avatar: data.avatar,
      };

      const response = await userService.updateMe(requestData);
      toast.success('Profile updated successfully');
      dispatch(updateUserSuccess(response));
    } catch (error) {
      toast.error('Failed to update profile');
      dispatch(updateUserFailure(error as string));
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentAvatar =
    form.watch('avatar') || user?.data.avatar || '/Auth/authbg-bear.jpg';

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* ————— Basic Information Header ————— */}
      <section className="py-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="mt-1 text-gray-600">
          This is your personal information that you can update anytime.
        </p>
        <div className="mt-4 border-t border-gray-200"></div>
      </section>

      {/* ————— Profile Photo Section ————— */}
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
            {/* Current avatar preview */}
            <div className="relative">
              <Image
                src={currentAvatar}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full object-cover"
              />
            </div>

            {/* FileUploader replaces the static dashed box */}
            <FileUploader
              bucket={SupabaseBucket.USER_SETTINGS}
              folder={SupabaseFolder.USER_SETTINGS}
              onComplete={(url) => {
                form.setValue('avatar', url);
              }}
              wrapperClassName="
                flex
                h-36
                w-60
                flex-col
                items-center
                justify-center
                rounded-lg
                border-2
                border-dashed
                border-indigo-300
                p-6
                text-center
                hover:border-indigo-400
                transition
                duration-150
                ease-in-out
              "
              buttonClassName="flex flex-col items-center"
            >
              {/* All of this is the "children" inside the clickable area */}
              <ImageIcon className="h-6 w-6 text-indigo-600" />
              <p className="mt-2 font-medium text-indigo-600">
                Click to replace
              </p>
              <p className="mt-1 text-sm text-gray-500">or drag and drop</p>
              <p className="mt-1 text-xs text-gray-500">
                SVG, PNG, JPG or GIF (max. 400 x 400px)
              </p>
            </FileUploader>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200"></div>
      </section>

      {/* ————— Personal Details Section ————— */}
      <section className="py-6">
        <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          {/* Full Name */}
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

          {/* Phone Number */}
          <div className="col-span-1">
            <Label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 after:ml-0.5 after:text-red-500 after:content-['*']"
            >
              Phone Number
            </Label>
            <div className="mt-1 flex gap-2">
              <Select
                value={selectedCountryCode}
                onValueChange={setSelectedCountryCode}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Select country">
                    {selectedCountryCode && (
                      <span className="flex items-center gap-2">
                        {
                          countryCodes.find(
                            (c) => c.code === selectedCountryCode,
                          )?.flag
                        }
                        <span className="ml-1">{selectedCountryCode}</span>
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {countryCodes.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <span className="flex items-center gap-2">
                        {country.flag}
                        <span className="ml-1">{country.code}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                {...form.register('phone', {
                  onChange: (e) => {
                    // Only allow digits
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = value;
                    form.setValue('phone', value, {
                      shouldValidate: true,
                      shouldDirty: true,
                      shouldTouch: true,
                    });
                  },
                  setValueAs: (value) => value.replace(/\D/g, ''),
                })}
                className="flex-1"
                placeholder="Enter phone number (digits only)"
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            {form.formState.errors.phone && (
              <p className="mt-1 text-sm text-red-500">
                {form.formState.errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
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

          {/* Date of Birth */}
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

          {/* Gender */}
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

      {/* ————— Save Button ————— */}
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
