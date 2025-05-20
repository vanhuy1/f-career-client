'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  updateEmailSchema,
  changePasswordSchema,
  type UpdateEmailFormValues,
  type ChangePasswordFormValues,
} from '@/schemas/CandidateSettings';
import { userApi } from '@/app/(candidate)/_components/settings/api';
import type { UserProfile } from '@/types/CandidateSettings';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'react-toastify';

export default function LoginDetailsPage() {
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: 'jakegyll@email.com',
    isEmailVerified: true,
  });

  // Loading states
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Email update form
  const emailForm = useForm<UpdateEmailFormValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: {
      newEmail: '',
    },
  });

  // Password change form
  const passwordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  // Handle email update submission
  const handleUpdateEmail = async (data: UpdateEmailFormValues) => {
    try {
      setIsUpdatingEmail(true);
      const response = await userApi.updateEmail(data);

      if (response.success && response.data) {
        setUserProfile({
          email: response.data.email,
          isEmailVerified: response.data.isEmailVerified,
        });
        emailForm.reset();
        toast.success('Success', {});
      } else {
        toast.error('Error', {});
      }
    } catch (error) {
      toast.error(error as string, {});
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  // Handle password change submission
  const handleChangePassword = async (data: ChangePasswordFormValues) => {
    try {
      setIsChangingPassword(true);
      const response = await userApi.changePassword(data);

      if (response.success && response.data) {
        passwordForm.reset();
        toast.success('Success', {});
      } else {
        toast.error('Error', {});
      }
    } catch (error) {
      toast.error(error as string, {});
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div>
      <section className="py-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Basic Information
        </h2>
        <p className="mt-1 text-gray-600">
          This is login information that you can update anytime.
        </p>
        <div className="mt-4 border-t border-gray-200"></div>
      </section>

      <section className="py-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">Update Email</h3>
            <p className="mt-1 text-gray-600">
              Update your email address to
              <br />
              make sure it is safe
            </p>
          </div>
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-gray-900">{userProfile.email}</span>
              {userProfile.isEmailVerified && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="mb-4 text-sm text-gray-500">
              {userProfile.isEmailVerified
                ? 'Your email address is verified.'
                : 'Please verify your email address.'}
            </p>

            <Form {...emailForm}>
              <form
                onSubmit={emailForm.handleSubmit(handleUpdateEmail)}
                className="space-y-4"
              >
                <FormField
                  control={emailForm.control}
                  name="newEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">
                        Update Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your new email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={isUpdatingEmail}
                >
                  {isUpdatingEmail && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Update Email
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200"></div>
      </section>

      <section className="py-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">New Password</h3>
            <p className="mt-1 text-gray-600">
              Manage your password to make
              <br />
              sure it is safe
            </p>
          </div>
          <div className="flex-1">
            <Form {...passwordForm}>
              <form
                onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                className="space-y-6"
              >
                <FormField
                  control={passwordForm.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">
                        Old Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your old password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Minimum 8 characters
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium text-gray-700">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your new password"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Minimum 8 characters
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="bg-indigo-600 text-white hover:bg-indigo-700"
                  disabled={isChangingPassword}
                >
                  {isChangingPassword && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Change Password
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <div className="mt-6 border-t border-gray-200"></div>
      </section>

      <div className="flex justify-end py-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-red-500 hover:text-red-700"
          onClick={() =>
            confirm(
              'Are you sure you want to close your account? This action cannot be undone.',
            )
          }
        >
          Close Account
          <AlertCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
