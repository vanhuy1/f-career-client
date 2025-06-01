import type {
  DetailedApplication,
  FetchApplicationDetailRequest,
  FetchApplicationDetailResponse,
} from '@/types/Application';

export const mockDetailedApplications: DetailedApplication[] = [
  {
    id: 3,
    company: {
      id: 103,
      name: 'Packer',
      logo: '/logo-landing/nomad.png',
      website: 'https://packer.io',
      industry: 'Technology',
    },
    role: 'Social Media Assistant',
    dateApplied: '2021-07-16',
    status: 'OFFERED',
    jobDescription:
      'We are looking for a Social Media Assistant to help manage our social media accounts and create engaging content for our audience. The ideal candidate will have experience with social media management tools and a passion for creating compelling content.',
    salaryRange: {
      min: 50000,
      max: 65000,
      currency: 'USD',
    },
    location: {
      type: 'hybrid',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      country: 'USA',
    },
    employmentType: 'full-time',
    requiredSkills: [
      'Social Media Management',
      'Content Creation',
      'Adobe Creative Suite',
      'Copywriting',
      'Analytics',
    ],
    contacts: [
      {
        id: 1,
        name: 'Jane Smith',
        role: 'HR Manager',
        email: 'jane.smith@packer.io',
        phone: '555-123-4567',
      },
      {
        id: 2,
        name: 'Michael Johnson',
        role: 'Marketing Director',
        email: 'michael.johnson@packer.io',
      },
    ],
    documents: [
      {
        id: 1,
        type: 'resume',
        name: 'Jake_Resume_2021.pdf',
        url: '/documents/resume.pdf',
        dateUploaded: '2021-07-16',
        version: 1,
      },
      {
        id: 2,
        type: 'cover_letter',
        name: 'Jake_CoverLetter_Packer.pdf',
        url: '/documents/cover_letter.pdf',
        dateUploaded: '2021-07-16',
        version: 1,
      },
      {
        id: 3,
        type: 'portfolio',
        name: 'Social Media Portfolio',
        url: 'https://portfolio.jake.com',
        dateUploaded: '2021-07-16',
      },
      {
        id: 4,
        type: 'assessment',
        name: 'Social Media Strategy.pdf',
        url: '/documents/assessment.pdf',
        dateUploaded: '2021-08-05',
        version: 1,
      },
    ],
  },
  // Add more detailed applications as needed
];

// Fake fetch API for application details
export const fakeFetchApplicationDetail = async (
  request: FetchApplicationDetailRequest,
): Promise<FetchApplicationDetailResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the application by ID
  const application = mockDetailedApplications.find(
    (app) => app.id === request.applicationId,
  );

  if (!application) {
    throw new Error('Application not found');
  }

  return {
    application,
  };
};
