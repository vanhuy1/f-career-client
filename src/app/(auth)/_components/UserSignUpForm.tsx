'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { type SignUpRequest, signUpRequestSchema } from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { CompanyInfoModal } from './CompanyInfoModal';
import { toast } from 'react-toastify';
import {
  User,
  Building2,
  Mail,
  Lock,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

interface UserSignUpFormProps {
  isCompany?: boolean;
}

export const UserSignUpForm = ({ isCompany = false }: UserSignUpFormProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState<SignUpRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpRequestSchema),
    mode: 'onChange',
  });

  const handleRegisterClick = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    setIsLoading(true);
    const data = getValues();

    if (isCompany) {
      // For company registration, open the modal to collect additional company info
      setUserData({ ...data, roles: ['ADMIN_RECRUITER'] });
      setOpenModal(true);
      setIsLoading(false);
      return;
    }

    try {
      // For job seeker registration, assign the role USER and call the API
      const userDataWithRole = { ...data, roles: ['USER'] };
      await authService.signUp(userDataWithRole);
      toast.success(
        'Registration successful! Please check your email to verify your account.',
      );
    } catch (error) {
      toast.error(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
            {isCompany ? (
              <Building2 className="h-6 w-6 text-white" />
            ) : (
              <User className="h-6 w-6 text-white" />
            )}
          </div>
          <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
            {isCompany ? 'Create Company Account' : 'Get More Opportunities'}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {isCompany
              ? 'Set up your company profile to start hiring'
              : 'Join thousands of professionals finding their dream jobs'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <User className="h-4 w-4" />
                {isCompany ? 'HR Full Name' : 'Full Name'}
              </Label>
              <Input
                id="name"
                placeholder={`Enter your ${isCompany ? 'HR ' : ''}full name`}
                className={`transition-all duration-200 ${
                  errors.name
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('name')}
              />
              {errors.name && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.name.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <UserCheck className="h-4 w-4" />
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                className={`transition-all duration-200 ${
                  errors.username
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('username')}
              />
              {errors.username && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.username.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Mail className="h-4 w-4" />
                {isCompany ? 'Company HR Email' : 'Email Address'}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                className={`transition-all duration-200 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.email.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className={`transition-all duration-200 ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('password')}
              />
              {errors.password && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.password.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <Button
            type="button"
            className="w-full transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-blue-900 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleRegisterClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Processing...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                {isCompany ? 'Next: Add Company Info' : 'Create Account'}
                <ArrowRight className="h-4 w-4" />
              </div>
            )}
          </Button>

          {isCompany && (
            <p className="mt-4 text-center text-xs text-gray-500">
              You&apos;ll be able to add company details in the next step
            </p>
          )}
        </CardContent>
      </Card>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/signin"
            className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
          >
            Sign in here
          </Link>
        </p>
      </div>

      {isCompany && (
        <CompanyInfoModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          hrData={userData}
        />
      )}
    </div>
  );
};
