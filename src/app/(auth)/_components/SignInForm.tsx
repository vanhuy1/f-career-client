'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ROUTES from '@/constants/navigation';
import Divider from './Divider';
import GoogleSignButton from './GoogleSignButton';
import Link from 'next/link';
import { type SignInRequest, signInRequestSchema } from '@/schemas/Auth';
import { authService } from '@/services/api/auth/auth-api';
import { useAppDispatch } from '@/store/hooks';
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from '@/services/state/authSlice';
import { useRouter } from 'next/navigation';
import { setUserStart, setUserSuccess } from '@/services/state/userSlice';
import { userService } from '@/services/api/auth/user-api';
import { ROLES } from '@/enums/roles.enum';
import { toast } from 'react-toastify';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

export const SignInForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInRequest>({
    resolver: zodResolver(signInRequestSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: SignInRequest) => {
    try {
      dispatch(loginStart());
      const response = await authService.signIn(data);
      dispatch(loginSuccess(response));
      if (response) {
        dispatch(setUserStart());
        const userData = await userService.getMe();
        if (userData) {
          dispatch(setUserSuccess(userData));
          if (userData.data.roles[0] === ROLES.USER) {
            router.push(ROUTES.CA.HOME.path);
          } else if (userData.data.roles[0] === ROLES.ADMIN) {
            router.push(ROUTES.ADMIN.Home.path);
          } else if (userData.data.roles[0] === ROLES.RECRUITER) {
            router.push(ROUTES.CO.HOME.path);
          } else if (userData.data.roles[0] === ROLES.ADMIN_RECRUITER) {
            router.push(ROUTES.CO.HOME.path);
          }
        } else {
          dispatch(loginFailure('Failed to fetch user data'));
        }
      }
    } catch (error) {
      dispatch(loginFailure(error as string));
      toast.error(`${error}`);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card className="border-0 bg-white/80 shadow-lg backdrop-blur-sm">
        <CardHeader className="space-y-2 pb-6 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700">
            <LogIn className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-2xl font-bold text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-gray-600">
            Sign in to your account to continue your journey
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Google Sign In Button */}
          <GoogleSignButton text="Sign In with Google" />

          <Divider />

          {/* Sign In Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                className={`transition-all duration-200 ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('email')}
              />
              {errors.email && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.email.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <Lock className="h-4 w-4" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                className={`transition-all duration-200 ${
                  errors.password
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                    : 'border-gray-200 focus:border-blue-500 focus:ring-blue-200'
                }`}
                {...register('password')}
              />
              {errors.password && (
                <Alert variant="destructive" className="py-2">
                  <AlertDescription className="text-sm">
                    {errors.password.message}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="#"
                className="text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full transform rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 py-3 font-medium text-white transition-all duration-200 hover:scale-[1.02] hover:from-blue-800 hover:to-blue-900 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Sign Up Link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href={ROUTES.AUTH.SIGNUP.path}
            className="font-medium text-blue-600 transition-colors duration-200 hover:text-blue-500"
          >
            {ROUTES.AUTH.SIGNUP.name}
          </Link>
        </p>
      </div>

      {/* Terms and Privacy */}
      <div className="mx-auto mt-4 max-w-sm text-center text-xs leading-relaxed text-gray-500">
        By signing in, you acknowledge that you have read and accept the{' '}
        <Link
          href="#"
          className="text-blue-600 transition-colors duration-200 hover:text-blue-500"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          href="#"
          className="text-blue-600 transition-colors duration-200 hover:text-blue-500"
        >
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
};
