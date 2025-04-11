"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/navigation";
import Divider from "../_components/Divider";
import Logo from "../_components/Logo";
import Navigation from "../_components/Navigation";
import GoogleSignButton from "../_components/GoogleSignButton";

const SignUpForm = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Get more opportunities</h1>

    <GoogleSignButton text="Sign Up with Google" />

    <Divider />

    <div className="space-y-4">
      <div>
        <label
          htmlFor="fullName"
          className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>
        <Input
          id="fullName"
          placeholder="Enter your full name"
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <Input
          id="email"
          type="email"
          placeholder="Enter email address"
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          className="w-full"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password
        </label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          className="w-full"
        />
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
        Continue
      </Button>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          href={ROUTES.AUTH.SIGNIN.path}
          className="text-indigo-600 font-medium">
          {ROUTES.AUTH.SIGNIN.name}
        </a>
      </div>

      <div className="text-xs text-gray-500 text-center">
        By clicking Continue, you acknowledge that you have read and accept the{" "}
        <a href="#" className="text-indigo-600">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-indigo-600">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  </div>
);

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto w-full">
      <Logo />
      <Navigation />
      <SignUpForm />
    </div>
  );
}
