import { RequestBuilder } from '@/utils/axios/request-builder';
import {
  JobSearchRequest,
  JobSearchResponse,
  SuggestionQuery,
  SuggestionsResponse,
} from '@/types/JobSearch';
import { httpClient } from '@/utils/axios';

class JobSearchService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('job-search');
  }

  async searchJobs(params: JobSearchRequest = {}): Promise<JobSearchResponse> {
    const url = this.requestBuilder.buildUrl('search');

    const response = await httpClient.get<JobSearchResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as JobSearchResponse,
        };
      },
      config: {
        params,
        withCredentials: false,
      },
    });

    return response;
  }

  async getJobSuggestions(
    query: SuggestionQuery,
  ): Promise<SuggestionsResponse> {
    const url = this.requestBuilder.buildUrl('suggestions');

    const response = await httpClient.get<SuggestionsResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as SuggestionsResponse,
        };
      },
      config: {
        params: query,
        withCredentials: false,
      },
    });

    return response;
  }

  // Helper method to get flattened suggestions for backward compatibility
  async getJobSuggestionsFlat(query: SuggestionQuery): Promise<string[]> {
    const response = await this.getJobSuggestions(query);

    // Combine all suggestions into a flat array of strings
    const suggestions: string[] = [
      ...response.keywords.map((k) => k.value),
      ...response.jobs.map((j) => j.title),
      ...response.companies.map((c) => c.name),
    ];

    return suggestions;
  }
}

export const jobSearchService = new JobSearchService();
