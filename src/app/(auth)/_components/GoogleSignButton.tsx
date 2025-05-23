'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '@/lib/supabase';

interface GoogleSignUpButtonProps {
  text?: string;
  redirectTo?: string;
}

const GoogleSignButton = ({ text = 'Sign in with Google', redirectTo }: GoogleSignUpButtonProps) => {
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/auth/callback`,
      },
    });
    if (error) console.error('Error signing in:', error.message);
  };

  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center gap-2 border border-gray-300"
      onClick={signInWithGoogle}
    >
      <span className="flex h-5 w-5 items-center justify-center">
        <FcGoogle />
      </span>
      {text}
    </Button>
  );
};

export default GoogleSignButton;
