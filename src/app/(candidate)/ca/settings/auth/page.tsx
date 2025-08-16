'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  updateEmailSchema,
  changePasswordSchema,
  type UpdateEmailFormValues,
  type ChangePasswordFormValues,
} from '@/schemas/CandidateSettings';
import { userApi } from '@/app/(candidate)/_components/settings/api';
import { userService } from '@/services/api/auth/user-api';
import type { UserProfile } from '@/types/CandidateSettings';
import { useUser } from '@/services/state/userSlice';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { PasswordStrengthMeter } from '@/components/ui/password-strength-meter';
import { toast } from 'react-toastify';

export default function LoginDetailsPage() {
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({
    email: 'jakegyll@email.com',
    isEmailVerified: true,
  });
  const user = useUser();

  // Loading states
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = passwordForm.watch('newPassword', '');

  // Check if user signed in with Google OAuth
  const isGoogleUser = user?.data?.provider === 'google';

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

      const response = await userService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      });

      if (response) {
        passwordForm.reset();
        toast.success('Password updated successfully!');
      } else {
        toast.error('Failed to update password');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (
        errorMessage.includes('current password') ||
        errorMessage.includes('incorrect')
      ) {
        toast.error('Current password is incorrect. Please try again.');
      } else {
        toast.error(`Failed to update password: ${errorMessage}`);
      }
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
            <h3 className="text-lg font-medium text-gray-900">
              Change Password
            </h3>
            <p className="mt-1 text-gray-600">
              Update your password to keep
              <br />
              your account secure
            </p>
          </div>
          <div className="flex-1">
            {isGoogleUser ? (
              /* Google OAuth User - Show Information Message */
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-blue-900">
                      Google Account Sign-In
                    </h4>
                    <p className="mt-1 text-sm text-blue-800">
                      You signed in with Google, so your password is managed by
                      Google. To change your password, please visit your Google
                      Account settings.
                    </p>
                    <div className="mt-4">
                      <a
                        href="https://myaccount.google.com/security"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                      >
                        <Lock className="h-4 w-4" />
                        Change Password on Google
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Regular User - Show Password Change Form */
              <Form {...passwordForm}>
                <form
                  onSubmit={passwordForm.handleSubmit(handleChangePassword)}
                  className="space-y-6"
                >
                  {/* Current Password Field */}
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-700">
                          <Lock className="h-4 w-4" />
                          Current Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your current password"
                              type={showCurrentPassword ? 'text' : 'password'}
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label={
                                showCurrentPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* New Password Field */}
                  <FormField
                    control={passwordForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-700">
                          <Lock className="h-4 w-4" />
                          New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Enter your new password"
                              type={showNewPassword ? 'text' : 'password'}
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label={
                                showNewPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showNewPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Strength Meter */}
                  {newPasswordValue && (
                    <div className="rounded-lg border bg-gray-50 p-4">
                      <PasswordStrengthMeter password={newPasswordValue} />
                    </div>
                  )}

                  {/* Confirm Password Field */}
                  <FormField
                    control={passwordForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-medium text-gray-700">
                          <Lock className="h-4 w-4" />
                          Confirm New Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Confirm your new password"
                              type={showConfirmPassword ? 'text' : 'password'}
                              className="pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                              aria-label={
                                showConfirmPassword
                                  ? 'Hide password'
                                  : 'Show password'
                              }
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
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
                    Update Password
                  </Button>
                </form>
              </Form>
            )}
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
