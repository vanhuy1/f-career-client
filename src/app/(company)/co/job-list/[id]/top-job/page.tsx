'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, Clock, CalendarX, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { jobService } from '@/services/api/jobs/job-api';
import { payosService } from '@/services/api/payment/payos-api';
import { Job } from '@/types/Job';
import { couponService, type Coupon } from '@/services/api/coupons/coupon-api';
import { useJobDetail } from '@/hooks/use-job-detail';

// Import components
import {
  TopJobCard,
  VisibilityCard,
  Sidebar,
  JobListPreview,
  TopJobPreview,
} from './_components';

// Constants
const VIP_PRICE_PER_DAY = 12000; // VND / day
const PREMIUM_PRICE_PER_DAY = 10000; // VND / day

export default function TopJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  // Fetch job data for header
  useJobDetail(jobId);

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [nextAvailableSlot, setNextAvailableSlot] = useState<number>(0);
  const [totalSlotsUsed, setTotalSlotsUsed] = useState<number>(0);
  const [isInTopJobs, setIsInTopJobs] = useState<boolean>(false);
  const [displayDays] = useState<number>(1);
  const [topJobPrice, setTopJobPrice] = useState<number>(20000); // 10,000 VND / day
  const [visibilityPackage, setVisibilityPackage] = useState<'vip' | 'premium'>(
    'vip',
  );
  console.log('Top Job Price:', setTopJobPrice);
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [extendSelectedDate, setExtendSelectedDate] = useState<Date | null>(
    null,
  );

  const [upgradeSelectedDate, setUpgradeSelectedDate] = useState<Date | null>(
    null,
  );
  const [topJobSelectedDate, setTopJobSelectedDate] = useState<Date | null>(
    null,
  );
  const [visibilitySelectedDate, setVisibilitySelectedDate] =
    useState<Date | null>(null);
  const [premiumAction, setPremiumAction] = useState<'extend' | 'upgrade'>(
    'extend',
  );
  const [topJobExtendDate, setTopJobExtendDate] = useState<Date | null>(null);

  // Coupon states (separated)
  const [topJobCouponCode, setTopJobCouponCode] = useState('');
  const [topJobAppliedCoupon, setTopJobAppliedCoupon] = useState<Coupon | null>(
    null,
  );
  const [topJobCheckingCoupon, setTopJobCheckingCoupon] = useState(false);

  const [visibilityCouponCode, setVisibilityCouponCode] = useState('');
  const [visibilityAppliedCoupon, setVisibilityAppliedCoupon] =
    useState<Coupon | null>(null);
  const [visibilityCheckingCoupon, setVisibilityCheckingCoupon] =
    useState(false);

  // Preview states
  const [previewPackage, setPreviewPackage] = useState<
    'vip' | 'premium' | 'basic' | null
  >(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showTopJobPreview, setShowTopJobPreview] = useState(false);

  // Helper: calculate discounted price
  const applyDiscount = (baseAmount: number, coupon: Coupon | null) => {
    if (!coupon) return Math.round(baseAmount);
    const discount = (baseAmount * coupon.discountPercentage) / 100;
    return Math.round(baseAmount - discount);
  };

  const handleApplyTopJobCoupon = async () => {
    if (!topJobCouponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setTopJobCheckingCoupon(true);
    try {
      const coupons = await couponService.findAll();
      const coupon = coupons.find(
        (c) => c.code.toLowerCase() === topJobCouponCode.toLowerCase(),
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

      setTopJobAppliedCoupon(coupon);
      setTopJobCouponCode('');
      toast.success(
        `Coupon applied! You got ${coupon.discountPercentage}% OFF`,
      );
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setTopJobCheckingCoupon(false);
    }
  };

  const removeTopJobCoupon = () => {
    setTopJobAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleApplyVisibilityCoupon = async () => {
    if (!visibilityCouponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setVisibilityCheckingCoupon(true);
    try {
      const coupons = await couponService.findAll();
      const coupon = coupons.find(
        (c) => c.code.toLowerCase() === visibilityCouponCode.toLowerCase(),
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

      setVisibilityAppliedCoupon(coupon);
      setVisibilityCouponCode('');
      toast.success(
        `Coupon applied! You got ${coupon.discountPercentage}% OFF`,
      );
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setVisibilityCheckingCoupon(false);
    }
  };

  const removeVisibilityCoupon = () => {
    setVisibilityAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const isVipPackage = job?.priorityPosition === 1;
  const isPremiumPackage = job?.priorityPosition === 2;

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString() : 'N/A';

  const topJobDaysDiff = (() => {
    if (!topJobSelectedDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const t = new Date(topJobSelectedDate);
    t.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.ceil((t.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    );
  })();

  const visibilityDaysDiff = (() => {
    if (!visibilitySelectedDate) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const t = new Date(visibilitySelectedDate);
    t.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.ceil((t.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    );
  })();

  const computeNewExpiry = (baseISO?: string, addDays?: number) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const base = baseISO ? new Date(baseISO) : now;
    if (base < now) base.setTime(now.getTime());
    const days = Math.max(1, addDays || displayDays);
    const exp = new Date(base);
    exp.setDate(exp.getDate() + days);
    return exp;
  };

  const startVisibilityPayment = async (
    pkg: 'vip' | 'premium',
    days: number,
    baseISO?: string,
  ) => {
    if (!job) return;
    if (job.status === 'CLOSED') {
      toast.error(
        'Cannot purchase visibility package for CLOSED job. Please renew to OPEN.',
      );
      return;
    }
    const newExp = computeNewExpiry(baseISO, days);
    if (job.deadline) {
      const dl = new Date(job.deadline);
      dl.setHours(0, 0, 0, 0);
      if (newExp > dl) {
        toast.error('Selected days exceed the current job deadline');
        return;
      }
    }

    const baseAmountVnd =
      (pkg === 'vip' ? VIP_PRICE_PER_DAY : PREMIUM_PRICE_PER_DAY) *
      Math.max(1, days);
    const finalAmountVnd = applyDiscount(
      Math.round(baseAmountVnd),
      visibilityAppliedCoupon,
    );
    localStorage.setItem(
      'VISIBILITY_PACKAGE_DATA',
      JSON.stringify({
        jobId: job.id,
        packageType: pkg,
        durationDays: Math.max(1, days),
        priorityPosition: pkg === 'vip' ? 1 : 2,
        vipExpired: newExp.toISOString(),
        amountVnd: finalAmountVnd,
        amount: finalAmountVnd, // For payment history API
        coupon: visibilityAppliedCoupon
          ? {
              id: visibilityAppliedCoupon.id,
              code: visibilityAppliedCoupon.code,
              discountPercentage: visibilityAppliedCoupon.discountPercentage,
            }
          : null,
      }),
    );

    setIsProcessingPayment(true);
    try {
      const orderCode = Date.now();
      const response = await payosService.createPaymentLink({
        amount: finalAmountVnd,
        description: `${pkg === 'vip' ? 'VIP' : 'Premium'} Visibility ${Math.max(1, days)}d`,
        orderCode,
        returnUrl: `${window.location.origin}/co/visibility-payment-success`,
        cancelUrl: `${window.location.origin}/co/visibility-payment-failed`,
      });
      window.location.href = response.checkoutUrl;
    } catch (e) {
      console.error(e);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleCancelVisibility = async () => {
    if (!job) return;
    const daysLeft = job.vipExpired
      ? Math.ceil(
          (new Date(job.vipExpired).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        )
      : 0;
    try {
      console.log(daysLeft);
      setVisibilityLoading(true);
      await jobService.update(job.id!, {
        priorityPosition: 3,
        vipExpired: undefined,
      });
      toast.success('Visibility package canceled');
      setJob({ ...job, priorityPosition: 3, vipExpired: undefined });
    } catch (e) {
      toast.error('Failed to cancel package');
      console.log('Error canceling visibility package:', e);
    } finally {
      setVisibilityLoading(false);
    }
  };

  // Handle upgrade to VIP
  const handleUpgradeToVip = async () => {
    if (!job) return;
    const base = job.vipExpired ? new Date(job.vipExpired) : new Date();
    base.setHours(0, 0, 0, 0);
    const target = upgradeSelectedDate ? new Date(upgradeSelectedDate) : null;
    if (!target) {
      toast.error('Please select a target expiry date for upgrade');
      return;
    }
    target.setHours(0, 0, 0, 0);
    const days = Math.max(
      0,
      Math.ceil((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)),
    );
    if (days <= 0) {
      toast.error('Selected date must be after current expiry');
      return;
    }
    await startVisibilityPayment('vip', days, job?.vipExpired);
  };

  // Handle extend current
  const handleExtendCurrent = async () => {
    if (!job) return;
    const base = job.vipExpired ? new Date(job.vipExpired) : new Date();
    base.setHours(0, 0, 0, 0);
    const target = extendSelectedDate ? new Date(extendSelectedDate) : null;
    if (!target) {
      toast.error('Please select a target expiry date to extend');
      return;
    }
    target.setHours(0, 0, 0, 0);
    const days = Math.max(
      0,
      Math.ceil((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)),
    );
    if (days <= 0) {
      toast.error('Selected date must be after current expiry');
      return;
    }
    const pkg: 'vip' | 'premium' = isVipPackage ? 'vip' : 'premium';
    await startVisibilityPayment(pkg, days, job?.vipExpired);
  };

  // [ADD] Mua mới visibility (Basic) bằng end-date
  const handleBuyVisibilityBasic = async () => {
    if (!job) return;

    if (job.status === 'CLOSED') {
      toast.error(
        'Cannot purchase visibility package for CLOSED job. Please renew or OPEN this job first.',
      );
      return;
    }

    if (!visibilitySelectedDate) {
      toast.error('Please select an end date');
      return;
    }

    // Chuẩn hoá & validate với deadline
    const end = new Date(visibilitySelectedDate);
    end.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (end <= today) {
      toast.error('End date must be after today');
      return;
    }

    if (job.deadline) {
      const dl = new Date(job.deadline);
      dl.setHours(0, 0, 0, 0);
      if (end > dl) {
        toast.error('Selected date cannot exceed job deadline');
        return;
      }
    }

    // Tính số ngày & gọi payment
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    );
    await startVisibilityPayment(visibilityPackage, days);
  };

  // Fetch job data
  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return;

      try {
        setIsLoading(true);
        const data = await jobService.findOne(jobId);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job data:', error);
        toast.error('Failed to load job data');
        router.push('/co/job-list');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [jobId, router]);

  // Fetch top job slots info
  useEffect(() => {
    const fetchTopJobInfo = async () => {
      try {
        setLoadingSlots(true);
        const response = await jobService.getTopJobs();
        const existingTopJobs = response.data
          .map((job) => job.topJob || 0)
          .filter((value) => value > 0);

        setTotalSlotsUsed(existingTopJobs.length);

        // Check if current job is in top jobs
        const currentTopJob = job?.topJob || 0;
        setIsInTopJobs(currentTopJob > 0);

        // New rule: all top jobs have value 1; capacity is 16
        if (existingTopJobs.length >= 16) {
          setNextAvailableSlot(0); // No slots available
        } else {
          setNextAvailableSlot(1);
        }
      } catch (error) {
        console.error('Error fetching top job info:', error);
        toast.error('Failed to load top job information');
      } finally {
        setLoadingSlots(false);
      }
    };

    if (job) {
      fetchTopJobInfo();
    }
  }, [job]);

  // Handle remove from top jobs
  const handleRemoveFromTopJobs = async () => {
    if (!job) return;

    try {
      setIsUpdating(true);
      await jobService.update(job.id!, { topJob: 0, topJobExpired: undefined });
      toast.success('Removed from Homepage Spotlight');

      // Update local state
      setJob({ ...job, topJob: 0, topJobExpired: undefined });
      setIsInTopJobs(false);

      // Refresh top job info
      const response = await jobService.getTopJobs();
      const existingTopJobs = response.data
        .map((job) => job.topJob || 0)
        .filter((value) => value > 0);
      setTotalSlotsUsed(existingTopJobs.length);

      const maxSlot =
        existingTopJobs.length > 0 ? Math.max(...existingTopJobs) : 0;
      setNextAvailableSlot(maxSlot + 1);
    } catch (error) {
      console.error('Error removing job from top jobs:', error);
      toast.error('Failed to remove job from top positions');
    } finally {
      setIsUpdating(false);
    }
  };

  const saveTopJobDataToStorage = (endDate: Date, days: number) => {
    const normalizedEnd = new Date(endDate);
    normalizedEnd.setHours(0, 0, 0, 0);

    const safeDays = Math.max(1, days);
    const baseAmount = safeDays * topJobPrice;
    const finalAmount = applyDiscount(baseAmount, topJobAppliedCoupon);

    const topJobData = {
      jobId: job?.id,
      currentTopJob: job?.topJob || 0,
      newTopJob: nextAvailableSlot,
      jobTitle: job?.title,
      companyName: job?.company.companyName,
      topJobExpired: normalizedEnd.toISOString(),
      displayDays: safeDays,
      amountVnd: finalAmount,
      amount: finalAmount, // For payment history API
      durationDays: safeDays,
      coupon: topJobAppliedCoupon
        ? {
            id: topJobAppliedCoupon.id,
            code: topJobAppliedCoupon.code,
            discountPercentage: topJobAppliedCoupon.discountPercentage,
          }
        : null,
    };

    localStorage.setItem('TOP_JOB_DATA', JSON.stringify(topJobData));
  };

  // + NEW: Extend Top Job Spotlight
  const handleExtendTopJob = async () => {
    if (!job) return;

    const base = job.topJobExpired ? new Date(job.topJobExpired) : new Date();
    base.setHours(0, 0, 0, 0);

    const target = topJobExtendDate ? new Date(topJobExtendDate) : null;
    if (!target) {
      toast.error('Please select a new end date to extend');
      return;
    }
    target.setHours(0, 0, 0, 0);

    // Validate deadline
    if (job.deadline) {
      const dl = new Date(job.deadline);
      dl.setHours(0, 0, 0, 0);
      if (target > dl) {
        toast.error('Selected date cannot exceed job deadline');
        return;
      }
    }

    // Tính số ngày thêm
    const days = Math.max(
      0,
      Math.ceil((target.getTime() - base.getTime()) / (1000 * 60 * 60 * 24)),
    );
    if (days <= 0) {
      toast.error('Selected date must be after current expiry');
      return;
    }

    // Lưu dữ liệu cho trang success/fail đọc lại
    saveTopJobDataToStorage(target, days);

    // Thanh toán
    setIsProcessingPayment(true);
    try {
      const orderCode = Date.now();
      const baseAmount = Math.round(days * topJobPrice);
      const amount = applyDiscount(baseAmount, topJobAppliedCoupon);
      const response = await payosService.createPaymentLink({
        amount,
        description: `Extend Top Job ${Math.max(1, topJobExtendDaysDiff || 0)}d`,
        orderCode,
        returnUrl: `${window.location.origin}/co/top-job-payment-success`,
        cancelUrl: `${window.location.origin}/co/top-job-payment-failed`,
      });
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Payment error details:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!job) return;

    if (job.status === 'CLOSED') {
      toast.error(
        'Cannot purchase Top Job package. Please renew this job to OPEN status first.',
      );
      return;
    }

    if (!topJobSelectedDate) {
      toast.error('Please select an end date');
      return;
    }

    // Validate vs deadline
    const end = new Date(topJobSelectedDate);
    end.setHours(0, 0, 0, 0);
    if (job.deadline) {
      const dl = new Date(job.deadline);
      dl.setHours(0, 0, 0, 0);
      if (end > dl) {
        toast.error('Selected date cannot exceed job deadline');
        return;
      }
    }

    // Tính số ngày theo end-date đã chọn
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Math.max(
      1,
      Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
    );

    // Lưu dữ liệu để trang success/fail đọc lại
    saveTopJobDataToStorage(end, days);

    setIsProcessingPayment(true);
    try {
      const orderCode = Date.now();
      const baseAmount = Math.round(days * topJobPrice);
      const amount = applyDiscount(baseAmount, topJobAppliedCoupon); // VND sau khi giảm

      const paymentData = {
        amount,
        description: `Top Job ${Math.max(1, topJobDaysDiff)}d`,
        orderCode,
        returnUrl: `${window.location.origin}/co/top-job-payment-success`,
        cancelUrl: `${window.location.origin}/co/top-job-payment-failed`,
      };

      const response = await payosService.createPaymentLink(paymentData);
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Payment error details:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getCurrentTopJob = () => {
    const pos = job?.topJob ?? 0;

    if (pos === 0) {
      return (
        <Badge
          variant="secondary"
          className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600"
        >
          <XCircle className="h-4 w-4" />
          Not purchased
        </Badge>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
        <CheckCircle className="h-4 w-4" />
        Featured
      </span>
    );
  };

  const getVisibilityBadge = () => {
    if (isVipPackage) {
      return (
        <Badge
          variant="outline"
          className="border-purple-200 bg-purple-50 text-purple-700"
        >
          <Star className="mr-1 h-3 w-3" />
          VIP
        </Badge>
      );
    }
    if (isPremiumPackage) {
      return (
        <Badge
          variant="outline"
          className="border-amber-200 bg-amber-50 text-amber-700"
        >
          <Star className="mr-1 h-3 w-3" />
          Premium
        </Badge>
      );
    }
    return (
      <Badge
        variant="secondary"
        className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600"
      >
        <XCircle className="h-4 w-4" />
        Not purchased
      </Badge>
    );
  };

  const getTopJobExpiryBadge = () => {
    const purchased = !!job?.topJob; // 1 = purchased, 0/null = not
    if (!purchased) {
      return (
        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-50 text-slate-600"
        >
          <Clock className="mr-1 h-3 w-3" />
          No expiry
        </Badge>
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = job?.topJobExpired ? new Date(job.topJobExpired) : null;
    if (exp) exp.setHours(0, 0, 0, 0);

    if (exp && exp < today) {
      return (
        <Badge variant="secondary" className="bg-red-50 text-red-600">
          <CalendarX className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    }
    return (
      <span className="font-medium">{formatDate(job?.topJobExpired)}</span>
    );
  };

  const getVisibilityExpiryBadge = () => {
    const purchased = isVipPackage || isPremiumPackage;
    if (!purchased) {
      return (
        <Badge
          variant="outline"
          className="border-slate-200 bg-slate-50 text-slate-600"
        >
          <Clock className="mr-1 h-3 w-3" />
          Not active
        </Badge>
      );
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const exp = job?.vipExpired ? new Date(job.vipExpired) : null;
    if (exp) exp.setHours(0, 0, 0, 0);

    if (exp && exp < today) {
      return (
        <Badge variant="secondary" className="bg-red-50 text-red-600">
          <CalendarX className="mr-1 h-3 w-3" />
          Expired
        </Badge>
      );
    }
    return <span className="font-medium">{formatDate(job?.vipExpired)}</span>;
  };

  // + NEW: ngày hết hạn spotlight hiện tại
  const topJobExpiredDate = job?.topJobExpired
    ? new Date(job.topJobExpired)
    : null;
  if (topJobExpiredDate) topJobExpiredDate.setHours(0, 0, 0, 0);

  // + NEW: đã max tới deadline chưa
  const isTopJobMaxedOut = !!(
    topJobExpiredDate &&
    job?.deadline &&
    topJobExpiredDate.getTime() === new Date(job.deadline).getTime()
  );

  // + NEW: số ngày extend spotlight
  const topJobExtendDaysDiff = (() => {
    if (!topJobExpiredDate || !topJobExtendDate) return 0;
    const t = new Date(topJobExtendDate);
    t.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.ceil(
        (t.getTime() - topJobExpiredDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  })();

  const vipExpiredDate = job?.vipExpired ? new Date(job.vipExpired) : null;
  const jobDeadlineDate = job?.deadline ? new Date(job.deadline) : null;
  if (vipExpiredDate) vipExpiredDate.setHours(0, 0, 0, 0);
  if (jobDeadlineDate) jobDeadlineDate.setHours(0, 0, 0, 0);
  const isMaxedOut = !!(
    vipExpiredDate &&
    jobDeadlineDate &&
    vipExpiredDate.getTime() === jobDeadlineDate.getTime()
  );
  const extendDaysDiff = (() => {
    if (!vipExpiredDate || !extendSelectedDate) return 0;
    const t = new Date(extendSelectedDate);
    t.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.ceil(
        (t.getTime() - vipExpiredDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  })();
  const upgradeDaysDiff = (() => {
    if (!vipExpiredDate || !upgradeSelectedDate) return 0;
    const t = new Date(upgradeSelectedDate);
    t.setHours(0, 0, 0, 0);
    return Math.max(
      0,
      Math.ceil(
        (t.getTime() - vipExpiredDate.getTime()) / (1000 * 60 * 60 * 24),
      ),
    );
  })();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-8 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-500">Loading job information...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="py-8 text-center">
          <p className="text-gray-500">Job not found</p>
          <Button onClick={() => router.push('/co/job-list')} className="mt-4">
            Back to Job List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Top Job Card */}
          <TopJobCard
            job={job}
            isInTopJobs={isInTopJobs}
            totalSlotsUsed={totalSlotsUsed}
            loadingSlots={loadingSlots}
            isUpdating={isUpdating}
            isProcessingPayment={isProcessingPayment}
            topJobPrice={topJobPrice}
            topJobSelectedDate={topJobSelectedDate}
            topJobExtendDate={topJobExtendDate}
            topJobCouponCode={topJobCouponCode}
            topJobAppliedCoupon={topJobAppliedCoupon}
            topJobCheckingCoupon={topJobCheckingCoupon}
            topJobExtendDaysDiff={topJobExtendDaysDiff}
            topJobDaysDiff={topJobDaysDiff}
            isTopJobMaxedOut={isTopJobMaxedOut}
            onTopJobSelectedDateChange={setTopJobSelectedDate}
            onTopJobExtendDateChange={setTopJobExtendDate}
            onTopJobCouponCodeChange={setTopJobCouponCode}
            onApplyTopJobCoupon={handleApplyTopJobCoupon}
            onRemoveTopJobCoupon={removeTopJobCoupon}
            onExtendTopJob={handleExtendTopJob}
            onPaymentSubmit={handlePaymentSubmit}
            onRemoveFromTopJobs={handleRemoveFromTopJobs}
            onPreviewClick={() => {
              setShowTopJobPreview(true);
            }}
          />

          {/* Visibility Card */}
          <VisibilityCard
            job={job}
            isVipPackage={isVipPackage}
            isPremiumPackage={isPremiumPackage}
            visibilityPackage={visibilityPackage}
            VIP_PRICE_PER_DAY={VIP_PRICE_PER_DAY}
            PREMIUM_PRICE_PER_DAY={PREMIUM_PRICE_PER_DAY}
            visibilityLoading={visibilityLoading}
            isProcessingPayment={isProcessingPayment}
            extendSelectedDate={extendSelectedDate}
            upgradeSelectedDate={upgradeSelectedDate}
            visibilitySelectedDate={visibilitySelectedDate}
            premiumAction={premiumAction}
            visibilityCouponCode={visibilityCouponCode}
            visibilityAppliedCoupon={visibilityAppliedCoupon}
            visibilityCheckingCoupon={visibilityCheckingCoupon}
            extendDaysDiff={extendDaysDiff}
            upgradeDaysDiff={upgradeDaysDiff}
            visibilityDaysDiff={visibilityDaysDiff}
            isMaxedOut={isMaxedOut}
            onVisibilityPackageChange={setVisibilityPackage}
            onExtendSelectedDateChange={setExtendSelectedDate}
            onUpgradeSelectedDateChange={setUpgradeSelectedDate}
            onVisibilitySelectedDateChange={setVisibilitySelectedDate}
            onPremiumActionChange={setPremiumAction}
            onVisibilityCouponCodeChange={setVisibilityCouponCode}
            onApplyVisibilityCoupon={handleApplyVisibilityCoupon}
            onRemoveVisibilityCoupon={removeVisibilityCoupon}
            onExtendCurrent={handleExtendCurrent}
            onUpgradeToVip={handleUpgradeToVip}
            onBuyVisibilityBasic={handleBuyVisibilityBasic}
            onCancelVisibility={handleCancelVisibility}
            onPreviewClick={(packageType) => {
              setPreviewPackage(packageType);
              setShowPreview(true);
            }}
            getVisibilityBadge={getVisibilityBadge}
            getVisibilityExpiryBadge={getVisibilityExpiryBadge}
          />
        </div>

        {/* Sidebar */}
        <Sidebar
          job={job}
          isVipPackage={isVipPackage}
          isPremiumPackage={isPremiumPackage}
          getCurrentTopJob={getCurrentTopJob}
          getTopJobExpiryBadge={getTopJobExpiryBadge}
          getVisibilityBadge={getVisibilityBadge}
          getVisibilityExpiryBadge={getVisibilityExpiryBadge}
          formatDate={formatDate}
        />
      </div>

      {/* Job List Preview Modal */}
      <JobListPreview
        packageType={previewPackage}
        showPreview={showPreview}
        onClose={() => setShowPreview(false)}
        currentJobTitle={job?.title || ''}
      />

      {/* Top Job Preview Modal */}
      <TopJobPreview
        showPreview={showTopJobPreview}
        onClose={() => setShowTopJobPreview(false)}
        currentJobTitle={job?.title || ''}
      />
    </div>
  );
}
