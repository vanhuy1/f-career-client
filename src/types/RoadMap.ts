// types/RoadMap.ts - Complete types synchronized with backend

// CV Snapshot interfaces
export interface CVExperience {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string;
  duration?: string;
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string;
}

export interface CVSnapshot {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: CVExperience[];
  education: CVEducation[];
  skills: string[];
  certifications?: Array<{
    name: string;
    issuer: string;
    date?: string;
  }>;
  languages?: string[];
  totalExperience?: number;
}

// CV Analysis interfaces
export interface CVAnalysisDetail {
  score: number;
  feedback: string;
  matching?: string[];
  missing?: string[];
}

export interface CVAnalysisOverall {
  summary: string;
  nextSteps: string[];
}

export interface CVAnalysis {
  overallScore: number;
  experienceLevel: 'entry' | 'junior' | 'mid' | 'senior' | 'expert';
  strengths: string[];
  weaknesses: string[];
  skillGaps: string[];
  recommendations: string[];
  matchPercentage: number;
  detailedAnalysis: {
    experience: CVAnalysisDetail;
    skills: CVAnalysisDetail;
    education: CVAnalysisDetail;
    overall: CVAnalysisOverall;
  };
}

// Roadmap SubTask interface
export interface RoadmapSubTask {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  order: number;
  estimatedMinutes?: number;
  checkCriteria?: string;
}

// Roadmap Task interface
export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  type: 'learn' | 'practice' | 'project' | 'review' | 'assessment';
  estimatedHours: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  completed: boolean;
  order: number;
  tips?: string[];
  subTasks: RoadmapSubTask[];
  relatedSkills?: string[];
}

// Roadmap Skill interface
export interface RoadmapSkill {
  id: string;
  title: string;
  description: string;
  category: 'fundamental' | 'core' | 'advanced' | 'specialized';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedHours: number;
  prerequisites?: string[];
  progress: number;
  order: number;
  reason: string;
  tasks: RoadmapTask[];
}

// Main Roadmap interface
export interface Roadmap {
  id: string;
  title: string;
  description: string;
  jobTitle: string;
  progress: number;
  estimatedDuration?: number;
  skills: RoadmapSkill[];
  cvSnapshot?: CVSnapshot;
  cvAnalysis?: CVAnalysis;
  userId: number;
  jobId?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Request interfaces
export interface CreateRoadmapRequest {
  title: string;
  description: string;
  jobTitle: string;
  estimatedDuration?: number;
  jobId?: string;
}

export interface UpdateRoadmapRequest {
  title?: string;
  description?: string;
  progress?: number;
  estimatedDuration?: number;
  skills?: RoadmapSkill[];
}

export interface GenerateRoadmapRequest {
  cvId: string;
  jobId: string;
  jobTitle?: string;
  jobDescription?: string;
  jobRequirements?: string;
  useTestMode?: boolean;
}

// Response interfaces
export interface RoadmapPaginatedList {
  items: Roadmap[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

// Task completion update interface
export interface UpdateTaskCompletionRequest {
  roadmapId: string;
  skillId: string;
  taskId: string;
  subTaskId?: string;
}
