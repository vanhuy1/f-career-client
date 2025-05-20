// Existing types...

export interface Application {
  id: number;
  company: {
    id: number;
    name: string;
    logo: string;
    website: string;
    industry: string;
  };
  role: string;
  dateApplied: string;
  status: ApplicationStatus;
  notes?: string;
  hasFollowedUp: boolean;
  followUpDate?: string;
}

export type ApplicationStatus =
  | 'IN_REVIEW'
  | 'INTERVIEWING'
  | 'ASSESSMENT'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'SHORTLISTED'
  | 'UNSUITABLE';

export interface FetchApplicationsRequest {
  page: number;
  limit: number;
  status?: ApplicationStatus | 'ALL';
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export interface FetchApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  limit: number;
}

export interface FollowUpRequest {
  applicationId: number;
}

export interface FollowUpResponse {
  success: boolean;
  message?: string;
  application?: Application;
}

// Extended Application Type with more details
export interface DetailedApplication extends Application {
  jobDescription: string;
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    type: 'remote' | 'hybrid' | 'on-site';
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  requiredSkills: string[];
  timeline: ApplicationEvent[];
  contacts: ContactPerson[];
  documents: ApplicationDocument[];
}

// Application Event for Timeline
export interface ApplicationEvent {
  id: number;
  date: string;
  type:
    | 'status_change'
    | 'interview'
    | 'assessment'
    | 'offer'
    | 'follow_up'
    | 'note'
    | 'other';
  title: string;
  description?: string;
  status?: ApplicationStatus; // If event is a status change
  feedback?: string; // For interviews or assessments
}

// Contact Person
export interface ContactPerson {
  id: number;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  notes?: string;
  communications: Communication[];
}

// Communication History
export interface Communication {
  id: number;
  date: string;
  type: 'email' | 'phone' | 'in-person' | 'video' | 'other';
  direction: 'incoming' | 'outgoing';
  summary: string;
  content?: string;
}

// Application Document
export interface ApplicationDocument {
  id: number;
  type:
    | 'resume'
    | 'cover_letter'
    | 'portfolio'
    | 'reference'
    | 'assessment'
    | 'other';
  name: string;
  url?: string;
  dateUploaded: string;
  version?: number;
}

// Request DTO for fetching a single application
export interface FetchApplicationDetailRequest {
  applicationId: number;
}

// Response DTO for a single application
export interface FetchApplicationDetailResponse {
  application: DetailedApplication;
}

// Request DTO for updating application notes
export interface UpdateApplicationNotesRequest {
  applicationId: number;
  notes: string;
}

// Response DTO for updating application notes
export interface UpdateApplicationNotesResponse {
  success: boolean;
  application: DetailedApplication;
}

// Request DTO for adding a timeline event
export interface AddTimelineEventRequest {
  applicationId: number;
  event: Omit<ApplicationEvent, 'id'>;
}

// Response DTO for adding a timeline event
export interface AddTimelineEventResponse {
  success: boolean;
  event: ApplicationEvent;
  application: DetailedApplication;
}
