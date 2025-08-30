'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Crown,
  Star,
  Zap,
  Calendar,
  TrendingUp,
  Check,
  AlertTriangle,
  X,
  Ticket,
  Loader2,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { Company } from '@/types/Company';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { Coupon, couponService } from '@/services/api/coupons/coupon-api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { CompanyPromotionPreview } from './CompanyPromotionPreview';

// VIP Package Configuration
const VIP_PACKAGES = [
  { days: 15, label: '15 Days', price: 130000, popular: false },
  { days: 30, label: '30 Days', price: 220000, popular: true },
  { days: 45, label: '45 Days', price: 300000, popular: false },
];

const PRICE_PER_DAY = 10000; // 10,000 VNĐ per day

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

const formatDateForInput = (dateString: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

interface PromotionFormData {
  promotionType: 'normal' | 'vip';
  vipPackage: '15' | '30' | '45' | 'custom';
  vipExpired: string;
  customDays: string;
}

interface CompanyPromotionModalProps {
  company: Company;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCompany: (data: Partial<Company>) => Promise<void>;
}

export default function CompanyPromotionModal({
  company,
  isOpen,
  onClose,
  onUpdateCompany,
}: CompanyPromotionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isCancellingVIP, setIsCancellingVIP] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCheckingCoupon, setIsCheckingCoupon] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Determine current promotion type
  const currentPromotionType =
    company.priorityPosition === 1 ? 'vip' : 'normal';
  const isCurrentlyVip = currentPromotionType === 'vip';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<PromotionFormData>({
    defaultValues: {
      promotionType: currentPromotionType,
      vipPackage: '15', // Default to 15 days for new users
      vipExpired: formatDateForInput(company.vipExpired || ''),
      customDays: '',
    },
  });

  const promotionType = watch('promotionType');
  const vipPackage = watch('vipPackage');

  useEffect(() => {
    reset({
      promotionType: currentPromotionType,
      vipPackage: '15', // Default to 15 days for new users
      vipExpired: formatDateForInput(company.vipExpired || ''),
      customDays: '',
    });
  }, [company, reset, currentPromotionType]);

  const onSubmit = async (data: PromotionFormData) => {
    try {
      setIsLoading(true);

      let vipExpiredDate = null;
      let durationDays = 0;

      if (data.promotionType === 'vip') {
        if (data.vipPackage === 'custom') {
          // Use custom date provided by user
          vipExpiredDate = data.vipExpired || null;

          if (vipExpiredDate) {
            if (isCurrentlyVip && company.vipExpired) {
              // Calculate extension days
              const currentExpiry = new Date(company.vipExpired);
              const newExpiry = new Date(vipExpiredDate);
              durationDays = Math.ceil(
                (newExpiry.getTime() - currentExpiry.getTime()) /
                  (1000 * 60 * 60 * 24),
              );
            } else {
              // Calculate new VIP days
              const today = new Date();
              const expiry = new Date(vipExpiredDate);
              durationDays = Math.ceil(
                (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
              );
            }
          }
        } else {
          // Calculate expiration date based on package
          const packageDays = parseInt(data.vipPackage);
          durationDays = packageDays;

          if (isCurrentlyVip && company.vipExpired) {
            // Extension: add days to current expiry
            const currentExpiry = new Date(company.vipExpired);
            const expirationDate = new Date(currentExpiry);
            expirationDate.setDate(currentExpiry.getDate() + packageDays);
            vipExpiredDate = expirationDate.toISOString().split('T')[0];
          } else {
            // New VIP: add days to today
            const currentDate = new Date();
            const expirationDate = new Date(currentDate);
            expirationDate.setDate(currentDate.getDate() + packageDays);
            vipExpiredDate = expirationDate.toISOString().split('T')[0];
          }
        }
      }

      // Calculate total amount
      let baseAmount = 0;
      let totalAmount = 0;

      if (data.promotionType === 'vip') {
        if (data.vipPackage === 'custom') {
          // Custom package: calculate based on duration days
          baseAmount = Math.max(1, durationDays || 0) * PRICE_PER_DAY;
        } else {
          // Pre-defined packages: use package price directly
          const packagePrice =
            VIP_PACKAGES.find((pkg) => pkg.days.toString() === data.vipPackage)
              ?.price || 0;
          baseAmount = packagePrice;
        }

        // Apply coupon discount
        totalAmount = applyDiscount(baseAmount, appliedCoupon);
      } else {
        // Normal promotion: no cost
        baseAmount = 0;
        totalAmount = 0;
      }

      // Prepare payment data for storage
      const paymentData = {
        amountVnd: totalAmount,
        baseAmount: baseAmount, // Store original amount before discount
        coupon: appliedCoupon
          ? {
              id: appliedCoupon.id,
              code: appliedCoupon.code,
              discountPercentage: appliedCoupon.discountPercentage,
            }
          : null,
        companyId: company.id,
        durationDays: durationDays,
        priorityPosition: data.promotionType === 'vip' ? 1 : 3,
        vipExpired: vipExpiredDate,
        isExtension: isCurrentlyVip && company.vipExpired,
        packageType: data.vipPackage,
        basePricePerDay: PRICE_PER_DAY,
        timestamp: new Date().toISOString(),
      };

      // Store payment data in localStorage
      localStorage.setItem('topCompanyPayment', JSON.stringify(paymentData));

      // Create PayOS payment
      const orderCode = Date.now();
      const description =
        data.promotionType === 'vip'
          ? isCurrentlyVip && company.vipExpired
            ? `VIP Extension ${durationDays}d`
            : `VIP Upgrade ${durationDays}d`
          : 'Company Settings Update';

      const payosPaymentData = {
        amount: totalAmount, // Use the correctly calculated amount with coupon discount
        description: description,
        orderCode: orderCode,
        returnUrl: `${window.location.origin}/co/profile/top-company-success`,
        cancelUrl: `${window.location.origin}/co/profile/top-company-failed`,
      };

      const response = await payosService.createPaymentLink(payosPaymentData);
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Failed to create payment:', error);
      toast.error('Failed to create payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelVIP = async () => {
    if (!company) return;

    setIsCancellingVIP(true);
    try {
      // Update company to normal status
      await onUpdateCompany({
        priorityPosition: 3, // Basic priority
        vipExpired: null, // Remove VIP expiration
      });

      toast.success(
        'VIP package cancelled successfully. Your company is now on normal status.',
      );
      setIsCancelDialogOpen(false);
      onClose(); // Close the modal
    } catch (error) {
      console.error('Failed to cancel VIP package:', error);
      toast.error('Failed to cancel VIP package. Please try again.');
    } finally {
      setIsCancellingVIP(false);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-gray-900">
            <Crown className="h-6 w-6 text-orange-500" />
            Company Promotion
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-500">
            Upgrade your company to VIP status for better visibility and
            priority positioning.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-8">
          {/* Current Status */}
          <div className="rounded-lg border border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
            <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Current Status
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Priority Level:</span>
                <span
                  className={`font-semibold ${isCurrentlyVip ? 'text-orange-600' : 'text-gray-600'}`}
                >
                  {isCurrentlyVip ? '🌟 VIP Priority ' : '📋 Normal Priority'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>VIP Status:</span>
                <span className="font-medium">
                  {company.vipExpired
                    ? `Active until ${format(new Date(company.vipExpired), 'MMM dd, yyyy')}`
                    : 'Not active'}
                </span>
              </div>

              {/* Cancel VIP Button - Only show when company is currently VIP */}
              {isCurrentlyVip && company.vipExpired && (
                <div className="mt-4 border-t border-gray-200 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsCancelDialogOpen(true)}
                    className="w-full border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel VIP Package
                  </Button>
                  <p className="mt-2 text-center text-xs text-gray-500">
                    Cancelling will immediately downgrade to Normal status
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Promotion Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Choose Promotion Level
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Normal Option */}
              <div
                className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                  promotionType === 'normal'
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setValue('promotionType', 'normal')}
              >
                <input
                  {...register('promotionType')}
                  type="radio"
                  value="normal"
                  className="sr-only"
                />
                <div className="flex items-start gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 p-3">
                    <Star className="h-6 w-6 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Normal
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Standard company listing
                    </p>
                  </div>
                </div>

                {/* đưa ul ra ngoài và thụt riêng */}
                <ul className="mt-3 space-y-1 pl-1 text-sm text-gray-500">
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    Standard company profile
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    Basic search visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    Regular job posting
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500" />
                    Standard support
                  </li>
                </ul>

                <div className="mt-4 flex justify-center">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2">
                    <span className="text-xl font-bold text-green-700">
                      Free
                    </span>
                  </div>
                </div>

                {promotionType === 'normal' && (
                  <div className="absolute top-3 right-3">
                    <div className="rounded-full bg-blue-500 p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>

              {/* VIP Option */}
              <div
                className={`relative cursor-pointer rounded-2xl border-2 p-6 transition-all ${
                  promotionType === 'vip'
                    ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-amber-50 ring-2 ring-orange-500/20'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
                onClick={() => setValue('promotionType', 'vip')}
              >
                <input
                  {...register('promotionType')}
                  type="radio"
                  value="vip"
                  className="sr-only"
                />

                {/* VIP Badge */}
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-400 to-amber-500 px-2 py-1 text-xs font-bold text-white">
                    <Crown className="h-3 w-3" />
                    VIP
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-3">
                    <Crown className="h-6 w-6 text-white" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-lg font-semibold text-gray-900">
                      VIP Priority
                    </h4>
                    <p className="mt-1 text-sm font-medium text-orange-600">
                      Maximum visibility and features
                    </p>
                  </div>
                </div>

                {/* đưa ul ra ngoài và thụt riêng */}
                <ul className="mt-3 space-y-1 pl-1 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-orange-500" />
                    <span className="font-medium">
                      {' '}
                      Top priority position #1
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-orange-500" />
                    Featured in top companies
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-orange-500" />
                    Enhanced search visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-orange-500" />
                    Premium company badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-orange-500" />
                    24/7 Support
                  </li>
                </ul>

                <div className="mt-4 flex justify-center">
                  <div className="inline-flex flex-col items-center gap-1">
                    <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-2">
                      <span className="text-xl font-bold text-orange-600">
                        {promotionType === 'vip' && vipPackage !== 'custom'
                          ? formatVND(
                              VIP_PACKAGES.find(
                                (pkg) => pkg.days.toString() === vipPackage,
                              )?.price || 0,
                            )
                          : 'Premium'}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {promotionType === 'vip' && vipPackage !== 'custom'
                        ? 'Full package price'
                        : 'Select package below'}
                    </span>
                  </div>
                </div>

                {/* Pricing with Coupon Discount */}
                {promotionType === 'vip' && vipPackage !== 'custom' && (
                  <div className="mt-3 rounded-lg border border-orange-200/50 bg-white/60 p-3">
                    <div className="space-y-2 text-center">
                      {appliedCoupon ? (
                        <>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <span>Original Price:</span>
                            <span className="line-through">
                              {formatVND(
                                VIP_PACKAGES.find(
                                  (pkg) => pkg.days.toString() === vipPackage,
                                )?.price || 0,
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                            <span>Discount:</span>
                            <span className="font-semibold">
                              -{appliedCoupon.discountPercentage}%
                            </span>
                          </div>
                          <div className="text-lg font-bold text-orange-600">
                            Final Price:{' '}
                            {formatVND(
                              applyDiscount(
                                VIP_PACKAGES.find(
                                  (pkg) => pkg.days.toString() === vipPackage,
                                )?.price || 0,
                                appliedCoupon,
                              ),
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-600">
                          Apply a coupon to get a discount!
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {promotionType === 'vip' && (
                  <div className="absolute top-3 left-3">
                    <div className="rounded-full bg-orange-500 p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* VIP Expiration Date (only show when VIP is selected) */}
          {promotionType === 'vip' && (
            <div className="space-y-6 rounded-lg border border-orange-200 bg-orange-50 p-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-500" />
                <h4 className="text-lg font-semibold text-gray-900">
                  {isCurrentlyVip && company.vipExpired
                    ? 'Extend VIP Status'
                    : 'Choose VIP Package'}
                </h4>
              </div>

              {/* VIP Packages */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {VIP_PACKAGES.map((pkg) => (
                  <div
                    key={pkg.days}
                    className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      vipPackage === pkg.days.toString()
                        ? 'border-orange-500 bg-white ring-2 ring-orange-500/20'
                        : 'border-orange-200 bg-white hover:border-orange-300'
                    }`}
                    onClick={() =>
                      setValue(
                        'vipPackage',
                        pkg.days.toString() as '15' | '30' | '45',
                      )
                    }
                  >
                    <input
                      {...register('vipPackage')}
                      type="radio"
                      value={pkg.days}
                      className="sr-only"
                    />

                    {/* Popular Badge */}
                    {pkg.popular && (
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                        <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-3 py-1 text-xs font-bold text-white">
                          Popular 🔥
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {pkg.label}
                      </div>
                      <div className="mt-1 text-xl font-bold text-orange-600">
                        {formatVND(pkg.price)}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        {formatVND(PRICE_PER_DAY)}/day
                      </div>
                    </div>

                    {/* Selection Indicator */}
                    {vipPackage === pkg.days.toString() && (
                      <div className="absolute top-2 right-2">
                        <div className="rounded-full bg-orange-500 p-1">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Custom Package Option */}
              <div className="mt-4">
                <div
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    vipPackage === 'custom'
                      ? 'border-orange-500 bg-white ring-2 ring-orange-500/20'
                      : 'border-orange-200 bg-white hover:border-orange-300'
                  }`}
                  onClick={() => setValue('vipPackage', 'custom')}
                >
                  <input
                    {...register('vipPackage')}
                    type="radio"
                    value="custom"
                    className="sr-only"
                  />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">
                        {isCurrentlyVip && company.vipExpired
                          ? 'Custom Extension'
                          : 'Custom Package'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {isCurrentlyVip && company.vipExpired
                          ? 'Choose your own extension period'
                          : 'Choose your own duration'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        {formatVND(PRICE_PER_DAY)}/day
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Days Input */}
                {vipPackage === 'custom' && (
                  <div className="mt-3">
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      {isCurrentlyVip && company.vipExpired
                        ? 'New End Date'
                        : 'End Date'}
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start border-orange-300 bg-white text-left font-normal hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20',
                            !watch('vipExpired') && 'text-muted-foreground',
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          {watch('vipExpired')
                            ? format(new Date(watch('vipExpired')), 'PPP')
                            : isCurrentlyVip && company.vipExpired
                              ? 'Select new end date'
                              : 'Select end date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={
                            watch('vipExpired')
                              ? new Date(watch('vipExpired'))
                              : undefined
                          }
                          onSelect={(date) => {
                            if (!date) return;
                            date.setHours(0, 0, 0, 0);

                            if (isCurrentlyVip && company.vipExpired) {
                              // Extension logic: must be after current VIP expiry
                              const currentVipExpiry = new Date(
                                company.vipExpired,
                              );
                              currentVipExpiry.setHours(0, 0, 0, 0);

                              if (date <= currentVipExpiry) {
                                toast.error(
                                  'New end date must be after current VIP expiry',
                                );
                                return;
                              }
                            } else {
                              // New VIP logic: must be after today
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);

                              if (date <= today) {
                                toast.error('End date must be after today');
                                return;
                              }
                            }

                            setValue('vipExpired', date.toISOString());
                          }}
                          disabled={(date) => {
                            const d = new Date(date);
                            d.setHours(0, 0, 0, 0);

                            if (isCurrentlyVip && company.vipExpired) {
                              // Extension: disable dates before current VIP expiry
                              const currentVipExpiry = new Date(
                                company.vipExpired,
                              );
                              currentVipExpiry.setHours(0, 0, 0, 0);
                              return d <= currentVipExpiry;
                            } else {
                              // New VIP: disable dates before today
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return d <= today;
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.vipExpired && (
                      <p className="mt-2 text-sm text-red-500">
                        {errors.vipExpired.message}
                      </p>
                    )}

                    {/* Extension Info */}
                    {isCurrentlyVip && company.vipExpired && (
                      <div className="mt-2 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <div className="flex items-center gap-2 text-sm text-blue-800">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            Current VIP expires:{' '}
                            <strong>
                              {format(new Date(company.vipExpired), 'PPP')}
                            </strong>
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-blue-600">
                          <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                          <span>
                            Select a date after current expiry to extend
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Package pricing note */}
              <div className="text-center text-sm text-gray-600">
                {isCurrentlyVip && company.vipExpired
                  ? '💡 Extend your VIP status to maintain premium features'
                  : '💡 All packages include premium features and can be extended anytime'}
              </div>

              {/* Coupon Section */}
              <div className="mt-4 border-t border-orange-200/50 pt-4">
                <div className="mb-3 flex items-center gap-2">
                  <div className="rounded-full bg-orange-100 p-1.5">
                    <Ticket className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="font-medium text-orange-800">
                    Apply Coupon
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="h-10 border-orange-200 focus:border-orange-400 focus:ring-orange-400"
                    disabled={!!appliedCoupon || isCheckingCoupon}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={isCheckingCoupon || !!appliedCoupon}
                    className="h-10 min-w-[100px] bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
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
                      className="h-10 border-orange-300 text-orange-700 hover:bg-orange-50"
                      onClick={handleRemoveCoupon}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 p-2">
                    <CheckCircle className="h-4 w-4 text-orange-600" />
                    <p className="text-sm text-orange-800">
                      Applied:{' '}
                      <span className="font-medium">{appliedCoupon.code}</span>{' '}
                      (-{appliedCoupon.discountPercentage}% OFF)
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-3 border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="px-6"
            >
              Close
            </Button>
            {promotionType === 'vip' && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPreview(true)}
                  disabled={isLoading}
                  className="border-orange-300 px-6 text-orange-700 hover:bg-orange-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview VIP
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-orange-500 to-amber-600 px-6 text-white hover:from-orange-600 hover:to-amber-700"
                >
                  {isLoading
                    ? 'Preparing Payment...'
                    : isCurrentlyVip && company.vipExpired
                      ? '💳 Process Extension Payment'
                      : '💳 Process VIP Payment'}
                </Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>

      {/* Cancel VIP Confirmation Dialog */}
      <AlertDialog
        open={isCancelDialogOpen}
        onOpenChange={setIsCancelDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Confirm VIP Package Cancellation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-700">
              <div className="space-y-3">
                <p>
                  Are you sure you want to cancel the VIP package for your
                  company?
                </p>

                {/* Current VIP Info */}
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
                  <div className="mb-2 text-sm font-medium text-orange-800">
                    Current Package Information:
                  </div>
                  <div className="space-y-1 text-xs text-orange-700">
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="font-semibold">🌟 VIP Priority</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span className="font-semibold">
                        {company.vipExpired
                          ? format(new Date(company.vipExpired), 'MMM dd, yyyy')
                          : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-semibold">
                        {company.vipExpired
                          ? Math.max(
                              0,
                              Math.ceil(
                                (new Date(company.vipExpired).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24),
                              ),
                            ) + ' days'
                          : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warning */}
                <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                  <div className="mb-2 flex items-center gap-2 text-red-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-semibold">Important Warnings:</span>
                  </div>
                  <ul className="space-y-1 text-xs text-red-700">
                    <li>
                      • <strong>No refunds</strong> will be provided when
                      cancelling VIP package
                    </li>
                    <li>
                      • Company will be immediately downgraded to Normal status
                    </li>
                    <li>
                      • All VIP benefits will be lost (priority #1, featured
                      status, etc.)
                    </li>
                    <li>• You can purchase VIP package again anytime</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isCancellingVIP}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Keep VIP Package
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelVIP}
              disabled={isCancellingVIP}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isCancellingVIP ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                  Cancelling...
                </>
              ) : (
                'Confirm Cancellation'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Company Promotion Preview */}
      <CompanyPromotionPreview
        showPreview={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </Dialog>
  );
}
