'use client';

import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Step1 from './_components/step-one';
import Step2 from './_components/step-two';
import Step3 from './_components/step-three';
import {
  StepProps,
  Benefit,
  Position,
  PackageInfo,
  PackageType,
} from '@/types/Job';
import { jobService } from '@/services/api/jobs/job-api';
import { skillService, Skill } from '@/services/api/skills/skill-api';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { JobStatus, EmploymentType } from '@/types/Job';
import { useUser } from '@/services/state/userSlice';
import { payosService } from '@/services/api/payment/payos-api';

// Function to calculate expiration date based on package type
const calculateExpirationDate = (
  packageType: PackageType,
  isYearly: boolean,
): string => {
  const now = new Date();
  const expirationDate = new Date(now);

  switch (packageType) {
    case 'basic':
      // Basic package is valid for 30 days
      expirationDate.setDate(now.getDate() + 30);
      break;
    case 'premium':
      // Premium package is valid for 60 days, or 1 year if yearly billing
      if (isYearly) {
        expirationDate.setFullYear(now.getFullYear() + 1);
      } else {
        expirationDate.setDate(now.getDate() + 60);
      }
      break;
    case 'vip':
      // VIP package is valid for 90 days, or 1 year if yearly billing
      if (isYearly) {
        expirationDate.setFullYear(now.getFullYear() + 1);
      } else {
        expirationDate.setDate(now.getDate() + 90);
      }
      break;
    default:
      // Default to 30 days
      expirationDate.setDate(now.getDate() + 30);
  }

  return expirationDate.toISOString();
};

export default function JobPostingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState([5000, 22000]);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  console.log(isYearlyBilling);
  // Package information state
  const [packageInfo, setPackageInfo] = useState<PackageInfo>({
    type: 'basic',
    purchasedAt: new Date().toISOString(),
    expiresAt: calculateExpirationDate('basic', false),
    isActive: true,
  });

  // Job information state
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [whoYouAre, setWhoYouAre] = useState('');
  const [benefit, setBenefit] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [jobStatus] = useState<JobStatus>('OPEN');
  const [typeOfEmployment, setTypeOfEmployment] =
    useState<EmploymentType>('FullTime');
  const [priorityPosition, setPriorityPosition] = useState<number>(3);
  const [vipExpiration, setVipExpiration] = useState<string>('');
  const user = useUser();

  const handleCreateJob = useCallback(async () => {
    try {
      const jobData = {
        title: jobTitle,
        description: jobDescription,
        categoryId: categoryId || '1',
        companyId: user?.data?.companyId || '1',
        skillIds: selectedSkillIds,
        benefit: benefits.map((benefit) => benefit.description),
        location: location,
        salaryMin: salaryRange[0],
        salaryMax: salaryRange[1],
        experienceYears: experienceYears,
        isVip: isVip,
        packageInfo: packageInfo,
        deadline: deadline,
        typeOfEmployment: typeOfEmployment,
        status: jobStatus,
        priorityPosition: priorityPosition,
        vip_expiration: vipExpiration,
      };

      await jobService.create(jobData);

      if (user?.data?.companyId) {
        localStorage.setItem(
          `company_${user.data.companyId}_package`,
          JSON.stringify(packageInfo),
        );
      }

      router.push('/job');
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  }, [
    jobTitle,
    jobDescription,
    categoryId,
    user?.data?.companyId,
    selectedSkillIds,
    benefits,
    location,
    salaryRange,
    experienceYears,
    isVip,
    packageInfo,
    deadline,
    typeOfEmployment,
    jobStatus,
    priorityPosition,
    vipExpiration,
    router,
  ]);

  // Check for payment completion
  useEffect(() => {
    const orderCode = searchParams?.get('orderCode');
    const checkPayment = async () => {
      if (!orderCode) return;

      try {
        const paymentStatus = await payosService.getPaymentStatus(orderCode);
        if (paymentStatus.status === 'COMPLETED') {
          // Nếu thanh toán thành công, tiến hành tạo job
          await handleCreateJob();
          toast.success('Payment successful and job posted!');
        } else {
          toast.error('Payment was not completed. Please try again.');
        }
      } catch (error) {
        console.error('Error checking payment:', error);
        toast.error('Failed to verify payment status');
      }
    };

    checkPayment();
  }, [searchParams, handleCreateJob]);

  // Check if company has active packages from previous purchases
  useEffect(() => {
    const checkExistingPackages = async () => {
      if (user?.data?.companyId) {
        try {
          // This is a placeholder - you would need to implement this API endpoint
          // const companyPackages = await packageService.getActivePackagesByCompanyId(user.data.companyId);

          // For now, let's simulate checking for existing packages
          const mockActivePackage = localStorage.getItem(
            `company_${user.data.companyId}_package`,
          );

          if (mockActivePackage) {
            const parsedPackage = JSON.parse(mockActivePackage);
            // Check if package is still active
            if (new Date(parsedPackage.expiresAt) > new Date()) {
              setPackageInfo(parsedPackage);
              setIsVip(parsedPackage.type === 'vip');
              toast.info(
                `You have an active ${parsedPackage.type} package until ${new Date(parsedPackage.expiresAt).toLocaleDateString()}`,
              );
            }
          }
        } catch (error) {
          console.error('Error fetching company packages:', error);
        }
      }
    };

    checkExistingPackages();
  }, [user?.data?.companyId]);

  // Handler for package selection with yearly billing option
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePackageUpdate = (type: PackageType, isYearly: boolean) => {
    setIsYearlyBilling(isYearly);
    setIsVip(type === 'vip');

    const newPackageInfo = {
      type,
      purchasedAt: new Date().toISOString(),
      expiresAt: calculateExpirationDate(type, isYearly),
      isActive: true,
      transactionId: `TR-${Date.now()}`, // In a real app, this would come from payment processor
      autoRenew: isYearly, // Auto-renew for yearly subscriptions
    };

    setPackageInfo(newPackageInfo);
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skills = await skillService.findAll();
        setAvailableSkills(skills);
      } catch (error) {
        console.error('Error fetching skills:', error);
        toast.error('Failed to fetch skills');
      }
    };

    fetchSkills();
  }, []);

  // Update priority position when package type changes
  useEffect(() => {
    if (packageInfo) {
      switch (packageInfo.type) {
        case 'vip':
          setPriorityPosition(1);
          break;
        case 'premium':
          setPriorityPosition(2);
          break;
        case 'basic':
        default:
          setPriorityPosition(3);
          break;
      }

      // Set VIP expiration date based on package info
      if (packageInfo.type === 'vip' && packageInfo.expiresAt) {
        setVipExpiration(packageInfo.expiresAt);
      }
    }
  }, [packageInfo]);

  const handleAddSkill = (skillId: string) => {
    const skill = availableSkills.find((s) => s.id === skillId);
    if (skill && !skills.includes(skill.name)) {
      setSkills([...skills, skill.name]);
      setSelectedSkillIds([...selectedSkillIds, skillId]);
    }
  };

  const handleRemoveSkill = (skillName: string) => {
    const skill = availableSkills.find((s) => s.name === skillName);
    if (skill) {
      setSelectedSkillIds((prev) => prev.filter((id) => id !== skill.id));
      setSkills((prev) => prev.filter((s) => s !== skillName));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (packageInfo.type === 'basic') {
      // Nếu là gói basic, tạo job luôn không cần thanh toán
      await handleCreateJob();
      return;
    }

    setIsProcessingPayment(true);
    try {
      const orderCode = Date.now();
      const returnUrl = `${window.location.origin}/job`;
      const cancelUrl = `${window.location.origin}/co/post-job`;

      const response = await payosService.createPaymentLink({
        amount: Math.round(totalPrice * 24000),
        description: `${packageInfo.type.toUpperCase()} Package - ${packageInfo.durationDays} days`,
        orderCode,
        returnUrl,
        cancelUrl,
      });

      // Chuyển hướng đến trang thanh toán PayOS
      window.location.href = response.checkoutUrl;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment. Please try again.');
    } finally {
      setIsProcessingPayment(false);
      await handleCreateJob();
    }
  };

  const stepProps: StepProps = {
    skills,
    newSkill,
    salaryRange,
    benefits,
    positions,
    packageInfo,
    setSkills,
    setNewSkill,
    setSalaryRange,
    setBenefits,
    setPositions,
    setPackageInfo,
    handleAddSkill,
    handleRemoveSkill,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    whoYouAre,
    setWhoYouAre,
    benefit,
    setBenefit,
    typeOfEmployment,
    setTypeOfEmployment,
    categoryId,
    setCategoryId,
    location,
    setLocation,
    isVip,
    setIsVip,
    deadline,
    setDeadline,
    experienceYears,
    setExperienceYears,
    availableSkills,
    totalPrice,
    setTotalPrice,
  };

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-8 sm:px-6 md:px-8 lg:px-10">
      {/* Back Link */}
      <div className="mb-6 flex items-center sm:mb-8">
        <Link
          href="#"
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          <span className="text-base font-medium sm:text-lg">Post a Job</span>
        </Link>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex w-full flex-col overflow-hidden rounded-lg border bg-white shadow-sm sm:mb-8 sm:flex-row">
        {[1, 2, 3].map((step, index) => {
          //handle the index here
          console.log('index:', index);
          const isActive = currentStep === step;
          const isLast = step === 3;

          return (
            <div
              key={step}
              className={`flex flex-1 items-start px-4 py-3 sm:items-center sm:px-6 sm:py-4 ${!isLast ? 'border-b sm:border-r sm:border-b-0' : ''} ${isActive ? 'bg-indigo-50' : 'bg-white'}`}
            >
              <div
                className={`flex items-start space-x-3 sm:items-center ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border ${isActive ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-gray-300'}`}
                >
                  <Pencil className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{`Step ${step}/3`}</span>
                  <span className="text-sm font-semibold">
                    {step === 1
                      ? 'Job Information'
                      : step === 2
                        ? 'Job Description'
                        : 'Featured Placement'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mx-auto w-full">
        {currentStep === 1 && <Step1 {...stepProps} />}
        {currentStep === 2 && <Step2 {...stepProps} />}
        {currentStep === 3 && <Step3 {...stepProps} />}
      </div>

      {/* Navigation Buttons */}
      <div className="mx-auto mt-6 flex max-w-7xl flex-col justify-end gap-2 sm:flex-row sm:gap-4">
        {currentStep > 1 && (
          <Button
            variant="outline"
            onClick={prevStep}
            className="w-full sm:w-auto"
          >
            Previous
          </Button>
        )}
        {currentStep < 3 ? (
          <Button onClick={nextStep} className="w-full sm:w-auto">
            Next Step
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
            disabled={isProcessingPayment}
          >
            {isProcessingPayment
              ? 'Processing...'
              : packageInfo.type === 'basic'
                ? 'Post Job'
                : `Pay $${totalPrice.toFixed(2)} & Post Job`}
          </Button>
        )}
      </div>
    </div>
  );
}
