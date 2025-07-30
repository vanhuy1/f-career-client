'use client';

import React from 'react';
import { Phone, PhoneOff, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IncomingCallNotificationProps {
  isVisible: boolean;
  callerName: string;
  callerAvatar?: string;
  onAccept: () => void;
  onDecline: () => void;
  isVideoCall?: boolean;
}

const IncomingCallNotification: React.FC<IncomingCallNotificationProps> = ({
  isVisible,
  callerName,
  callerAvatar,
  onAccept,
  onDecline,
  isVideoCall = true,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  if (!isVisible) return null;

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-2xl">
        <div className="text-center">
          {/* Caller Avatar */}
          <div className="mb-4">
            <Avatar className="mx-auto h-20 w-20">
              <AvatarImage src={callerAvatar} />
              <AvatarFallback className="bg-blue-100 text-xl text-blue-700">
                {getInitials(callerName)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Call Info */}
          <div className="mb-6">
            <h3 className="mb-1 text-lg font-semibold text-gray-900">
              {callerName}
            </h3>
            <p className="text-gray-600">
              Incoming {isVideoCall ? 'video' : 'voice'} call...
            </p>
          </div>

          {/* Call Actions */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onDecline}
              className="h-16 w-16 rounded-full bg-red-500 p-4 text-white hover:bg-red-600"
            >
              <PhoneOff className="h-6 w-6" />
            </Button>

            <Button
              onClick={onAccept}
              className="h-16 w-16 rounded-full bg-green-500 p-4 text-white hover:bg-green-600"
            >
              {isVideoCall ? (
                <Video className="h-6 w-6" />
              ) : (
                <Phone className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallNotification;
