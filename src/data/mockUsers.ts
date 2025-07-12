// Mock user data for admin user management
export interface UserDetail {
  id: number;
  name: string;
  username: string;
  email: string;
  phone?: string;
  birthday?: string;
  avatar?: string;
  status: 'verified' | 'unverified' | 'banned';
  role: 'USER' | 'ADMIN' | 'RECRUITER' | 'ADMIN_RECRUITER';
  joinDate: string;
  lastActive: string;
  location?: string;
  bio?: string;
  totalApplications: number;
  totalJobs: number;
  profileViews: number;
  loginCount: number;
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  accountWarnings: number;
  suspensionHistory: SuspensionRecord[];
  reports: UserReport[];
  activityLogs: ActivityLog[];
  permissions: string[];
}

export interface SuspensionRecord {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
  issuedBy: string;
  status: 'active' | 'completed' | 'revoked';
}

export interface UserReport {
  id: number;
  reportedBy: string;
  reason: string;
  description: string;
  reportDate: string;
  status: 'pending' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
}

export interface ActivityLog {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// Company interfaces
export interface CompanyDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  logo?: string;
  status: 'accepted' | 'pending' | 'denied';
  submissionDate: string;
  approvalDate?: string;
  lastActive: string;
  industry: string;
  employees: string;
  location: string;
  description: string;
  foundedYear: number;
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalHires: number;
  profileViews: number;
  subscriptionPlan: 'free' | 'premium' | 'enterprise';
  subscriptionExpiry?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  companyWarnings: number;
  suspensionHistory: CompanySuspensionRecord[];
  reports: CompanyReport[];
  activityLogs: ActivityLog[];
  contactPerson: {
    name: string;
    role: string;
    email: string;
    phone?: string;
  };
  socialMedia: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  benefits: string[];
  companySize: string;
  fundingStage?: string;
  revenue?: string;
}

export interface CompanySuspensionRecord {
  id: number;
  reason: string;
  startDate: string;
  endDate: string;
  issuedBy: string;
  status: 'active' | 'completed' | 'revoked';
}

export interface CompanyReport {
  id: number;
  reportedBy: string;
  reason: string;
  description: string;
  reportDate: string;
  status: 'pending' | 'resolved' | 'dismissed';
  severity: 'low' | 'medium' | 'high';
}

export const mockUsers: UserDetail[] = [
  {
    id: 1,
    name: 'John Smith',
    username: 'johnsmith',
    email: 'john.smith@email.com',
    phone: '+1 (555) 123-4567',
    birthday: '1990-05-15',
    avatar: '/placeholder.svg?height=120&width=120',
    status: 'verified',
    role: 'USER',
    joinDate: '2023-06-15',
    lastActive: '2024-01-23',
    location: 'San Francisco, CA',
    bio: 'Software engineer with 5+ years experience in web development. Passionate about creating innovative solutions.',
    totalApplications: 45,
    totalJobs: 8,
    profileViews: 1250,
    loginCount: 342,
    lastPasswordChange: '2023-12-01',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: false,
    accountWarnings: 1,
    suspensionHistory: [
      {
        id: 1,
        reason: 'Inappropriate content in profile',
        startDate: '2023-10-01',
        endDate: '2023-10-03',
        issuedBy: 'Admin Johnson',
        status: 'completed',
      },
    ],
    reports: [
      {
        id: 1,
        reportedBy: 'Sarah Johnson',
        reason: 'Spam/Inappropriate Content',
        description:
          'User posted inappropriate content in job application messages.',
        reportDate: '2023-09-28',
        status: 'resolved',
        severity: 'medium',
      },
      {
        id: 2,
        reportedBy: 'Mike Wilson',
        reason: 'Harassment',
        description:
          'User sent multiple unwanted messages despite being asked to stop.',
        reportDate: '2023-11-15',
        status: 'pending',
        severity: 'high',
      },
    ],
    activityLogs: [
      {
        id: 1,
        action: 'LOGIN',
        description: 'User logged in successfully',
        timestamp: '2024-01-23T10:30:00Z',
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: 2,
        action: 'PROFILE_UPDATE',
        description: 'Updated profile information',
        timestamp: '2024-01-20T14:15:00Z',
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: 3,
        action: 'APPLICATION_SUBMITTED',
        description: 'Submitted application for Software Engineer position',
        timestamp: '2024-01-18T09:45:00Z',
        ipAddress: '192.168.1.100',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    ],
    permissions: [
      'can_apply_jobs',
      'can_view_profiles',
      'can_message_recruiters',
    ],
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    username: 'sarahj',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 234-5678',
    birthday: '1988-03-22',
    avatar: '/placeholder.svg?height=120&width=120',
    status: 'unverified',
    role: 'USER',
    joinDate: '2024-01-10',
    lastActive: '2024-01-22',
    location: 'New York, NY',
    bio: 'Marketing professional with expertise in digital campaigns and brand strategy.',
    totalApplications: 12,
    totalJobs: 2,
    profileViews: 340,
    loginCount: 28,
    lastPasswordChange: '2024-01-10',
    twoFactorEnabled: false,
    emailVerified: false,
    phoneVerified: true,
    accountWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 4,
        action: 'ACCOUNT_CREATED',
        description: 'User account created',
        timestamp: '2024-01-10T08:00:00Z',
        ipAddress: '192.168.1.105',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      {
        id: 5,
        action: 'PROFILE_UPDATE',
        description: 'Added profile picture',
        timestamp: '2024-01-11T12:30:00Z',
        ipAddress: '192.168.1.105',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    ],
    permissions: ['can_apply_jobs', 'can_view_profiles'],
  },
  {
    id: 3,
    name: 'Mike Wilson',
    username: 'mikew',
    email: 'mike.wilson@email.com',
    phone: '+1 (555) 345-6789',
    birthday: '1985-11-08',
    avatar: '/placeholder.svg?height=120&width=120',
    status: 'banned',
    role: 'USER',
    joinDate: '2023-08-20',
    lastActive: '2024-01-15',
    location: 'Chicago, IL',
    bio: 'Data analyst with strong background in statistical analysis and machine learning.',
    totalApplications: 78,
    totalJobs: 15,
    profileViews: 890,
    loginCount: 156,
    lastPasswordChange: '2023-11-20',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    accountWarnings: 3,
    suspensionHistory: [
      {
        id: 2,
        reason: 'Multiple policy violations',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        issuedBy: 'Admin Smith',
        status: 'active',
      },
    ],
    reports: [
      {
        id: 3,
        reportedBy: 'Emily Davis',
        reason: 'Harassment',
        description: 'Inappropriate messages sent to multiple users.',
        reportDate: '2024-01-14',
        status: 'resolved',
        severity: 'high',
      },
    ],
    activityLogs: [
      {
        id: 6,
        action: 'ACCOUNT_SUSPENDED',
        description: 'Account suspended for policy violations',
        timestamp: '2024-01-15T16:00:00Z',
        ipAddress: '192.168.1.110',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    ],
    permissions: [],
  },
  {
    id: 4,
    name: 'Emily Davis',
    username: 'emilyd',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 456-7890',
    birthday: '1992-07-14',
    avatar: '/placeholder.svg?height=120&width=120',
    status: 'verified',
    role: 'RECRUITER',
    joinDate: '2023-11-05',
    lastActive: '2024-01-23',
    location: 'Austin, TX',
    bio: 'HR professional specializing in talent acquisition and employee relations.',
    totalApplications: 23,
    totalJobs: 45,
    profileViews: 2100,
    loginCount: 298,
    lastPasswordChange: '2023-12-15',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    accountWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 7,
        action: 'JOB_POSTED',
        description: 'Posted new job opening for Senior Developer',
        timestamp: '2024-01-23T09:15:00Z',
        ipAddress: '192.168.1.115',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      {
        id: 8,
        action: 'APPLICATION_REVIEWED',
        description: 'Reviewed application for Marketing Manager position',
        timestamp: '2024-01-22T14:30:00Z',
        ipAddress: '192.168.1.115',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    ],
    permissions: [
      'can_apply_jobs',
      'can_view_profiles',
      'can_message_recruiters',
      'can_post_jobs',
      'can_review_applications',
    ],
  },
  {
    id: 5,
    name: 'Alex Brown',
    username: 'alexb',
    email: 'alex.brown@email.com',
    phone: '+1 (555) 567-8901',
    birthday: '1991-09-03',
    avatar: '/placeholder.svg?height=120&width=120',
    status: 'unverified',
    role: 'USER',
    joinDate: '2024-01-18',
    lastActive: '2024-01-21',
    location: 'Seattle, WA',
    bio: 'UX/UI designer passionate about creating intuitive user experiences.',
    totalApplications: 8,
    totalJobs: 1,
    profileViews: 180,
    loginCount: 15,
    lastPasswordChange: '2024-01-18',
    twoFactorEnabled: false,
    emailVerified: false,
    phoneVerified: false,
    accountWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 9,
        action: 'ACCOUNT_CREATED',
        description: 'User account created',
        timestamp: '2024-01-18T10:00:00Z',
        ipAddress: '192.168.1.120',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: 10,
        action: 'FIRST_LOGIN',
        description: 'User logged in for the first time',
        timestamp: '2024-01-18T10:05:00Z',
        ipAddress: '192.168.1.120',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    ],
    permissions: ['can_apply_jobs', 'can_view_profiles'],
  },
  {
    id: 6,
    name: 'Jennifer Wilson',
    username: 'jenwilson',
    email: 'jennifer.wilson@email.com',
    phone: '+1 (555) 678-9012',
    birthday: '1987-12-25',
    avatar: '/placeholder.svg?height=120&width=120',
    status: 'verified',
    role: 'ADMIN',
    joinDate: '2023-01-15',
    lastActive: '2024-01-23',
    location: 'Los Angeles, CA',
    bio: 'System administrator with expertise in platform management and user experience.',
    totalApplications: 5,
    totalJobs: 0,
    profileViews: 450,
    loginCount: 500,
    lastPasswordChange: '2023-12-20',
    twoFactorEnabled: true,
    emailVerified: true,
    phoneVerified: true,
    accountWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 11,
        action: 'ADMIN_ACTION',
        description: 'Updated system settings',
        timestamp: '2024-01-23T11:00:00Z',
        ipAddress: '192.168.1.125',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      {
        id: 12,
        action: 'USER_MODERATION',
        description: 'Reviewed user reports',
        timestamp: '2024-01-22T16:45:00Z',
        ipAddress: '192.168.1.125',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    ],
    permissions: [
      'can_apply_jobs',
      'can_view_profiles',
      'can_message_recruiters',
      'can_post_jobs',
      'can_review_applications',
      'can_manage_users',
      'can_moderate_content',
    ],
  },
];

// Helper function to get user by ID
export const getUserById = (id: number): UserDetail | undefined => {
  return mockUsers.find((user) => user.id === id);
};

// Helper function to get users by status
export const getUsersByStatus = (
  status: 'verified' | 'unverified' | 'banned',
): UserDetail[] => {
  return mockUsers.filter((user) => user.status === status);
};

// Mock company data
export const mockCompanies: CompanyDetail[] = [
  {
    id: 1,
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    logo: '/placeholder.svg?height=120&width=120',
    status: 'accepted',
    submissionDate: '2024-01-15',
    approvalDate: '2024-01-20',
    lastActive: '2024-01-23',
    industry: 'Technology',
    employees: '50-100',
    location: 'San Francisco, CA',
    description:
      'Leading technology company specializing in cloud computing and AI solutions. We help businesses transform their operations through cutting-edge technology.',
    foundedYear: 2018,
    totalJobs: 45,
    activeJobs: 12,
    totalApplications: 1250,
    totalHires: 98,
    profileViews: 5400,
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2024-12-31',
    emailVerified: true,
    phoneVerified: true,
    companyWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 1,
        action: 'JOB_POSTED',
        description: 'Posted new job: Senior Software Engineer',
        timestamp: '2024-01-23T09:30:00Z',
        ipAddress: '192.168.1.200',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: 2,
        action: 'APPLICATION_REVIEWED',
        description: 'Reviewed applications for DevOps Engineer position',
        timestamp: '2024-01-22T14:15:00Z',
        ipAddress: '192.168.1.200',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    ],
    contactPerson: {
      name: 'Sarah Johnson',
      role: 'HR Manager',
      email: 'sarah.johnson@techcorp.com',
      phone: '+1 (555) 123-4568',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/techcorp',
      twitter: 'https://twitter.com/techcorp',
      facebook: 'https://facebook.com/techcorp',
    },
    benefits: [
      'Health Insurance',
      'Dental Insurance',
      'Vision Insurance',
      '401(k) Matching',
      'Flexible Work Hours',
      'Remote Work Options',
      'Professional Development Budget',
    ],
    companySize: 'Mid-size',
    fundingStage: 'Series B',
    revenue: '$10M - $50M',
  },
  {
    id: 2,
    name: 'Green Energy Ltd',
    email: 'info@greenenergy.com',
    phone: '+1 (555) 234-5678',
    website: 'https://greenenergy.com',
    logo: '/placeholder.svg?height=120&width=120',
    status: 'pending',
    submissionDate: '2024-01-20',
    lastActive: '2024-01-22',
    industry: 'Energy',
    employees: '10-50',
    location: 'Austin, TX',
    description:
      'Renewable energy company focused on solar and wind power solutions for residential and commercial clients.',
    foundedYear: 2020,
    totalJobs: 8,
    activeJobs: 5,
    totalApplications: 156,
    totalHires: 12,
    profileViews: 890,
    subscriptionPlan: 'free',
    emailVerified: true,
    phoneVerified: false,
    companyWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 3,
        action: 'COMPANY_REGISTERED',
        description: 'Company profile created and submitted for review',
        timestamp: '2024-01-20T10:00:00Z',
        ipAddress: '192.168.1.205',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    ],
    contactPerson: {
      name: 'Michael Green',
      role: 'CEO',
      email: 'michael.green@greenenergy.com',
      phone: '+1 (555) 234-5679',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/greenenergy',
      twitter: 'https://twitter.com/greenenergy',
    },
    benefits: [
      'Health Insurance',
      'Dental Insurance',
      'Equity Options',
      'Flexible Work Hours',
    ],
    companySize: 'Small',
    fundingStage: 'Seed',
    revenue: '$1M - $5M',
  },
  {
    id: 3,
    name: 'DataFlow Inc',
    email: 'hello@dataflow.com',
    phone: '+1 (555) 345-6789',
    website: 'https://dataflow.com',
    logo: '/placeholder.svg?height=120&width=120',
    status: 'denied',
    submissionDate: '2024-01-18',
    lastActive: '2024-01-19',
    industry: 'Data Analytics',
    employees: '100-500',
    location: 'New York, NY',
    description:
      'Data analytics company providing business intelligence solutions to Fortune 500 companies.',
    foundedYear: 2016,
    totalJobs: 25,
    activeJobs: 0,
    totalApplications: 450,
    totalHires: 35,
    profileViews: 2100,
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2024-06-30',
    emailVerified: true,
    phoneVerified: true,
    companyWarnings: 2,
    suspensionHistory: [
      {
        id: 1,
        reason: 'Incomplete company verification documents',
        startDate: '2024-01-19',
        endDate: '2024-02-19',
        issuedBy: 'Admin Wilson',
        status: 'active',
      },
    ],
    reports: [
      {
        id: 1,
        reportedBy: 'John Smith',
        reason: 'Misleading job descriptions',
        description:
          'Job postings contain inaccurate salary ranges and requirements',
        reportDate: '2024-01-17',
        status: 'resolved',
        severity: 'medium',
      },
    ],
    activityLogs: [
      {
        id: 4,
        action: 'COMPANY_SUSPENDED',
        description: 'Company suspended due to incomplete verification',
        timestamp: '2024-01-19T16:30:00Z',
        ipAddress: '192.168.1.210',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    ],
    contactPerson: {
      name: 'Lisa Chen',
      role: 'Head of HR',
      email: 'lisa.chen@dataflow.com',
      phone: '+1 (555) 345-6790',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/dataflow',
      twitter: 'https://twitter.com/dataflow',
      facebook: 'https://facebook.com/dataflow',
    },
    benefits: [
      'Health Insurance',
      'Dental Insurance',
      'Vision Insurance',
      '401(k) Matching',
      'Stock Options',
      'Gym Membership',
      'Catered Meals',
    ],
    companySize: 'Large',
    fundingStage: 'Series C',
    revenue: '$50M - $100M',
  },
  {
    id: 4,
    name: 'Creative Studios',
    email: 'team@creativestudios.com',
    phone: '+1 (555) 456-7890',
    website: 'https://creativestudios.com',
    logo: '/placeholder.svg?height=120&width=120',
    status: 'accepted',
    submissionDate: '2024-01-12',
    approvalDate: '2024-01-15',
    lastActive: '2024-01-23',
    industry: 'Design',
    employees: '5-10',
    location: 'Portland, OR',
    description:
      'Creative design studio specializing in branding, web design, and digital marketing for small to medium businesses.',
    foundedYear: 2019,
    totalJobs: 15,
    activeJobs: 3,
    totalApplications: 234,
    totalHires: 18,
    profileViews: 1200,
    subscriptionPlan: 'free',
    emailVerified: true,
    phoneVerified: true,
    companyWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 5,
        action: 'JOB_POSTED',
        description: 'Posted new job: UX/UI Designer',
        timestamp: '2024-01-23T11:00:00Z',
        ipAddress: '192.168.1.215',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
      {
        id: 6,
        action: 'PROFILE_UPDATED',
        description: 'Updated company profile and added new portfolio items',
        timestamp: '2024-01-21T09:45:00Z',
        ipAddress: '192.168.1.215',
        userAgent:
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      },
    ],
    contactPerson: {
      name: 'Alex Rivera',
      role: 'Creative Director',
      email: 'alex.rivera@creativestudios.com',
      phone: '+1 (555) 456-7891',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/creativestudios',
      twitter: 'https://twitter.com/creativestudios',
      facebook: 'https://facebook.com/creativestudios',
    },
    benefits: [
      'Health Insurance',
      'Flexible Work Hours',
      'Creative Budget',
      'Professional Development',
      'Team Retreats',
    ],
    companySize: 'Small',
    fundingStage: 'Bootstrap',
    revenue: '$500K - $1M',
  },
  {
    id: 5,
    name: 'FinTech Innovations',
    email: 'support@fintech.com',
    phone: '+1 (555) 567-8901',
    website: 'https://fintech.com',
    logo: '/placeholder.svg?height=120&width=120',
    status: 'pending',
    submissionDate: '2024-01-22',
    lastActive: '2024-01-23',
    industry: 'Finance',
    employees: '20-50',
    location: 'Boston, MA',
    description:
      'Financial technology company developing innovative payment solutions and digital banking platforms.',
    foundedYear: 2021,
    totalJobs: 12,
    activeJobs: 7,
    totalApplications: 189,
    totalHires: 8,
    profileViews: 670,
    subscriptionPlan: 'premium',
    subscriptionExpiry: '2024-08-31',
    emailVerified: true,
    phoneVerified: true,
    companyWarnings: 0,
    suspensionHistory: [],
    reports: [],
    activityLogs: [
      {
        id: 7,
        action: 'COMPANY_REGISTERED',
        description: 'Company profile created and submitted for review',
        timestamp: '2024-01-22T14:20:00Z',
        ipAddress: '192.168.1.220',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      {
        id: 8,
        action: 'JOB_POSTED',
        description: 'Posted new job: Backend Developer',
        timestamp: '2024-01-23T10:15:00Z',
        ipAddress: '192.168.1.220',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    ],
    contactPerson: {
      name: 'Emma Davis',
      role: 'Head of Talent',
      email: 'emma.davis@fintech.com',
      phone: '+1 (555) 567-8902',
    },
    socialMedia: {
      linkedin: 'https://linkedin.com/company/fintech',
      twitter: 'https://twitter.com/fintech',
    },
    benefits: [
      'Health Insurance',
      'Dental Insurance',
      'Vision Insurance',
      '401(k) Matching',
      'Stock Options',
      'Flexible Work Hours',
      'Learning Stipend',
    ],
    companySize: 'Small',
    fundingStage: 'Series A',
    revenue: '$5M - $10M',
  },
];

// Helper function to get company by ID
export const getCompanyById = (id: number): CompanyDetail | undefined => {
  return mockCompanies.find((company) => company.id === id);
};

// Helper function to get companies by status
export const getCompaniesByStatus = (
  status: 'accepted' | 'pending' | 'denied',
): CompanyDetail[] => {
  return mockCompanies.filter((company) => company.status === status);
};
