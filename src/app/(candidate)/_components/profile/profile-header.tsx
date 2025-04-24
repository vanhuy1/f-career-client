import Image from 'next/image';
import { MapPin, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types/UserProfile';

interface ProfileHeaderProps {
  profile: UserProfile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="relative h-32 bg-gradient-to-r from-pink-200 via-purple-300 to-purple-800">
        {profile.coverImage && (
          <Image
            src={profile.coverImage || '/placeholder.svg'}
            alt="Cover"
            fill
            className="object-cover"
          />
        )}
        <div className="absolute top-4 right-4">
          <Button variant="outline" size="icon" className="h-8 w-8 bg-white">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="relative px-6 pb-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
          <div className="relative -mt-16">
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white">
              <Image
                src={profile.avatar || '/placeholder.svg'}
                alt={`${profile.name}'s profile picture`}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>
          <div className="flex-1 pt-2 md:pt-0">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-500">
                  {profile.title} at {profile.company}
                </p>
                <div className="mt-1 flex items-center text-gray-500">
                  <MapPin className="mr-1 h-4 w-4" />
                  <span>{profile.location}</span>
                </div>
              </div>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
        {profile.isOpenToOpportunities && (
          <div className="mt-4">
            <Badge
              variant="outline"
              className="flex items-center gap-2 border-green-200 bg-green-50 text-green-600"
            >
              <div className="flex h-4 w-4 items-center justify-center rounded-sm bg-green-200">
                <span className="text-xs text-green-600">✓</span>
              </div>
              OPEN FOR OPPORTUNITIES
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
