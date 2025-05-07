export interface CandidateProfile {
  id: string;
  name: string;
  title: string | null;
  company: string | null;
  location: string | null;
  avatar: string | null;
  coverImage: string | null;
  isOpenToOpportunities: boolean;
  about: string | null;
  birthDate: string | null;
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
  endYear: number | null;
  description?: string;
}

export interface Portfolio {
  id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
}

// DTOs for experiences
export interface UpdateExperienceDto {
  id: string;
  role: string;
  company: string;
  employmentType: string;
  location: string;
  description: string;
  startDate: string;

  logo?: string;
  endDate: string | null;

  currentlyWorking?: boolean;
}

export interface CreateExperienceDto {
  role: string;
  company: string;
  employmentType: string;
  location: string;
  description: string;
  startDate: string; // In "MMM yyyy" format
  logo?: string; // Optional in the form
  endDate: string | null; // null when currently working
}

// DTOs for education

export interface UpdateEducationDto {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | null;
  currentlyStudying: boolean;
  logo: string;
  description: string;
}

export interface CreateEducationDto {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number | null;
  currentlyStudying: boolean;
  logo: string;
  description: string;
}

// DTOs for portfolios
export interface UpdatePortfolioDto {
  id: string;
  title: string;
  image: string;
  description?: string;
  link?: string;
}

export interface CreatePortfolioDto {
  title: string;
  image: string;
  description?: string;
  link?: string;
}

// DTOs for skills
export interface UpdateSkillsDto {
  skills: string[];
}

// DTOs for social links
export interface UpdateSocialLinksDto {
  instagram: string;
  twitter: string;
  website: string;
}

export interface updateAboutSectionRequestDto {
  about: string;
}

export interface updateProfileResponseDto {
  message: string;
}

export interface updateProfileHeaderRequestDto {
  title: string | null;
  company: string | null;
  location: string | null;
  isOpenToOpportunities: boolean;
}
