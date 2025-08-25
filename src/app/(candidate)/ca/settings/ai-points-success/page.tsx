'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowLeft, Loader2 } from 'lucide-react';
import { useAiPointsManager } from '@/hooks/use-ai-points';
import { toast } from 'react-toastify';

interface PaymentData {
  amountVnd: number;
  baseAmount: number;
  coupon: {
    code: string;
    discountPercentage: number;
  } | null;
  points: number;
  packageType: 'predefined' | 'custom';
  selectedPackage: number | null;
  pricePerPoint: number;
  timestamp: string;
}

export default function AiPointsSuccessPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const hasProcessedRef = useRef(false);
  const { addAiPoints } = useAiPointsManager();

  useEffect(() => {
    let isMounted = true;

    const processPayment = async () => {
      try {
        // Check if payment has already been processed
        const isProcessed = localStorage.getItem('aiPointsPaymentProcessed');
        if (isProcessed === 'true') {
          // Payment already processed, just show success
          setIsProcessing(false);
          return;
        }

        // Prevent multiple processing
        if (hasProcessedRef.current) {
          setIsProcessing(false);
          return;
        }

        // Get payment data from localStorage
        const storedData = localStorage.getItem('aiPointsPayment');
        if (!storedData) {
          toast.error('Payment data not found');
          router.push('/ca/settings');
          return;
        }

        const data: PaymentData = JSON.parse(storedData);

        // Check if component is still mounted
        if (!isMounted) return;

        setPaymentData(data);
        hasProcessedRef.current = true;

        // Add AI points to user account (without toast from hook)
        await addAiPoints(data.points, false);

        // Check if component is still mounted
        if (!isMounted) return;

        // Clear payment data from localStorage
        localStorage.removeItem('aiPointsPayment');
        localStorage.setItem('aiPointsPaymentProcessed', 'true');

        toast.success(
          `Successfully added ${data.points} AI points to your account!`,
        );
        setIsProcessing(false);
      } catch (error) {
        console.error('Error processing payment:', error);
        if (isMounted) {
          toast.error('Failed to add AI points. Please contact support.');
          setIsProcessing(false);
        }
      }
    };

    processPayment();

    // Cleanup function
    return () => {
      isMounted = false;
      // Clear processing flag when component unmounts
      localStorage.removeItem('aiPointsPaymentProcessed');
    };
  }, []); // Remove hasProcessed dependency to prevent infinite loop

  // Handle when processing is stuck
  useEffect(() => {
    if (hasProcessedRef.current && isProcessing) {
      // Payment has been processed, ensure we're not stuck in loading
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-purple-600" />
            <h2 className="mb-2 text-xl font-semibold text-gray-900">
              Processing Your Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we add your AI points...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600">
            Your AI points have been added to your account
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Points Added */}
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Points Added
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    +{paymentData?.points} AI Points
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-900">
              Payment Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Package:</span>
                <span className="font-medium">
                  {paymentData?.packageType === 'predefined'
                    ? `${paymentData.selectedPackage} Points Package`
                    : `${paymentData?.points} Custom Points`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Amount:</span>
                <span className="font-medium">
                  {formatVND(paymentData?.baseAmount || 0)}
                </span>
              </div>
              {paymentData?.coupon && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Coupon Applied:</span>
                  <span className="font-medium text-green-600">
                    {paymentData.coupon.code} (-
                    {paymentData.coupon.discountPercentage}%)
                  </span>
                </div>
              )}
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total Paid:</span>
                  <span className="text-green-600">
                    {formatVND(paymentData?.amountVnd || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">
              What&apos;s Next?
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Your AI points are now available for use</li>
              <li>• Use them for CV optimization and roadmap generation</li>
              <li>• Points never expire and can be used anytime</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push('/ca/settings')}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Go to Settings
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
        </CardContent>
      </Card>
    </div>
  );
}
