export interface QuizQuestion {
  id: string;
  question: string;
  type: 'single-choice' | 'multiple-choice' | 'true-false';
  difficulty: 'easy' | 'medium' | 'hard';
  answers: QuizAnswer[];
  explanation: string;
  topic: string;
  points: number;
  order: number;
}

export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  id: string;
  roadmapId: string;
  userId: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  totalQuestions: number;
  passingScore: number;
  timeLimit: number;
  status: string;
  isRetry?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  roadmapId: string;
  userId: number;
  answers: UserAnswer[];
  score?: number;
  percentage?: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  timeSpent?: number;
  status: string;
  feedback?: QuizFeedback;
  attemptNumber?: number;
  createdAt: string;
}

export interface UserAnswer {
  questionId: string;
  questionText?: string;
  questionType?: string;
  questionDifficulty?: string;
  questionTopic?: string;
  selectedAnswers: string[];
  selectedAnswerTexts?: string[];
  correctAnswers?: string[];
  correctAnswerTexts?: string[];
  isCorrect: boolean;
  points?: number;
  earnedPoints?: number;
  timeSpent?: number;
  answeredAt?: Date;
}

export interface QuizFeedback {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  topicScores: Record<
    string,
    { correct: number; total: number; percentage: number }
  >;
}

export interface QuizWithAttempts {
  quiz: Quiz;
  attempts: QuizAttempt[];
  hasCompleted: boolean;
  bestScore: number;
  attemptsCount: number;
  canRetake: boolean;
  passed?: boolean;
  remainingAttempts?: number;
}

export interface QuizStats {
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  passRate: number;
  averageTime: number;
  lastAttempt?: QuizAttempt;
}

export interface CreateQuizRequest {
  roadmapId: string;
  title?: string;
  description?: string;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedAnswers: string[];
}
