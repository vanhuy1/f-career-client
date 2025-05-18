'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignUpRequest, signUpRequestSchema } from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { CompanyInfoModal } from './CompanyInfoModal';
import { toast } from 'react-toastify';

interface UserSignUpFormProps {
  isCompany?: boolean;
}

export const UserSignUpForm = ({ isCompany = false }: UserSignUpFormProps) => {
  const [openModal, setOpenModal] = useState(false);
  const [userData, setUserData] = useState<SignUpRequest | null>(null);

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpRequestSchema),
  });

  const handleRegisterClick = async () => {
    const data = getValues();

    if (isCompany) {
      // For company registration, open the modal to collect additional company info
      setUserData({ ...data, roles: ['ADMIN_RECRUITER'] });
      setOpenModal(true);
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
    }
  };

  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold">
        {isCompany ? 'Create Company Account' : 'Get more opportunities'}
      </h1>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {isCompany ? 'HR Full Name' : 'Full name'}
          </label>
          <Input
            id="name"
            placeholder={`Enter your ${isCompany ? 'HR ' : ''}full name`}
            className="w-full"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Username
          </label>
          <Input
            id="username"
            placeholder="Enter your username"
            className="w-full"
            {...register('username')}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-600">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            {isCompany ? 'Email HR Company' : 'Email Address'}
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email address"
            className="w-full"
            {...register('email')}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full"
            {...register('password')}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="button"
        className="w-full bg-indigo-600 hover:bg-indigo-700"
        onClick={handleRegisterClick}
      >
        {isCompany ? 'Next: Add Company Info' : 'Continue'}
      </Button>

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
