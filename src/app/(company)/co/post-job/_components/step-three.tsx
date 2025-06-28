'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Crown,
  Star,
  AlertCircle,
  Eye,
  DollarSign,
  Clock,
  Sparkles,
  Trophy,
  Medal,
  X,
  Calendar,
  Flame,
  TrendingUp,
  Users,
} from 'lucide-react';
import type { StepProps, PackageInfo, PackageType } from '@/types/Job';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
// Switch is commented out as it's not currently used
// import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Input } from '@/components/ui/input';

interface DisplayPackage {
  id: PackageType;
  name: string;
  pricePerDay: number;
  features: string[];
  position: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  hoverGradient: string;
  recommended?: boolean;
  popular?: boolean;
  boost: string;
}

// Mock job data for preview
const mockPreviewJobs = [
  {
    id: 1,
    title: 'Senior Full-Stack Software Engineer - React, Node.js, TypeScript',
    company: 'Your Company',
    companyLogo: '/Logo/talkit.svg',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'Full-time',
    category: 'Technology',
    postedDate: '2 days ago',
  },
  {
    id: 2,
    title: 'Senior UX/UI Designer - Product Design & User Research Specialist',
    company: 'DesignStudio',
    companyLogo: '/Logo/amd.webp',
    location: 'Austin, TX',
    salary: '$80k - $120k',
    type: 'Full-time',
    category: 'Design',
    postedDate: '3 days ago',
  },
  {
    id: 3,
    title:
      'Data Scientist Data Scientist Data Scientist Data Scientist Data Scientist',
    company: 'DataFlow',
    companyLogo: '/Logo/talkit.svg',
    location: 'Seattle, WA',
    salary: '$90k - $140k',
    type: 'Full-time',
    category: 'Data Science',
    postedDate: '5 days ago',
  },
  {
    id: 4,
    title:
      'Digital Marketing Specialist - SEO, SEM & Social Media Marketing Expert',
    company: 'GrowthCo',
    companyLogo: '/Logo/talkit.svg',
    location: 'Chicago, IL',
    salary: '$60k - $80k',
    type: 'Full-time',
    category: 'Marketing',
    postedDate: '1 week ago',
  },
];

const displayPackages: DisplayPackage[] = [
  {
    id: 'vip',
    name: 'VIP Elite',
    pricePerDay: 0.5,
    features: [
      'Top position in search results',
      'Premium highlighted listing with glow effect',
      'Featured on homepage banner',
      'Included in weekly newsletter',
      'Priority support from our team',
      'Social media promotion',
      'Advanced analytics dashboard',
    ],
    position: 1,
    icon: <Crown className="h-7 w-7" />,
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    gradient: 'from-purple-600 via-pink-600 to-orange-500',
    hoverGradient: 'from-purple-700 via-pink-700 to-orange-600',
    popular: true,
    boost: '10x more visibility',
  },
  {
    id: 'premium',
    name: 'Premium Pro',
    pricePerDay: 0.4,
    features: [
      'Higher position in search results',
      'Highlighted listing with border',
      'Featured on homepage',
      'Get 5x more views than basic',
      'Email notifications for applications',
      'Priority customer support',
    ],
    position: 2,
    icon: <Star className="h-6 w-6" />,
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    gradient: 'from-blue-600 to-cyan-500',
    hoverGradient: 'from-blue-700 to-cyan-600',
    recommended: true,
    boost: '5x more visibility',
  },
  {
    id: 'basic',
    name: 'Basic',
    pricePerDay: 0,
    features: [
      'Standard job listing',
      'Basic search visibility',
      'Standard listing period',
      'Email confirmation',
    ],
    position: 3,
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    gradient: 'from-gray-500 to-gray-600',
    hoverGradient: 'from-gray-600 to-gray-700',
    boost: 'Standard visibility',
  },
];

// Function to calculate expiration date based on package type and duration
const calculateExpirationDate = (
  packageType: PackageType,
  durationDays?: number,
): string => {
  const now = new Date();
  const expirationDate = new Date(now);

  if (durationDays && durationDays > 0) {
    // Set expiration based on selected duration
    expirationDate.setDate(now.getDate() + durationDays);
  } else {
    // Default durations if none specified
    switch (packageType) {
      case 'basic':
        expirationDate.setDate(now.getDate() + 30);
        break;
      case 'premium':
        expirationDate.setDate(now.getDate() + 30);
        break;
      case 'vip':
        expirationDate.setDate(now.getDate() + 30);
        break;
      default:
        expirationDate.setDate(now.getDate() + 30);
    }
  }

  return expirationDate.toISOString();
};

function getCategoryBadge(category: string) {
  switch (category) {
    case 'Technology':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Management':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Design':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Data Science':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Marketing':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
}

function getPositionStyles(packageType: PackageType | null, position: number) {
  if (!packageType) {
    return {
      card: 'border bg-white hover:shadow-sm transition-all duration-200',
      badge: '',
      title: 'text-gray-800',
      border: '',
      effect: '',
    };
  }

  switch (packageType) {
    case 'vip':
      if (position === 1) {
        return {
          card: 'border-2 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 shadow-2xl scale-105 ring-2 ring-purple-200 ring-opacity-50',
          badge:
            'bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white animate-pulse shadow-lg',
          title: 'text-purple-800 font-bold text-lg',
          border:
            'border-gradient-to-r from-purple-400 via-pink-500 to-orange-400 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_25px_rgba(168,85,247,0.6)] after:animate-pulse',
        };
      }
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
    case 'premium':
      if (position === 2) {
        return {
          card: 'border-2 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl ring-1 ring-blue-200',
          badge:
            'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md',
          title: 'text-blue-800 font-semibold text-lg',
          border: 'border-gradient-to-r from-blue-400 to-cyan-500 border-2',
          effect:
            'after:absolute after:inset-0 after:rounded-lg after:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
      }
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
    case 'basic':
      if (position === 3) {
        return {
          card: 'border bg-gradient-to-br from-gray-50 to-gray-50/80 shadow-sm',
          badge: 'bg-gradient-to-r from-gray-600 to-gray-600 text-white',
          title: 'text-gray-800 font-medium',
          border: 'border-gray-300',
          effect: '',
        };
      }
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
    default:
      return {
        card: 'border bg-white hover:shadow-md transition-all duration-200',
        badge: '',
        title: 'text-gray-800',
        border: '',
        effect: '',
      };
  }
}

function JobPreviewCard({
  job,
  position,
  packageType,
  isHighlighted,
}: {
  job: (typeof mockPreviewJobs)[0];
  position: number;
  packageType: PackageType | null;
  isHighlighted: boolean;
}) {
  const styles = getPositionStyles(
    isHighlighted ? packageType : null,
    position,
  );

  const PositionBadge = () => {
    if (position === 1) {
      return (
        <Badge
          variant="outline"
          className="absolute top-0 right-2 z-20 flex -translate-y-1/2 items-center gap-1 border-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-2 py-1 text-xs text-white shadow-lg"
        >
          <Trophy className="h-3 w-3" />
          <Flame className="h-2.5 w-2.5 animate-pulse" />
          TOP
        </Badge>
      );
    }
    if (position === 2) {
      return (
        <Badge
          variant="outline"
          className="absolute top-0 right-2 z-20 flex -translate-y-1/2 items-center gap-1 border-0 bg-gradient-to-r from-blue-600 to-cyan-600 px-2 py-1 text-xs text-white shadow-md"
        >
          <Medal className="h-3 w-3" /> PRO
        </Badge>
      );
    }
    return null;
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`View details for job: ${job.title}`);
  };

  return (
    <div className="group w-full">
      <div
        className={`w-full cursor-pointer overflow-hidden rounded-lg ${styles.card} transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      >
        <div className="relative w-full">
          <PositionBadge />

          {isHighlighted && packageType && packageType !== 'basic' && (
            <div className="absolute top-0 left-0">
              {position === 1 ? (
                <Badge
                  className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs font-bold`}
                >
                  🔥 HOT
                </Badge>
              ) : position === 2 ? (
                <Badge
                  className={`rounded-none rounded-br-lg ${styles.badge} z-10 px-2 py-0.5 text-xs`}
                >
                  ⭐ FEATURED
                </Badge>
              ) : null}
            </div>
          )}

          <div className="flex p-3">
            <div className="mr-3 flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={job.companyLogo || '/placeholder.svg'}
                  alt={`${job.company} logo`}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="flex min-w-0 flex-1">
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-sm font-semibold ${styles.title} truncate`}
                  title={job.title}
                >
                  {job.title}
                </h3>
                <p className="truncate text-xs text-gray-600">
                  {job.company} • {job.location}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700">
                    {job.type}
                  </span>
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${getCategoryBadge(job.category)}`}
                  >
                    {job.category}
                  </span>
                </div>
              </div>

              <div className="ml-3 flex flex-col items-end justify-between text-xs">
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{job.postedDate}</span>
                </div>
                <div className="flex items-center gap-1 font-medium text-green-600">
                  <DollarSign className="h-3 w-3" />
                  <span>{job.salary}</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDetailClick}
                  className={`h-6 px-2 py-1 text-xs transition-all duration-200 hover:shadow-sm ${
                    isHighlighted && packageType === 'vip'
                      ? 'border-purple-300 text-purple-700 hover:bg-purple-50'
                      : isHighlighted && packageType === 'premium'
                        ? 'border-blue-300 text-blue-700 hover:bg-blue-50'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobListPreview({
  packageType,
  showPreview,
  onClose,
}: {
  packageType: PackageType | null;
  showPreview: boolean;
  onClose: () => void;
}) {
  if (!packageType || !showPreview) return null;

  const getHighlightedPositions = (packageId: PackageType) => {
    switch (packageId) {
      case 'vip':
        return [1];
      case 'premium':
        return [2];
      case 'basic':
        return [3];
      default:
        return [];
    }
  };

  const getPositionText = (packageId: PackageType) => {
    switch (packageId) {
      case 'vip':
        return 'Your job will dominate the top of search results with maximum visibility';
      case 'premium':
        return 'Your job will be prominently highlighted and appear above standard listings';
      case 'basic':
        return 'Your job will appear in standard positions in search results';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative mx-4 max-h-[90vh] w-full max-w-[700px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        <div className="sticky top-0 z-10 border-b bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-3 text-white shadow-lg">
                <Eye className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Live Preview: {packageType.toUpperCase()} Package
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {getPositionText(packageType)}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-full bg-gray-100 p-2.5 shadow-sm transition-colors hover:bg-gray-200"
              aria-label="Close preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto p-6">
          {mockPreviewJobs.slice(0, 5).map((job, index) => {
            const position = index + 1;
            const isHighlighted =
              getHighlightedPositions(packageType).includes(position);

            return (
              <JobPreviewCard
                key={job.id}
                job={job}
                position={position}
                packageType={isHighlighted ? packageType : null}
                isHighlighted={isHighlighted}
              />
            );
          })}
        </div>

        <div className="sticky bottom-0 border-t bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-100 to-purple-100 p-4 text-blue-800">
            <Sparkles className="h-6 w-6 flex-shrink-0 text-blue-600" />
            <p className="text-sm font-medium">
              <span className="font-bold">Premium positions</span> receive up to
              10x more visibility and 5x more applications than basic listings
            </p>
          </div>
          <div className="flex justify-end">
            <Button
              size="lg"
              variant="default"
              onClick={onClose}
              className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 shadow-lg hover:from-blue-700 hover:to-purple-700"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Step3({
  setIsVip,
  packageInfo,
  setPackageInfo,
  deadline,
  setTotalPrice,
}: StepProps) {
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(
    packageInfo?.type || 'basic',
  );
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [activeUntil, setActiveUntil] = useState<string | null>(null);
  const [previewPackage, setPreviewPackage] = useState<PackageType | null>(
    null,
  );
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [maxDuration, setMaxDuration] = useState<number>(30);
  const [internalTotalPrice, setInternalTotalPrice] = useState<number>(0);

  // Calculate max duration based on job deadline
  useEffect(() => {
    if (deadline) {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      const diffTime = Math.abs(deadlineDate.getTime() - today.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setMaxDuration(diffDays);

      if (selectedDuration > diffDays) {
        setSelectedDuration(diffDays);
      } else if (selectedDuration < 1) {
        setSelectedDuration(1);
      }
    }
  }, [deadline, selectedDuration]);

  // Calculate total price based on package and duration
  useEffect(() => {
    const pkg = displayPackages.find((p) => p.id === selectedPackage);
    if (pkg) {
      const price = Number((pkg.pricePerDay * selectedDuration).toFixed(2));
      setInternalTotalPrice(price);
      if (setTotalPrice) {
        setTotalPrice(price);
      }
    }
  }, [selectedPackage, selectedDuration, setTotalPrice]);

  // Check if there's an active package subscription
  useEffect(() => {
    if (packageInfo && packageInfo.isActive) {
      const expiryDate = new Date(packageInfo.expiresAt);
      const now = new Date();

      if (expiryDate > now) {
        setHasActiveSubscription(true);
        setActiveUntil(expiryDate.toLocaleDateString());
        setSelectedPackage(packageInfo.type);
        if (packageInfo.durationDays) {
          setSelectedDuration(packageInfo.durationDays);
        }
      }
    }
  }, [packageInfo]);

  const handlePackageChange = (packageId: PackageType) => {
    setSelectedPackage(packageId);

    const newPackageInfo: PackageInfo = {
      type: packageId,
      purchasedAt: new Date().toISOString(),
      expiresAt: calculateExpirationDate(packageId, selectedDuration),
      isActive: true,
      transactionId: `TR-${Date.now()}`,
      durationDays: selectedDuration,
    };

    setPackageInfo(newPackageInfo);
    setIsVip(packageId === 'vip');
  };

  const handleDurationChange = (days: number) => {
    const durationValue = Math.max(1, Math.min(days, maxDuration));
    setSelectedDuration(durationValue);

    if (packageInfo) {
      const updatedPackageInfo = {
        ...packageInfo,
        expiresAt: calculateExpirationDate(packageInfo.type, durationValue),
        durationDays: durationValue,
      };
      setPackageInfo(updatedPackageInfo);
    }
  };

  return (
    <div className="relative px-4 md:px-0">
      {/* Enhanced Header */}
      <div className="mb-8 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-2 text-sm font-semibold text-blue-700">
          <TrendingUp className="h-4 w-4" />
          Boost Your Job Visibility
        </div>
        <h2 className="mb-3 text-3xl font-bold text-gray-900">
          Choose Your Visibility Package
        </h2>
        <p className="mx-auto max-w-2xl text-lg text-gray-600">
          Stand out from the competition and attract top talent with our premium
          positioning options
        </p>
      </div>

      {hasActiveSubscription && (
        <Alert className="mb-8 border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-lg">
          <AlertCircle className="h-5 w-5 text-indigo-600" />
          <AlertTitle className="text-lg font-semibold">
            Active Subscription
          </AlertTitle>
          <AlertDescription className="text-base">
            Your {packageInfo?.type} package is active until {activeUntil}. You
            can continue with this package or upgrade to a better one.
          </AlertDescription>
        </Alert>
      )}

      <div className="border-t border-gray-100 pt-8">
        <RadioGroup
          value={selectedPackage}
          onValueChange={handlePackageChange}
          className="flex flex-col gap-8"
        >
          {displayPackages.map((pkg) => (
            <div key={pkg.id} className="relative w-full">
              {/* Enhanced badges */}
              {pkg.recommended && (
                <div className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1 text-sm font-bold text-white shadow-lg">
                  ⭐ MOST POPULAR
                </div>
              )}
              {pkg.popular && (
                <div className="absolute -top-4 right-8 z-20 animate-pulse rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-4 py-1 text-sm font-bold text-white shadow-lg">
                  🔥 BEST VALUE
                </div>
              )}

              <Label
                htmlFor={pkg.id}
                className={`group flex cursor-pointer flex-row overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.01] hover:shadow-xl ${
                  selectedPackage === pkg.id
                    ? pkg.id === 'vip'
                      ? 'border-purple-500 shadow-xl shadow-purple-200'
                      : pkg.id === 'premium'
                        ? 'border-blue-500 shadow-xl shadow-blue-200'
                        : 'border-indigo-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-[180px] bg-gradient-to-br p-4 ${pkg.gradient} relative flex flex-col justify-between overflow-hidden text-white`}
                >
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 h-24 w-24 translate-x-12 -translate-y-12 transform rounded-full bg-white"></div>
                    <div className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 transform rounded-full bg-white"></div>
                  </div>

                  <div className="relative z-10">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="rounded-lg bg-white/20 p-1.5 shadow-lg backdrop-blur-sm">
                        {pkg.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold">{pkg.name}</h3>
                        <p className="text-xs text-white/80">
                          Position #{pkg.position}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">
                          ${pkg.pricePerDay.toFixed(2)}
                        </span>
                        <span className="text-xs text-white/80">/ day</span>
                      </div>
                      <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                        <Users className="h-3 w-3" />
                        {pkg.boost}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className={`relative z-10 h-8 w-full justify-center border border-white bg-white/10 text-xs font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-gray-900 ${selectedPackage === pkg.id ? 'bg-white text-gray-900' : ''}`}
                    onClick={() => handlePackageChange(pkg.id)}
                  >
                    {selectedPackage === pkg.id ? (
                      <>
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        Selected
                      </>
                    ) : (
                      'Select Package'
                    )}
                  </Button>
                </div>

                <div className="flex-grow bg-white p-4">
                  <RadioGroupItem
                    value={pkg.id}
                    id={pkg.id}
                    className="sr-only"
                  />

                  <div className="mb-2">
                    <h4 className="text-sm font-bold text-gray-900">
                      Whats Included:
                    </h4>
                  </div>

                  <ul className="space-y-2 text-xs">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div
                          className={`mt-0.5 mr-2 rounded-full p-0.5 ${
                            selectedPackage === pkg.id
                              ? pkg.id === 'vip'
                                ? 'bg-purple-100 text-purple-600'
                                : pkg.id === 'premium'
                                  ? 'bg-blue-100 text-blue-600'
                                  : 'bg-indigo-100 text-indigo-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <CheckCircle2 className="h-3 w-3" />
                        </div>
                        <span className="font-medium text-gray-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {/* Enhanced duration selector */}
        {selectedPackage !== 'basic' && (
          <div className="mt-10 rounded-2xl border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-lg">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Premium Duration
                </h3>
                <p className="text-sm text-gray-600">
                  Choose how long you want premium visibility
                </p>
              </div>
            </div>

            <div className="mb-6">
              <Label
                htmlFor="duration"
                className="mb-3 block text-base font-semibold text-gray-900"
              >
                Select Premium Days (1-{maxDuration})
              </Label>
              <div className="flex items-center gap-4">
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={maxDuration}
                  value={selectedDuration}
                  onChange={(e) =>
                    handleDurationChange(parseInt(e.target.value))
                  }
                  className="h-12 w-32 border-2 text-center text-lg font-semibold"
                />
                <span className="text-base font-medium text-gray-600">
                  days of premium visibility
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Maximum duration is based on your job deadline ({maxDuration}{' '}
                days)
              </p>
            </div>

            <div className="rounded-xl border-2 border-gray-100 bg-white p-6 shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    Total Investment
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedDuration} days × $
                    {displayPackages
                      .find((p) => p.id === selectedPackage)
                      ?.pricePerDay.toFixed(2)}
                    /day
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600">
                    ${internalTotalPrice.toFixed(2)}
                  </div>
                  <p className="text-sm text-gray-500">one-time payment</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced preview button */}
        <div className="mt-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-6 py-3 text-sm font-semibold text-blue-700">
            <Eye className="h-5 w-5" />
            See exactly how your job will appear to candidates
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => {
              setPreviewPackage(selectedPackage);
              setShowPreview(true);
            }}
            className="mx-auto border-2 px-8 py-3 text-base font-semibold transition-all duration-300 hover:shadow-lg"
          >
            <Eye className="mr-2 h-5 w-5" />
            Preview Your Job Listing
          </Button>

          <JobListPreview
            packageType={previewPackage}
            showPreview={showPreview}
            onClose={() => setShowPreview(false)}
          />
        </div>
      </div>
    </div>
  );
}
