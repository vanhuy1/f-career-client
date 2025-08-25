import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  RefreshCw,
  Gift,
  Coins,
  Crown,
  AlertCircle,
  CreditCard,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { useAiPointsManager } from '@/hooks/use-ai-points';
import { useAiPoints } from '@/services/state/userSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { payosService } from '@/services/api/payment/payos-api';
import { Coupon, couponService } from '@/services/api/coupons/coupon-api';
import { toast } from 'react-toastify';
import { AiPointsPaymentPreview } from './AiPointsPaymentPreview';

interface PaymentPreviewData {
  points: number;
  packageType: 'predefined' | 'custom';
  selectedPackage: number | null;
  baseAmount: number;
  totalAmount: number;
  coupon: Coupon | null;
  pricePerPoint: number;
}

// AI Points Package Configuration
const AI_POINTS_PACKAGES = [
  { points: 5, label: 'Starter', price: 5000, popular: false },
  { points: 10, label: 'Basic', price: 10000, popular: true },
  { points: 25, label: 'Pro', price: 25000, popular: false },
  { points: 50, label: 'Premium', price: 50000, popular: false },
];

const PRICE_PER_POINT = 1000; // 1,000 VNĐ per point

// Helper function to format Vietnamese currency
const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper function to apply coupon discount
const applyDiscount = (baseAmount: number, coupon: Coupon | null) => {
  if (!coupon) return Math.round(baseAmount);
  const discount = (baseAmount * coupon.discountPercentage) / 100;
  return Math.round(baseAmount - discount);
};

export const AiPointsManager: React.FC = () => {
  const [customPoints, setCustomPoints] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<PaymentPreviewData | null>(
    null,
  );
  const { getAiPoints, addAiPoints } = useAiPointsManager();
  const currentPoints = useAiPoints();
  console.log(addAiPoints);
  const handleRefreshPoints = async () => {
    try {
      await getAiPoints();
    } catch (error) {
      console.error('Error refreshing points:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsCheckingCoupon(true);
    try {
      const coupons = await couponService.findAll();
      const coupon = coupons.find(
        (c) => c.code.toLowerCase() === couponCode.trim().toLowerCase(),
      );

      if (!coupon) {
        toast.error('Coupon not found');
        return;
      }

      if (!coupon.isActive) {
        toast.error('This coupon is no longer active');
        return;
      }

      if (new Date(coupon.validUntil) < new Date()) {
        toast.error('This coupon has expired');
        return;
      }

      setAppliedCoupon(coupon);
      setCouponCode('');
      toast.success(
        `Coupon applied! You got ${coupon.discountPercentage}% OFF`,
      );
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      toast.error('Invalid coupon code. Please try again.');
    } finally {
      setIsCheckingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.info('Coupon removed');
  };

  const handlePurchasePoints = async (points: number) => {
    // Calculate total amount
    let baseAmount = 0;
    let totalAmount = 0;

    if (selectedPackage) {
      // Pre-defined packages: use package price directly
      const packagePrice =
        AI_POINTS_PACKAGES.find((pkg) => pkg.points === selectedPackage)
          ?.price || 0;
      baseAmount = packagePrice;
    } else {
      // Custom points: calculate based on points
      baseAmount = points * PRICE_PER_POINT;
    }

    // Apply coupon discount
    totalAmount = applyDiscount(baseAmount, appliedCoupon);

    // Set preview data
    setPreviewData({
      points: points,
      packageType: selectedPackage ? 'predefined' : 'custom',
      selectedPackage: selectedPackage,
      baseAmount: baseAmount,
      totalAmount: totalAmount,
      coupon: appliedCoupon,
      pricePerPoint: PRICE_PER_POINT,
    });

    setShowPreview(true);
  };

  const handleConfirmPurchase = async () => {
    if (!previewData) return;

    try {
      setIsLoading(true);

      // Prepare payment data for storage
      const paymentData = {
        amountVnd: previewData.totalAmount,
        baseAmount: previewData.baseAmount,
        coupon: previewData.coupon
          ? {
              code: previewData.coupon.code,
              discountPercentage: previewData.coupon.discountPercentage,
            }
          : null,
        points: previewData.points,
        packageType: previewData.packageType,
        selectedPackage: previewData.selectedPackage,
        pricePerPoint: previewData.pricePerPoint,
        timestamp: new Date().toISOString(),
      };

      // Store payment data in localStorage
      localStorage.setItem('aiPointsPayment', JSON.stringify(paymentData));

      // Create PayOS payment
      const orderCode = Date.now();
      const description = `AI Points ${previewData.points}`;

      const payosPaymentData = {
        amount: previewData.totalAmount,
        description: description,
        orderCode: orderCode,
        returnUrl: `${window.location.origin}/ca/settings/ai-points-success`,
        cancelUrl: `${window.location.origin}/ca/settings/ai-points-failed`,
      };

      const response = await payosService.createPaymentLink(payosPaymentData);
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Failed to create payment:', error);
      toast.error('Failed to create payment. Please try again.');
    } finally {
      setIsLoading(false);
      setShowPreview(false);
    }
  };

  const handleAddPredefinedPoints = async (points: number) => {
    setSelectedPackage(points);
    await handlePurchasePoints(points);
  };

  const handleAddCustomPoints = async () => {
    const points = parseInt(customPoints);
    if (isNaN(points) || points <= 0) {
      return;
    }

    setSelectedPackage(null);
    await handlePurchasePoints(points);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Add AI Points
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current points display */}
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Current Balance:
            </span>
            <span className="text-lg font-bold text-purple-600">
              {currentPoints} points
            </span>
          </div>
        </div>

        {/* Predefined packages */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Quick Add Packages
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {AI_POINTS_PACKAGES.map((pkg) => (
              <Button
                key={pkg.points}
                onClick={() => handleAddPredefinedPoints(pkg.points)}
                disabled={isLoading}
                variant="outline"
                className="h-auto flex-col gap-2 p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  {pkg.points === 5 && <Sparkles className="h-4 w-4" />}
                  {pkg.points === 10 && <Coins className="h-4 w-4" />}
                  {pkg.points === 25 && <Gift className="h-4 w-4" />}
                  {pkg.points === 50 && <Crown className="h-4 w-4" />}
                  <Badge
                    className={
                      pkg.points === 5
                        ? 'bg-purple-100 text-purple-800'
                        : pkg.points === 10
                          ? 'bg-blue-100 text-blue-800'
                          : pkg.points === 25
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                    }
                  >
                    {pkg.label}
                  </Badge>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  +{pkg.points} points
                </span>
                <span className="text-sm text-gray-600">
                  {formatVND(pkg.price)}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom points input */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Custom Amount
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="1"
              max="1000"
              value={customPoints}
              onChange={(e) => setCustomPoints(e.target.value)}
              placeholder="Enter number of points"
              className="flex-1"
            />
            <Button
              onClick={handleAddCustomPoints}
              disabled={
                isLoading || !customPoints || parseInt(customPoints) <= 0
              }
              className="bg-purple-600 hover:bg-purple-700"
            >
              <CreditCard className="mr-1 h-4 w-4" />
              Buy
            </Button>
          </div>
          {customPoints && (
            <div className="text-sm text-gray-600">
              Total: {formatVND(parseInt(customPoints) * PRICE_PER_POINT)} (
              {customPoints} points × {formatVND(PRICE_PER_POINT)})
            </div>
          )}
        </div>

        {/* Coupon Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Apply Coupon (Optional)
          </Label>
          <div className="flex gap-2">
            <Input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter coupon code"
              className="flex-1"
              disabled={!!appliedCoupon || isCheckingCoupon}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={isCheckingCoupon || !!appliedCoupon}
              variant="outline"
              className="min-w-[100px]"
            >
              {isCheckingCoupon ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Apply'
              )}
            </Button>
            {appliedCoupon && (
              <Button
                variant="outline"
                className="text-red-700 hover:bg-red-50"
                onClick={handleRemoveCoupon}
              >
                Remove
              </Button>
            )}
          </div>
          {appliedCoupon && (
            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <p className="text-sm text-green-800">
                Applied:{' '}
                <span className="font-medium">{appliedCoupon.code}</span> (-
                {appliedCoupon.discountPercentage}% OFF)
              </p>
            </div>
          )}
        </div>

        {/* Refresh button */}
        <Button
          onClick={handleRefreshPoints}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
          />
          Refresh Balance
        </Button>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center text-sm text-gray-500">
            <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin" />
            Processing payment...
          </div>
        )}

        {/* Info alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            AI points are used for premium features like CV optimization,
            roadmap generation, and AI chat assistance. Points are added
            instantly after successful payment and can be used immediately.
          </AlertDescription>
        </Alert>
      </CardContent>

      {/* Payment Preview Dialog */}
      <AiPointsPaymentPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={handleConfirmPurchase}
        data={previewData}
        isLoading={isLoading}
      />
    </Card>
  );
};
