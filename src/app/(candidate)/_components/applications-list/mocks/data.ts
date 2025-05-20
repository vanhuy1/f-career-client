import type {
  Application,
  ApplicationStatus,
  FetchApplicationsRequest,
  FetchApplicationsResponse,
  FollowUpRequest,
  FollowUpResponse,
} from '@/types/Application';

// Mock company logos
const companyLogos = {
  Nomad: '/logo-landing/nomad.png',
  Udacity: '/logo-landing/nomad.png',
  Packer: '/logo-landing/nomad.png',
  Divvy: '/logo-landing/nomad.png',
  DigitalOcean: '/logo-landing/nomad.png',
  Google: '/logo-landing/nomad.png',
  Microsoft: '/logo-landing/nomad.png',
  Amazon: '/logo-landing/nomad.png',
  Facebook: '/logo-landing/nomad.png',
  Apple: '/logo-landing/nomad.png',
};

// Mock data for applications
export const mockApplications: Application[] = [
  {
    id: 1,
    company: {
      id: 101,
      name: 'Nomad',
      logo: companyLogos['Nomad'],
      website: 'https://nomad.com',
      industry: 'Technology',
    },
    role: 'Social Media Assistant',
    dateApplied: '2021-07-24',
    status: 'IN_REVIEW',
    notes: 'Applied through company website',
    hasFollowedUp: false,
  },
  {
    id: 2,
    company: {
      id: 102,
      name: 'Udacity',
      logo: companyLogos['Udacity'],
      website: 'https://udacity.com',
      industry: 'Education',
    },
    role: 'Social Media Assistant',
    dateApplied: '2021-07-20',
    status: 'SHORTLISTED',
    notes: 'Referred by John',
    hasFollowedUp: false,
  },
  {
    id: 3,
    company: {
      id: 103,
      name: 'Packer',
      logo: companyLogos['Packer'],
      website: 'https://packer.io',
      industry: 'Technology',
    },
    role: 'Social Media Assistant',
    dateApplied: '2021-07-16',
    status: 'OFFERED',
    notes: 'Final interview scheduled for next week',
    hasFollowedUp: true,
  },
  {
    id: 4,
    company: {
      id: 104,
      name: 'Divvy',
      logo: companyLogos['Divvy'],
      website: 'https://divvy.com',
      industry: 'Finance',
    },
    role: 'Social Media Assistant',
    dateApplied: '2021-07-14',
    status: 'INTERVIEWING',
    notes: 'First round completed',
    hasFollowedUp: true,
  },
  {
    id: 5,
    company: {
      id: 105,
      name: 'DigitalOcean',
      logo: companyLogos['DigitalOcean'],
      website: 'https://digitalocean.com',
      industry: 'Cloud Computing',
    },
    role: 'Social Media Assistant',
    dateApplied: '2021-07-10',
    status: 'UNSUITABLE',
    notes: 'Position requires 5+ years of experience',
    hasFollowedUp: false,
  },
  {
    id: 6,
    company: {
      id: 106,
      name: 'Google',
      logo: companyLogos['Google'],
      website: 'https://google.com',
      industry: 'Technology',
    },
    role: 'Social Media Manager',
    dateApplied: '2021-07-22',
    status: 'IN_REVIEW',
    notes: 'Applied through referral',
    hasFollowedUp: false,
  },
  {
    id: 7,
    company: {
      id: 107,
      name: 'Microsoft',
      logo: companyLogos['Microsoft'],
      website: 'https://microsoft.com',
      industry: 'Technology',
    },
    role: 'Digital Marketing Specialist',
    dateApplied: '2021-07-21',
    status: 'ASSESSMENT',
    notes: 'Technical assessment scheduled',
    hasFollowedUp: false,
  },
  {
    id: 8,
    company: {
      id: 108,
      name: 'Amazon',
      logo: companyLogos['Amazon'],
      website: 'https://amazon.com',
      industry: 'E-commerce',
    },
    role: 'Content Creator',
    dateApplied: '2021-07-19',
    status: 'IN_REVIEW',
    notes: 'Applied through LinkedIn',
    hasFollowedUp: false,
  },
  {
    id: 9,
    company: {
      id: 109,
      name: 'Facebook',
      logo: companyLogos['Facebook'],
      website: 'https://facebook.com',
      industry: 'Social Media',
    },
    role: 'Social Media Coordinator',
    dateApplied: '2021-07-18',
    status: 'HIRED',
    notes: 'Offer accepted',
    hasFollowedUp: true,
  },
  {
    id: 10,
    company: {
      id: 110,
      name: 'Apple',
      logo: companyLogos['Apple'],
      website: 'https://apple.com',
      industry: 'Technology',
    },
    role: 'Digital Marketing Assistant',
    dateApplied: '2021-07-15',
    status: 'REJECTED',
    notes: 'Position filled internally',
    hasFollowedUp: false,
  },
];

// Generate more mock data to reach 45 total applications
for (let i = 11; i <= 45; i++) {
  const companyNames = Object.keys(companyLogos);
  const randomCompany =
    companyNames[Math.floor(Math.random() * companyNames.length)];
  const statuses: ApplicationStatus[] = [
    'IN_REVIEW',
    'INTERVIEWING',
    'ASSESSMENT',
    'OFFERED',
    'HIRED',
    'REJECTED',
    'SHORTLISTED',
    'UNSUITABLE',
  ];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const day = Math.floor(Math.random() * 15) + 10; // Random day between 10 and 25

  mockApplications.push({
    id: i,
    company: {
      id: 100 + i,
      name: randomCompany,
      logo: companyLogos[randomCompany as keyof typeof companyLogos],
      website: `https://${randomCompany.toLowerCase()}.com`,
      industry: 'Technology',
    },
    role: 'Social Media Assistant',
    dateApplied: `2021-07-${day}`,
    status: randomStatus,
    notes: 'Applied online',
    hasFollowedUp: Math.random() > 0.7,
  });
}

// Fake fetch API for applications
export const fakeFetchApplications = async (
  request: FetchApplicationsRequest,
): Promise<FetchApplicationsResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Filter applications based on request parameters
  let filteredApplications = [...mockApplications];

  // Filter by status if provided
  if (request.status && request.status !== 'ALL') {
    filteredApplications = filteredApplications.filter(
      (app) => app.status === request.status,
    );
  }

  // Filter by search query if provided
  if (request.searchQuery) {
    const query = request.searchQuery.toLowerCase();
    filteredApplications = filteredApplications.filter(
      (app) =>
        app.company.name.toLowerCase().includes(query) ||
        app.role.toLowerCase().includes(query),
    );
  }

  // Filter by date range if provided
  if (request.startDate && request.endDate) {
    filteredApplications = filteredApplications.filter((app) => {
      const appDate = new Date(app.dateApplied);
      const startDate = new Date(request.startDate as string);
      const endDate = new Date(request.endDate as string);
      return appDate >= startDate && appDate <= endDate;
    });
  }

  // Calculate pagination
  const total = filteredApplications.length;
  const startIndex = (request.page - 1) * request.limit;
  const endIndex = startIndex + request.limit;
  const paginatedApplications = filteredApplications.slice(
    startIndex,
    endIndex,
  );

  return {
    applications: paginatedApplications,
    total,
    page: request.page,
    limit: request.limit,
  };
};

// Fake follow-up API
export const fakeFollowUp = async (
  request: FollowUpRequest,
): Promise<FollowUpResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Find the application
  const application = mockApplications.find(
    (app) => app.id === request.applicationId,
  );

  if (!application) {
    return {
      success: false,
      message: 'Application not found',
    };
  }

  // Check if application is in review
  if (application.status !== 'IN_REVIEW') {
    return {
      success: false,
      message: 'Follow-up can only be requested for applications in review',
    };
  }

  // Check if already followed up
  if (application.hasFollowedUp) {
    return {
      success: false,
      message: 'You have already followed up on this application',
    };
  }

  // Check if 7 days have passed since application
  const applicationDate = new Date(application.dateApplied);
  const currentDate = new Date();
  const daysDifference = Math.floor(
    (currentDate.getTime() - applicationDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysDifference < 7) {
    return {
      success: false,
      message: `You can follow up after 7 days. ${7 - daysDifference} days remaining.`,
    };
  }

  // Update application
  application.hasFollowedUp = true;
  application.followUpDate = new Date().toISOString().split('T')[0];

  return {
    success: true,
    message: 'Follow-up request sent successfully',
    application,
  };
};
