// src/services/api/cv/cv-api.ts
import { Cv } from '@/types/Cv';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

interface CvListResponse {
  items: Cv[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

interface CvResponse {
  data: Cv;
  meta?: string;
}

interface CvOptimizationResponse {
  data: {
    optimizedCv: Cv;
    suggestions: {
      summary?: {
        suggestion: string;
        reason: string;
      };
      skills?: {
        suggestions: string[];
        reason: string;
      };
      experience?: {
        index: number;
        field: string;
        suggestion: string;
        reason: string;
      }[];
      education?: {
        index: number;
        field: string;
        suggestion: string;
        reason: string;
      }[];
    };
  };
  meta?: string;
}

// Interfaces cho history
export interface CvOptimizationHistoryItem {
  id: string;
  cvId: string;
  jobTitle?: string;
  jobDescription?: string;
  suggestions: {
    summary?: {
      suggestion: string;
      reason: string;
    };
    skills?: {
      suggestions: string[];
      reason: string;
    };
    experience?: {
      index: number;
      field: string;
      suggestion: string;
      reason: string;
    }[];
    education?: {
      index: number;
      field: string;
      suggestion: string;
      reason: string;
    }[];
  };
  optimizedCv: Cv;
  isApplied: boolean;
  createdAt: string;
}

interface OptimizationHistoryResponse {
  data: CvOptimizationHistoryItem[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface RestoreHistoryResponse {
  data: {
    optimizedCv: Cv;
    suggestions: CvOptimizationHistoryItem['suggestions'];
  };
  meta: {
    restoredFrom: string;
    restoredAt: string;
  };
}

class CvService {
  private rb = new RequestBuilder().setResourcePath('cvs');

  async findAll(userId: number): Promise<CvListResponse> {
    const url = this.rb.buildUrl(`user/${userId}`);
    console.log('Fetching CVs for user:', userId, 'URL:', url);
    const response = await httpClient.get<CvListResponse>({
      url,
      typeCheck: (data) => {
        const listResponse = data as CvListResponse;
        return { success: true, data: listResponse };
      },
    });
    return response;
  }

  async findById(id: string | number): Promise<Cv> {
    const url = this.rb.buildUrl(id.toString());
    const response = await httpClient.get<CvResponse>({
      url,
      typeCheck: (data) => {
        const rawData = data as CvResponse | Cv;
        const cvData = 'data' in rawData ? rawData.data : rawData;

        const processedData = {
          ...cvData,
          experiences: cvData.experience || [],
          education: cvData.education || [],
          certifications: cvData.certifications || [],
          skills: cvData.skills || [],
        };

        return { success: true, data: processedData };
      },
    });
    return response.data;
  }

  async create(cv: Partial<Cv>): Promise<Cv> {
    const url = this.rb.buildUrl();
    const response = await httpClient.post<CvResponse, Partial<Cv>>({
      url,
      body: cv,
      typeCheck: (data) => {
        const cvResponse = data as CvResponse;
        return { success: true, data: cvResponse.data };
      },
    });
    return response.data;
  }

  async update(id: string | number, cv: Partial<Cv>): Promise<Cv> {
    const url = this.rb.buildUrl(id.toString());
    const response = await httpClient.patch<CvResponse, Partial<Cv>>({
      url,
      body: {
        ...cv,
        experience: cv.experience || [],
        education: cv.education || [],
        certifications: cv.certifications || [],
        skills: cv.skills || [],
      },
      typeCheck: (data) => {
        const cvResponse = data as CvResponse;
        return { success: true, data: cvResponse.data };
      },
    });
    return response.data;
  }

  async delete(id: string | number): Promise<void> {
    const url = this.rb.buildUrl(id.toString());
    await httpClient.delete({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
  }

  async optimizeCv(
    cvId: string,
    jobTitle?: string,
    jobDescription?: string,
    userId?: number,
  ): Promise<CvOptimizationResponse> {
    const url = this.rb.buildUrl(`${cvId}/optimize`);
    const response = await httpClient.post<
      CvOptimizationResponse,
      { jobTitle?: string; jobDescription?: string; userId?: number }
    >({
      url,
      body: { jobTitle, jobDescription, userId },
      typeCheck: (data) => {
        const optimizationResponse = data as CvOptimizationResponse;
        return { success: true, data: optimizationResponse };
      },
    });
    return response;
  }

  // New API methods for history
  async getOptimizationHistory(
    cvId: string,
    limit = 10,
    offset = 0,
  ): Promise<OptimizationHistoryResponse> {
    const url = this.rb.buildUrl(
      `${cvId}/optimization-history?limit=${limit}&offset=${offset}`,
    );
    const response = await httpClient.get<OptimizationHistoryResponse>({
      url,
      typeCheck: (data) => {
        const historyResponse = data as OptimizationHistoryResponse;
        return { success: true, data: historyResponse };
      },
    });
    return response;
  }

  async restoreFromHistory(historyId: string): Promise<RestoreHistoryResponse> {
    const url = this.rb.buildUrl(`optimization-history/${historyId}/restore`);
    const response = await httpClient.post<
      RestoreHistoryResponse,
      Record<string, never>
    >({
      url,
      body: {},
      typeCheck: (data) => {
        const restoreResponse = data as RestoreHistoryResponse;
        return { success: true, data: restoreResponse };
      },
    });
    return response;
  }

  async getUserOptimizationHistory(
    userId: number,
    limit = 10,
    offset = 0,
  ): Promise<OptimizationHistoryResponse> {
    const rb = new RequestBuilder().setResourcePath('users');
    const url = rb.buildUrl(
      `${userId}/optimization-history?limit=${limit}&offset=${offset}`,
    );
    const response = await httpClient.get<OptimizationHistoryResponse>({
      url,
      typeCheck: (data) => {
        const historyResponse = data as OptimizationHistoryResponse;
        return { success: true, data: historyResponse };
      },
    });
    return response;
  }
}

export const cvService = new CvService();
