import { RequestBuilder } from '@/utils/axios/request-builder';
import { httpClient } from '@/utils/axios';
import {
  JobBookMarkResponse,
  MyBookmarkedJobRequest,
  MyBookmarkedJobsResponse,
  CheckJobBookmarkedResponse,
} from '@/types/JobBookMark';

class BookmarkJobService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('bookmarks');
  }

  async toggleBookmarkJob(jobId: string): Promise<JobBookMarkResponse> {
    const url = this.requestBuilder.buildUrl(`toggle/${jobId}`);
    const response = await httpClient.post<JobBookMarkResponse, void>({
      url,
      body: undefined,
      typeCheck: (data) => ({
        success: true,
        data: data as JobBookMarkResponse,
      }),
    });
    return response;
  }

  async getMyBookmarkedJobs(
    params?: MyBookmarkedJobRequest,
  ): Promise<MyBookmarkedJobsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit !== undefined)
      queryParams.append('limit', params.limit.toString());
    if (params?.offset !== undefined)
      queryParams.append('offset', params.offset.toString());

    const url = this.requestBuilder.buildUrl(
      `my-bookmarks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    );

    const response = await httpClient.get<MyBookmarkedJobsResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as MyBookmarkedJobsResponse,
      }),
    });
    return response;
  }

  async checkBookmark(jobId: string): Promise<CheckJobBookmarkedResponse> {
    const url = this.requestBuilder.buildUrl(`check/${jobId}`);
    const response = await httpClient.get<CheckJobBookmarkedResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CheckJobBookmarkedResponse,
      }),
    });
    return response;
  }
}

export const bookmarkJobService = new BookmarkJobService();
