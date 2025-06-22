'use client';

import type React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Save,
  Camera,
  Briefcase,
  Building,
  Edit,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type {
  CandidateProfile,
  updateProfileHeaderRequestDto,
} from '@/types/CandidateProfile';
import { candidateProfileService } from '@/services/api/profile/ca-api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  updateCaProfileFailure,
  updateCaProfileStart,
  updateCaProfileSuccess,
  useCaProfileLoading,
} from '@/services/state/caProfileSlice';
import { LoadingState } from '@/store/store.model';
import { useUser } from '@/services/state/userSlice';
interface ProfileHeaderProps {
  profile: CandidateProfile | null;
  onProfileUpdate?: (updatedProfile: Partial<CandidateProfile>) => void;
}

export function ProfileHeader({
  profile,
  onProfileUpdate,
}: ProfileHeaderProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    title: profile?.title,
    company: profile?.company,
    location: profile?.location,
    isOpenToOpportunities: profile?.isOpenToOpportunities,
  });

  const dispatch = useDispatch();
  const loadingState = useCaProfileLoading();
  const errors = useCaProfileLoading();
  const user = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setEditedProfile((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setEditedProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setEditedProfile((prev) => ({
      ...prev,
      isOpenToOpportunities: checked,
    }));
  };

  const handleSave = async () => {
    try {
      dispatch(updateCaProfileStart());
      // Prepare the request payload
      const payload: updateProfileHeaderRequestDto = {
        title: editedProfile.title || null,
        company: editedProfile.company || null,
        location: editedProfile.location || null,
        isOpenToOpportunities: editedProfile.isOpenToOpportunities || false,
      };

      // Call the API service
      await candidateProfileService.updateProfileHeader(payload);
      dispatch(updateCaProfileSuccess());
      // If successful, update the local state via the callback
      if (onProfileUpdate) {
        onProfileUpdate(editedProfile);
      }

      toast.success('Profile updated successfully!', {});

      setIsDialogOpen(false);
    } catch (error) {
      dispatch(updateCaProfileFailure(error as string));
      toast.error(`Failed to update profile. Please try again. ${errors}`, {});
    }
  };

  const handleDialogOpen = (open: boolean) => {
    if (open) {
      // Reset form when opening
      setEditedProfile({
        title: profile?.title,
        company: profile?.company,
        location: profile?.location,
        isOpenToOpportunities: profile?.isOpenToOpportunities,
      });
    }
    setIsDialogOpen(open);
  };

  return (
    <Card className="mb-6 overflow-hidden rounded-xl border-0 bg-white p-0">
      <div className="relative m-0 h-50 w-full rounded-t-xl bg-gradient-to-r from-blue-800 via-blue-900 to-blue-950 p-0">
        <Image
          src={
            '/placeholder.svg?height=400&width=1200&query=abstract professional profile cover'
          }
          alt="Cover"
          fill
          className="h-full w-full object-cover opacity-90"
          priority
        />
        <div className="absolute right-4 bottom-4 flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="h-9 gap-1.5 bg-white/90 px-3 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm hover:bg-white"
          >
            <Camera className="h-4 w-4" />
            Change Cover
          </Button>
        </div>
      </div>
      <CardContent className="relative px-6 pt-0 pb-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end">
          <div className="relative -mt-24 flex-shrink-0">
            <div className="group relative h-40 w-40 overflow-hidden rounded-full border-4 border-white bg-white shadow-md transition-all">
              <Image
                src={
                  user?.data.avatar ??
                  '/placeholder.svg?height=160&width=160&query=avatar'
                }
                alt={`${profile?.name}'s profile picture`}
                width={160}
                height={160}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-white/80 text-gray-700 backdrop-blur-sm hover:bg-white"
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Change profile picture</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-4 pt-2 md:pt-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
                  {profile?.name || 'Your Name'}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                  {(profile?.title || profile?.company) && (
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">
                        {profile?.title || 'No position'}{' '}
                        {profile?.company ? `at ${profile.company}` : ''}
                      </span>
                    </div>
                  )}

                  {profile?.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <span>{profile?.location}</span>
                    </div>
                  )}
                </div>

                {profile?.isOpenToOpportunities ? (
                  <Badge className="flex w-fit items-center gap-1.5 border-0 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700">
                    <Check className="h-3.5 w-3.5 text-green-500" />
                    Open to opportunities
                  </Badge>
                ) : (
                  <Badge className="flex w-fit items-center gap-1.5 border-0 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700">
                    <X className="h-3.5 w-3.5 text-red-500" />
                    Not open to opportunities
                  </Badge>
                )}
              </div>

              <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 gap-1.5 border-gray-200 bg-white px-4 text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Update your profile information. Click save when
                      you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="text-sm font-medium text-gray-700"
                      >
                        Position
                      </Label>
                      <div className="flex items-center rounded-md border border-gray-200 bg-white px-3 focus-within:ring-1 focus-within:ring-blue-400">
                        <Briefcase className="mr-2 h-4 w-4 text-gray-400" />
                        <Input
                          id="title"
                          name="title"
                          value={editedProfile.title || ''}
                          onChange={handleInputChange}
                          className="h-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Your position"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="company"
                        className="text-sm font-medium text-gray-700"
                      >
                        Company
                      </Label>
                      <div className="flex items-center rounded-md border border-gray-200 bg-white px-3 focus-within:ring-1 focus-within:ring-blue-400">
                        <Building className="mr-2 h-4 w-4 text-gray-400" />
                        <Input
                          id="company"
                          name="company"
                          value={editedProfile.company || ''}
                          onChange={handleInputChange}
                          className="h-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Your company"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="location"
                        className="text-sm font-medium text-gray-700"
                      >
                        Location
                      </Label>
                      <div className="flex items-center rounded-md border border-gray-200 bg-white px-3 focus-within:ring-1 focus-within:ring-blue-400">
                        <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                        <Input
                          id="location"
                          name="location"
                          value={editedProfile.location || ''}
                          onChange={handleInputChange}
                          className="h-10 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          placeholder="Your location"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="isOpenToOpportunities"
                        checked={editedProfile.isOpenToOpportunities || false}
                        onCheckedChange={handleSwitchChange}
                      />
                      <Label
                        htmlFor="isOpenToOpportunities"
                        className="font-medium"
                      >
                        Open to opportunities
                      </Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleSave}
                      className="gap-1.5 bg-blue-700 hover:bg-blue-800"
                      disabled={loadingState === LoadingState.loading}
                    >
                      {loadingState === LoadingState.loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
