'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ArrowLeft, Star, X, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { jobService } from '@/services/api/jobs/job-api';
import { payosService } from '@/services/api/payment/payos-api';
import { Job } from '@/types/Job';

export default function TopJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [nextAvailableSlot, setNextAvailableSlot] = useState<number>(0);
  const [totalSlotsUsed, setTotalSlotsUsed] = useState<number>(0);
  const [isInTopJobs, setIsInTopJobs] = useState<boolean>(false);
  const [topJobPrice, setTopJobPrice] = useState<number>(0.2); // Giá cố định cho top job
  console.log('Top Job Price:', setTopJobPrice);
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

        // Find next available slot
        if (existingTopJobs.length >= 16) {
          setNextAvailableSlot(0); // No slots available
        } else {
          // Find the highest slot number and add 1
          const maxSlot =
            existingTopJobs.length > 0 ? Math.max(...existingTopJobs) : 0;
          setNextAvailableSlot(maxSlot + 1);
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

  const handleRemoveFromTopJobs = async () => {
    if (!job) return;

    try {
      setIsUpdating(true);
      await jobService.update(job.id!, { topJob: 0 });
      toast.success('Job removed from top jobs successfully');

      // Update local state
      setJob({ ...job, topJob: 0 });
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

  // Save top job data to localStorage
  const saveTopJobDataToStorage = () => {
    const topJobData = {
      jobId: job?.id,
      currentTopJob: job?.topJob || 0,
      newTopJob: nextAvailableSlot,
      jobTitle: job?.title,
      companyName: job?.company.companyName,
    };
    localStorage.setItem('TOP_JOB_DATA', JSON.stringify(topJobData));
  };

  const handlePaymentSubmit = async () => {
    if (!job) return;

    // Check if job status is CLOSED
    if (job.status === 'CLOSED') {
      toast.error('Cannot purchase Top Job package. Please renew this job to OPEN status first.');
      return;
    }

    // Save data to localStorage before payment
    saveTopJobDataToStorage();

    setIsProcessingPayment(true);
    try {
      const orderCode = Date.now();
      const amount = Math.round(topJobPrice * 24000); // Convert USD to VND

      // Try with localhost URLs first (like post-job)
      const paymentData = {
        amount,
        description: `Top Job Position ${nextAvailableSlot}`, // Simplified description
        orderCode,
        returnUrl: `${window.location.origin}/co/top-job-payment-success`,
        cancelUrl: `${window.location.origin}/co/top-job-payment-failed`,
      };

      const response = await payosService.createPaymentLink(paymentData);

      // Redirect to payment page
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Payment error details:' + error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getCurrentPositionText = () => {
    const currentTopJob = job?.topJob || 0;
    if (currentTopJob === 0) {
      return 'Not in top positions';
    }
    return `Currently at position ${currentTopJob}`;
  };

  const getAvailableSlotsText = () => {
    if (totalSlotsUsed >= 16) {
      return 'All 16 slots are currently occupied';
    }
    return `${16 - totalSlotsUsed} slots available (${totalSlotsUsed}/16 used)`;
  };

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
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="outline"
          onClick={() => router.push(`/co/job-list/${jobId}/job-details`)}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Job Details
        </Button>

        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-2xl font-bold text-white">S</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <p className="text-gray-600">{job.company.companyName}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Top Job Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Status */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Current Status</h3>
                <div className="text-gray-600">{getCurrentPositionText()}</div>
              </div>

              {/* Available Slots */}
              {!loadingSlots && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Available Slots</h3>
                  <div className="text-gray-600">{getAvailableSlotsText()}</div>
                </div>
              )}

              {/* Action Section */}
              {loadingSlots ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-sm text-gray-500">
                    Loading top job information...
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Check if job is CLOSED */}
                  {job.status === 'CLOSED' ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                        <div className="text-red-800">
                          <p className="font-medium">Cannot Purchase Top Job Package</p>
                          <p>
                            This job is currently CLOSED. You need to renew this job to OPEN status before purchasing a Top Job package.
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isInTopJobs ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-4">
                        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                        <div className="text-yellow-800">
                          <p className="font-medium">Remove from Top Jobs?</p>
                          <p>
                            This will remove your job from the homepage featured
                            positions.
                          </p>
                        </div>
                      </div>

                      <Button
                        onClick={handleRemoveFromTopJobs}
                        disabled={isUpdating}
                        variant="outline"
                        size="lg"
                        className="w-full border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <X className="mr-2 h-5 w-5" />
                        {isUpdating ? 'Removing...' : 'Remove from Top Jobs'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {totalSlotsUsed >= 16 ? (
                        <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4">
                          <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                          <div className="text-red-800">
                            <p className="font-medium">No Slots Available</p>
                            <p>
                              All 16 top job positions are currently occupied.
                              Please try again later.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
                            <Star className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                            <div className="text-blue-800">
                              <p className="font-medium">Add to Top Jobs?</p>
                              <p>
                                This will add your job to position{' '}
                                {nextAvailableSlot} on the homepage. Only 16
                                jobs can be featured at once.
                              </p>
                            </div>
                          </div>

                          <Button
                            onClick={handlePaymentSubmit}
                            disabled={isUpdating || isProcessingPayment}
                            size="lg"
                            className="w-full bg-yellow-600 hover:bg-yellow-700"
                          >
                            <Star className="mr-2 h-5 w-5" />
                            {isProcessingPayment
                              ? 'Processing Payment...'
                              : `Pay $${topJobPrice.toFixed(2)} & Add to Position ${nextAvailableSlot}`}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <Badge
                  variant={job.status === 'OPEN' ? 'default' : 'secondary'}
                >
                  {job.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type</span>
                <span className="font-medium">{job.typeOfEmployment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{job.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Experience</span>
                <span className="font-medium">{job.experienceYears} years</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Salary</span>
                <span className="font-medium">
                  ${job.salaryMin.toLocaleString()} - $
                  {job.salaryMax.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Job Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <span className="text-sm">Featured on homepage</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <span className="text-sm">Higher visibility to candidates</span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <span className="text-sm">
                  Priority placement in search results
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Star className="mt-0.5 h-4 w-4 flex-shrink-0 text-yellow-500" />
                <span className="text-sm">Limited to 16 positions total</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
