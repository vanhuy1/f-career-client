'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import Modal from '../ui/Modal';
import Icon from '../ui/Icon';
import { useLocalStorageState } from '../../hooks/useLocalStorage';
import {
  CheckCircle2,
  Circle,
  BookOpen,
  Award,
  ChevronRight,
  ChevronDown,
  Clock,
  BarChart,
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedHours: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  category?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  milestones: Milestone[];
}

const SAMPLE_COURSES: Course[] = [
  {
    id: 'web-dev',
    title: 'Web Development Fundamentals',
    description:
      'Learn the core technologies of web development: HTML, CSS, and JavaScript.',
    progress: 35,
    category: 'Programming',
    difficulty: 'beginner',
    milestones: [
      {
        id: 'html-basics',
        title: 'HTML Basics',
        description:
          'Learn the structure of web pages and essential HTML tags.',
        completed: true,
        estimatedHours: 4,
      },
      {
        id: 'css-styling',
        title: 'CSS Styling',
        description:
          'Master the styling of web pages using CSS properties and selectors.',
        completed: true,
        estimatedHours: 6,
      },
      {
        id: 'js-intro',
        title: 'JavaScript Introduction',
        description:
          'Get started with JavaScript programming language fundamentals.',
        completed: false,
        estimatedHours: 8,
      },
      {
        id: 'dom-manipulation',
        title: 'DOM Manipulation',
        description:
          'Learn to interact with web page elements using JavaScript.',
        completed: false,
        estimatedHours: 5,
      },
    ],
  },
  {
    id: 'data-science',
    title: 'Data Science Essentials',
    description:
      'Learn the fundamentals of data science, including statistics, Python, and data visualization.',
    progress: 15,
    category: 'Data',
    difficulty: 'intermediate',
    milestones: [
      {
        id: 'python-basics',
        title: 'Python Basics',
        description: 'Learn the fundamentals of Python programming language.',
        completed: true,
        estimatedHours: 6,
      },
      {
        id: 'data-analysis',
        title: 'Data Analysis with Pandas',
        description:
          'Learn to manipulate and analyze data using Pandas library.',
        completed: false,
        estimatedHours: 8,
      },
      {
        id: 'data-viz',
        title: 'Data Visualization',
        description:
          'Create insightful visualizations using matplotlib and seaborn.',
        completed: false,
        estimatedHours: 7,
      },
      {
        id: 'ml-intro',
        title: 'Machine Learning Introduction',
        description:
          'Get started with basic machine learning algorithms and concepts.',
        completed: false,
        estimatedHours: 10,
      },
    ],
  },
];

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RoadmapModal({ isOpen, onClose }: RoadmapModalProps) {
  const [courses, setCourses] = useLocalStorageState<Course[]>(
    SAMPLE_COURSES.map((course) => ({
      ...course,
      milestones: course.milestones || [],
    })),
    'study-room-courses',
  );
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [tab, setTab] = useState<'current' | 'all'>('current');

  // Toggle milestone completion
  const toggleMilestone = (courseId: string, milestoneId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((course) => {
        if (course.id === courseId && course.milestones) {
          const updatedMilestones = course.milestones.map((milestone) => {
            if (milestone.id === milestoneId) {
              return { ...milestone, completed: !milestone.completed };
            }
            return milestone;
          });

          // Calculate new progress percentage
          const completedCount = updatedMilestones.filter(
            (m) => m.completed,
          ).length;
          const progress = Math.round(
            (completedCount / updatedMilestones.length) * 100,
          );

          return { ...course, milestones: updatedMilestones, progress };
        }
        return course;
      }),
    );
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: string | undefined) => {
    if (!difficulty) return 'bg-blue-500/20 text-blue-400 border-blue-500/30';

    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Learning Roadmaps"
      size="lg"
    >
      <div className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-stone-300">
              Track your learning progress with interactive roadmaps.
            </p>

            <div className="flex rounded-md bg-stone-800 p-0.5">
              <button
                className={cn(
                  'rounded-md px-3 py-1 text-sm transition-colors',
                  tab === 'current'
                    ? 'bg-stone-700 text-white'
                    : 'text-stone-400 hover:text-white',
                )}
                onClick={() => setTab('current')}
              >
                In Progress
              </button>
              <button
                className={cn(
                  'rounded-md px-3 py-1 text-sm transition-colors',
                  tab === 'all'
                    ? 'bg-stone-700 text-white'
                    : 'text-stone-400 hover:text-white',
                )}
                onClick={() => setTab('all')}
              >
                All Paths
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="overflow-hidden rounded-lg bg-stone-800/60 transition-all duration-300"
              >
                <div
                  className="cursor-pointer p-4 hover:bg-stone-700/40"
                  onClick={() =>
                    setExpandedCourse(
                      expandedCourse === course.id ? null : course.id,
                    )
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-700">
                        <BookOpen size={20} className="text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-white">
                          {course.title}
                        </h3>
                        <div className="mt-1 flex items-center gap-3">
                          <span className="text-xs text-stone-400">
                            {course.category}
                          </span>
                          <span
                            className={cn(
                              'rounded-full border px-2 py-0.5 text-xs',
                              getDifficultyColor(course.difficulty),
                            )}
                          >
                            {course.difficulty
                              ? course.difficulty.charAt(0).toUpperCase() +
                                course.difficulty.slice(1)
                              : 'Beginner'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5">
                          <BarChart size={14} className="text-green-400" />
                          <span className="font-medium text-white">
                            {course.progress}%
                          </span>
                        </div>
                        <span className="text-xs text-stone-400">
                          completed
                        </span>
                      </div>
                      {expandedCourse === course.id ? (
                        <ChevronDown className="text-stone-400" />
                      ) : (
                        <ChevronRight className="text-stone-400" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedCourse === course.id && (
                  <div className="px-4 pb-4">
                    <p className="mt-2 mb-6 border-l-2 border-stone-700 pl-4 text-sm text-stone-300">
                      {course.description}
                    </p>

                    <div className="mb-6 h-2 w-full rounded-full bg-stone-700">
                      <div
                        className="h-2 rounded-full bg-green-500 transition-all duration-700"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>

                    <div className="space-y-1">
                      {course.milestones &&
                        course.milestones.map((milestone, index) => (
                          <div
                            key={milestone.id}
                            className={cn(
                              'relative rounded-md py-3 pr-3 pl-8 hover:bg-stone-700/30',
                              milestone.completed && 'bg-green-500/5',
                            )}
                          >
                            {/* Connection line */}
                            {index < course.milestones.length - 1 && (
                              <div className="absolute top-12 left-4 h-[calc(100%-30px)] w-0.5 bg-stone-700" />
                            )}

                            <div className="flex items-start justify-between">
                              <div>
                                <div className="relative flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      toggleMilestone(course.id, milestone.id)
                                    }
                                    className="absolute -left-8 mt-0.5"
                                  >
                                    {milestone.completed ? (
                                      <CheckCircle2
                                        size={18}
                                        className="text-green-400"
                                      />
                                    ) : (
                                      <Circle
                                        size={18}
                                        className="text-stone-500 hover:text-stone-400"
                                      />
                                    )}
                                  </button>
                                  <h4
                                    className={cn(
                                      'font-medium text-white',
                                      milestone.completed && 'text-green-400',
                                    )}
                                  >
                                    {milestone.title}
                                  </h4>
                                </div>
                                <p className="mt-1 text-sm text-stone-300">
                                  {milestone.description}
                                </p>
                              </div>

                              <div className="ml-3 flex items-center text-xs whitespace-nowrap text-stone-400">
                                <Clock size={12} className="mr-1.5" />
                                <span>{milestone.estimatedHours} hours</span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-lg border border-yellow-600/30 bg-stone-800/60 p-4">
            <div className="flex items-center gap-2">
              <Icon name="Learning" />
              <h3 className="font-medium text-yellow-400">
                AI-Generated Learning Path
              </h3>
            </div>
            <p className="mt-2 text-sm text-stone-300">
              Create a personalized learning roadmap based on your goals and
              skill level. Our AI will suggest the optimal learning path for
              you.
            </p>
            <button className="mt-4 flex items-center gap-2 rounded-md bg-stone-700 px-4 py-2 text-sm text-white hover:bg-stone-600">
              <Award size={16} />
              <span>Coming Soon</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
