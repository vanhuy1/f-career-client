'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Loader2,
  Plus,
  Briefcase,
  Building,
  CreditCard,
  Calendar,
  XCircle,
  Star,
  Crown,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { payosService } from '@/services/api/payment/payos-api';
import { jobService } from '@/services/api/jobs/job-api';
import { useUser } from '@/services/state/userSlice';
import { JobStatus } from '@/types/Job';

interface JobFormData {
  title: string;
  description: string;
  categoryId: string;
  skillIds: string[];
  benefits: { description: string }[];
  location: string;
  salaryRange: [number, number];
  experienceYears: number;
  isVip: boolean;
  packageInfo: string;
  deadline: string;
  typeOfEmployment: string;
  priorityPosition: number;
}

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>(
    'processing',
  );
  const [jobData, setJobData] = useState<JobFormData | null>(null);
  const user = useUser();

  useEffect(() => {
    const processPaymentSuccess = async () => {
      // PayOS có thể trả về orderCode hoặc id
      const orderCode =
        searchParams?.get('orderCode') || searchParams?.get('id');
      const payosStatus = searchParams?.get('status');
      const cancel = searchParams?.get('cancel');

      console.log('Payment Success Debug:', {
        orderCode,
        payosStatus,
        cancel,
        allParams: Object.fromEntries(searchParams?.entries() || []),
      });

      if (!orderCode) {
        setStatus('error');
        toast.error('Invalid payment information');
        router.push('/co/payment-failed');
        return;
      }

      try {
        // Verify payment status with PayOS
        console.log(
          'Calling PayOS getPaymentStatus with orderCode:',
          orderCode,
        );
        const paymentStatus = await payosService.getPaymentStatus(orderCode);
        console.log('PayOS payment status response:', paymentStatus);

        // Check if payment was successful
        console.log('Payment verification conditions:', {
          payosStatus: paymentStatus.status,
          queryStatus: payosStatus,
          cancel,
          isCompleted: paymentStatus.status === 'COMPLETED',
          isPaid: payosStatus === 'PAID',
          isNotCancelled: cancel === 'false',
        });

        // PayOS có thể trả về status khác nhau trong API và query params
        // API status: 'COMPLETED', Query status: 'PAID'
        const isPaymentSuccessful =
          (paymentStatus.status === 'COMPLETED' || payosStatus === 'PAID') &&
          cancel === 'false';

        if (isPaymentSuccessful) {
          // Get saved form data from localStorage
          const savedData = localStorage.getItem('JOB_FORM_DATA');
          console.log('Saved form data from localStorage:', savedData);

          if (!savedData) {
            setStatus('error');
            toast.error(
              'Form data not found. Please try posting the job again.',
            );
            router.push('/co/payment-failed');
            return;
          }

          const formData = JSON.parse(savedData);
          console.log('Parsed form data:', formData);

          // Compute vipExpired based on durationDays and deadline
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const dl = new Date(formData.deadline);
          dl.setHours(0, 0, 0, 0);
          const durationDays =
            (formData?.packageInfo?.durationDays as number) || 0;
          let vipExpiredDate = new Date(today);
          if (durationDays > 0) {
            vipExpiredDate.setDate(today.getDate() + durationDays);
          } else {
            vipExpiredDate = new Date(dl);
          }
          if (vipExpiredDate < today) vipExpiredDate = new Date(today);
          if (vipExpiredDate > dl) vipExpiredDate = new Date(dl);

          // Create job with saved data
          const jobData = {
            title: formData.title,
            description: formData.description,
            categoryId: formData.categoryId || '1',
            companyId: String(user?.data?.companyId || '1'),
            skillIds: formData.skillIds || [],
            benefit: (formData.benefits || []).map(
              (benefit: { description: string }) => benefit.description,
            ),
            location: formData.location,
            salaryMin: (formData.salaryRange || [5000, 22000])[0],
            salaryMax: (formData.salaryRange || [5000, 22000])[1],
            experienceYears: formData.experienceYears || 0,
            isVip: formData.isVip || false,
            packageInfo: formData.packageInfo,
            deadline: formData.deadline,
            typeOfEmployment: formData.typeOfEmployment || 'FULL_TIME',
            status: 'OPEN' as JobStatus,
            priorityPosition: formData.priorityPosition || 3,
            vipExpired: vipExpiredDate.toISOString(),
          };

          console.log('Creating job with data:', jobData);
          await jobService.create(jobData);
          console.log('Job created successfully!');

          // Save package info to localStorage
          if (user?.data?.companyId) {
            localStorage.setItem(
              `company_${user.data.companyId}_package`,
              JSON.stringify(formData.packageInfo),
            );
          }

          setJobData(formData);
          setStatus('success');
          toast.success('Payment successful and job posted!');

          // Clear form data only after successful display
          setTimeout(() => {
            localStorage.removeItem('JOB_FORM_DATA');
          }, 1000);
        } else {
          setStatus('error');
          toast.error('Payment was not completed. Please try again.');
          router.push('/co/payment-failed');
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
        setStatus('error');
        toast.error('Failed to verify payment status');
        router.push('/co/payment-failed');
      } finally {
        setIsProcessing(false);
      }
    };

    processPaymentSuccess();
  }, [searchParams, router, user]);

  if (isProcessing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <Card className="w-full max-w-md border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <Loader2 className="mx-auto h-16 w-16 animate-spin text-blue-600" />
              <h2 className="mt-4 text-xl font-semibold text-blue-900">
                Processing Payment...
              </h2>
              <p className="mt-2 text-blue-700">
                Please wait while we verify your payment and create your job
                posting.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'success' && jobData) {
    const isVIP = jobData.isVip;
    const packageColor = isVIP ? 'purple' : 'blue';
    const packageTitle = isVIP ? 'VIP Job Package' : 'Standard Job Package';
    const packageDescription = isVIP
      ? 'Enhanced visibility and priority'
      : 'Standard job posting';

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-emerald-100 shadow-lg">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="mb-2 text-3xl font-bold text-green-900">
              Job Posted Successfully!
            </h1>
            <p className="text-lg text-green-700">
              Your job has been created and is now live on the platform!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Job Summary */}
            <div className="lg:col-span-2">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CreditCard className="h-5 w-5" />
                    Job Created Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Job Details */}
                  <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 p-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {jobData.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {jobData.location}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        isVIP
                          ? 'border-purple-300 bg-purple-50 text-purple-700'
                          : 'border-blue-300 bg-blue-50 text-blue-700'
                      }
                    >
                      {isVIP ? 'VIP' : 'Standard'}
                    </Badge>
                  </div>

                  {/* Package Details */}
                  <div className="flex items-center justify-between rounded-lg bg-white/60 p-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`rounded-lg bg-gradient-to-br from-${packageColor}-100 to-${packageColor === 'purple' ? 'pink' : 'cyan'}-100 p-2`}
                      >
                        {isVIP ? (
                          <Crown className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Star className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {packageTitle}
                        </div>
                        <div className="text-sm text-gray-600">
                          {packageDescription}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Job Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Application Deadline
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {format(new Date(jobData.deadline), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/60 p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">
                          Priority Level
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        #{jobData.priorityPosition}
                      </div>
                    </div>
                  </div>

                  {/* Job Features */}
                  <div className="border-t border-green-200/50 pt-4">
                    <h4 className="mb-3 font-semibold text-green-900">
                      Job Features:
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? 'Enhanced visibility and priority ranking'
                          : 'Standard job posting visibility'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? 'VIP badge and special highlighting'
                          : 'Professional job listing appearance'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? 'Top position in search results'
                          : 'Searchable job listing'}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {isVIP
                          ? '24/7 priority support'
                          : 'Standard customer support'}
                      </div>
                      {isVIP && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Featured on homepage spotlight
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Section */}
            <div className="lg:col-span-1">
              <Card className="border-2 border-green-200 bg-white shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-green-900">Success!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="py-4 text-center">
                    <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                    <h3 className="mb-2 text-lg font-semibold text-green-900">
                      Job Posted Successfully!
                    </h3>
                    <p className="mb-6 text-sm text-gray-600">
                      Your job is now live and visible to potential candidates
                    </p>

                    <div className="space-y-3">
                      <Button
                        onClick={() => router.push('/co/post-job')}
                        className="w-full bg-green-600 text-white hover:bg-green-700"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Post Another Job
                      </Button>

                      <Button
                        onClick={() => router.push('/job')}
                        variant="outline"
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        <Briefcase className="mr-2 h-4 w-4" />
                        View Public Jobs
                      </Button>

                      <Button
                        onClick={() => router.push('/co/job-list')}
                        variant="outline"
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Building className="mr-2 h-4 w-4" />
                        Manage Company Jobs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md border-2 border-red-200 bg-gradient-to-br from-red-50 to-pink-50 shadow-xl">
          <CardContent className="p-8">
            <div className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-xl font-semibold text-red-900">
                Payment Processing Failed
              </h2>
              <p className="mt-2 text-red-700">
                There was an issue processing your payment. Please try again.
              </p>
              <div className="mt-6 space-y-3">
                <Button
                  onClick={() => router.push('/co/post-job')}
                  className="w-full bg-red-600 text-white hover:bg-red-700"
                >
                  Back to Post Job
                </Button>
                <Button
                  onClick={() => router.push('/')}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  Go to Homepage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
}
