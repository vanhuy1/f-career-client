'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { payosService } from '@/services/api/payment/payos-api';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function PaymentStartPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const amount = Number(formData.get('amount'));
      const description = formData.get('description') as string;

      const orderCode = Date.now(); // Use timestamp as numeric order code
      const returnUrl = `${window.location.origin}/payment/success?orderCode=${orderCode}`;
      const cancelUrl = `${window.location.origin}/payment/cancel`;

      const response = await payosService.createPaymentLink({
        amount,
        description,
        orderCode,
        returnUrl,
        cancelUrl,
      });

      // Redirect to PayOS checkout URL
      window.location.href = response.checkoutUrl;
    } catch (error) {
      toast.error('Failed to create payment link. Please try again.', {
        className: 'bg-red-500 text-white font-semibold',
      });
      console.error('Payment error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle>Make a Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (VND)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min="1000"
                step="1000"
                required
                placeholder="Enter amount in VND"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="Payment description"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
