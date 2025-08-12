'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Modal from '../ui/Modal';
import {
  MapPin,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronDown,
  BarChart,
  Award,
  Clock,
  Target,
  BookOpen,
  Code,
  Briefcase,
  RefreshCw,
  Network,
  Calendar,
  FlaskConical,
  User,
  GraduationCap,
  AlertCircle,
  Loader2,
  History,
  Trophy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import MindMapVisualization from './MindMapVisualization';
import QuizModal from './QuizModal';
import { useRouter } from 'next/navigation';
import 'reactflow/dist/style.css';
import { roadmapService } from '@/services/api/roadmap/roadmap-api';
import { toast } from 'react-hot-toast';
import { Roadmap, RoadmapSkill, CVSnapshot, CVAnalysis } from '@/types/RoadMap';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  generateRoadmap?: boolean;
  jobId?: string;
  cvId?: string;
  jobTitle?: string;
}

interface CombinedSkillForMindMap extends Omit<RoadmapSkill, 'tasks'> {
  skills: RoadmapSkill[];
  tasks: Array<
    RoadmapSkill['tasks'][0] & {
      skillId: string;
      skillTitle: string;
    }
  >;
}

// Extended Roadmap interface for quiz features
interface ExtendedRoadmap extends Roadmap {
  testPassed?: boolean;
  quizBestScore?: number;
  quizAttempts?: number;
}

// Task type icons mapping
const getTaskTypeIcon = (type: string) => {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {
    learn: BookOpen,
    practice: Code,
    project: Briefcase,
    review: RefreshCw,
    assessment: GraduationCap,
  };
  return icons[type] || Circle;
};

// Priority color mapping
const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    critical: 'text-red-400 border-red-500/50 bg-red-500/10',
    high: 'text-orange-400 border-orange-500/50 bg-orange-500/10',
    medium: 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10',
    low: 'text-blue-400 border-blue-500/50 bg-blue-500/10',
  };
  return (
    colors[priority] || 'text-stone-400 border-stone-500/50 bg-stone-500/10'
  );
};

// Category color mapping
const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    fundamental: 'bg-green-500/20 text-green-300 border-green-500/50',
    core: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
    advanced: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
    specialized: 'bg-orange-500/20 text-orange-300 border-orange-500/50',
  };
  return (
    colors[category] || 'bg-stone-500/20 text-stone-300 border-stone-500/50'
  );
};

// Difficulty color mapping
const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    beginner: 'bg-green-500/20 text-green-300',
    intermediate: 'bg-yellow-500/20 text-yellow-300',
    advanced: 'bg-orange-500/20 text-orange-300',
    expert: 'bg-red-500/20 text-red-300',
  };
  return colors[difficulty] || 'bg-stone-500/20 text-stone-300';
};

export default function RoadmapModal({
  isOpen,
  onClose,
  generateRoadmap,
  jobId,
  cvId,
  jobTitle,
}: RoadmapModalProps) {
  const [roadmaps, setRoadmaps] = useState<ExtendedRoadmap[]>([]);
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [tab, setTab] = useState<'in-progress' | 'practice-test' | 'completed'>(
    'in-progress',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  const [selectedSkillForVisualization, setSelectedSkillForVisualization] =
    useState<{ roadmapId: string; skill: RoadmapSkill } | null>(null);
  const [showFullRoadmapVisualization, setShowFullRoadmapVisualization] =
    useState<string | null>(null);
  const [showQuizModal, setShowQuizModal] = useState<{
    roadmapId: string;
    roadmapTitle: string;
  } | null>(null);
  const router = useRouter();

  // Load roadmaps from backend
  const fetchRoadmaps = useCallback(async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const response = await roadmapService.findAll({ page: 1, limit: 50 });
      setRoadmaps(response.items || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      toast.error('Failed to load roadmaps');
    } finally {
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  // Generate roadmap if requested
  useEffect(() => {
    const handleGenerateRoadmap = async () => {
      if (
        generateRoadmap &&
        jobId &&
        cvId &&
        jobTitle &&
        isOpen &&
        !isGenerating
      ) {
        setIsGenerating(true);
        try {
          const newRoadmap = await roadmapService.generate({
            cvId,
            jobId,
            jobTitle,
          });

          await fetchRoadmaps();
          setExpandedRoadmap(newRoadmap.id);
          toast.success('Roadmap generated successfully!');
        } catch (error) {
          console.error('Error generating roadmap:', error);
          toast.error('Failed to generate roadmap');
        } finally {
          setIsGenerating(false);
        }
      }
    };

    handleGenerateRoadmap();
  }, [
    generateRoadmap,
    jobId,
    cvId,
    jobTitle,
    isOpen,
    fetchRoadmaps,
    isGenerating,
  ]);

  // Update task completion - optimized version
  const toggleTask = useCallback(
    async (roadmapId: string, skillId: string, taskId: string) => {
      const taskKey = `${roadmapId}-${skillId}-${taskId}`;

      // Prevent double-clicking
      if (updatingTasks.has(taskKey)) return;

      setUpdatingTasks((prev) => new Set(prev).add(taskKey));

      try {
        // Optimistic update
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((r) => {
            if (r.id !== roadmapId) return r;

            const updatedSkills = r.skills.map((s) => {
              if (s.id !== skillId) return s;

              const updatedTasks = s.tasks.map((t) => {
                if (t.id !== taskId) return t;
                return { ...t, completed: !t.completed };
              });

              // Calculate new progress
              const completedCount = updatedTasks.filter(
                (t) => t.completed,
              ).length;
              const progress =
                updatedTasks.length > 0
                  ? Math.round((completedCount / updatedTasks.length) * 100)
                  : 0;

              return { ...s, tasks: updatedTasks, progress };
            });

            // Calculate overall progress
            const totalProgress = Math.round(
              updatedSkills.reduce((sum, s) => sum + s.progress, 0) /
                updatedSkills.length,
            );

            return { ...r, skills: updatedSkills, progress: totalProgress };
          }),
        );

        // Call API
        const updatedRoadmap = await roadmapService.updateTaskCompletion(
          roadmapId,
          skillId,
          taskId,
        );

        // Update with server response
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((r) => (r.id === roadmapId ? updatedRoadmap : r)),
        );
      } catch (error) {
        console.error('Error updating task:', error);
        toast.error('Failed to update task');

        // Revert optimistic update
        await fetchRoadmaps();
      } finally {
        setUpdatingTasks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(taskKey);
          return newSet;
        });
      }
    },
    [updatingTasks, fetchRoadmaps],
  );

  // Toggle subtask completion - optimized version
  const toggleSubTask = useCallback(
    async (
      roadmapId: string,
      skillId: string,
      taskId: string,
      subTaskId: string,
    ) => {
      const taskKey = `${roadmapId}-${skillId}-${taskId}-${subTaskId}`;

      if (updatingTasks.has(taskKey)) return;

      setUpdatingTasks((prev) => new Set(prev).add(taskKey));

      try {
        // Optimistic update
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((r) => {
            if (r.id !== roadmapId) return r;

            const updatedSkills = r.skills.map((s) => {
              if (s.id !== skillId) return s;

              const updatedTasks = s.tasks.map((t) => {
                if (t.id !== taskId) return t;

                const updatedSubTasks = t.subTasks.map((st) =>
                  st.id === subTaskId
                    ? { ...st, completed: !st.completed }
                    : st,
                );

                // Auto-complete task if all subtasks are done
                const allCompleted = updatedSubTasks.every(
                  (st) => st.completed,
                );

                return {
                  ...t,
                  subTasks: updatedSubTasks,
                  completed: allCompleted,
                };
              });

              // Calculate progress
              const completedCount = updatedTasks.filter(
                (t) => t.completed,
              ).length;
              const progress =
                updatedTasks.length > 0
                  ? Math.round((completedCount / updatedTasks.length) * 100)
                  : 0;

              return { ...s, tasks: updatedTasks, progress };
            });

            // Calculate overall progress
            const totalProgress = Math.round(
              updatedSkills.reduce((sum, s) => sum + s.progress, 0) /
                updatedSkills.length,
            );

            return { ...r, skills: updatedSkills, progress: totalProgress };
          }),
        );

        // Call API
        const updatedRoadmap = await roadmapService.updateTaskCompletion(
          roadmapId,
          skillId,
          taskId,
          subTaskId,
        );

        // Update with server response
        setRoadmaps((prevRoadmaps) =>
          prevRoadmaps.map((r) => (r.id === roadmapId ? updatedRoadmap : r)),
        );
      } catch (error) {
        console.error('Error updating subtask:', error);
        toast.error('Failed to update subtask');

        // Revert
        await fetchRoadmaps();
      } finally {
        setUpdatingTasks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(taskKey);
          return newSet;
        });
      }
    },
    [updatingTasks, fetchRoadmaps],
  );

  // Filter roadmaps based on tab
  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap) => {
      if (tab === 'completed') {
        // Only show roadmaps that have been completed AND passed practice test
        return roadmap.progress === 100 && roadmap.testPassed === true;
      } else if (tab === 'practice-test') {
        // Show roadmaps that are 100% complete and ready for practice test
        return roadmap.progress === 100 && !roadmap.testPassed;
      }
      // In progress (0% <= progress < 100%)
      return roadmap.progress < 100;
    });
  }, [roadmaps, tab]);

  // Check if task update is loading
  const isTaskUpdating = (
    roadmapId: string,
    skillId: string,
    taskId: string,
    subTaskId?: string,
  ) => {
    const key = subTaskId
      ? `${roadmapId}-${skillId}-${taskId}-${subTaskId}`
      : `${roadmapId}-${skillId}-${taskId}`;
    return updatingTasks.has(key);
  };

  // Get current roadmap for visualization
  const getCurrentRoadmap = useCallback(() => {
    if (!showFullRoadmapVisualization) return null;
    return roadmaps.find((r) => r.id === showFullRoadmapVisualization);
  }, [showFullRoadmapVisualization, roadmaps]);

  // Create combined skill for full roadmap mind map
  const getCombinedSkillForMindMap =
    useCallback((): CombinedSkillForMindMap | null => {
      const roadmap = getCurrentRoadmap();
      if (!roadmap) return null;

      const allTasks = roadmap.skills.flatMap((skill) =>
        skill.tasks.map((task) => ({
          ...task,
          skillId: skill.id,
          skillTitle: skill.title,
        })),
      );

      return {
        id: roadmap.id,
        title: roadmap.title,
        description: roadmap.description,
        progress: roadmap.progress,
        tasks: allTasks,
        skills: roadmap.skills,
        order: 1,
        category: 'core',
        difficulty: 'intermediate',
        estimatedHours: roadmap.skills.reduce(
          (sum, s) => sum + s.estimatedHours,
          0,
        ),
        reason: '',
      };
    }, [getCurrentRoadmap]);

  // Handle quiz modal close and refresh
  const handleQuizModalClose = useCallback(() => {
    setShowQuizModal(null);
    // Refresh roadmaps to update test status
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  // Open quiz modal
  const handleOpenQuiz = useCallback(
    (roadmapId: string, roadmapTitle: string) => {
      setShowQuizModal({ roadmapId, roadmapTitle });
    },
    [],
  );

  // Render CV Analysis section
  const renderCVAnalysis = useCallback(
    (cvAnalysis: CVAnalysis, cvSnapshot?: CVSnapshot) => (
      <div className="mb-6 rounded-lg bg-stone-800/60 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-medium text-white">
              <User className="h-5 w-5 text-green-400" />
              {cvSnapshot?.name || 'Candidate Profile'}
            </h3>
            <p className="mt-1 text-sm text-stone-400">
              {cvAnalysis.experienceLevel} level •{' '}
              {cvSnapshot?.totalExperience || 0} years experience
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">
              {cvAnalysis.matchPercentage}%
            </div>
            <p className="text-xs text-stone-400">Job Match</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <h4 className="mb-2 text-sm font-medium text-green-400">
              Strengths
            </h4>
            <ul className="space-y-1">
              {cvAnalysis.strengths.slice(0, 3).map((strength, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1 text-xs text-stone-300"
                >
                  <CheckCircle2 className="mt-0.5 h-3 w-3 flex-shrink-0 text-green-400" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-medium text-orange-400">
              Skill Gaps
            </h4>
            <ul className="space-y-1">
              {cvAnalysis.skillGaps.slice(0, 3).map((gap, i) => (
                <li
                  key={i}
                  className="flex items-start gap-1 text-xs text-stone-300"
                >
                  <AlertCircle className="mt-0.5 h-3 w-3 flex-shrink-0 text-orange-400" />
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-3 border-t border-stone-700 pt-3">
          <p className="text-xs text-stone-400">
            {cvAnalysis.detailedAnalysis.overall.summary}
          </p>
        </div>
      </div>
    ),
    [],
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Learning Roadmaps"
        size="xl"
      >
        {isGenerating ? (
          <div className="flex h-[70vh] flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-stone-700 border-t-green-500"></div>
              <h3 className="text-xl font-medium text-green-500">
                Generating Your Roadmap
              </h3>
              <p className="max-w-md text-center text-stone-300">
                Creating a personalized learning roadmap based on your CV and
                the job requirements. This may take a moment...
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex h-[70vh] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-stone-700 border-t-green-500"></div>
              <p className="text-stone-300">Loading roadmaps...</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex items-center justify-between">
                <p className="text-stone-300">
                  Track your learning progress with AI-generated roadmaps.
                </p>

                <div className="flex rounded-md bg-stone-800 p-0.5">
                  <button
                    className={cn(
                      'rounded-md px-3 py-1 text-sm transition-colors',
                      tab === 'in-progress'
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-400 hover:text-white',
                    )}
                    onClick={() => setTab('in-progress')}
                  >
                    In Progress
                  </button>
                  <button
                    className={cn(
                      'rounded-md px-3 py-1 text-sm transition-colors',
                      tab === 'practice-test'
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-400 hover:text-white',
                    )}
                    onClick={() => setTab('practice-test')}
                  >
                    <FlaskConical className="mr-1 inline h-3 w-3" />
                    Practice Test
                  </button>
                  <button
                    className={cn(
                      'rounded-md px-3 py-1 text-sm transition-colors',
                      tab === 'completed'
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-400 hover:text-white',
                    )}
                    onClick={() => setTab('completed')}
                  >
                    <Trophy className="mr-1 inline h-3 w-3" />
                    Completed
                  </button>
                </div>
              </div>

              {/* Roadmaps List */}
              {filteredRoadmaps.length === 0 ? (
                <div className="rounded-lg bg-stone-800/60 p-6 text-center">
                  <p className="text-stone-300">
                    {tab === 'completed'
                      ? 'No completed roadmaps yet. Pass practice tests to move roadmaps here.'
                      : tab === 'practice-test'
                        ? 'Complete all tasks (100%) to unlock practice tests.'
                        : 'No roadmaps in progress. Generate one from a job listing!'}
                  </p>
                </div>
              ) : (
                <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto">
                  {filteredRoadmaps.map((roadmap) => (
                    <div
                      key={roadmap.id}
                      className="overflow-hidden rounded-lg bg-stone-800/60 transition-all duration-300"
                    >
                      {/* Roadmap Header */}
                      <div
                        className="cursor-pointer p-4 hover:bg-stone-700/40"
                        onClick={() =>
                          setExpandedRoadmap(
                            expandedRoadmap === roadmap.id ? null : roadmap.id,
                          )
                        }
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-700">
                              <MapPin size={20} className="text-green-400" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-white">
                                {roadmap.title}
                              </h3>
                              <div className="mt-1 flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="border-purple-500 bg-purple-500/20 text-purple-300"
                                >
                                  {roadmap.jobTitle}
                                </Badge>
                                {roadmap.estimatedDuration && (
                                  <Badge
                                    variant="outline"
                                    className="border-green-500 bg-green-500/20 text-green-300"
                                  >
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {roadmap.estimatedDuration} weeks
                                  </Badge>
                                )}
                                {tab === 'practice-test' && (
                                  <Badge className="border-orange-500 bg-orange-500/20 text-orange-300">
                                    <FlaskConical className="mr-1 h-3 w-3" />
                                    Ready for test
                                  </Badge>
                                )}
                                {tab === 'completed' && (
                                  <Badge className="border-green-500 bg-green-500/20 text-green-300">
                                    <Trophy className="mr-1 h-3 w-3" />
                                    Test Passed
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex h-7 items-center gap-1 rounded-full px-2 text-green-400 hover:bg-green-500/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowFullRoadmapVisualization(roadmap.id);
                              }}
                            >
                              <Network className="h-3.5 w-3.5" />
                              <span className="text-xs">Mind Map</span>
                            </Button>
                            <div className="text-right">
                              <div className="flex items-center gap-1.5">
                                <BarChart
                                  size={14}
                                  className="text-green-400"
                                />
                                <span className="font-medium text-white">
                                  {roadmap.progress}%
                                </span>
                              </div>
                              <span className="text-xs text-stone-400">
                                completed
                              </span>
                            </div>
                            {expandedRoadmap === roadmap.id ? (
                              <ChevronDown className="text-stone-400" />
                            ) : (
                              <ChevronRight className="text-stone-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      {expandedRoadmap === roadmap.id && (
                        <div className="px-4 pb-4">
                          <p className="mt-2 mb-4 text-sm text-stone-300">
                            {roadmap.description}
                          </p>

                          {/* CV Analysis */}
                          {roadmap.cvAnalysis &&
                            renderCVAnalysis(
                              roadmap.cvAnalysis,
                              roadmap.cvSnapshot,
                            )}

                          <Progress
                            value={roadmap.progress}
                            className="mb-6 h-2"
                          />

                          {/* Show completion notice for 100% progress in In Progress tab */}
                          {tab === 'in-progress' &&
                            roadmap.progress === 100 && (
                              <div className="mb-4 rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="flex items-center gap-2 text-sm font-medium text-green-300">
                                      <CheckCircle2 className="h-4 w-4" />
                                      Congratulations! Learning Completed
                                    </h4>
                                    <p className="mt-1 text-xs text-stone-300">
                                      You&apos;ve completed all tasks! Take the
                                      practice test to validate your knowledge.
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-500 text-green-400 hover:bg-green-500/20"
                                    onClick={() => setTab('practice-test')}
                                  >
                                    Go to Practice Test
                                    <ChevronRight className="ml-1 h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}

                          {/* Practice Test Section */}
                          {tab === 'practice-test' && (
                            <div className="mb-4 rounded-lg border border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="flex items-center gap-2 text-sm font-medium text-orange-300">
                                    <FlaskConical className="h-4 w-4" />
                                    AI Practice Test Available
                                  </h4>
                                  <p className="mt-1 text-xs text-stone-300">
                                    Test your knowledge with AI-generated
                                    questions based on your learning path.
                                  </p>
                                  <div className="mt-2 flex items-center gap-4 text-xs text-stone-400">
                                    <span className="flex items-center gap-1">
                                      <Target className="h-3 w-3" />
                                      50 questions
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      60 minutes
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Trophy className="h-3 w-3" />
                                      70% to pass
                                    </span>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    size="sm"
                                    className="bg-orange-600 text-white hover:bg-orange-700"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenQuiz(roadmap.id, roadmap.title);
                                    }}
                                  >
                                    <FlaskConical className="mr-2 h-3 w-3" />
                                    Start Test
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-xs text-stone-400 hover:text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenQuiz(roadmap.id, roadmap.title);
                                    }}
                                  >
                                    <History className="mr-1 h-3 w-3" />
                                    View History
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Completed Section */}
                          {tab === 'completed' && roadmap.quizBestScore && (
                            <div className="mb-4 rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="flex items-center gap-2 text-sm font-medium text-green-300">
                                    <Trophy className="h-4 w-4" />
                                    Test Completed Successfully
                                  </h4>
                                  <p className="mt-1 text-xs text-stone-300">
                                    You&apos;ve passed the practice test with a
                                    score of {roadmap.quizBestScore}%
                                  </p>
                                  {roadmap.quizAttempts && (
                                    <p className="mt-1 text-xs text-stone-400">
                                      Total attempts: {roadmap.quizAttempts}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-green-400 hover:bg-green-500/20"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenQuiz(roadmap.id, roadmap.title);
                                  }}
                                >
                                  <History className="mr-2 h-3 w-3" />
                                  View Results
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Skills List - Keep all existing code */}
                          {tab === 'in-progress' && (
                            <div className="space-y-4">
                              {roadmap.skills.map((skill) => (
                                <div
                                  key={skill.id}
                                  className="overflow-hidden rounded-lg bg-stone-700/30"
                                >
                                  <div
                                    className="flex cursor-pointer items-center justify-between p-3 hover:bg-stone-700/50"
                                    onClick={() =>
                                      setExpandedSkill(
                                        expandedSkill === skill.id
                                          ? null
                                          : skill.id,
                                      )
                                    }
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className={cn(
                                          'h-2 w-2 rounded-full',
                                          skill.progress === 100
                                            ? 'bg-green-500'
                                            : skill.progress > 0
                                              ? 'bg-yellow-500'
                                              : 'bg-stone-500',
                                        )}
                                      />
                                      <h4 className="font-medium text-white">
                                        {skill.order}. {skill.title}
                                      </h4>
                                      <Badge
                                        className={cn(
                                          'text-xs',
                                          getCategoryColor(skill.category),
                                        )}
                                      >
                                        {skill.category}
                                      </Badge>
                                      <Badge
                                        className={cn(
                                          'text-xs',
                                          getDifficultyColor(skill.difficulty),
                                        )}
                                      >
                                        {skill.difficulty}
                                      </Badge>
                                      <span className="text-xs text-stone-400">
                                        ({skill.progress}% •{' '}
                                        {skill.estimatedHours}h)
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 w-7 rounded-full p-0 text-green-400 hover:bg-green-500/20"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedSkillForVisualization({
                                            roadmapId: roadmap.id,
                                            skill,
                                          });
                                        }}
                                      >
                                        <MapPin className="h-4 w-4" />
                                      </Button>
                                      {expandedSkill === skill.id ? (
                                        <ChevronDown className="h-4 w-4 text-stone-400" />
                                      ) : (
                                        <ChevronRight className="h-4 w-4 text-stone-400" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Expanded Skill Content */}
                                  {expandedSkill === skill.id && (
                                    <div className="p-3">
                                      <p className="mb-3 text-sm text-stone-300">
                                        {skill.description}
                                      </p>
                                      <p className="mb-4 text-xs text-green-400">
                                        Why: {skill.reason}
                                      </p>

                                      {/* Tasks */}
                                      <div className="space-y-2">
                                        <h5 className="flex items-center gap-1.5 text-sm font-medium text-stone-200">
                                          <Target className="h-3.5 w-3.5" />
                                          Tasks (
                                          {
                                            skill.tasks.filter(
                                              (t) => t.completed,
                                            ).length
                                          }
                                          /{skill.tasks.length})
                                        </h5>
                                        {skill.tasks.map((task) => {
                                          const TaskIcon = getTaskTypeIcon(
                                            task.type,
                                          );
                                          const isUpdating = isTaskUpdating(
                                            roadmap.id,
                                            skill.id,
                                            task.id,
                                          );

                                          return (
                                            <div
                                              key={task.id}
                                              className="rounded-md bg-stone-800/50 p-2"
                                            >
                                              <div className="flex items-start gap-2">
                                                <div className="mt-1">
                                                  {isUpdating ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-green-400" />
                                                  ) : (
                                                    <Checkbox
                                                      id={`task-${task.id}`}
                                                      checked={task.completed}
                                                      onCheckedChange={() =>
                                                        toggleTask(
                                                          roadmap.id,
                                                          skill.id,
                                                          task.id,
                                                        )
                                                      }
                                                      disabled={false}
                                                    />
                                                  )}
                                                </div>
                                                <div className="flex-1">
                                                  <div
                                                    className="flex cursor-pointer items-center gap-2"
                                                    onClick={() =>
                                                      setExpandedTask(
                                                        expandedTask === task.id
                                                          ? null
                                                          : task.id,
                                                      )
                                                    }
                                                  >
                                                    <TaskIcon className="h-3.5 w-3.5 text-stone-400" />
                                                    <label
                                                      htmlFor={`task-${task.id}`}
                                                      className={cn(
                                                        'cursor-pointer text-sm leading-none font-medium',
                                                        task.completed
                                                          ? 'text-gray-400 line-through'
                                                          : 'text-gray-200',
                                                      )}
                                                    >
                                                      {task.title}
                                                    </label>
                                                    <Badge
                                                      className={cn(
                                                        'text-xs',
                                                        getPriorityColor(
                                                          task.priority,
                                                        ),
                                                      )}
                                                    >
                                                      {task.priority}
                                                    </Badge>
                                                    {task.estimatedHours && (
                                                      <span className="text-xs text-stone-500">
                                                        <Clock className="inline h-3 w-3" />{' '}
                                                        {task.estimatedHours}h
                                                      </span>
                                                    )}
                                                    {task.subTasks &&
                                                      task.subTasks.length >
                                                        0 &&
                                                      (expandedTask ===
                                                      task.id ? (
                                                        <ChevronDown className="h-3 w-3 text-stone-400" />
                                                      ) : (
                                                        <ChevronRight className="h-3 w-3 text-stone-400" />
                                                      ))}
                                                  </div>

                                                  {/* Expanded Task Content */}
                                                  {expandedTask === task.id && (
                                                    <>
                                                      <p className="mt-2 text-xs text-stone-400">
                                                        {task.description}
                                                      </p>

                                                      {/* Tips */}
                                                      {task.tips &&
                                                        task.tips.length >
                                                          0 && (
                                                          <div className="mt-2">
                                                            <p className="text-xs font-medium text-green-400">
                                                              Tips:
                                                            </p>
                                                            <ul className="mt-1 space-y-0.5">
                                                              {task.tips.map(
                                                                (tip, i) => (
                                                                  <li
                                                                    key={i}
                                                                    className="text-xs text-stone-300"
                                                                  >
                                                                    • {tip}
                                                                  </li>
                                                                ),
                                                              )}
                                                            </ul>
                                                          </div>
                                                        )}

                                                      {/* Subtasks */}
                                                      {task.subTasks &&
                                                        task.subTasks.length >
                                                          0 && (
                                                          <div className="mt-3 ml-4 space-y-2">
                                                            {task.subTasks.map(
                                                              (subTask) => {
                                                                const isSubUpdating =
                                                                  isTaskUpdating(
                                                                    roadmap.id,
                                                                    skill.id,
                                                                    task.id,
                                                                    subTask.id,
                                                                  );

                                                                return (
                                                                  <div
                                                                    key={
                                                                      subTask.id
                                                                    }
                                                                    className="flex items-start gap-2"
                                                                  >
                                                                    <div className="mt-0.5">
                                                                      {isSubUpdating ? (
                                                                        <Loader2 className="h-3 w-3 animate-spin text-green-400" />
                                                                      ) : (
                                                                        <Checkbox
                                                                          id={`subtask-${subTask.id}`}
                                                                          checked={
                                                                            subTask.completed
                                                                          }
                                                                          onCheckedChange={() =>
                                                                            toggleSubTask(
                                                                              roadmap.id,
                                                                              skill.id,
                                                                              task.id,
                                                                              subTask.id,
                                                                            )
                                                                          }
                                                                          className="h-3 w-3"
                                                                          disabled={
                                                                            false
                                                                          }
                                                                        />
                                                                      )}
                                                                    </div>
                                                                    <div className="flex-1">
                                                                      <label
                                                                        htmlFor={`subtask-${subTask.id}`}
                                                                        className={cn(
                                                                          'cursor-pointer text-xs leading-none',
                                                                          subTask.completed
                                                                            ? 'text-gray-500 line-through'
                                                                            : 'text-gray-300',
                                                                        )}
                                                                      >
                                                                        {
                                                                          subTask.order
                                                                        }
                                                                        .{' '}
                                                                        {
                                                                          subTask.title
                                                                        }
                                                                      </label>
                                                                      {subTask.estimatedMinutes && (
                                                                        <p className="mt-0.5 text-xs text-stone-500">
                                                                          ~
                                                                          {
                                                                            subTask.estimatedMinutes
                                                                          }{' '}
                                                                          mins
                                                                        </p>
                                                                      )}
                                                                      {subTask.checkCriteria && (
                                                                        <p className="mt-1 text-xs text-green-400/60">
                                                                          ✓{' '}
                                                                          {
                                                                            subTask.checkCriteria
                                                                          }
                                                                        </p>
                                                                      )}
                                                                    </div>
                                                                  </div>
                                                                );
                                                              },
                                                            )}
                                                          </div>
                                                        )}
                                                    </>
                                                  )}
                                                </div>
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Generate New Roadmap CTA */}
              <div className="mt-8 rounded-lg border border-green-600/30 bg-stone-800/60 p-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-green-400" />
                  <h3 className="font-medium text-green-400">
                    Generate New Career Roadmap
                  </h3>
                </div>
                <p className="mt-2 text-sm text-stone-300">
                  Create a personalized career roadmap based on your CV and
                  target job position. Our AI will analyze your profile and
                  suggest the optimal learning path.
                </p>
                <Button
                  className="mt-4 flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700"
                  onClick={() => router.push('/job')}
                >
                  <Award size={16} />
                  <span>Find Jobs & Generate Roadmap</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Quiz Modal */}
      {showQuizModal && (
        <QuizModal
          isOpen={true}
          onClose={handleQuizModalClose}
          roadmapId={showQuizModal.roadmapId}
          roadmapTitle={showQuizModal.roadmapTitle}
        />
      )}

      {/* Mind Map Visualization Modals */}
      {selectedSkillForVisualization && (
        <MindMapVisualization
          skill={selectedSkillForVisualization.skill}
          onClose={() => setSelectedSkillForVisualization(null)}
          onToggleTask={(taskId) => {
            toggleTask(
              selectedSkillForVisualization.roadmapId,
              selectedSkillForVisualization.skill.id,
              taskId,
            );
          }}
        />
      )}

      {showFullRoadmapVisualization && getCombinedSkillForMindMap() && (
        <MindMapVisualization
          skill={getCombinedSkillForMindMap() as CombinedSkillForMindMap}
          onClose={() => setShowFullRoadmapVisualization(null)}
          onToggleTask={(taskId) => {
            const roadmap = getCurrentRoadmap();
            if (roadmap) {
              const skill = roadmap.skills.find((s) =>
                s.tasks.some((t) => t.id === taskId),
              );
              if (skill) {
                toggleTask(showFullRoadmapVisualization, skill.id, taskId);
              }
            }
          }}
        />
      )}
    </>
  );
}
