// Enums for schedule events
export enum EventType {
  INTERVIEW = 'interview',
  MEETING = 'meeting',
}

export enum EventStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum ParticipantRole {
  CANDIDATE = 'candidate',
  INTERVIEWER = 'interviewer',
  ATTENDEE = 'attendee',
  HOST = 'host',
}

export enum ResponseStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
}

// Core interfaces
export interface ScheduleParticipant {
  userId: number;
  role: ParticipantRole;
  responseStatus?: ResponseStatus;
  notes?: string;
}

// Updated participant interface to match API response
export interface ScheduleParticipantResponse {
  eventId: string;
  userId: number;
  role: ParticipantRole;
  response: ResponseStatus;
  user: {
    id?: number;
    name?: string;
    email?: string;
  };
}

export interface ScheduleEvent {
  id?: number;
  title: string;
  type: EventType;
  status?: EventStatus;
  startsAt: string; // ISO 8601 date string
  endsAt: string; // ISO 8601 date string
  location?: string;
  notes?: string;
  participants: ScheduleParticipant[];
  companyId?: number;
  createdAt?: string;
  updatedAt?: string;
  version?: number; // For optimistic locking
}

// Request/Response DTOs
export interface CreateScheduleEventRequest {
  title: string;
  type: EventType;
  startsAt: string;
  endsAt: string;
  location?: string;
  notes?: string;
  participants: Array<{
    userId: number;
    role: ParticipantRole;
  }>;
}

export interface UpdateScheduleEventRequest {
  title?: string;
  type?: EventType;
  startsAt?: string;
  endsAt?: string;
  location?: string;
  notes?: string;
  participants?: Array<{
    userId: number;
    role: ParticipantRole;
  }>;
}

// Updated response interface to match actual API response
export interface ScheduleEventResponse {
  id: string; // UUID string
  companyId: string;
  createdBy: number;
  title: string;
  type: EventType;
  status: EventStatus;
  startsAt: string;
  endsAt: string;
  location?: string;
  notes?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  participants: ScheduleParticipantResponse[];
}

// Updated list response to match actual API response
export interface ScheduleEventsListResponse {
  data: ScheduleEventResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Query parameters for getting events
export interface GetScheduleEventsQuery {
  type?: EventType;
  status?: EventStatus;
  page?: number;
  limit?: number;
  startDate?: string; // ISO 8601 date string - only day portion needed
  endDate?: string; // ISO 8601 date string - only day portion needed
}

// API Response wrappers
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ScheduleApiError {
  statusCode: number;
  message: string;
  error: string;
  details?: Array<{ field: string; message: string }>;
  timestamp: string;
  path: string;
}

// Form types
export interface ScheduleEventFormData {
  title: string;
  type: EventType;
  startsAt: string;
  endsAt: string;
  location: string;
  notes: string;
  participantUserId: number;
  participantRole: ParticipantRole;
}
