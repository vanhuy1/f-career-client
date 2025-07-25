'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import CouponList from './_components/CouponList';
import CouponForm from './_components/CouponForm';
import { createCoupon, updateCoupon } from '@/services/state/couponSlice';
import type { AppDispatch } from '@/store/store';
import type {
  Coupon,
  CreateCouponDto,
  UpdateCouponDto,
} from '@/services/api/coupons/coupon-api';
import type { RootState } from '@/store/store';

export default function CouponsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.coupons);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | undefined>();

  const handleSubmit = async (formData: CreateCouponDto | UpdateCouponDto) => {
    try {
      if (selectedCoupon) {
        const updateData: UpdateCouponDto = {
          code: formData.code,
          discountPercentage: formData.discountPercentage,
          validUntil: formData.validUntil,
          isActive:
            'isActive' in formData
              ? formData.isActive
              : selectedCoupon.isActive,
        };

        console.log('Updating coupon:', {
          id: selectedCoupon.id,
          data: updateData,
        });

        await dispatch(
          updateCoupon({
            id: selectedCoupon.id,
            dto: updateData,
          }),
        ).unwrap();
        toast.success('Coupon updated successfully');
      } else {
        const createData: CreateCouponDto = {
          code: formData.code,
          discountPercentage: formData.discountPercentage,
          validUntil: formData.validUntil,
        };

        console.log('Creating new coupon:', createData);
        await dispatch(createCoupon(createData)).unwrap();
        toast.success('Coupon created successfully');
      }
      setIsDialogOpen(false);
      setSelectedCoupon(undefined);
    } catch (error) {
      console.error('Error handling coupon:', error);
      toast.error(
        selectedCoupon ? 'Failed to update coupon' : 'Failed to create coupon',
      );
    }
  };

  const handleEdit = (coupon: Coupon) => {
    console.log('Selected coupon for edit:', coupon);
    setSelectedCoupon(coupon);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex h-full flex-1 flex-col space-y-8 p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Coupons</h2>
          <p className="text-muted-foreground">
            Create and manage discount coupons for company packages
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => setSelectedCoupon(undefined)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Coupon
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedCoupon ? 'Edit Coupon' : 'Create New Coupon'}
                </DialogTitle>
                <DialogDescription>
                  {selectedCoupon
                    ? 'Update the coupon details below'
                    : 'Fill in the details to create a new coupon'}
                </DialogDescription>
              </DialogHeader>
              <CouponForm
                coupon={selectedCoupon}
                onSubmit={handleSubmit}
                isLoading={loading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <CouponList onEdit={handleEdit} />
    </div>
  );
}
