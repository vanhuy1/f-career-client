'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

// Define props for customization (optional)
interface GoogleSignUpButtonProps {
  text?: string;
  onClick?: () => void; // Keep for backward compatibility but won't use it
}

const GoogleSignButton = ({ text }: GoogleSignUpButtonProps) => {
  // Handle Google OAuth redirect
  const handleGoogleAuth = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL!;
    const googleAuthUrl = `${backendUrl}api/v1/auth/google`;

    // Redirect to backend Google OAuth endpoint
    window.location.href = googleAuthUrl;
  };

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-2 border border-gray-300"
      onClick={handleGoogleAuth}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <FcGoogle />
      </span>
      {text}
    </Button>
  );
};

export default GoogleSignButton;
