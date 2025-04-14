'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

// Define props for customization (optional)
interface GoogleSignUpButtonProps {
  text?: string;
  onClick?: () => void;
}

const GoogleSignButton = ({ text, onClick }: GoogleSignUpButtonProps) => {
  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-2 border border-gray-300"
      onClick={onClick}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <FcGoogle />
      </span>
      {text}
    </Button>
  );
};

export default GoogleSignButton;
