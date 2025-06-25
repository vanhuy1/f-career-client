import type { Candidate } from '../types/candidate';
import type { JobDetails } from '../types/job';
import { ApplicationStatus } from '../types/candidate';

export async function getJobApplicants(): Promise<Candidate[]> {
  // Simulate API call
  //   await new Promise((resolve) => setTimeout(resolve, 100));

  return [
    {
      id: '1',
      name: 'Jake Gyll',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 4.0,
      status: ApplicationStatus.APPLIED,
    },
    {
      id: '2',
      name: 'Jenny Wilson',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.APPLIED,
    },
    {
      id: '3',
      name: 'Jane Cooper',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.APPLIED,
    },
    {
      id: '4',
      name: 'Courtney Henry',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      id: '5',
      name: 'Floyd Miles',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      id: '6',
      name: 'Devon Lane',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.INTERVIEW,
    },
    {
      id: '7',
      name: 'Annette Black',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.HIRED,
    },
    {
      id: '8',
      name: 'Brooklyn Simmons',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '13 July, 2021',
      score: 0.0,
      status: ApplicationStatus.HIRED,
    },
    {
      id: '9',
      name: 'Robert Johnson',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '10 July, 2021',
      score: 2.5,
      status: ApplicationStatus.REJECTED,
    },
    {
      id: '10',
      name: 'Sarah Davis',
      avatar: '/placeholder.svg?height=48&width=48',
      appliedDate: '08 July, 2021',
      score: 1.0,
      status: ApplicationStatus.REJECTED,
    },
  ];
}

export async function getJobDetails(): Promise<JobDetails> {
  return {
    id: '1',
    title: 'Social Media Assistant',
    description:
      'Stripe is looking for Social Media Marketing expert to help manage our online networks. You will be responsible for monitoring our social media channels, creating content, finding effective ways to engage the community and incentivize others to engage on our channels.',
    responsibilities: [
      'Community engagement to ensure that is supported and actively represented online',
      'Focus on social media content development and publication',
      'Marketing and strategy support',
      'Stay on top of trends on social media platforms, and suggest content ideas to the team',
      'Engage with online communities',
    ],
    requirements: [
      'You get energy from people and building the ideal work environment',
      'You have a sense for beautiful spaces and office experiences',
      'You are a confident office manager, ready for added responsibilities',
      "You're detail-oriented and creative",
      "You're a growth marketer and know how to run campaigns",
    ],
    niceToHaves: ['Fluent in English', 'Project management skills'],
    applicationsCount: 5,
    capacity: 10,
    applyBefore: 'July 31, 2021',
    postedOn: 'July 1, 2021',
    type: 'Full-Time',
    salary: '$75k-$85k USD',
    categories: ['Marketing', 'Design'],
    requiredSkills: [
      'Project Management',
      'Copywriting',
      'English',
      'Social Media Marketing',
      'Copy Editing',
    ],
  };
}
