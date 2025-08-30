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
  Crown,
  Star,
  X,
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

interface TopJobCardProps {
  job: Job;
  isInTopJobs: boolean;
  totalSlotsUsed: number;
  loadingSlots: boolean;
  isUpdating: boolean;
  isProcessingPayment: boolean;
  topJobPrice: number;
  topJobSelectedDate: Date | null;
  topJobExtendDate: Date | null;
  topJobCouponCode: string;
  topJobAppliedCoupon: Coupon | null;
  topJobCheckingCoupon: boolean;
  topJobExtendDaysDiff: number;
  topJobDaysDiff: number;
  isTopJobMaxedOut: boolean;
  onTopJobSelectedDateChange: (date: Date | null) => void;
  onTopJobExtendDateChange: (date: Date | null) => void;
  onTopJobCouponCodeChange: (code: string) => void;
  onApplyTopJobCoupon: () => void;
  onRemoveTopJobCoupon: () => void;
  onExtendTopJob: () => void;
  onPaymentSubmit: () => void;
  onRemoveFromTopJobs: () => void;
  onPreviewClick: () => void;
}

export function TopJobCard({
  job,
  isInTopJobs,
  totalSlotsUsed,
  loadingSlots,
  isUpdating,
  isProcessingPayment,
  topJobPrice,
  topJobSelectedDate,
  topJobExtendDate,
  topJobCouponCode,
  topJobAppliedCoupon,
  topJobCheckingCoupon,
  topJobExtendDaysDiff,
  topJobDaysDiff,
  isTopJobMaxedOut,
  onTopJobSelectedDateChange,
  onTopJobExtendDateChange,
  onTopJobCouponCodeChange,
  onApplyTopJobCoupon,
  onRemoveTopJobCoupon,
  onExtendTopJob,
  onPaymentSubmit,
  onRemoveFromTopJobs,
  onPreviewClick,
}: TopJobCardProps) {
  const getAvailableSlotsText = () => {
    if (totalSlotsUsed >= 16) {
      return 'All 16 homepage spots are currently taken';
    }
    return `${16 - totalSlotsUsed} slots available (${totalSlotsUsed}/16 used)`;
  };

  const applyDiscount = (baseAmount: number, coupon: Coupon | null) => {
    if (!coupon) return Math.round(baseAmount);
    const discount = (baseAmount * coupon.discountPercentage) / 100;
    return Math.round(baseAmount - discount);
  };

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-amber-900">
          <div className="rounded-lg bg-gradient-to-br from-amber-100 to-yellow-100 p-3">
            <Crown className="h-7 w-7 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold">Top Job Spotlight</div>
            <div className="text-sm font-normal text-amber-700">
              Featured homepage placement
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Available Slots */}
        {!loadingSlots && (
          <div className="mb-6 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="mb-1 text-lg font-bold text-amber-900">
                    Homepage Spotlight Slots
                  </h3>
                  <div className="text-sm font-medium text-amber-700">
                    {getAvailableSlotsText()}
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="flex flex-col items-end gap-2">
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-900">
                    {16 - totalSlotsUsed}
                  </div>
                  <div className="text-xs font-medium text-amber-600">
                    Available
                  </div>
                </div>
                <div className="h-2 w-24 overflow-hidden rounded-full bg-amber-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                    style={{ width: `${(totalSlotsUsed / 16) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-amber-600">
                  {totalSlotsUsed}/16 used
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-4 border-t border-amber-200/50 pt-4">
              <div className="flex items-center gap-2 text-xs text-amber-700">
                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                <span>Featured on homepage</span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-amber-700">
                <div className="h-2 w-2 rounded-full bg-amber-400"></div>
                <span>Higher visibility to candidates</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Section */}
        {loadingSlots ? (
          <div className="py-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-sm text-gray-500">
              Loading Top Job status...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* CLOSED check */}
            {job.status === 'CLOSED' ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                  <div className="text-red-800">
                    <p className="font-medium">Cannot purchase this job</p>
                    <p>
                      This job is currently CLOSED. Please renew it or OPEN
                      before purchasing a homepage spotlight.
                    </p>
                  </div>
                </div>
              </div>
            ) : isInTopJobs ? (
              <div className="space-y-5">
                {/* EXTEND */}
                <div className="rounded-xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <p className="text-lg font-bold text-amber-900">
                          Extend Homepage Spotlight
                        </p>
                        <Crown className="h-6 w-6 text-amber-600" />
                        <Badge
                          variant="outline"
                          className="border-amber-300 bg-amber-50 text-amber-700"
                        >
                          {topJobPrice.toLocaleString('vi-VN')}₫/day
                        </Badge>
                      </div>
                      <p className="mb-4 text-sm text-amber-700">
                        Choose a new end date to extend your featured placement
                        on the homepage.
                      </p>

                      <div className="mt-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full justify-start bg-white text-left font-normal',
                                !topJobExtendDate && 'text-muted-foreground',
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {topJobExtendDate
                                ? format(topJobExtendDate, 'PPP')
                                : 'Select new end date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={topJobExtendDate || undefined}
                              onSelect={(date) => {
                                if (!date) return;
                                date.setHours(0, 0, 0, 0);
                                const base = job.topJobExpired
                                  ? new Date(job.topJobExpired)
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
                                onTopJobExtendDateChange(new Date(date));
                              }}
                              disabled={(date) => {
                                const d = new Date(date);
                                d.setHours(0, 0, 0, 0);
                                const base = job.topJobExpired
                                  ? new Date(job.topJobExpired)
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

                        {job.deadline && (
                          <p className="mt-2 text-xs text-amber-800/70">
                            Must end by{' '}
                            {new Date(job.deadline).toLocaleDateString()}
                          </p>
                        )}
                        {topJobExtendDaysDiff > 0 && (
                          <p className="mt-2 text-xs text-amber-800/70">
                            You selected to extend {topJobExtendDaysDiff} day(s)
                          </p>
                        )}
                      </div>

                      {/* Coupon Section for Top Job Extend */}
                      <div className="mt-4 border-t border-amber-200/50 pt-4">
                        <div className="mb-3 flex items-center gap-2">
                          <div className="rounded-full bg-amber-100 p-1.5">
                            <Ticket className="h-4 w-4 text-amber-600" />
                          </div>
                          <span className="font-medium text-amber-800">
                            Apply Coupon
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            value={topJobCouponCode}
                            onChange={(e) =>
                              onTopJobCouponCodeChange(e.target.value)
                            }
                            placeholder="Enter coupon code"
                            className="h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                            disabled={
                              !!topJobAppliedCoupon || topJobCheckingCoupon
                            }
                          />
                          <Button
                            onClick={onApplyTopJobCoupon}
                            disabled={
                              topJobCheckingCoupon || !!topJobAppliedCoupon
                            }
                            className="h-10 min-w-[100px] bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                          >
                            {topJobCheckingCoupon ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              'Apply'
                            )}
                          </Button>
                          {topJobAppliedCoupon && (
                            <Button
                              variant="outline"
                              className="h-10 border-amber-300 text-amber-700 hover:bg-amber-50"
                              onClick={onRemoveTopJobCoupon}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        {topJobAppliedCoupon && (
                          <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
                            <CheckCircle className="h-4 w-4 text-amber-600" />
                            <p className="text-sm text-amber-800">
                              Applied:{' '}
                              <span className="font-medium">
                                {topJobAppliedCoupon.code}
                              </span>{' '}
                              (-{topJobAppliedCoupon.discountPercentage}% OFF)
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-4">
                        <Button
                          onClick={onExtendTopJob}
                          disabled={isTopJobMaxedOut || !topJobExtendDate}
                          className="h-12 w-full bg-gradient-to-r from-amber-600 to-orange-600 font-semibold text-white shadow-xl hover:from-amber-700 hover:to-orange-700"
                          aria-disabled={isTopJobMaxedOut || !topJobExtendDate}
                          title={
                            isTopJobMaxedOut
                              ? "Spotlight is already at the job's deadline."
                              : undefined
                          }
                        >
                          {isTopJobMaxedOut
                            ? 'Spotlight reached job deadline'
                            : !topJobExtendDate
                              ? 'Please select a date first'
                              : `Pay ${applyDiscount(Math.round(topJobPrice * Math.max(1, topJobExtendDaysDiff || 0)), topJobAppliedCoupon).toLocaleString('vi-VN')}₫ & extend spotlight ${Math.max(1, topJobExtendDaysDiff || 0)} days`}
                        </Button>
                      </div>

                      <div className="mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={onPreviewClick}
                          className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Preview Homepage Spotlight
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* REMOVE */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isUpdating}
                      variant="outline"
                      size="lg"
                      className="w-full border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="mr-2 h-5 w-5" />
                      {isUpdating
                        ? 'Removing...'
                        : 'Remove from Homepage Spotlight'}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Remove from Homepage Spotlight?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This job is currently featured. Removing now will stop
                        the homepage spotlight immediately and no refund will be
                        issued.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <AlertDialogAction onClick={onRemoveFromTopJobs}>
                        Confirm Remove
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ) : (
              <div className="space-y-4">
                {totalSlotsUsed >= 16 ? (
                  <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
                    <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                    <div className="text-red-800">
                      <p className="font-medium">No spots available</p>
                      <p>
                        All 16 homepage spots are currently taken. Please try
                        again later.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="rounded-xl border border-amber-200 bg-white/80 p-6 shadow-lg">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 p-3">
                          <Crown className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-2">
                            <p className="text-lg font-bold text-amber-900">
                              Feature on Homepage
                            </p>
                            <Badge
                              variant="outline"
                              className="border-amber-300 bg-amber-50 text-amber-700"
                            >
                              {topJobPrice.toLocaleString('vi-VN')}₫/day
                            </Badge>
                          </div>
                          <p className="mb-4 text-sm text-amber-700">
                            Stand out to candidates with prime placement on the
                            homepage.
                          </p>

                          <div className="mt-3">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full justify-start bg-white text-left font-normal',
                                    !topJobSelectedDate &&
                                      'text-muted-foreground',
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {topJobSelectedDate
                                    ? format(topJobSelectedDate, 'PPP')
                                    : 'Select end date'}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={topJobSelectedDate || undefined}
                                  onSelect={(date) => {
                                    if (!date) return;
                                    date.setHours(0, 0, 0, 0);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    if (date <= today) {
                                      toast.error(
                                        'End date must be after today',
                                      );
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
                                    onTopJobSelectedDateChange(new Date(date));
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

                            {job.deadline && (
                              <p className="mt-2 text-xs text-amber-800/70">
                                Must end by{' '}
                                {new Date(job.deadline).toLocaleDateString()}
                              </p>
                            )}
                            {topJobSelectedDate && (
                              <p className="mt-2 text-xs text-amber-800/70">
                                You selected {Math.max(1, topJobDaysDiff)}{' '}
                                day(s)
                              </p>
                            )}
                          </div>

                          {/* Coupon Section for New Top Job */}
                          <div className="mt-4 border-t border-amber-200/50 pt-4">
                            <div className="mb-3 flex items-center gap-2">
                              <div className="rounded-full bg-amber-100 p-1.5">
                                <Ticket className="h-4 w-4 text-amber-600" />
                              </div>
                              <span className="font-medium text-amber-800">
                                Apply Coupon
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <Input
                                value={topJobCouponCode}
                                onChange={(e) =>
                                  onTopJobCouponCodeChange(e.target.value)
                                }
                                placeholder="Enter coupon code"
                                className="h-10 border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                                disabled={
                                  !!topJobAppliedCoupon || topJobCheckingCoupon
                                }
                              />
                              <Button
                                onClick={onApplyTopJobCoupon}
                                disabled={
                                  topJobCheckingCoupon || !!topJobAppliedCoupon
                                }
                                className="h-10 min-w-[100px] bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                              >
                                {topJobCheckingCoupon ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  'Apply'
                                )}
                              </Button>
                              {topJobAppliedCoupon && (
                                <Button
                                  variant="outline"
                                  className="h-10 border-amber-300 text-amber-700 hover:bg-amber-50"
                                  onClick={onRemoveTopJobCoupon}
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                            {topJobAppliedCoupon && (
                              <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2">
                                <CheckCircle className="h-4 w-4 text-amber-600" />
                                <p className="text-sm text-amber-800">
                                  Applied:{' '}
                                  <span className="font-medium">
                                    {topJobAppliedCoupon.code}
                                  </span>{' '}
                                  (-{topJobAppliedCoupon.discountPercentage}%
                                  OFF)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={onPaymentSubmit}
                        disabled={
                          isUpdating ||
                          isProcessingPayment ||
                          !topJobSelectedDate
                        }
                        size="lg"
                        className="h-12 w-full bg-gradient-to-r from-amber-600 to-orange-600 font-semibold text-white shadow-xl hover:from-amber-700 hover:to-orange-700"
                      >
                        <Star className="mr-2 h-5 w-5" />
                        {isProcessingPayment
                          ? 'Processing Payment...'
                          : !topJobSelectedDate
                            ? 'Please select a date first'
                            : `Pay ${applyDiscount(Math.round(topJobPrice * Math.max(1, topJobDaysDiff)), topJobAppliedCoupon).toLocaleString('vi-VN')}₫ & feature on homepage`}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={onPreviewClick}
                        className="w-full border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview Homepage Spotlight
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
