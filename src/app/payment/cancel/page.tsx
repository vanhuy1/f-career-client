'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="h-16 w-16 text-red-500" />
            <h3 className="mt-4 text-xl font-semibold">
              Payment was cancelled
            </h3>
            <p className="mt-2 text-center text-gray-600">
              Your payment has been cancelled. No charges were made.
            </p>
            <Button asChild className="mt-6">
              <Link href="/payment/start">Try Again</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
