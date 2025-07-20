'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Building,
  Shield,
  User as UserIcon,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { userManagementService } from '@/services/api/admin/user-mgm.api';
import { User } from '@/types/admin/UserManagement';

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userManagementService.getUserDetail(userId);
      setUser(userData);
    } catch (err) {
      setError('Failed to fetch user details');
      console.error('Error fetching user details:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      fetchUserDetail();
    }
  }, [userId, fetchUserDetail]);

  const handleStatusChange = async (newStatus: 'active' | 'disabled') => {
    if (!user) return;

    try {
      const isAccountDisabled = newStatus === 'disabled';
      await userManagementService.updateUserStatus({
        id: userId,
        isAccountDisabled,
      });

      // Update local state
      setUser((prevUser) =>
        prevUser
          ? {
              ...prevUser,
              isAccountDisabled,
            }
          : null,
      );
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Failed to update user status');
    }
  };

  const getStatusBadge = (isDisabled: boolean) => {
    if (isDisabled) {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Disabled
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Active
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading user details...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="p-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/ad/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error || 'User not found'}</span>
            </div>
            <Button
              onClick={fetchUserDetail}
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push('/ad/users')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Users
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="mt-2 text-gray-600">
              View and manage user information
            </p>
          </div>
          <div className="flex gap-2">
            {!user.isAccountDisabled ? (
              <Button
                variant="destructive"
                onClick={() => handleStatusChange('disabled')}
              >
                Disable Account
              </Button>
            ) : (
              <Button
                variant="default"
                onClick={() => handleStatusChange('active')}
              >
                Enable Account
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Profile Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="mb-4 h-24 w-24">
                <AvatarImage src={user.avatar || '/placeholder.svg'} />
                <AvatarFallback className="text-lg">
                  {user.name
                    .split(' ')
                    .map((n: string) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">@{user.username}</p>
              <div className="mt-2">
                {getStatusBadge(user.isAccountDisabled)}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-gray-600">{user.phone}</p>
                  </div>
                </div>
              )}

              {user.dob && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Date of Birth</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(user.dob)}
                    </p>
                  </div>
                </div>
              )}

              {user.companyId && (
                <div className="flex items-center gap-3">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Company ID</p>
                    <p className="text-sm text-gray-600">{user.companyId}</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Detailed Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-sm">{user.name}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Username
                  </label>
                  <p className="text-sm">@{user.username}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Email Address
                  </label>
                  <p className="text-sm">{user.email}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Gender
                  </label>
                  <p className="text-sm">{user.gender || 'Not specified'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Phone Number
                  </label>
                  <p className="text-sm">{user.phone || 'Not provided'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Date of Birth
                  </label>
                  <p className="text-sm">
                    {user.dob ? formatDate(user.dob) : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div>
              <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
                <Shield className="h-5 w-5" />
                Account Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    User ID
                  </label>
                  <p className="text-sm">{user.id}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Account Status
                  </label>
                  <div>{getStatusBadge(user.isAccountDisabled)}</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Roles
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Company ID
                  </label>
                  <p className="text-sm">
                    {user.companyId || 'Not associated'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Member Since
                  </label>
                  <p className="text-sm">{formatDateTime(user.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Last Updated
                  </label>
                  <p className="text-sm">{formatDateTime(user.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
