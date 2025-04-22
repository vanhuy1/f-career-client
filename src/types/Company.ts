interface TechStack {
  name: string;
  logo: string;
}

interface SocialLinks {
  twitter: string;
  facebook: string;
  linkedin: string;
}

interface OfficeLocation {
  country: string;
  flag: string;
}

export interface Company {
  name: string;
  logo: string; // Expecting image path for CompanyCard
  website: string;
  founded: string;
  employees: string;
  location: string;
  industry: string;
  jobCount: number;
  primaryColor: string;
  description: string;
  techStack: TechStack[];
  socialLinks: SocialLinks;
  officeLocations: OfficeLocation[];
  tags: string[];
}
