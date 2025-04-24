import type { UserProfile } from '@/types/UserProfile';

export const fakeUserProfile: UserProfile = {
  id: 'user-1',
  name: 'Jake Gyll',
  title: 'Product Designer',
  company: 'Twitter',
  location: 'Manchester, UK',
  avatar: '/Auth/authbg.jpg',
  coverImage: '/Auth/dugbg.jpg',
  isOpenToOpportunities: true,
  about:
    "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.\n\nFor 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
  contact: {
    email: 'jakegyll@email.com',
    phone: '+44 1245 572 135',
    languages: ['English', 'French'],
  },
  social: {
    instagram: 'instagram.com/jakegyll',
    twitter: 'twitter.com/jakegyll',
    website: 'www.jakegyll.com',
  },
  experiences: [
    {
      id: 'exp-1',
      role: 'Product Designer',
      company: 'Twitter',
      logo: '/Auth/dugbg.jpg',
      employmentType: 'Full-Time',
      startDate: 'Jun 2019',
      endDate: null,
      location: 'Manchester, UK',
      description:
        'Created and executed social media plan for 10 brands utilizing multiple features and content types to increase brand outreach, engagement, and leads.',
    },
    {
      id: 'exp-2',
      role: 'Growth Marketing Designer',
      company: 'GoDaddy',
      logo: '/Auth/dugbg.jpg',
      employmentType: 'Full-Time',
      startDate: 'Jun 2011',
      endDate: 'May 2019',
      location: 'Manchester, UK',
      description:
        'Developed digital marketing strategies, activation plans, proposals, contests and promotions for client initiatives',
    },
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Harvard University',
      logo: '/Auth/dugbg.jpg',
      degree: 'Postgraduate degree',
      field: 'Applied Psychology',
      startYear: 2010,
      endYear: 2012,
      description:
        'As an Applied Psychologist in the field of Consumer and Society, I am specialized in creating business opportunities by observing, analysing, researching and changing behaviour.',
    },
    {
      id: 'edu-2',
      institution: 'University of Toronto',
      logo: '/Auth/dugbg.jpg',
      degree: 'Bachelor of Arts',
      field: 'Visual Communication',
      startYear: 2005,
      endYear: 2009,
    },
  ],
  skills: [
    'Communication',
    'Analytics',
    'Facebook Ads',
    'Content Planning',
    'Community Manager',
  ],
  portfolios: [
    {
      id: 'port-1',
      title: 'Clinically - clinic & health care website',
      image: '/Auth/dugbg.jpg',
      description: 'Healthcare website design',
    },
    {
      id: 'port-2',
      title: 'Growthly - SaaS Analytics & Sales Website',
      image: '/Auth/dugbg.jpg',
      description: 'SaaS analytics dashboard',
    },
    {
      id: 'port-3',
      title: 'Planna - Project Management App',
      image: '/Auth/dugbg.jpg',
      description: 'Project management application',
    },
    {
      id: 'port-4',
      title: 'Funiro - furniture website',
      image: '/Auth/dugbg.jpg',
      description: 'Furniture e-commerce website',
    },
  ],
};
