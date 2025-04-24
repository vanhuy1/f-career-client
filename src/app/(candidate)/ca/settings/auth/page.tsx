'use client';

import type React from 'react';

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginDetailsPage() {
  const [email, setEmail] = useState('jakegyll@email.com');
  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(true);

  const handleUpdateEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail) {
      setEmail(newEmail);
      setNewEmail('');
      setIsEmailVerified(false);
      // In a real app, you would send verification email here
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword && newPassword && newPassword.length >= 8) {
      // In a real app, you would verify old password and update to new password
      setOldPassword('');
      setNewPassword('');
      alert('Password updated successfully');
    }
  };

  return (
    <div className="py-6">
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
              <span className="text-gray-900">{email}</span>
              {isEmailVerified && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
            <p className="mb-4 text-sm text-gray-500">
              {isEmailVerified
                ? 'Your email address is verified.'
                : 'Please verify your email address.'}
            </p>

            <form onSubmit={handleUpdateEmail}>
              <h4 className="mb-2 text-base font-medium text-gray-700">
                Update Email
              </h4>
              <Input
                placeholder="Enter your new email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mb-4"
              />
              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Update Email
              </Button>
            </form>
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
            <form onSubmit={handleChangePassword}>
              <div className="mb-6">
                <h4 className="mb-2 text-base font-medium text-gray-700">
                  Old Password
                </h4>
                <Input
                  placeholder="Enter your old password"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mb-1"
                />
                <p className="text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <div className="mb-6">
                <h4 className="mb-2 text-base font-medium text-gray-700">
                  New Password
                </h4>
                <Input
                  placeholder="Enter your new password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mb-1"
                />
                <p className="text-xs text-gray-500">Minimum 8 characters</p>
              </div>

              <Button
                type="submit"
                className="bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Change Password
              </Button>
            </form>
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
