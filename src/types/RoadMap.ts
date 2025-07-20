export interface Roadmap {
  id: string;
  title: string;
  description: string;
  cvName: string;
  jobTitle: string;
  progress: number;
  skills: RoadmapSkill[];
  userId: number;
  cvId?: string;
  jobId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoadmapSkill {
  id: string;
  title: string;
  description: string;
  progress: number;
  tasks: RoadmapTask[];
  test?: RoadmapTest;
}

export interface RoadmapTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export interface RoadmapQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface RoadmapTest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  score?: number;
  questions: RoadmapQuestion[];
}

export interface CreateRoadmapRequest {
  title: string;
  description: string;
  jobTitle: string;
  cvId?: string;
  jobId?: string;
}

export interface GenerateRoadmapRequest {
  cvId: string;
  jobId: string;
  jobTitle?: string;
  useTestMode?: boolean; // Flag to use test mode instead of real AI
}

export interface UpdateRoadmapRequest {
  title?: string;
  description?: string;
  progress?: number;
  skills?: RoadmapSkill[];
}

// Define our own PaginatedList type to match the backend response
export interface RoadmapPaginatedList {
  items: Roadmap[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}
