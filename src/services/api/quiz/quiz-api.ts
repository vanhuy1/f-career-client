import { RequestBuilder } from '@/utils/axios/request-builder';
import { httpClient } from '@/utils/axios';
import { Quiz, QuizWithAttempts, QuizAttempt, QuizStats } from '@/types/Quiz';

// Request DTOs based on backend
interface GenerateQuizRequest {
  roadmapId: string;
  title?: string;
  description?: string;
}

interface SubmitAnswerRequest {
  questionId: string;
  selectedAnswers: string[];
}

interface SubmitAnswerResponse {
  isCorrect: boolean;
  explanation: string;
}

interface SubmitAllAnswersRequest {
  answers: Array<{
    questionId: string;
    selectedAnswers: string[];
  }>;
}

class QuizService {
  private readonly rb: RequestBuilder;

  constructor() {
    this.rb = new RequestBuilder().setResourcePath('ai-quiz');
  }

  // Generate new quiz or get existing (with forceNew flag)
  async generateQuiz(
    roadmapId: string,
    title?: string,
    description?: string,
    forceNew: boolean = false,
  ): Promise<Quiz> {
    const url = this.rb.buildUrl(`generate${forceNew ? '?forceNew=true' : ''}`);

    const response = await httpClient.post<Quiz, GenerateQuizRequest>({
      url,
      body: {
        roadmapId,
        title,
        description,
      },
      typeCheck: (data) => {
        return { success: true, data: data as Quiz };
      },
    });

    return response;
  }

  // Get quiz by roadmap with attempts history
  async getQuizByRoadmap(roadmapId: string): Promise<QuizWithAttempts | null> {
    const url = this.rb.buildUrl(`roadmap/${roadmapId}`);

    const response = await httpClient.get<QuizWithAttempts | null>({
      url,
      typeCheck: (data) => {
        return { success: true, data: data as QuizWithAttempts | null };
      },
    });

    return response;
  }

  // Get quiz history
  async getQuizHistory(quizId: string): Promise<QuizAttempt[]> {
    const url = this.rb.buildUrl(`history/${quizId}`);

    const response = await httpClient.get<QuizAttempt[]>({
      url,
      typeCheck: (data) => {
        return { success: true, data: data as QuizAttempt[] };
      },
    });

    return response;
  }

  // Start quiz attempt
  async startQuizAttempt(quizId: string): Promise<QuizAttempt> {
    const url = this.rb.buildUrl(`attempt/${quizId}/start`);

    const response = await httpClient.post<QuizAttempt, Record<string, never>>({
      url,
      body: {},
      typeCheck: (data) => {
        return { success: true, data: data as QuizAttempt };
      },
    });

    return response;
  }

  // Submit all answers at once
  async submitAllAnswers(
    attemptId: string,
    answers: Array<{ questionId: string; selectedAnswers: string[] }>,
  ): Promise<QuizAttempt> {
    const url = this.rb.buildUrl(`attempt/${attemptId}/submit-all`);

    const response = await httpClient.post<
      QuizAttempt,
      SubmitAllAnswersRequest
    >({
      url,
      body: {
        answers,
      },
      typeCheck: (data) => {
        return { success: true, data: data as QuizAttempt };
      },
    });

    return response;
  }

  // Submit answer (deprecated - for backward compatibility)
  async submitAnswer(
    attemptId: string,
    questionId: string,
    selectedAnswers: string[],
  ): Promise<SubmitAnswerResponse> {
    const url = this.rb.buildUrl(`attempt/${attemptId}/answer`);

    const response = await httpClient.post<
      SubmitAnswerResponse,
      SubmitAnswerRequest
    >({
      url,
      body: {
        questionId,
        selectedAnswers,
      },
      typeCheck: (data) => {
        return { success: true, data: data as SubmitAnswerResponse };
      },
    });

    return response;
  }

  // Complete quiz attempt (deprecated - use submitAllAnswers instead)
  async completeQuizAttempt(attemptId: string): Promise<QuizAttempt> {
    const url = this.rb.buildUrl(`attempt/${attemptId}/complete`);

    const response = await httpClient.post<QuizAttempt, Record<string, never>>({
      url,
      body: {},
      typeCheck: (data) => {
        return { success: true, data: data as QuizAttempt };
      },
    });

    return response;
  }

  // Get user stats for roadmap
  async getUserStats(roadmapId: string): Promise<QuizStats | null> {
    const url = this.rb.buildUrl(`stats/roadmap/${roadmapId}`);

    const response = await httpClient.get<QuizStats | null>({
      url,
      typeCheck: (data) => {
        return { success: true, data: data as QuizStats | null };
      },
    });

    return response;
  }
}

export const quizService = new QuizService();
