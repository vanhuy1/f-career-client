'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
} from '@/services/api/coupons/coupon-api';

interface CouponFormProps {
  coupon?: Coupon;
  onSubmit: (data: CreateCouponDto | UpdateCouponDto) => void;
  isLoading?: boolean;
}

const formSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  discountPercentage: z
    .number()
    .int('Discount must be a whole number')
    .min(0, 'Discount must be at least 0')
    .max(100, 'Discount cannot exceed 100'),
  validUntil: z.string().min(1, 'Valid until date is required'),
  isActive: z.boolean().optional(),
});

export default function CouponForm({
  coupon,
  onSubmit,
  isLoading = false,
}: CouponFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: coupon?.code || '',
      discountPercentage: coupon?.discountPercentage
        ? Math.round(coupon.discountPercentage)
        : 0,
      validUntil: coupon?.validUntil
        ? format(new Date(coupon.validUntil), 'yyyy-MM-dd')
        : '',
      isActive: coupon?.isActive ?? true,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedData = {
      ...values,
      validUntil: new Date(values.validUntil).toISOString(),
      discountPercentage: Math.round(Number(values.discountPercentage)),
    };

    console.log('Form data before submit:', formattedData);
    onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter coupon code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discountPercentage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Percentage</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    const intValue = value ? Math.round(Number(value)) : 0;
                    field.onChange(intValue);
                  }}
                  placeholder="Enter discount percentage"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="validUntil"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valid Until</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {coupon && (
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Active Status</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading
            ? 'Processing...'
            : coupon
              ? 'Update Coupon'
              : 'Create Coupon'}
        </Button>
      </form>
    </Form>
  );
}
