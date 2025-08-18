//toggle bookmark job

export interface JobBookMarkRequest {
  jobId: string;
}

export interface JobBookMarkResponse {
  bookmarked: boolean;
  message: string;
}

// get my bookmarked jobs

export interface MyBookmarkedJobRequest {
  limit?: number;
  offset?: number;
}

export interface MyBookmarkedJob {
  id: number;
  userId: number;
  jobId: string;
  createdAt: string;
  isApply: boolean;
  job: {
    id: string;
    title: string;
    deadline: string;
    location: string;
    typeOfEmployment: string;
    category: {
      id: string;
      name: string;
    };
    company: {
      id: string;
      companyName: string;
      logoUrl: string | null;
    };
  };
}

export interface MyBookmarkedJobsResponse {
  jobs: MyBookmarkedJob[];
}

// check if job is bookmarked

export interface CheckJobBookmarkedRequest {
  jobId: string;
}

export interface CheckJobBookmarkedResponse {
  bookmarked: boolean;
}
