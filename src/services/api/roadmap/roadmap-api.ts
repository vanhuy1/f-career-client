// services/api/roadmap/roadmap-api.ts

import { PaginationParams } from '@/utils/types/pagination-params.type';
import { RequestBuilder } from '@/utils/axios/request-builder';
import { httpClient } from '@/utils/axios';
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
    // Check if test mode is enabled from localStorage
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
    const url = this.rb.buildUrl(id);

    const response = await httpClient.get<Roadmap>({
      url,
      typeCheck: (data) => {
        return { success: true, data: data as Roadmap };
      },
    });

    return response;
  }

  async create(data: CreateRoadmapRequest): Promise<Roadmap> {
    const url = this.rb.buildUrl();

    const response = await httpClient.post<Roadmap, CreateRoadmapRequest>({
      url,
      body: data,
      typeCheck: (data) => {
        return { success: true, data: data as Roadmap };
      },
    });

    return response;
  }

  async update(id: string, data: UpdateRoadmapRequest): Promise<Roadmap> {
    const url = this.rb.buildUrl(id);

    const response = await httpClient.put<Roadmap, UpdateRoadmapRequest>({
      url,
      body: data,
      typeCheck: (data) => {
        return { success: true, data: data as Roadmap };
      },
    });

    return response;
  }

  async updateTaskCompletion(
    roadmapId: string,
    skillId: string,
    taskId: string,
    subTaskId?: string,
  ): Promise<Roadmap> {
    const url = this.rb.buildUrl(
      `${roadmapId}/skills/${skillId}/tasks/${taskId}/toggle`,
    );
    const queryParams = subTaskId ? `?subTaskId=${subTaskId}` : '';

    // Fixed: Use Record<string, never> instead of {} for empty object type
    const response = await httpClient.put<Roadmap, Record<string, never>>({
      url: `${url}${queryParams}`,
      body: {},
      typeCheck: (data) => {
        return { success: true, data: data as Roadmap };
      },
    });

    return response;
  }

  async remove(id: string): Promise<void> {
    const url = this.rb.buildUrl(id);

    await httpClient.delete({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
  }

  async generate(data: GenerateRoadmapRequest): Promise<Roadmap> {
    // Check if test mode is explicitly requested
    const useTestMode = data.useTestMode || this.isTestMode;

    if (useTestMode) {
      // Generate mock roadmap for testing
      return this.generateMockRoadmap(data);
    }

    // Real API call
    const url = this.rb.buildUrl('generate');

    const response = await httpClient.post<Roadmap, GenerateRoadmapRequest>({
      url,
      body: {
        cvId: data.cvId,
        jobId: data.jobId,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        jobRequirements: data.jobRequirements,
      },
      typeCheck: (data) => {
        return { success: true, data: data as Roadmap };
      },
    });

    return response;
  }

  private async generateMockRoadmap(
    data: GenerateRoadmapRequest,
  ): Promise<Roadmap> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const mockRoadmap: Roadmap = {
      id: `roadmap-${Date.now()}`,
      title: `Learning Path to ${data.jobTitle || 'Target Position'}`,
      description: `Personalized roadmap for transitioning to ${data.jobTitle || 'your target role'}`,
      jobTitle: data.jobTitle || 'Target Position',
      progress: 0,
      estimatedDuration: 16,
      skills: [
        {
          id: 'skill-1',
          title: 'Fundamental Skills',
          description: 'Core foundation skills required for the role',
          category: 'fundamental',
          difficulty: 'beginner',
          estimatedHours: 40,
          prerequisites: [],
          progress: 0,
          order: 1,
          reason: 'Essential foundation for your career transition',
          tasks: [
            {
              id: 'task-1-1',
              title: 'Learn core concepts',
              description: 'Understanding fundamental principles',
              type: 'learn',
              estimatedHours: 8,
              priority: 'critical',
              completed: false,
              order: 1,
              tips: ['Start with basics', 'Practice daily'],
              subTasks: [
                {
                  id: 'subtask-1-1-1',
                  title: 'Research and study materials',
                  completed: false,
                  order: 1,
                  estimatedMinutes: 120,
                  checkCriteria: 'Can explain key concepts',
                },
              ],
              relatedSkills: [],
            },
          ],
        },
        {
          id: 'skill-2',
          title: 'Technical Skills',
          description: 'Technical competencies for the role',
          category: 'core',
          difficulty: 'intermediate',
          estimatedHours: 60,
          prerequisites: ['skill-1'],
          progress: 0,
          order: 2,
          reason: 'Critical technical skills for daily work',
          tasks: [],
        },
      ],
      cvSnapshot: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+84 123456789',
        summary: 'Professional seeking career transition',
        experience: [],
        education: [],
        skills: ['JavaScript', 'Git'],
        totalExperience: 2,
      },
      cvAnalysis: {
        overallScore: 60,
        experienceLevel: 'junior',
        strengths: [
          'Good foundation',
          'Motivated learner',
          'Technical aptitude',
        ],
        weaknesses: ['Limited experience', 'Need more practice', 'Skill gaps'],
        skillGaps: [
          'Advanced techniques',
          'Industry knowledge',
          'Best practices',
        ],
        recommendations: [
          'Focus on fundamentals first',
          'Build practical projects',
          'Network with professionals',
        ],
        matchPercentage: 45,
        detailedAnalysis: {
          experience: {
            score: 50,
            feedback: 'You have potential but need more hands-on experience',
            matching: ['Basic skills'],
            missing: ['Industry experience'],
          },
          skills: {
            score: 60,
            feedback: 'Good foundation, need to expand skill set',
            matching: ['Programming basics'],
            missing: ['Advanced skills'],
          },
          education: {
            score: 70,
            feedback: 'Solid educational background',
          },
          overall: {
            summary:
              'You have good potential for this role with focused learning',
            nextSteps: [
              'Complete this roadmap',
              'Build portfolio',
              'Apply for positions',
            ],
          },
        },
      },
      userId: 1,
      jobId: data.jobId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Optionally persist to backend even in test mode
    try {
      const created = await this.create({
        title: mockRoadmap.title,
        description: mockRoadmap.description,
        jobTitle: mockRoadmap.jobTitle,
        estimatedDuration: mockRoadmap.estimatedDuration,
        jobId: mockRoadmap.jobId,
      });

      // Update with full data
      const updated = await this.update(created.id, {
        skills: mockRoadmap.skills,
        progress: 0,
      });

      return updated;
    } catch (error) {
      console.error('Failed to persist mock roadmap:', error);
      return mockRoadmap;
    }
  }
}

export const roadmapService = new RoadmapService();
