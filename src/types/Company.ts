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

export interface Benefit {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export type ContactInfo = {
  [key: string]: string;
};

export interface NativeName {
  [language: string]: {
    official: string;
    common: string;
  };
}

export interface Name {
  common: string;
  official: string;
  nativeName: NativeName;
}

export interface Country {
  name: Name;
  flag: string;
}

export interface Location extends Country {
  country: string;
  emoji: string;
  isHQ?: boolean;
}

export interface CountryOption {
  name: string;
  emoji: string;
}
