import { PaginationParams } from '@/utils/types/pagination-params.type';
import { RequestBuilder } from '@/utils/axios/request-builder';
import { httpClient } from '@/utils/axios';
import { ApiSuccessResponse } from '@/utils/types/api.type';
import {
  CreateRoadmapRequest,
  GenerateRoadmapRequest,
  Roadmap,
  RoadmapPaginatedList,
  UpdateRoadmapRequest,
} from '@/types/RoadMap';

class RoadmapService {
  private readonly rb: RequestBuilder;
  private isTestMode = false;

  constructor() {
    this.rb = new RequestBuilder().setResourcePath('roadmaps');
    // Check if test mode is enabled from localStorage or environment
    this.isTestMode =
      typeof window !== 'undefined' &&
      localStorage.getItem('roadmap_test_mode') === 'true';
  }

  // Enable or disable test mode
  setTestMode(enabled: boolean): void {
    this.isTestMode = enabled;
    if (typeof window !== 'undefined') {
      if (enabled) {
        localStorage.setItem('roadmap_test_mode', 'true');
      } else {
        localStorage.removeItem('roadmap_test_mode');
      }
    }
  }

  // Check if test mode is enabled
  isInTestMode(): boolean {
    return this.isTestMode;
  }

  async findAll(params?: PaginationParams): Promise<RoadmapPaginatedList> {
    // Always call backend API – test mode is handled only in generate()
    const url = this.rb.buildUrl();
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : '';

    const response = await httpClient.get<RoadmapPaginatedList>({
      url: `${url}${queryParams}`,
      typeCheck: (data) => {
        return { success: true, data: data as RoadmapPaginatedList };
      },
    });

    return response;
  }

  async findByUserId(
    userId: number,
    params?: PaginationParams,
  ): Promise<RoadmapPaginatedList> {
    // Always call backend
    const baseUrl = this.rb.buildUrl(`user/${userId}`);
    const queryParams = params
      ? `?page=${params.page}&limit=${params.limit}`
      : '';

    const response = await httpClient.get<RoadmapPaginatedList>({
      url: `${baseUrl}${queryParams}`,
      typeCheck: (data) => {
        return { success: true, data: data as RoadmapPaginatedList };
      },
    });

    return response;
  }

  async findOne(id: string): Promise<Roadmap> {
    // Always call backend
    const url = this.rb.buildUrl(id);

    const response = await httpClient.get<ApiSuccessResponse<Roadmap>>({
      url,
      typeCheck: (data) => {
        return { success: true, data };
      },
    });

    return response;
  }

  async create(data: CreateRoadmapRequest): Promise<Roadmap> {
    // Always call backend
    const url = this.rb.buildUrl();

    const response = await httpClient.post<
      ApiSuccessResponse<Roadmap>,
      CreateRoadmapRequest
    >({
      url,
      body: data,
      typeCheck: (data) => {
        return { success: true, data };
      },
    });

    return response;
  }

  async update(id: string, data: UpdateRoadmapRequest): Promise<Roadmap> {
    // Always call backend
    const url = this.rb.buildUrl(id);

    const response = await httpClient.put<
      ApiSuccessResponse<Roadmap>,
      UpdateRoadmapRequest
    >({
      url,
      body: data,
      typeCheck: (data) => {
        return { success: true, data };
      },
    });

    return response;
  }

  async remove(id: string): Promise<void> {
    // Always call backend
    const url = this.rb.buildUrl(id);

    await httpClient.delete({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
  }

  async generate(data: GenerateRoadmapRequest): Promise<Roadmap> {
    // Check if test mode is explicitly requested in the request
    const useTestMode = data.useTestMode || this.isTestMode;

    if (useTestMode) {
      // Generate a mock roadmap based on the job title
      const mockRoadmap: Roadmap = {
        id: `roadmap-${Date.now()}`,
        title: `Learning Roadmap for ${data.jobTitle || 'Developer'}`,
        description: `A personalized learning path to help you transition into the ${data.jobTitle || 'Developer'} role`,
        cvName: 'Your CV',
        jobTitle: data.jobTitle || 'Developer',
        progress: 0,
        skills: [
          {
            id: 'skill-1',
            title: 'Node.js Fundamentals',
            description: 'Learn server-side JavaScript with Node.js',
            progress: 0,
            tasks: [
              {
                id: 'task-1',
                title: 'Learn NestJS basics',
                completed: false,
              },
            ],
            test: {
              id: 'test-1',
              title: 'JavaScript Basics Assessment',
              description: 'Evaluate your JS knowledge',
              completed: false,
              score: 0,
              questions: [
                {
                  id: 'q1',
                  question: 'What is TypeScript?',
                  options: ['A', 'B', 'C', 'D'],
                  correctAnswer: 1,
                  userAnswer: 1,
                },
              ],
            },
          },
        ],
        userId: 1,
        cvId: data.cvId,
        jobId: data.jobId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Persist in backend: step 1 create minimal record
      try {
        const created = await this.create({
          title: mockRoadmap.title,
          description: mockRoadmap.description,
          jobTitle: mockRoadmap.jobTitle,
          cvId: mockRoadmap.cvId,
          jobId: mockRoadmap.jobId,
        });
        // step 2 update skills & progress
        await this.update(created.id, {
          skills: mockRoadmap.skills,
          progress: 0,
        });
        // replace id with db id
        mockRoadmap.id = created.id;
      } catch (e) {
        console.error('Failed to persist mock roadmap to backend', e);
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      return mockRoadmap;
    }

    // Real API call
    const url = this.rb.buildUrl('generate');

    const response = await httpClient.post<
      ApiSuccessResponse<Roadmap>,
      GenerateRoadmapRequest
    >({
      url,
      body: {
        cvId: data.cvId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
      },
      typeCheck: (data) => {
        return { success: true, data };
      },
    });

    return response;
  }
}

export const roadmapService = new RoadmapService();
