'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignUpRequest, signUpRequestSchema } from '@/schemas/Auth';
import { CompanyInfoModal } from './CompanyInfoModal';

export const HRSignUpForm = () => {
  const [openModal, setOpenModal] = useState(false);
  const [hrData, setHrData] = useState<SignUpRequest | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpRequest>({
    resolver: zodResolver(signUpRequestSchema),
  });

  const handleNext = (data: SignUpRequest) => {
    setHrData(data);
    setOpenModal(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleNext)} className="space-y-4">
        <h1 className="text-2xl font-bold">HR Sign Up</h1>

        <div>
          <label htmlFor="name" className="block text-sm font-medium">
            Full Name
          </label>
          <Input id="name" {...register('name')} placeholder="HR Full Name" />
          {errors.name && (
            <p className="text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            {...register('username')}
            placeholder="Username"
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email HR Company
          </label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="Email Address"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            {...register('password')}
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-sm text-red-500">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          Next: Add Company Info
        </Button>
      </form>

      <CompanyInfoModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        hrData={hrData}
      />
    </>
  );
};
