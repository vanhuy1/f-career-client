'use client';

import { useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Step1 from './_components/step-one';
import Step2 from './_components/step-two';
import Step3 from './_components/step-three';
import { StepProps } from '@/types/Job';
import { jobService } from '@/services/api/jobs/job-api';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function JobPostingForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<string[]>([
    'Graphic Design',
    'Communication',
    'Illustrator',
  ]);
  const [newSkill, setNewSkill] = useState('');
  const [salaryRange, setSalaryRange] = useState([5000, 22000]);
  const [benefits, setBenefits] = useState([
    {
      id: 1,
      icon: 'healthcare',
      title: 'Full Healthcare',
      description:
        'We believe in thriving communities and that starts with our team being happy and healthy.',
    },
    {
      id: 2,
      icon: 'vacation',
      title: 'Unlimited Vacation',
      description:
        'We believe you should have a flexible schedule that makes space for family, wellness, and fun.',
    },
    {
      id: 3,
      icon: 'development',
      title: 'Skill Development',
      description:
        "We believe in investing and leveling up our skills. Whether it's a conference or online course.",
    },
  ]);

  // Thêm state cho các thông tin job
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [whoYouAre, setWhoYouAre] = useState('');
  const [niceToHaves, setNiceToHaves] = useState('');
  const [employmentType, setEmploymentType] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState('');
  const [isVip, setIsVip] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
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
    try {
      // Chuẩn bị dữ liệu để gửi lên BE
      const jobData = {
        title: jobTitle,
        description: jobDescription,
        categoryId: categoryId || '1', // Default value nếu chưa chọn
        companyId: '1', // Default value, có thể lấy từ context hoặc state
        responsibility: responsibilities
          .split('\n')
          .filter((item) => item.trim() !== ''),
        jobFitAttributes: whoYouAre
          .split('\n')
          .filter((item) => item.trim() !== ''),
        niceToHave: niceToHaves
          .split('\n')
          .filter((item) => item.trim() !== ''),
        location: location || 'New York', // Default value
        salaryMin: salaryRange[0],
        salaryMax: salaryRange[1],
        experienceYears: experienceYears,
        isVip: isVip,
        deadline: deadline || '2024-12-31T00:00:00.000Z', // Default value
        typeOfEmployment: employmentType[0] || 'FullTime', // Lấy loại đầu tiên hoặc default
      };

      // Gọi API tạo job
      await jobService.create(jobData);

      toast.success('Job created successfully!');
      router.push('/job'); // Chuyển hướng về trang danh sách job
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job. Please try again.');
    }
  };

  const stepProps: StepProps = {
    skills,
    newSkill,
    salaryRange,
    benefits,
    setSkills,
    setNewSkill,
    setSalaryRange,
    setBenefits,
    handleAddSkill,
    handleRemoveSkill,
    jobTitle,
    setJobTitle,
    jobDescription,
    setJobDescription,
    responsibilities,
    setResponsibilities,
    whoYouAre,
    setWhoYouAre,
    niceToHaves,
    setNiceToHaves,
    employmentType,
    setEmploymentType,
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
                        : 'Perks & Benefit'}
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
          <Button onClick={handleSubmit} className="w-full sm:w-auto">
            Do a Review
          </Button>
        )}
      </div>
    </div>
  );
}
