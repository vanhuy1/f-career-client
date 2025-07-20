'use client';

import { useState, useEffect } from 'react';
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
  FileText,
  PenTool,
  Network,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocalStorageState } from '../../hooks/useLocalStorage';
import MindMapVisualization from './MindMapVisualization';
import { useRouter } from 'next/navigation';
import 'reactflow/dist/style.css';
import { Roadmap, RoadmapSkill } from '@/types/RoadMap';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  generateRoadmap?: boolean;
  jobId?: string;
  cvId?: string;
  jobTitle?: string;
}

interface TestComponentProps {
  activeTest: { roadmapId: string; skillId: string } | null;
  roadmaps: Roadmap[];
  setActiveTest: (test: { roadmapId: string; skillId: string } | null) => void;
  submitTest: (roadmapId: string, skillId: string, answers: number[]) => void;
}

// Test component
const TestComponent = ({
  activeTest,
  roadmaps,
  setActiveTest,
  submitTest,
}: TestComponentProps) => {
  const [answers, setAnswers] = useState<number[]>([]);

  // Move useEffect to the top level to comply with rules of hooks
  useEffect(() => {
    if (!activeTest) return;

    const roadmap = roadmaps.find((r) => r.id === activeTest.roadmapId);
    if (!roadmap) return;

    const skill = roadmap.skills.find((s) => s.id === activeTest.skillId);
    if (!skill || !skill.test) return;

    setAnswers(skill.test.questions.map((q) => q.userAnswer ?? -1));
  }, [activeTest, roadmaps]);

  if (!activeTest) return null;

  const roadmap = roadmaps.find((r) => r.id === activeTest.roadmapId);
  if (!roadmap) return null;

  const skill = roadmap.skills.find((s) => s.id === activeTest.skillId);
  if (!skill || !skill.test) return null;

  const handleAnswer = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const allAnswered = answers.every((a) => a !== -1);

  return (
    <div className="rounded-lg bg-stone-800/60 p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-medium text-green-400">
          {skill.test.title}
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="border-stone-600 text-stone-300"
          onClick={() => setActiveTest(null)}
        >
          Cancel
        </Button>
      </div>

      <p className="mb-6 text-stone-300">{skill.test.description}</p>

      <div className="space-y-8">
        {skill.test.questions.map((q, qIndex) => (
          <div key={q.id} className="rounded-lg bg-stone-700/50 p-4">
            <h4 className="mb-3 font-medium text-white">
              {qIndex + 1}. {q.question}
            </h4>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <div
                  key={oIndex}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md p-2',
                    answers[qIndex] === oIndex
                      ? 'border border-green-500/50 bg-green-500/20'
                      : 'hover:bg-stone-600/50',
                  )}
                  onClick={() => handleAnswer(qIndex, oIndex)}
                >
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border',
                      answers[qIndex] === oIndex
                        ? 'border-green-500 bg-green-500'
                        : 'border-stone-500',
                    )}
                  />
                  <span className="text-stone-200">{option}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          disabled={!allAnswered}
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={() =>
            submitTest(activeTest.roadmapId, activeTest.skillId, answers)
          }
        >
          Submit Answers
        </Button>
      </div>
    </div>
  );
};

export default function RoadmapModal({ isOpen, onClose }: RoadmapModalProps) {
  const [roadmaps, setRoadmaps] = useLocalStorageState<Roadmap[]>(
    [],
    'career-roadmaps',
  );
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);
  const [expandedSkill, setExpandedSkill] = useState<string | null>(null);
  const [activeTest, setActiveTest] = useState<{
    roadmapId: string;
    skillId: string;
  } | null>(null);
  const [tab, setTab] = useState<'current' | 'completed'>('current');
  const [isGenerating, _] = useState(false);
  const [selectedSkillForVisualization, setSelectedSkillForVisualization] =
    useState<{
      roadmapId: string;
      skill: RoadmapSkill;
    } | null>(null);
  const [showFullRoadmapVisualization, setShowFullRoadmapVisualization] =
    useState<string | null>(null);
  const router = useRouter();

  // Toggle task completion
  const toggleTask = (roadmapId: string, skillId: string, taskId: string) => {
    setRoadmaps((prevRoadmaps) =>
      prevRoadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedSkills = roadmap.skills.map((skill) => {
            if (skill.id === skillId) {
              const updatedTasks = skill.tasks.map((task) => {
                if (task.id === taskId) {
                  return { ...task, completed: !task.completed };
                }
                return task;
              });

              // Check if all tasks are completed
              const allTasksCompleted = updatedTasks.every(
                (task) => task.completed,
              );

              // Check if test is passed (if it exists)
              const testPassed =
                skill.test?.completed && (skill.test?.score ?? 0) > 80;

              // A skill is 100% complete only when all tasks are done AND test is passed (if exists)
              let skillProgress = 0;

              if (skill.test) {
                // If there's a test, tasks are 50% of progress and test is 50%
                const taskProgress =
                  (updatedTasks.filter((t) => t.completed).length /
                    updatedTasks.length) *
                  50;
                const testProgress = testPassed ? 50 : 0;
                skillProgress = Math.round(taskProgress + testProgress);
              } else {
                // If no test, tasks are 100% of progress
                skillProgress = Math.round(
                  (updatedTasks.filter((t) => t.completed).length /
                    updatedTasks.length) *
                    100,
                );
              }

              // If all tasks are done and test is passed (or no test), skill is 100% complete
              if (allTasksCompleted && (testPassed || !skill.test)) {
                skillProgress = 100;
              }

              return { ...skill, tasks: updatedTasks, progress: skillProgress };
            }
            return skill;
          });

          // Calculate overall roadmap progress based on skills progress
          const totalSkills = updatedSkills.length;
          const skillsProgressSum = updatedSkills.reduce(
            (sum, skill) => sum + skill.progress,
            0,
          );
          const roadmapProgress = Math.round(skillsProgressSum / totalSkills);

          return {
            ...roadmap,
            skills: updatedSkills,
            progress: roadmapProgress,
          };
        }
        return roadmap;
      }),
    );
  };

  // Submit test answers
  const submitTest = (
    roadmapId: string,
    skillId: string,
    answers: number[],
  ) => {
    setRoadmaps((prevRoadmaps) =>
      prevRoadmaps.map((roadmap) => {
        if (roadmap.id === roadmapId) {
          const updatedSkills = roadmap.skills.map((skill) => {
            if (skill.id === skillId && skill.test) {
              // Calculate score
              const correctCount = skill.test.questions.reduce(
                (acc, q, index) => {
                  return acc + (q.correctAnswer === answers[index] ? 1 : 0);
                },
                0,
              );
              const score = Math.round(
                (correctCount / skill.test.questions.length) * 100,
              );

              // Update questions with user answers
              const updatedQuestions = skill.test.questions.map((q, index) => ({
                ...q,
                userAnswer: answers[index],
              }));

              const updatedTest = {
                ...skill.test,
                completed: true,
                score,
                questions: updatedQuestions,
              };

              // Check if all tasks are completed
              const allTasksCompleted = skill.tasks.every(
                (task) => task.completed,
              );

              // Check if test is passed
              const testPassed = score > 80;

              // Calculate skill progress
              let skillProgress = 0;

              // Tasks are 50% of progress and test is 50%
              const taskProgress =
                (skill.tasks.filter((t) => t.completed).length /
                  skill.tasks.length) *
                50;
              const testProgress = testPassed ? 50 : 0;
              skillProgress = Math.round(taskProgress + testProgress);

              // If all tasks are done and test is passed, skill is 100% complete
              if (allTasksCompleted && testPassed) {
                skillProgress = 100;
              }

              return {
                ...skill,
                test: updatedTest,
                progress: skillProgress,
              };
            }
            return skill;
          });

          // Calculate overall roadmap progress based on skills progress
          const totalSkills = updatedSkills.length;
          const skillsProgressSum = updatedSkills.reduce(
            (sum, skill) => sum + skill.progress,
            0,
          );
          const roadmapProgress = Math.round(skillsProgressSum / totalSkills);

          return {
            ...roadmap,
            skills: updatedSkills,
            progress: roadmapProgress,
          };
        }
        return roadmap;
      }),
    );

    setActiveTest(null);
  };

  // Start a test
  const startTest = (roadmapId: string, skillId: string) => {
    setActiveTest({ roadmapId, skillId });
  };

  // Filter roadmaps based on tab
  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    if (tab === 'completed') {
      return roadmap.progress === 100;
    }
    return roadmap.progress < 100;
  });

  // Function to show skill visualization
  const showSkillVisualization = (roadmapId: string, skill: RoadmapSkill) => {
    setSelectedSkillForVisualization({ roadmapId, skill });
  };

  // Function to close skill visualization
  const closeSkillVisualization = () => {
    setSelectedSkillForVisualization(null);
  };

  // Function to get the current roadmap
  const getCurrentRoadmap = () => {
    if (!showFullRoadmapVisualization) return null;
    return roadmaps.find((r) => r.id === showFullRoadmapVisualization);
  };

  // Function to create a combined skill object for mind map visualization
  const getCombinedSkillForMindMap = () => {
    const roadmap = getCurrentRoadmap();
    if (!roadmap) return null;

    // Create a combined skill object that includes all tasks from all skills
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
      description: `Learning path for ${roadmap.jobTitle}`,
      tasks: allTasks,
      progress: roadmap.progress,
      skills: roadmap.skills.map((skill, index) => ({
        ...skill,
        order: index + 1, // Add order property for sequential display
      })),
    };
  };

  // Function to toggle task from the mind map
  const toggleTaskFromMindMap = (taskId: string) => {
    const task = getCurrentRoadmap()
      ?.skills.flatMap((s) => s.tasks)
      .find((t) => t.id === taskId);
    if (task && showFullRoadmapVisualization) {
      const skillId = getCurrentRoadmap()?.skills.find((s) =>
        s.tasks.some((t) => t.id === taskId),
      )?.id;
      if (skillId) {
        toggleTask(showFullRoadmapVisualization, skillId, taskId);
      }
    }
  };

  // Function to toggle task from the skill visualization
  const toggleTaskFromSkillVisualization = (
    roadmapId: string,
    skillId: string,
    taskId: string,
  ) => {
    toggleTask(roadmapId, skillId, taskId);
  };

  return (
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
              Were creating a personalized learning roadmap based on your CV and
              the job requirements. This may take a moment...
            </p>
          </div>
        </div>
      ) : activeTest ? (
        <TestComponent
          activeTest={activeTest}
          roadmaps={roadmaps}
          setActiveTest={setActiveTest}
          submitTest={submitTest}
        />
      ) : (
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
                    tab === 'completed'
                      ? 'bg-stone-700 text-white'
                      : 'text-stone-400 hover:text-white',
                  )}
                  onClick={() => setTab('completed')}
                >
                  Completed
                </button>
              </div>
            </div>

            {filteredRoadmaps.length === 0 ? (
              <div className="rounded-lg bg-stone-800/60 p-6 text-center">
                <p className="text-stone-300">
                  No roadmaps found in this category.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {filteredRoadmaps.map((roadmap) => (
                  <div
                    key={roadmap.id}
                    className="overflow-hidden rounded-lg bg-stone-800/60 transition-all duration-300"
                  >
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
                                className="border-blue-500 bg-blue-500/20 text-blue-300"
                              >
                                CV: {roadmap.cvName}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-purple-500 bg-purple-500/20 text-purple-300"
                              >
                                Job: {roadmap.jobTitle}
                              </Badge>
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
                              <BarChart size={14} className="text-green-400" />
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

                    {expandedRoadmap === roadmap.id && (
                      <div className="px-4 pb-4">
                        <p className="mt-2 mb-6 border-l-2 border-stone-700 pl-4 text-sm text-stone-300">
                          {roadmap.description}
                        </p>

                        <Progress
                          value={roadmap.progress}
                          className="mb-6 h-2"
                        />

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
                                    {skill.title}
                                  </h4>
                                  <span className="text-xs text-stone-400">
                                    ({skill.progress}%)
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 w-7 rounded-full p-0 text-green-400 hover:bg-green-500/20"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      showSkillVisualization(roadmap.id, skill);
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

                              {expandedSkill === skill.id && (
                                <div className="p-3">
                                  <p className="mb-4 text-sm text-stone-300">
                                    {skill.description}
                                  </p>

                                  <div className="mb-4 space-y-2">
                                    <h5 className="flex items-center gap-1.5 text-sm font-medium text-stone-200">
                                      <PenTool className="h-3.5 w-3.5" />
                                      Tasks
                                    </h5>
                                    {skill.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        className="flex items-start gap-2"
                                      >
                                        <Checkbox
                                          id={task.id}
                                          checked={task.completed}
                                          onCheckedChange={() =>
                                            toggleTask(
                                              roadmap.id,
                                              skill.id,
                                              task.id,
                                            )
                                          }
                                          className="mt-1"
                                        />
                                        <label
                                          htmlFor={task.id}
                                          className={cn(
                                            'text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                                            task.completed
                                              ? 'text-gray-400 line-through'
                                              : 'text-gray-200',
                                          )}
                                        >
                                          {task.title}
                                        </label>
                                      </div>
                                    ))}
                                  </div>

                                  {skill.test && (
                                    <div className="mt-4 rounded-lg bg-stone-800/80 p-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                          <FileText className="h-4 w-4 text-yellow-400" />
                                          <h5 className="text-sm font-medium text-yellow-400">
                                            Knowledge Assessment
                                          </h5>
                                        </div>

                                        {skill.test.completed ? (
                                          <Badge className="bg-green-500/20 text-green-300">
                                            Score: {skill.test.score}%
                                          </Badge>
                                        ) : (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-7 border-yellow-500/30 text-xs text-yellow-400 hover:bg-yellow-500/20"
                                            onClick={() =>
                                              startTest(roadmap.id, skill.id)
                                            }
                                            disabled={skill.tasks.some(
                                              (t) => !t.completed,
                                            )}
                                          >
                                            Take Test
                                          </Button>
                                        )}
                                      </div>

                                      {skill.test.completed && (
                                        <div className="mt-2 text-xs text-stone-300">
                                          {skill.test.score &&
                                          skill.test.score >= 70 ? (
                                            <div className="flex items-center gap-1 text-green-400">
                                              <CheckCircle2 className="h-3 w-3" />
                                              <span>Passed successfully</span>
                                            </div>
                                          ) : (
                                            <div className="flex items-center gap-1 text-yellow-400">
                                              <Circle className="h-3 w-3" />
                                              <span>Needs improvement</span>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 rounded-lg border border-green-600/30 bg-stone-800/60 p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-400" />
                <h3 className="font-medium text-green-400">
                  Generate New Career Roadmap
                </h3>
              </div>
              <p className="mt-2 text-sm text-stone-300">
                Create a personalized career roadmap based on your CV and target
                job position. Our AI will suggest the optimal learning path for
                you.
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
      {selectedSkillForVisualization && (
        <MindMapVisualization
          skill={selectedSkillForVisualization.skill}
          onClose={closeSkillVisualization}
          onToggleTask={(taskId) =>
            toggleTaskFromSkillVisualization(
              selectedSkillForVisualization.roadmapId,
              selectedSkillForVisualization.skill.id,
              taskId,
            )
          }
        />
      )}
      {showFullRoadmapVisualization && getCombinedSkillForMindMap() && (
        <MindMapVisualization
          skill={getCombinedSkillForMindMap() as RoadmapSkill}
          onClose={() => setShowFullRoadmapVisualization(null)}
          onToggleTask={toggleTaskFromMindMap}
        />
      )}
    </Modal>
  );
}
