import type {
  Application,
  ApplicationStatus,
  FetchApplicationsRequest,
  FetchApplicationsResponse,
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
    status: 'HIRED',
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
    status: 'REJECTED',
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
