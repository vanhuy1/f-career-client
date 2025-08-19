// CV Checklist Types based on the blueprint specification

export interface ChecklistItem {
  id: string;
  criterion: string;
  weight: number; // 1-10
  required: boolean;
  description?: string;
}

export interface CompanyCvChecklist {
  id: number;
  checklistName: string;
  description?: string;
  checklistItems: ChecklistItem[];
  isActive: boolean;
  isDefault: boolean;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request Types
export interface CreateChecklistReq {
  checklistName: string;
  description?: string;
  checklistItems: ChecklistItem[];
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateChecklistReq {
  checklistName?: string;
  description?: string;
  checklistItems?: ChecklistItem[];
  isActive?: boolean;
  isDefault?: boolean;
}

// API Response Types
export interface ChecklistListResponse {
  data: CompanyCvChecklist[];
  meta: {
    count: number;
    page?: number;
    limit?: number;
  };
}

export interface ChecklistUsageStats {
  checklistId: number;
  usageCount: number;
  successRate?: number;
  lastUsed?: Date;
}

export interface ChecklistAnalyticsResponse {
  data: ChecklistUsageStats[];
  meta: {
    totalChecklists: number;
    totalUsage: number;
  };
}

// Filter and Query Types
export interface ChecklistFilters {
  isActive?: boolean;
  isDefault?: boolean;
  search?: string;
}

export interface GetChecklistsQuery extends ChecklistFilters {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

// Default checklist template - FOR CREATION/DISPLAY TEMPLATE PURPOSES ONLY
// This is NOT real database data, only used as a template for new checklist creation
export const DEFAULT_CHECKLIST_TEMPLATE: ChecklistItem[] = [
  {
    id: 'contact_info',
    criterion: 'Contact info present & accurate',
    weight: 8,
    required: true,
    description: 'Name, phone, email valid and professional',
  },
  {
    id: 'professional_summary',
    criterion: 'Professional summary/objective',
    weight: 7,
    required: false,
    description: 'Clear, role-targeted summary that demonstrates purpose',
  },
  {
    id: 'relevant_experience',
    criterion: 'Relevant experience',
    weight: 9,
    required: true,
    description: 'Work history that fits role requirements and level',
  },
  {
    id: 'achievements_impact',
    criterion: 'Achievements/impact',
    weight: 8,
    required: false,
    description: 'Quantified results and measurable achievements listed',
  },
  {
    id: 'skills_qualifications',
    criterion: 'Skills/qualifications (role-fit)',
    weight: 9,
    required: true,
    description: 'Skills match job description and requirements',
  },
  {
    id: 'education_certifications',
    criterion: 'Education/certifications',
    weight: 7,
    required: false,
    description: 'Required degree/certifications noted if applicable',
  },
  {
    id: 'employment_dates',
    criterion: 'Employment dates/career path',
    weight: 6,
    required: false,
    description: 'Dates shown with steady growth, minimal gaps',
  },
  {
    id: 'formatting_readability',
    criterion: 'Formatting/readability/clarity',
    weight: 5,
    required: true,
    description: 'Well-organized sections, professional appearance',
  },
  {
    id: 'customization',
    criterion: 'Customization to job/sector',
    weight: 7,
    required: false,
    description: 'Resume appears tailored to specific role or industry',
  },
  {
    id: 'red_flags',
    criterion: 'Red flags (if any)',
    weight: 10,
    required: true,
    description: 'Check for errors, unexplained gaps, or inconsistencies',
  },
];
