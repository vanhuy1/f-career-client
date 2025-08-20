export interface CandidateBookmark {
  id: string;
  companyId: string;
  candidateProfileId: string;
  createdAt: string;
  candidateProfile: {
    id: string;
    title: string | null;
    location: string | null;
    isOpenToOpportunities: boolean;
    user: {
      name: string;
      avatar: string | null;
    };
  };
}

export interface CandidateBookmarkResponse {
  bookmarks: CandidateBookmark[];
}

export interface CandidateBookmarkRequest {
  limit?: number;
  offset?: number;
}

// toggle bookmark candidate

export interface ToggleBookmarkCandidateRequest {
  candidateProfileId: string;
}

export interface ToggleBookmarkCandidateResponse {
  bookmarked: boolean;
  message: string;
}

// check if candidate is bookmarked

export interface CheckCandidateBookmarkedRequest {
  candidateProfileId: string;
}

export interface CheckCandidateBookmarkedResponse {
  bookmarked: boolean;
}
