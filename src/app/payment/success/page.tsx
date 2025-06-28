'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  payosService,
  PaymentStatusResponse,
} from '@/services/api/payment/payos-api';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) {
      setError('Invalid payment session');
      setIsLoading(false);
      return;
    }

    const orderCode = searchParams.get('orderCode');
    if (!orderCode) {
      setError('Invalid payment session');
      setIsLoading(false);
      return;
    }

    const checkPaymentStatus = async () => {
      try {
        const response = await payosService.getPaymentStatus(orderCode);
        setStatus(response);
      } catch (error) {
        toast.error('Failed to check payment status', {
          className: 'bg-red-500 text-white font-semibold',
        });
        setError('Failed to check payment status');
        console.error('Payment status error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
          <p className="mt-4 text-lg text-gray-600">
            Checking payment status...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <XCircle className="h-16 w-16 text-red-500" />
          <p className="mt-4 text-lg text-gray-600">{error}</p>
          <Button asChild className="mt-6">
            <Link href="/payment/start">Try Again</Link>
          </Button>
        </div>
      );
    }

    if (!status) {
      return null;
    }

    const isSuccess = status.status === 'COMPLETED';

    return (
      <div className="flex flex-col items-center justify-center py-8">
        {isSuccess ? (
          <CheckCircle className="h-16 w-16 text-green-500" />
        ) : (
          <XCircle className="h-16 w-16 text-red-500" />
        )}
        <h3 className="mt-4 text-xl font-semibold">
          {isSuccess ? 'Payment Successful' : 'Payment Failed'}
        </h3>
        <div className="mt-4 space-y-2 text-center">
          <p className="text-gray-600">Order Code: {status.orderCode}</p>
          <p className="text-gray-600">
            Amount:{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(status.amount)}
          </p>
          {status.paymentTime && (
            <p className="text-gray-600">
              Payment Time: {new Date(status.paymentTime).toLocaleString()}
            </p>
          )}
          <p className="text-gray-600">Description: {status.description}</p>
        </div>
        <Button asChild className="mt-6">
          <Link href="/payment/start">Make Another Payment</Link>
        </Button>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
