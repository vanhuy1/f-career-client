'use client';

import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Calendar as CalendarIcon,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Ticket,
  Loader2,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Job } from '@/types/Job';
import { Coupon } from '@/services/api/coupons/coupon-api';

interface VisibilityCardProps {
  job: Job;
  isVipPackage: boolean;
  isPremiumPackage: boolean;
  visibilityPackage: 'vip' | 'premium';
  VIP_PRICE_PER_DAY: number;
  PREMIUM_PRICE_PER_DAY: number;
  visibilityLoading: boolean;
  isProcessingPayment: boolean;
  extendSelectedDate: Date | null;
  upgradeSelectedDate: Date | null;
  visibilitySelectedDate: Date | null;
  premiumAction: 'extend' | 'upgrade';
  visibilityCouponCode: string;
  visibilityAppliedCoupon: Coupon | null;
  visibilityCheckingCoupon: boolean;
  extendDaysDiff: number;
  upgradeDaysDiff: number;
  visibilityDaysDiff: number;
  isMaxedOut: boolean;
  onVisibilityPackageChange: (pkg: 'vip' | 'premium') => void;
  onExtendSelectedDateChange: (date: Date | null) => void;
  onUpgradeSelectedDateChange: (date: Date | null) => void;
  onVisibilitySelectedDateChange: (date: Date | null) => void;
  onPremiumActionChange: (action: 'extend' | 'upgrade') => void;
  onVisibilityCouponCodeChange: (code: string) => void;
  onApplyVisibilityCoupon: () => void;
  onRemoveVisibilityCoupon: () => void;
  onExtendCurrent: () => void;
  onUpgradeToVip: () => void;
  onBuyVisibilityBasic: () => void;
  onCancelVisibility: () => void;
  onPreviewClick: (packageType: 'vip' | 'premium' | 'basic') => void;
  getVisibilityBadge: () => React.ReactNode;
  getVisibilityExpiryBadge: () => React.ReactNode;
}

export function VisibilityCard({
  job,
  isVipPackage,
  isPremiumPackage,
  visibilityPackage,
  VIP_PRICE_PER_DAY,
  PREMIUM_PRICE_PER_DAY,
  visibilityLoading,
  isProcessingPayment,
  extendSelectedDate,
  upgradeSelectedDate,
  visibilitySelectedDate,
  premiumAction,
  visibilityCouponCode,
  visibilityAppliedCoupon,
  visibilityCheckingCoupon,
  extendDaysDiff,
  upgradeDaysDiff,
  visibilityDaysDiff,
  isMaxedOut,
  onVisibilityPackageChange,
  onExtendSelectedDateChange,
  onUpgradeSelectedDateChange,
  onVisibilitySelectedDateChange,
  onPremiumActionChange,
  onVisibilityCouponCodeChange,
  onApplyVisibilityCoupon,
  onRemoveVisibilityCoupon,
  onExtendCurrent,
  onUpgradeToVip,
  onBuyVisibilityBasic,
  onCancelVisibility,
  onPreviewClick,
  getVisibilityBadge,
  getVisibilityExpiryBadge,
}: VisibilityCardProps) {
  const applyDiscount = (baseAmount: number, coupon: Coupon | null) => {
    if (!coupon) return Math.round(baseAmount);
    const discount = (baseAmount * coupon.discountPercentage) / 100;
    return Math.round(baseAmount - discount);
  };

  const visibilityPrice =
    visibilityPackage === 'vip' ? VIP_PRICE_PER_DAY : PREMIUM_PRICE_PER_DAY;

  return (
    <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-indigo-900">
          <div className="rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 p-3">
            <TrendingUp className="h-7 w-7 text-indigo-600" />
          </div>
          <div>
            <div className="text-xl font-bold">Job List Visibility</div>
            <div className="flex items-center gap-2">
              {getVisibilityBadge()}
              <span className="text-sm font-normal text-indigo-700">
                ( {getVisibilityExpiryBadge()} )
              </span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {job.status === 'CLOSED' ? (
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <div className="text-red-800">
              <p className="font-medium">Cannot purchase visibility package</p>
              <p>
                This job is CLOSED. Please renew or OPEN this job to continue.
              </p>
            </div>
          </div>
        ) : isVipPackage ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-200/50 bg-white/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                  <CalendarIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-medium text-indigo-900">
                  Select New Expiry Date
                </span>
              </div>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !extendSelectedDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {extendSelectedDate
                        ? format(extendSelectedDate, 'PPP')
                        : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={extendSelectedDate || undefined}
                      onSelect={(date) => {
                        if (!date) return;
                        date.setHours(0, 0, 0, 0);
                        const base = job.vipExpired
                          ? new Date(job.vipExpired)
                          : new Date();
                        const max = job.deadline
                          ? new Date(job.deadline)
                          : null;
                        if (max && date > max) {
                          toast.error(
                            'Selected date cannot exceed job deadline',
                          );
                          return;
                        }
                        if (date <= base) {
                          toast.error(
                            'Selected date must be after current expiry',
                          );
                          return;
                        }
                        onExtendSelectedDateChange(new Date(date));
                      }}
                      disabled={(date) => {
                        const d = new Date(date);
                        d.setHours(0, 0, 0, 0);
                        const base = job.vipExpired
                          ? new Date(job.vipExpired)
                          : new Date();
                        const max = job.deadline
                          ? new Date(job.deadline)
                          : null;
                        if (d <= base) return true;
                        if (max && d > max) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {job.deadline && (
                <p className="mt-2 text-xs text-gray-500">
                  Must end by {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}
              {extendDaysDiff > 0 && (
                <p className="mt-1 text-xs text-gray-600">
                  You selected to extend {extendDaysDiff} day(s)
                </p>
              )}

              {/* Coupon Section for VIP */}
              <div className="mt-4 border-t border-indigo-200/50 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                    <Ticket className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-medium text-indigo-800">
                    Apply Coupon
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={visibilityCouponCode}
                    onChange={(e) =>
                      onVisibilityCouponCodeChange(e.target.value)
                    }
                    placeholder="Enter coupon code"
                    className="h-9 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                    disabled={
                      !!visibilityAppliedCoupon || visibilityCheckingCoupon
                    }
                  />
                  <Button
                    onClick={onApplyVisibilityCoupon}
                    disabled={
                      visibilityCheckingCoupon || !!visibilityAppliedCoupon
                    }
                    className="h-9 min-w-[100px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {visibilityCheckingCoupon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                  {visibilityAppliedCoupon && (
                    <Button
                      variant="outline"
                      className="h-9 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={onRemoveVisibilityCoupon}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {visibilityAppliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm text-indigo-700">
                      Applied:{' '}
                      <span className="font-medium">
                        {visibilityAppliedCoupon.code}
                      </span>{' '}
                      (-{visibilityAppliedCoupon.discountPercentage}% OFF)
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              <Button
                onClick={onExtendCurrent}
                disabled={isMaxedOut || !extendSelectedDate}
                className="h-12 w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-xl hover:from-indigo-700 hover:to-purple-700"
                aria-disabled={isMaxedOut || !extendSelectedDate}
                title={
                  isMaxedOut
                    ? "Your job visibility can't extend any more."
                    : undefined
                }
              >
                {isMaxedOut
                  ? "Your job visibility can't extend any more."
                  : !extendSelectedDate
                    ? 'Please select a date first'
                    : `Pay ${applyDiscount(Math.round(VIP_PRICE_PER_DAY * Math.max(1, extendDaysDiff || 0)), visibilityAppliedCoupon).toLocaleString('vi-VN')}₫ & extend ${Math.max(1, extendDaysDiff || 0)} days`}
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onPreviewClick('vip')}
                className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview VIP Position
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={visibilityLoading}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {visibilityLoading ? 'Canceling...' : 'Cancel Package'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Cancel visibility package?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Canceling now will end visibility immediately and no
                      refund will be issued.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction onClick={onCancelVisibility}>
                      Confirm Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : isPremiumPackage ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-indigo-200/50 bg-white/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-medium text-indigo-900">
                  Choose Action
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-200 bg-white/60 p-3 transition-colors hover:bg-white/80">
                  <input
                    type="radio"
                    name="premiumAction"
                    checked={premiumAction === 'extend'}
                    onChange={() => onPremiumActionChange('extend')}
                    className="text-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-indigo-900">
                        Extend Premium
                      </span>
                      <Badge
                        variant="outline"
                        className="border-amber-300 bg-amber-50 text-amber-700"
                      >
                        {PREMIUM_PRICE_PER_DAY.toLocaleString('vi-VN')}₫/day
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-indigo-700">
                      Extend your current premium visibility
                    </p>
                  </div>
                </label>

                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-200 bg-white/60 p-3 transition-colors hover:bg-white/80">
                  <input
                    type="radio"
                    name="premiumAction"
                    checked={premiumAction === 'upgrade'}
                    onChange={() => onPremiumActionChange('upgrade')}
                    className="text-indigo-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-indigo-900">
                        Upgrade to VIP
                      </span>
                      <Badge
                        variant="outline"
                        className="border-purple-300 bg-purple-50 text-purple-700"
                      >
                        {VIP_PRICE_PER_DAY.toLocaleString('vi-VN')}₫/day
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-indigo-700">
                      Upgrade to highest visibility tier
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="rounded-xl border border-indigo-200/50 bg-white/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                  <CalendarIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-medium text-indigo-900">
                  {premiumAction === 'extend'
                    ? 'Select New Expiry Date (Extend)'
                    : 'Select New Expiry Date (Upgrade to VIP)'}
                </span>
              </div>

              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !(premiumAction === 'extend'
                          ? extendSelectedDate
                          : upgradeSelectedDate) && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {(() => {
                        const d =
                          premiumAction === 'extend'
                            ? extendSelectedDate
                            : upgradeSelectedDate;
                        return d ? format(d, 'PPP') : 'Select date';
                      })()}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={
                        (premiumAction === 'extend'
                          ? extendSelectedDate
                          : upgradeSelectedDate) || undefined
                      }
                      onSelect={(date) => {
                        if (!date) return;
                        date.setHours(0, 0, 0, 0);
                        const base = job.vipExpired
                          ? new Date(job.vipExpired)
                          : new Date();
                        const max = job.deadline
                          ? new Date(job.deadline)
                          : null;
                        if (max && date > max) {
                          toast.error(
                            'Selected date cannot exceed job deadline',
                          );
                          return;
                        }
                        if (date <= base) {
                          toast.error(
                            'Selected date must be after current expiry',
                          );
                          return;
                        }
                        if (premiumAction === 'extend') {
                          onExtendSelectedDateChange(new Date(date));
                        } else {
                          onUpgradeSelectedDateChange(new Date(date));
                        }
                      }}
                      disabled={(date) => {
                        const d = new Date(date);
                        d.setHours(0, 0, 0, 0);
                        const base = job.vipExpired
                          ? new Date(job.vipExpired)
                          : new Date();
                        const max = job.deadline
                          ? new Date(job.deadline)
                          : null;
                        if (d <= base) return true;
                        if (max && d > max) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {job.deadline && (
                <p className="mt-2 text-xs text-gray-500">
                  Must end by {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}

              {(() => {
                const diff =
                  premiumAction === 'extend' ? extendDaysDiff : upgradeDaysDiff;
                return diff > 0 ? (
                  <p className="mt-1 text-xs text-gray-600">
                    {premiumAction === 'extend'
                      ? `You selected to extend ${diff} day(s)`
                      : `You selected to upgrade for ${diff} day(s)`}
                  </p>
                ) : null;
              })()}

              {/* Coupon Section for Premium */}
              <div className="mt-4 border-t border-indigo-200/50 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                    <Ticket className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-medium text-indigo-800">
                    Apply Coupon
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={visibilityCouponCode}
                    onChange={(e) =>
                      onVisibilityCouponCodeChange(e.target.value)
                    }
                    placeholder="Enter coupon code"
                    className="h-9 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                    disabled={
                      !!visibilityAppliedCoupon || visibilityCheckingCoupon
                    }
                  />
                  <Button
                    onClick={onApplyVisibilityCoupon}
                    disabled={
                      visibilityCheckingCoupon || !!visibilityAppliedCoupon
                    }
                    className="h-9 min-w-[100px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {visibilityCheckingCoupon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                  {visibilityAppliedCoupon && (
                    <Button
                      variant="outline"
                      className="h-9 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={onRemoveVisibilityCoupon}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {visibilityAppliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm text-indigo-700">
                      Applied:{' '}
                      <span className="font-medium">
                        {visibilityAppliedCoupon.code}
                      </span>{' '}
                      (-{visibilityAppliedCoupon.discountPercentage}% OFF)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Actions row: Pay + Preview + Cancel */}
            <div className="space-y-3">
              {/* PAY (Extend/Upgrade) */}
              {(() => {
                const selectedDate =
                  premiumAction === 'extend'
                    ? extendSelectedDate
                    : upgradeSelectedDate;
                const days =
                  premiumAction === 'extend' ? extendDaysDiff : upgradeDaysDiff;
                const pricePerDay =
                  premiumAction === 'extend'
                    ? PREMIUM_PRICE_PER_DAY
                    : VIP_PRICE_PER_DAY;

                return (
                  <Button
                    onClick={
                      premiumAction === 'extend'
                        ? onExtendCurrent
                        : onUpgradeToVip
                    }
                    disabled={isMaxedOut || !selectedDate}
                    className={cn(
                      'h-12 w-full font-semibold text-white shadow-xl',
                      premiumAction === 'upgrade'
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700',
                    )}
                    aria-disabled={isMaxedOut || !selectedDate}
                    title={
                      isMaxedOut
                        ? "Your job visibility can't extend any more."
                        : undefined
                    }
                  >
                    {isMaxedOut
                      ? "Your job visibility can't extend any more."
                      : !selectedDate
                        ? 'Please select a date first'
                        : `Pay ${applyDiscount(Math.round(pricePerDay * Math.max(1, days || 0)), visibilityAppliedCoupon).toLocaleString('vi-VN')}₫ & ${
                            premiumAction === 'extend'
                              ? `extend ${Math.max(1, days || 0)} days`
                              : `upgrade to VIP for ${Math.max(1, days || 0)} days`
                          }`}
                  </Button>
                );
              })()}

              {/* Preview Buttons */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewClick('premium')}
                  className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Premium
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewClick('vip')}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview VIP
                </Button>
              </div>

              {/* CANCEL */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={visibilityLoading}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  >
                    {visibilityLoading ? 'Canceling...' : 'Cancel Package'}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Cancel visibility package?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Canceling now will end visibility immediately and no
                      refund will be issued.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction onClick={onCancelVisibility}>
                      Confirm Cancel
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-200 bg-white/60 p-3 transition-colors hover:bg-white/80">
                <input
                  type="radio"
                  name="visibilityPackage"
                  checked={visibilityPackage === 'vip'}
                  onChange={() => onVisibilityPackageChange('vip')}
                  className="text-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-indigo-900">VIP</span>
                    <Badge
                      variant="outline"
                      className="border-purple-300 bg-purple-50 text-purple-700"
                    >
                      {VIP_PRICE_PER_DAY.toLocaleString('vi-VN')}₫/day
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-indigo-700">
                    Highest visibility, top placement
                  </p>
                </div>
              </label>
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-indigo-200 bg-white/60 p-3 transition-colors hover:bg-white/80">
                <input
                  type="radio"
                  name="visibilityPackage"
                  checked={visibilityPackage === 'premium'}
                  onChange={() => onVisibilityPackageChange('premium')}
                  className="text-indigo-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-indigo-900">Premium</span>
                    <Badge
                      variant="outline"
                      className="border-amber-300 bg-amber-50 text-amber-700"
                    >
                      {PREMIUM_PRICE_PER_DAY.toLocaleString('vi-VN')}₫/day
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-indigo-700">
                    Increased visibility, good placement
                  </p>
                </div>
              </label>
            </div>

            <div className="rounded-xl border border-indigo-200/50 bg-white/70 p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                  <CalendarIcon className="h-4 w-4 text-indigo-600" />
                </div>
                <span className="font-medium text-indigo-900">
                  Select End Date
                </span>
              </div>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !visibilitySelectedDate && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {visibilitySelectedDate
                        ? format(visibilitySelectedDate, 'PPP')
                        : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={visibilitySelectedDate || undefined}
                      onSelect={(date) => {
                        if (!date) return;
                        date.setHours(0, 0, 0, 0);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (date <= today) {
                          toast.error('End date must be after today');
                          return;
                        }
                        const dl = job?.deadline
                          ? new Date(job.deadline)
                          : null;
                        if (dl) dl.setHours(0, 0, 0, 0);
                        if (dl && date > dl) {
                          toast.error(
                            'Selected date cannot exceed job deadline',
                          );
                          return;
                        }
                        onVisibilitySelectedDateChange(new Date(date));
                      }}
                      disabled={(date) => {
                        const d = new Date(date);
                        d.setHours(0, 0, 0, 0);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        if (d <= today) return true;
                        const dl = job?.deadline
                          ? new Date(job.deadline)
                          : null;
                        if (dl) dl.setHours(0, 0, 0, 0);
                        if (dl && d > dl) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {job.deadline && (
                <p className="mt-2 text-xs text-gray-500">
                  Must end by {new Date(job.deadline).toLocaleDateString()}
                </p>
              )}

              {visibilitySelectedDate && (
                <p className="mt-1 text-xs text-gray-600">
                  You selected {Math.max(1, visibilityDaysDiff)} day(s)
                </p>
              )}

              {/* Coupon Section for Basic */}
              <div className="mt-4 border-t border-indigo-200/50 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 p-1.5">
                    <Ticket className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="font-medium text-indigo-800">
                    Apply Coupon
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={visibilityCouponCode}
                    onChange={(e) =>
                      onVisibilityCouponCodeChange(e.target.value)
                    }
                    placeholder="Enter coupon code"
                    className="h-9 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                    disabled={
                      !!visibilityAppliedCoupon || visibilityCheckingCoupon
                    }
                  />
                  <Button
                    onClick={onApplyVisibilityCoupon}
                    disabled={
                      visibilityCheckingCoupon || !!visibilityAppliedCoupon
                    }
                    className="h-9 min-w-[100px] bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    {visibilityCheckingCoupon ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                  {visibilityAppliedCoupon && (
                    <Button
                      variant="outline"
                      className="h-9 border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                      onClick={onRemoveVisibilityCoupon}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {visibilityAppliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 p-2">
                    <CheckCircle className="h-4 w-4 text-indigo-600" />
                    <p className="text-sm text-indigo-700">
                      Applied:{' '}
                      <span className="font-medium">
                        {visibilityAppliedCoupon.code}
                      </span>{' '}
                      (-{visibilityAppliedCoupon.discountPercentage}% OFF)
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onBuyVisibilityBasic}
                disabled={isProcessingPayment || !visibilitySelectedDate}
                className="h-12 w-full bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white shadow-xl hover:from-indigo-700 hover:to-purple-700"
              >
                {isProcessingPayment
                  ? 'Processing Payment...'
                  : !visibilitySelectedDate
                    ? 'Please select a date first'
                    : `Pay ${applyDiscount(Math.round(visibilityPrice * Math.max(1, visibilityDaysDiff)), visibilityAppliedCoupon).toLocaleString('vi-VN')}₫ & boost visibility for ${Math.max(1, visibilityDaysDiff)} days`}
              </Button>

              {/* Preview Buttons */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewClick('vip')}
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview VIP
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onPreviewClick('premium')}
                  className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Premium
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
