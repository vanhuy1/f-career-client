"use client";

import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";

// Define props for customization (optional)
interface GoogleSignUpButtonProps {
  text?: string;
  onClick?: () => void;
}

const GoogleSignButton = ({ text, onClick }: GoogleSignUpButtonProps) => {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 border border-gray-300"
      onClick={onClick}>
      <span className="flex items-center justify-center w-5 h-5">
        <FcGoogle />
      </span>
      {text}
    </Button>
  );
};

export default GoogleSignButton;
