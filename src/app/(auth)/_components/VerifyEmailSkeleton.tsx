import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

export default function VerifyEmailSkeleton() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">
              Email Verification
            </CardTitle>
            <CardDescription className="text-center">
              Please wait while we verify your email
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6 pt-6 pb-8">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              <p className="text-center text-gray-600">
                Verifying your email address...
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button className="w-full bg-blue-600 hover:bg-blue-700" disabled>
              Verifying...
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
