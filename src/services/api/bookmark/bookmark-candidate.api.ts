import { RequestBuilder } from '@/utils/axios/request-builder';
import { httpClient } from '@/utils/axios';
import {
  CandidateBookmark,
  CandidateBookmarkRequest,
  CandidateBookmarkResponse,
  CheckCandidateBookmarkedResponse,
  ToggleBookmarkCandidateResponse,
} from '@/types/CandidateBookmark';

class CandidateBookmarkService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'bookmark-candidates',
    );
  }

  async toggleBookmarkCandidate(
    candidateProfileId: string,
  ): Promise<ToggleBookmarkCandidateResponse> {
    const url = this.requestBuilder.buildUrl(`toggle/${candidateProfileId}`);
    const response = await httpClient.post<
      ToggleBookmarkCandidateResponse,
      void
    >({
      url,
      body: undefined,
      typeCheck: (data) => ({
        success: true,
        data: data as ToggleBookmarkCandidateResponse,
      }),
    });
    return response;
  }

  async checkBookmark(
    candidateProfileId: string,
  ): Promise<CheckCandidateBookmarkedResponse> {
    const url = this.requestBuilder.buildUrl(`check/${candidateProfileId}`);
    const response = await httpClient.get<CheckCandidateBookmarkedResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CheckCandidateBookmarkedResponse,
      }),
    });
    return response;
  }

  async getMyBookmarkedCandidates(
    params: CandidateBookmarkRequest,
  ): Promise<CandidateBookmarkResponse> {
    const queryParams = new URLSearchParams();
    if (params.limit !== undefined)
      queryParams.append('limit', params.limit.toString());
    if (params.offset !== undefined)
      queryParams.append('offset', params.offset.toString());

    const url = this.requestBuilder.buildUrl(
      `${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    );
    const list = await httpClient.get<CandidateBookmark[]>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CandidateBookmark[],
      }),
    });
    return { bookmarks: list };
  }
}

export const candidateBookmarkService = new CandidateBookmarkService();
