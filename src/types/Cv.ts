export interface Project {
  title: string;
  link: string;
  summary: string;
}

export interface Experience {
  role: string;
  company: string;
  location: string;
  description: string;
  employmentType: string;
  startDate: string;
  endDate: string;
}

export interface Education {
  institution: string;
  degree: string;
  description: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface Certification {
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Cv {
  id?: string;
  userId?: number;
  title?: string;
  summary?: string;
  createdAt?: string;
  updatedAt?: string;
  activeColor?: string;
  templateId: number;
  url?: string;
  fileType?: string;
  // Local fields
  name: string;
  image: string;
  email: string;
  linkedin: string;
  github: string;
  skills: string[];
  phone: number;
  languages: string[];
  certifications: Certification[];
  education: Education[];
  experience: Experience[];
  displayImage: boolean;
  displayMail: boolean;
  displayWebSite: boolean;
  displayGithub: boolean;
  displayTwitter: boolean;
  displayLinkedIn: boolean;
  displayInstagram: boolean;
  displayFacebook: boolean;
}

export interface CvState {
  list: {
    data: Cv[];
    loading: boolean;
    error: string | null;
  };
  details: {
    data: Cv[];
    loading: boolean;
    error: string | null;
  };
  currentTemplate: number;
  scale: number;
}

export interface CvListResponse {
  items: Cv[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export type TagKey = 'skills' | 'languages';
