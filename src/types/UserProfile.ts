export interface UserProfile {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: string;
  coverImage: string;
  isOpenToOpportunities: boolean;
  about: string;
  contact: {
    email: string;
    phone: string;
    languages: string[];
  };
  social: {
    instagram: string;
    twitter: string;
    website: string;
  };
  experiences: Experience[];
  education: Education[];
  skills: string[];
  portfolios: Portfolio[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  logo: string;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  location: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  logo: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  description?: string;
}

export interface Portfolio {
  id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
}
