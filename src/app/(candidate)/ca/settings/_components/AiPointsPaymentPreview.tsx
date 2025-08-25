import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CreditCard, CheckCircle, X } from 'lucide-react';
import { Coupon } from '@/services/api/coupons/coupon-api';

interface PaymentPreviewData {
  points: number;
  packageType: 'predefined' | 'custom';
  selectedPackage: number | null;
  baseAmount: number;
  totalAmount: number;
  coupon: Coupon | null;
  pricePerPoint: number;
}

interface AiPointsPaymentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: PaymentPreviewData | null;
  isLoading: boolean;
}

const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const AiPointsPaymentPreview: React.FC<AiPointsPaymentPreviewProps> = ({
  isOpen,
  onClose,
  onConfirm,
  data,
  isLoading,
}) => {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-purple-600" />
            Payment Preview
          </DialogTitle>
          <DialogDescription>
            Review your AI points purchase before proceeding to payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Points Summary */}
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">
                    AI Points to Purchase
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    +{data.points} Points
                  </p>
                </div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">
                {data.packageType === 'predefined' ? 'Package' : 'Custom'}
              </Badge>
            </div>
          </div>

          {/* Package Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-900">
              Package Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Package Type:</span>
                <span className="font-medium">
                  {data.packageType === 'predefined'
                    ? `${data.selectedPackage} Points Package`
                    : `${data.points} Custom Points`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per Point:</span>
                <span className="font-medium">
                  {formatVND(data.pricePerPoint)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Amount:</span>
                <span className="font-medium">
                  {formatVND(data.baseAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Coupon Applied */}
          {data.coupon && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">
                  Coupon Applied
                </span>
              </div>
              <div className="mt-2 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Code:</span>
                  <span className="font-medium text-green-800">
                    {data.coupon.code}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Discount:</span>
                  <span className="font-medium text-green-800">
                    -{data.coupon.discountPercentage}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Total Amount */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900">
                Total Amount:
              </span>
              <span className="text-2xl font-bold text-purple-600">
                {formatVND(data.totalAmount)}
              </span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <h3 className="mb-2 font-semibold text-blue-900">
              Payment Information
            </h3>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Secure payment via PayOS</li>
              <li>• Multiple payment methods available</li>
              <li>• Points added instantly after payment</li>
              <li>• No hidden fees</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="px-6"
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-purple-600 px-6 hover:bg-purple-700"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isLoading ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
