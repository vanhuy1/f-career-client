import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ROUTES from '@/constants/navigation';
import Logo from '../_components/Logo';
import Navigation from '../_components/Navigation';
import Divider from '../_components/Divider';
import GoogleSignButton from '../_components/GoogleSignButton';
import Link from 'next/link';

const SignInForm = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold">Welcome Back</h1>

    <GoogleSignButton text="Sign In with Google" />

    <Divider />

    <div className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
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
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          className="w-full"
        />
      </div>

      <div className="flex justify-end">
        <Link href="#" className="text-sm font-medium text-indigo-600">
          Forgot Password?
        </Link>
      </div>

      <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
        Sign In
      </Button>

      <div className="text-center text-sm">
        Don’t have an account?{' '}
        <Link
          href={ROUTES.AUTH.SIGNUP.path}
          className="font-medium text-indigo-600"
        >
          {ROUTES.AUTH.SIGNUP.name}
        </Link>
      </div>

      <div className="text-center text-xs text-gray-500">
        By signing in, you acknowledge that you have read and accept the{' '}
        <a href="#" className="text-indigo-600">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-indigo-600">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  </div>
);

export default function SignInPage() {
  return (
    <div className="mx-auto w-full max-w-md">
      <Logo />
      <Navigation />
      <SignInForm />
    </div>
  );
}
