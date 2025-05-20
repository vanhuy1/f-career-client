import type {
  FetchApplicationsRequest,
  FetchApplicationsResponse,
  FollowUpRequest,
  FollowUpResponse,
} from '@/types/Application';
import { fakeFetchApplications, fakeFollowUp } from '../mocks/data';
import type {
  FetchApplicationDetailRequest,
  FetchApplicationDetailResponse,
  UpdateApplicationNotesRequest,
  UpdateApplicationNotesResponse,
  AddTimelineEventRequest,
  AddTimelineEventResponse,
} from '@/types/Application';
import {
  fakeFetchApplicationDetail,
  fakeUpdateApplicationNotes,
  fakeAddTimelineEvent,
} from '../mocks/detail-data';

// API base URL - would be set from environment variables in a real app
const API_BASE_URL = 'https://api.example.com';

// Flag to toggle between real and fake API
const USE_FAKE_API = true;

/**
 * Fetch applications from the API
 * @param request The request parameters
 * @returns A promise that resolves to the response
 */
export const fetchApplications = async (
  request: FetchApplicationsRequest,
): Promise<FetchApplicationsResponse> => {
  if (USE_FAKE_API) {
    return fakeFetchApplications(request);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization would be added here in a real app
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching applications:', error);

    // Fall back to fake API if real API fails
    return fakeFetchApplications(request);
  }
};

/**
 * Send a follow-up request for an application
 * @param request The follow-up request
 * @returns A promise that resolves to the response
 */
export const followUpApplication = async (
  request: FollowUpRequest,
): Promise<FollowUpResponse> => {
  if (USE_FAKE_API) {
    return fakeFollowUp(request);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${request.applicationId}/follow-up`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization would be added here in a real app
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending follow-up:', error);

    // Fall back to fake API if real API fails
    return fakeFollowUp(request);
  }
};

/**
 * Fetch application details from the API
 * @param request The request parameters
 * @returns A promise that resolves to the response
 */
export const fetchApplicationDetail = async (
  request: FetchApplicationDetailRequest,
): Promise<FetchApplicationDetailResponse> => {
  if (USE_FAKE_API) {
    return fakeFetchApplicationDetail(request);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${request.applicationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization would be added here in a real app
        },
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching application details:', error);

    // Fall back to fake API if real API fails
    return fakeFetchApplicationDetail(request);
  }
};

/**
 * Update application notes
 * @param request The request parameters
 * @returns A promise that resolves to the response
 */
export const updateApplicationNotes = async (
  request: UpdateApplicationNotesRequest,
): Promise<UpdateApplicationNotesResponse> => {
  if (USE_FAKE_API) {
    return fakeUpdateApplicationNotes(request);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${request.applicationId}/notes`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Authorization would be added here in a real app
        },
        body: JSON.stringify({ notes: request.notes }),
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating application notes:', error);

    // Fall back to fake API if real API fails
    return fakeUpdateApplicationNotes(request);
  }
};

/**
 * Add a timeline event to an application
 * @param request The request parameters
 * @returns A promise that resolves to the response
 */
export const addTimelineEvent = async (
  request: AddTimelineEventRequest,
): Promise<AddTimelineEventResponse> => {
  if (USE_FAKE_API) {
    return fakeAddTimelineEvent(request);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/applications/${request.applicationId}/timeline`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization would be added here in a real app
        },
        body: JSON.stringify({ event: request.event }),
      },
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding timeline event:', error);

    // Fall back to fake API if real API fails
    return fakeAddTimelineEvent(request);
  }
};
