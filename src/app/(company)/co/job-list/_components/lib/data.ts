import type { JobDetails } from '../types/job';

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
