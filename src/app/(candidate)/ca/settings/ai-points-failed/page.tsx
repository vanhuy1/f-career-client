'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AiPointsFailedPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any stored payment data on failed payment
    localStorage.removeItem('aiPointsPayment');
    localStorage.removeItem('aiPointsPaymentProcessed');
    toast.error('Payment was cancelled or failed. Please try again.');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Failed
          </CardTitle>
          <p className="text-gray-600">
            Your payment was not completed. No charges were made to your
            account.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="mb-2 font-semibold text-red-900">What happened?</h3>
            <ul className="space-y-1 text-sm text-red-800">
              <li>• Payment was cancelled by you</li>
              <li>• Payment gateway encountered an error</li>
              <li>• Network connection issues</li>
              <li>• No charges were made to your account</li>
            </ul>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">
              What can you do?
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Try the payment again</li>
              <li>• Check your internet connection</li>
              <li>• Contact support if the problem persists</li>
              <li>• Your AI points balance remains unchanged</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/ca/settings')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push('/ca')}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          {/* Support Info */}
          <div className="text-center text-xs text-gray-500">
            Need help? Contact our support team at{' '}
            <a
              href="mailto:support@fcareer.com"
              className="text-purple-600 hover:underline"
            >
              support@fcareer.com
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
