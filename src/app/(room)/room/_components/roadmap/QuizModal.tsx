'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  ChevronRight,
  ChevronLeft,
  Brain,
  Trophy,
  Target,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FlaskConical,
  RefreshCw,
  BookOpen,
  Sparkles,
  TrendingUp,
  History,
  Award,
  Zap,
  Send,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { quizService } from '@/services/api/quiz/quiz-api';
import { Quiz, QuizAttempt } from '@/types/Quiz';
import QuizAttemptDetailModal from './QuizAttemptDetailModal';
import { useAiPoints } from '@/services/state/userSlice';
import { useRouter } from 'next/navigation';
import { AiLimitModal } from '@/components/AiLimitModal';
import { useUserActions } from '@/services/state/userSlice';
import { userService } from '@/services/api/auth/user-api';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: string;
  roadmapTitle: string;
}

type QuizView =
  | 'intro'
  | 'history'
  | 'loading'
  | 'generating'
  | 'quiz'
  | 'result';

export default function QuizModal({
  isOpen,
  onClose,
  roadmapId,
  roadmapTitle,
}: QuizModalProps) {
  const [view, setView] = useState<QuizView>('loading');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(
    null,
  );
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [existingQuiz, setExistingQuiz] = useState<Quiz | null>(null);
  const [canRetake, setCanRetake] = useState(true);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [bestScore, setBestScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [selectedAttemptDetail, setSelectedAttemptDetail] =
    useState<QuizAttempt | null>(null);
  const [_, setIsLoading] = useState(false);

  // Thêm state cho AI limit
  const [showLimitModal, setShowLimitModal] = useState(false);
  const points = useAiPoints();
  const router = useRouter();
  const { decrementAiPoints, updateAiPoints } = useUserActions();

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string[]>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Prevent closing during quiz
  const canCloseModal =
    view !== 'quiz' && view !== 'generating' && !isSubmitting;

  // Handle modal close with confirmation if in quiz
  const handleClose = useCallback(() => {
    if (!canCloseModal) {
      const confirmClose = window.confirm(
        'Are you sure you want to exit? Your progress will be lost.',
      );
      if (!confirmClose) return;
    }
    onClose();
  }, [canCloseModal, onClose]);

  // Handle upgrade action cho AI limit modal
  const handleUpgrade = () => {
    router.push('/pricing'); // Điều chỉnh theo route của bạn
    setShowLimitModal(false);
    onClose(); // Đóng cả quiz modal
  };

  // Load quiz data when modal opens
  const loadQuizData = useCallback(async () => {
    if (!isOpen) return;

    setIsLoading(true);
    try {
      const data = await quizService.getQuizByRoadmap(roadmapId);

      if (data) {
        setExistingQuiz(data.quiz);
        setAttempts(data.attempts || []);
        setCanRetake(data.canRetake);
        setRemainingAttempts(data.remainingAttempts || 0);
        setBestScore(data.bestScore || 0);
        setPassed(data.passed || false);

        // Show history if has attempts
        if (data.attempts && data.attempts.length > 0) {
          setView('history');
        } else {
          setView('intro');
        }
      } else {
        setView('intro');
      }
    } catch (error) {
      console.error('Error loading quiz data:', error);
      setView('intro');
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, roadmapId]);

  useEffect(() => {
    if (isOpen && roadmapId) {
      loadQuizData();
    }
  }, [isOpen, roadmapId, loadQuizData]);

  // Submit all answers at once
  const handleSubmitQuiz = useCallback(async () => {
    if (!currentAttempt || !quiz) return;

    // Check if user answered all questions
    const unansweredCount = quiz.questions.filter(
      (q) => !selectedAnswers[q.id] || selectedAnswers[q.id].length === 0,
    ).length;

    if (unansweredCount > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unansweredCount} unanswered questions. Are you sure you want to submit?`,
      );
      if (!confirmSubmit) return;
    }

    try {
      setIsSubmitting(true);

      // Prepare answers array
      const answersToSubmit = quiz.questions.map((question) => ({
        questionId: question.id,
        selectedAnswers: selectedAnswers[question.id] || [],
      }));

      // Submit all answers
      const result = await quizService.submitAllAnswers(
        currentAttempt.id,
        answersToSubmit,
      );

      setCurrentAttempt(result);

      // Update attempts list
      setAttempts([result, ...attempts]);

      // Update stats
      if (result.percentage && result.percentage > bestScore) {
        setBestScore(result.percentage);
      }
      if (result.passed) {
        setPassed(true);
      }

      setView('result');

      if (result.percentage === 100) {
        toast.success('Perfect score! Outstanding! 🏆');
      } else if (result.passed) {
        toast.success('Congratulations! You passed! 🎉');
      } else {
        toast('Keep practicing! You can do better next time.');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  }, [currentAttempt, quiz, selectedAnswers, attempts, bestScore]);

  // Timer effect
  useEffect(() => {
    if (view === 'quiz' && startTime && quiz) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
        const remaining = Math.max(0, quiz.timeLimit * 60 - elapsed);
        setTimeRemaining(remaining);

        if (remaining === 0) {
          handleSubmitQuiz();
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [view, startTime, quiz, handleSubmitQuiz]);

  // Generate new quiz or retry existing
  const handleStartQuiz = async (forceNew: boolean = false) => {
    try {
      // KIỂM TRA AI POINTS KHI TẠO QUIZ MỚI
      if (forceNew && points <= 0) {
        setShowLimitModal(true);
        return;
      }

      setView('generating');

      console.log(
        forceNew ? '🤖 Generating NEW quiz...' : '🔄 Getting quiz for retry...',
      );

      const newQuiz = await quizService.generateQuiz(
        roadmapId,
        forceNew ? `New Test: ${roadmapTitle}` : undefined,
        forceNew ? `AI-generated practice test for ${roadmapTitle}` : undefined,
        forceNew,
      );

      // Optimistically decrement AI points only when generating a NEW quiz
      if (forceNew) {
        decrementAiPoints();
        try {
          const refreshed = await userService.getAiPoints();
          if (typeof refreshed?.point === 'number') {
            updateAiPoints(refreshed.point);
          }
        } catch {}
      }

      setQuiz(newQuiz);

      // Start quiz attempt
      console.log('📝 Starting quiz attempt...');
      const attempt = await quizService.startQuizAttempt(newQuiz.id);
      setCurrentAttempt(attempt);

      // Reset quiz state
      setStartTime(new Date());
      setTimeRemaining(newQuiz.timeLimit * 60);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});

      setView('quiz');

      if (newQuiz.isRetry) {
        toast.success(`Starting attempt ${attempt.attemptNumber || 1}/3`);
      } else {
        toast.success('New quiz generated!');
      }
    } catch (error) {
      console.error('Error starting quiz:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('maximum number of attempts')) {
        toast.error('You have reached the maximum number of attempts (3)');
        setView('history');
      } else {
        toast.error('Failed to start quiz. Please try again.');
        setView('intro');
      }
    }
  };

  const handleAnswerSelect = (
    questionId: string,
    answerId: string,
    isMultiple: boolean,
  ) => {
    if (isMultiple) {
      const current = selectedAnswers[questionId] || [];
      const updated = current.includes(answerId)
        ? current.filter((id) => id !== answerId)
        : [...current, answerId];

      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: updated,
      });
    } else {
      setSelectedAnswers({
        ...selectedAnswers,
        [questionId]: [answerId],
      });
    }
  };

  const handleNextQuestion = () => {
    if (!quiz) return;

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = quiz?.questions[currentQuestionIndex];
  const answeredCount = quiz
    ? quiz.questions.filter(
        (q) => selectedAnswers[q.id] && selectedAnswers[q.id].length > 0,
      ).length
    : 0;
  const progress = quiz ? (answeredCount / quiz.questions.length) * 100 : 0;
  const isLastQuestion = quiz
    ? currentQuestionIndex === quiz.questions.length - 1
    : false;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={canCloseModal ? handleClose : undefined}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-10 w-full max-w-4xl"
          >
            <div className="overflow-hidden rounded-xl border border-green-500/20 bg-stone-900 shadow-2xl">
              {/* Header */}
              <div className="border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-500/20 p-2">
                      <Brain className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        AI Practice Test
                      </h2>
                      <p className="mt-0.5 text-sm text-stone-400">
                        {roadmapTitle}
                      </p>
                    </div>
                  </div>
                  {canCloseModal ? (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleClose}
                      className="text-stone-400 hover:text-white"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  ) : (
                    <div className="text-xs text-orange-400">
                      Quiz in progress
                    </div>
                  )}
                </div>

                {/* Quiz Progress Bar */}
                {view === 'quiz' && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-400">
                        Question {currentQuestionIndex + 1} of{' '}
                        {quiz?.questions.length}
                      </span>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="outline"
                          className={cn(
                            'border-orange-500 text-orange-400',
                            timeRemaining < 300 &&
                              'animate-pulse border-red-500 text-red-400',
                          )}
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          {formatTime(timeRemaining)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-green-500 text-green-400"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          {answeredCount}/{quiz?.questions.length} Answered
                        </Badge>
                        {currentAttempt && (
                          <Badge
                            variant="outline"
                            className="border-blue-500 text-blue-400"
                          >
                            Attempt {currentAttempt.attemptNumber || 1}/3
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}
              </div>

              {/* Content */}
              <ScrollArea className="h-[600px]">
                <div className="p-6">
                  {/* Loading View */}
                  {view === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="mb-4 h-12 w-12 animate-spin text-green-500" />
                      <p className="text-stone-400">Loading quiz data...</p>
                    </div>
                  )}

                  {/* Generating View */}
                  {view === 'generating' && (
                    <div className="flex flex-col items-center justify-center py-16">
                      <div className="relative mb-6">
                        <div className="h-20 w-20 animate-spin rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                        <div className="absolute inset-2 flex items-center justify-center rounded-full bg-stone-900">
                          <Brain className="h-8 w-8 text-green-400" />
                        </div>
                      </div>
                      <h3 className="mb-2 text-xl font-medium text-white">
                        Preparing your quiz...
                      </h3>
                      <p className="max-w-md text-center text-stone-400">
                        {existingQuiz
                          ? 'Shuffling questions for your retry...'
                          : 'AI is generating 50 personalized questions based on your roadmap skills.'}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-sm text-green-400">
                        <Sparkles className="h-4 w-4 animate-pulse" />
                        <span>
                          {existingQuiz
                            ? 'Preparing retry attempt'
                            : 'Powered by GPT-4'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* History View */}
                  {view === 'history' && (
                    <div className="space-y-6">
                      <div className="text-center">
                        <h3 className="mb-2 text-2xl font-bold text-white">
                          Quiz History
                        </h3>
                        <p className="text-stone-400">
                          Your previous attempts for this roadmap
                        </p>
                      </div>

                      {/* Stats Summary */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-stone-800/50 p-4 text-center">
                          <Trophy className="mx-auto mb-2 h-8 w-8 text-yellow-400" />
                          <p className="text-sm text-stone-400">Best Score</p>
                          <p className="text-2xl font-bold text-white">
                            {bestScore.toFixed(0)}%
                          </p>
                        </div>
                        <div className="rounded-lg bg-stone-800/50 p-4 text-center">
                          <Target className="mx-auto mb-2 h-8 w-8 text-green-400" />
                          <p className="text-sm text-stone-400">
                            Attempts Used
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {
                              attempts.filter((a) => a.status === 'completed')
                                .length
                            }
                            /3
                          </p>
                        </div>
                        <div className="rounded-lg bg-stone-800/50 p-4 text-center">
                          <Award className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                          <p className="text-sm text-stone-400">Status</p>
                          <p className="text-lg font-bold">
                            {passed ? (
                              <span className="text-green-400">Passed</span>
                            ) : (
                              <span className="text-orange-400">
                                Not Passed
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Attempts List */}
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-stone-300">
                          Previous Attempts
                        </h4>
                        {attempts.map((attempt, index) => (
                          <div
                            key={attempt.id}
                            className="cursor-pointer rounded-lg border border-stone-700 bg-stone-800/30 p-4 transition-colors hover:bg-stone-800/40"
                            onClick={() => setSelectedAttemptDetail(attempt)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-white">
                                  Attempt #{attempt.attemptNumber || index + 1}
                                </p>
                                <p className="text-sm text-stone-400">
                                  {new Date(
                                    attempt.completedAt || attempt.startedAt,
                                  ).toLocaleDateString()}
                                </p>
                                {attempt.timeSpent && (
                                  <p className="mt-1 text-xs text-stone-500">
                                    Time: {Math.floor(attempt.timeSpent / 60)}m{' '}
                                    {attempt.timeSpent % 60}s
                                  </p>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right">
                                  <p
                                    className={cn(
                                      'text-2xl font-bold',
                                      (attempt.percentage || 0) >= 80
                                        ? 'text-green-400'
                                        : 'text-orange-400',
                                    )}
                                  >
                                    {(attempt.percentage || 0).toFixed(0)}%
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      attempt.passed
                                        ? 'border-green-500 text-green-400'
                                        : 'border-orange-500 text-orange-400',
                                    )}
                                  >
                                    {attempt.passed ? 'Passed' : 'Not Passed'}
                                  </Badge>
                                </div>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-stone-400 hover:text-white"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedAttemptDetail(attempt);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={handleClose}
                          className="min-w-[120px]"
                        >
                          Close
                        </Button>
                        {canRetake && remainingAttempts > 0 ? (
                          <Button
                            onClick={() => handleStartQuiz(false)}
                            className="min-w-[180px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          >
                            <RefreshCw className="mr-2 h-5 w-5" />
                            Retry Quiz ({remainingAttempts} left)
                          </Button>
                        ) : remainingAttempts === 0 && !passed ? (
                          <div className="text-center">
                            <p className="mb-2 text-sm text-red-400">
                              Maximum attempts reached (3/3)
                            </p>
                            <Button
                              onClick={() => handleStartQuiz(true)}
                              className="min-w-[180px] bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                            >
                              <Zap className="mr-2 h-5 w-5" />
                              Generate New Quiz
                            </Button>
                          </div>
                        ) : passed ? (
                          <div className="text-center">
                            <p className="text-sm text-green-400">
                              ✅ You have successfully passed this quiz!
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )}

                  {/* Intro View */}
                  {view === 'intro' && (
                    <div className="space-y-6">
                      <div className="py-8 text-center">
                        <div className="mb-6">
                          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-green-500/50 bg-gradient-to-r from-green-500/20 to-blue-500/20">
                            <FlaskConical className="h-10 w-10 text-green-400" />
                          </div>
                        </div>
                        <h3 className="mb-3 text-2xl font-bold text-white">
                          AI Practice Test
                        </h3>
                        <p className="mx-auto mb-8 max-w-2xl text-stone-300">
                          Generate a personalized 50-question test based on your
                          completed roadmap. You have up to 3 attempts to pass
                          with 80% or higher.
                        </p>

                        {/* Features */}
                        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                          <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4">
                            <Target className="mx-auto mb-2 h-6 w-6 text-green-400" />
                            <p className="text-sm text-stone-400">Questions</p>
                            <p className="text-lg font-bold text-white">
                              50 AI
                            </p>
                          </div>
                          <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4">
                            <Clock className="mx-auto mb-2 h-6 w-6 text-blue-400" />
                            <p className="text-sm text-stone-400">Time Limit</p>
                            <p className="text-lg font-bold text-white">
                              60 min
                            </p>
                          </div>
                          <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4">
                            <Trophy className="mx-auto mb-2 h-6 w-6 text-yellow-400" />
                            <p className="text-sm text-stone-400">Pass Score</p>
                            <p className="text-lg font-bold text-white">80%</p>
                          </div>
                          <div className="rounded-lg border border-stone-700 bg-stone-800/50 p-4">
                            <RefreshCw className="mx-auto mb-2 h-6 w-6 text-purple-400" />
                            <p className="text-sm text-stone-400">Attempts</p>
                            <p className="text-lg font-bold text-white">
                              3 Max
                            </p>
                          </div>
                        </div>

                        {/* AI Points Display */}
                        <div className="mb-6 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="flex items-center gap-2 text-sm font-medium text-blue-400">
                              <Sparkles className="h-4 w-4" />
                              AI Credits
                            </h4>
                            <Badge
                              variant="outline"
                              className={cn(
                                'border',
                                points > 0
                                  ? 'border-green-500 text-green-400'
                                  : 'border-red-500 text-red-400',
                              )}
                            >
                              {points} points remaining
                            </Badge>
                          </div>
                          {points <= 0 && (
                            <p className="mt-1 text-xs text-red-400">
                              ⚠️ You need AI credits to generate new quizzes
                            </p>
                          )}
                        </div>

                        {/* Tips */}
                        <div className="mb-6 rounded-lg border border-stone-700 bg-stone-800/30 p-4">
                          <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-300">
                            <BookOpen className="h-4 w-4" />
                            Quick Tips
                          </h4>
                          <ul className="space-y-1 text-sm text-stone-300">
                            <li>
                              • Answer all questions then submit at the end
                            </li>
                            <li>• You can navigate between questions freely</li>
                            <li>• You need 80% (40/50 correct) to pass</li>
                            <li>
                              • AI provides detailed feedback after submission
                            </li>
                            <li className="text-yellow-400">
                              • Retry attempts don&apos;t cost AI credits
                            </li>
                          </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4">
                          <Button
                            size="lg"
                            variant="outline"
                            onClick={handleClose}
                            className="min-w-[120px]"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="lg"
                            onClick={() => handleStartQuiz(true)}
                            className="min-w-[180px] bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                          >
                            <Sparkles className="mr-2 h-5 w-5" />
                            Generate & Start
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quiz View */}
                  {view === 'quiz' && quiz && currentQuestion && (
                    <div className="space-y-6">
                      {/* Question */}
                      <div className="rounded-lg border border-stone-700 bg-stone-800/30 p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <Badge
                            variant="outline"
                            className={cn(
                              'capitalize',
                              currentQuestion.difficulty === 'easy' &&
                                'border-green-500 text-green-400',
                              currentQuestion.difficulty === 'medium' &&
                                'border-yellow-500 text-yellow-400',
                              currentQuestion.difficulty === 'hard' &&
                                'border-red-500 text-red-400',
                            )}
                          >
                            {currentQuestion.difficulty}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-blue-500 text-blue-400"
                            >
                              {currentQuestion.points}{' '}
                              {currentQuestion.points === 1
                                ? 'point'
                                : 'points'}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="border-purple-500 text-purple-400"
                            >
                              {currentQuestion.topic}
                            </Badge>
                          </div>
                        </div>

                        <h3 className="text-lg font-medium text-white">
                          {currentQuestion.question}
                        </h3>

                        {currentQuestion.type === 'multiple-choice' && (
                          <p className="mt-2 text-sm text-yellow-400">
                            ⚠️ Multiple answers may be correct
                          </p>
                        )}
                      </div>

                      {/* Answers */}
                      <div className="space-y-3">
                        {currentQuestion.answers.map((answer) => {
                          const isSelected = selectedAnswers[
                            currentQuestion.id
                          ]?.includes(answer.id);
                          const isMultiple =
                            currentQuestion.type === 'multiple-choice';

                          return (
                            <button
                              key={answer.id}
                              onClick={() =>
                                handleAnswerSelect(
                                  currentQuestion.id,
                                  answer.id,
                                  isMultiple,
                                )
                              }
                              className={cn(
                                'w-full rounded-lg border p-4 text-left transition-all',
                                'hover:border-green-500/50 hover:bg-stone-800/50',
                                isSelected &&
                                  'border-green-500 bg-green-500/10',
                                !isSelected &&
                                  'border-stone-700 bg-stone-800/30',
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border-2',
                                    isMultiple ? 'rounded' : 'rounded-full',
                                    isSelected &&
                                      'border-green-500 bg-green-500',
                                    !isSelected && 'border-stone-500',
                                  )}
                                >
                                  {isSelected && (
                                    <CheckCircle2 className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <span className="text-stone-200">
                                  {answer.text}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Navigation */}
                      <div className="flex items-center justify-between border-t border-stone-700 pt-4">
                        <Button
                          variant="outline"
                          onClick={handlePreviousQuestion}
                          disabled={isFirstQuestion}
                        >
                          <ChevronLeft className="mr-1 h-4 w-4" />
                          Previous
                        </Button>

                        <div className="flex items-center gap-2">
                          {(() => {
                            const totalQuestions = quiz.questions.length;
                            const maxButtons = Math.min(7, totalQuestions);

                            let startIndex = Math.max(
                              0,
                              currentQuestionIndex - 3,
                            );
                            const endIndex = Math.min(
                              totalQuestions - 1,
                              startIndex + maxButtons - 1,
                            );

                            if (endIndex === totalQuestions - 1) {
                              startIndex = Math.max(
                                0,
                                endIndex - maxButtons + 1,
                              );
                            }

                            const buttons = [];

                            // Show first question if not in range
                            if (startIndex > 0) {
                              buttons.push(
                                <button
                                  key="q-btn-0"
                                  onClick={() => handleJumpToQuestion(0)}
                                  className={cn(
                                    'h-8 w-8 rounded-full text-sm font-medium transition-all',
                                    selectedAnswers[quiz.questions[0].id]
                                      ?.length > 0
                                      ? 'border border-green-500 bg-green-500/20 text-green-400'
                                      : 'border border-stone-600 bg-stone-800 text-stone-400 hover:border-green-500',
                                  )}
                                >
                                  1
                                </button>,
                              );
                              if (startIndex > 1) {
                                buttons.push(
                                  <span
                                    key="dots-start"
                                    className="text-stone-500"
                                  >
                                    ...
                                  </span>,
                                );
                              }
                            }

                            // Main buttons
                            for (
                              let index = startIndex;
                              index <= endIndex;
                              index++
                            ) {
                              const question = quiz.questions[index];
                              const isActive = index === currentQuestionIndex;
                              const isAnswered =
                                selectedAnswers[question.id]?.length > 0;

                              buttons.push(
                                <button
                                  key={`q-btn-${index}`}
                                  onClick={() => handleJumpToQuestion(index)}
                                  className={cn(
                                    'h-8 w-8 rounded-full text-sm font-medium transition-all',
                                    isActive && 'bg-green-500 text-white',
                                    !isActive &&
                                      isAnswered &&
                                      'border border-green-500 bg-green-500/20 text-green-400',
                                    !isActive &&
                                      !isAnswered &&
                                      'border border-stone-600 bg-stone-800 text-stone-400 hover:border-green-500',
                                  )}
                                >
                                  {index + 1}
                                </button>,
                              );
                            }

                            // Show last question if not in range
                            if (endIndex < totalQuestions - 1) {
                              if (endIndex < totalQuestions - 2) {
                                buttons.push(
                                  <span
                                    key="dots-end"
                                    className="text-stone-500"
                                  >
                                    ...
                                  </span>,
                                );
                              }
                              buttons.push(
                                <button
                                  key={`q-btn-${totalQuestions - 1}`}
                                  onClick={() =>
                                    handleJumpToQuestion(totalQuestions - 1)
                                  }
                                  className={cn(
                                    'h-8 w-8 rounded-full text-sm font-medium transition-all',
                                    selectedAnswers[
                                      quiz.questions[totalQuestions - 1].id
                                    ]?.length > 0
                                      ? 'border border-green-500 bg-green-500/20 text-green-400'
                                      : 'border border-stone-600 bg-stone-800 text-stone-400 hover:border-green-500',
                                  )}
                                >
                                  {totalQuestions}
                                </button>,
                              );
                            }

                            return buttons;
                          })()}
                        </div>

                        <div className="flex gap-2">
                          {!isLastQuestion ? (
                            <Button
                              onClick={handleNextQuestion}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Next Question
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              onClick={handleNextQuestion}
                              variant="outline"
                              disabled
                            >
                              Last Question
                            </Button>
                          )}

                          <Button
                            onClick={handleSubmitQuiz}
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            {isSubmitting ? (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="mr-1 h-4 w-4" />
                            )}
                            Submit Quiz
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Result View */}
                  {view === 'result' && currentAttempt && (
                    <div className="space-y-6">
                      {/* Score Card */}
                      <div className="py-8 text-center">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', duration: 0.5 }}
                          className={cn(
                            'mb-4 inline-flex h-32 w-32 items-center justify-center rounded-full',
                            'bg-gradient-to-br',
                            (currentAttempt.percentage || 0) >= 100
                              ? 'border-2 border-yellow-500 from-yellow-500/20 to-yellow-600/20'
                              : currentAttempt.passed
                                ? 'border-2 border-green-500 from-green-500/20 to-green-600/20'
                                : 'border-2 border-orange-500 from-orange-500/20 to-orange-600/20',
                          )}
                        >
                          <div className="text-center">
                            <p className="text-4xl font-bold text-white">
                              {currentAttempt.percentage?.toFixed(0) || 0}%
                            </p>
                            <p
                              className={cn(
                                'mt-1 text-sm font-medium',
                                (currentAttempt.percentage || 0) >= 100
                                  ? 'text-yellow-400'
                                  : currentAttempt.passed
                                    ? 'text-green-400'
                                    : 'text-orange-400',
                              )}
                            >
                              {(currentAttempt.percentage || 0) >= 100
                                ? 'PERFECT'
                                : currentAttempt.passed
                                  ? 'PASSED'
                                  : 'NOT PASSED'}
                            </p>
                          </div>
                        </motion.div>

                        <h3 className="mb-2 text-2xl font-bold text-white">
                          {(currentAttempt.percentage || 0) >= 100
                            ? '🏆 Perfect Score!'
                            : currentAttempt.passed
                              ? '🎉 Congratulations!'
                              : 'Keep Practicing!'}
                        </h3>
                        <p className="text-stone-400">
                          You scored {currentAttempt.score?.toFixed(0)} out of{' '}
                          {quiz?.questions.reduce(
                            (sum, q) => sum + q.points,
                            0,
                          )}{' '}
                          points
                        </p>
                        {currentAttempt.timeSpent && (
                          <p className="mt-1 text-sm text-stone-500">
                            Time taken:{' '}
                            {Math.floor(currentAttempt.timeSpent / 60)} minutes{' '}
                            {currentAttempt.timeSpent % 60} seconds
                          </p>
                        )}
                        <p className="mt-2 text-sm text-stone-400">
                          Attempt {currentAttempt.attemptNumber || 1} of 3
                        </p>
                      </div>

                      {/* Statistics */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                          <p className="text-sm text-stone-400">Correct</p>
                          <p className="text-xl font-bold text-green-400">
                            {currentAttempt.answers?.filter((a) => a.isCorrect)
                              .length || 0}
                          </p>
                        </div>
                        <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                          <p className="text-sm text-stone-400">Incorrect</p>
                          <p className="text-xl font-bold text-red-400">
                            {currentAttempt.answers?.filter((a) => !a.isCorrect)
                              .length || 0}
                          </p>
                        </div>
                        <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                          <p className="text-sm text-stone-400">Skipped</p>
                          <p className="text-xl font-bold text-yellow-400">
                            {(quiz?.questions.length || 0) -
                              (currentAttempt.answers?.length || 0)}
                          </p>
                        </div>
                      </div>

                      {/* AI Feedback */}
                      {currentAttempt.feedback && (
                        <div className="space-y-4">
                          {/* Topic Scores */}
                          {currentAttempt.feedback.topicScores &&
                            Object.keys(currentAttempt.feedback.topicScores)
                              .length > 0 && (
                              <div className="rounded-lg border border-stone-700 bg-stone-800/30 p-4">
                                <h4 className="mb-3 text-sm font-medium text-stone-300">
                                  Performance by Topic
                                </h4>
                                <div className="space-y-2">
                                  {Object.entries(
                                    currentAttempt.feedback.topicScores,
                                  ).map(([topic, scores]) => (
                                    <div
                                      key={topic}
                                      className="flex items-center justify-between"
                                    >
                                      <span className="text-sm text-stone-400">
                                        {topic}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        <Progress
                                          value={scores.percentage}
                                          className="h-2 w-24"
                                        />
                                        <span
                                          className={cn(
                                            'min-w-[40px] text-right text-sm font-medium',
                                            scores.percentage >= 90
                                              ? 'text-green-400'
                                              : scores.percentage >= 80
                                                ? 'text-yellow-400'
                                                : 'text-orange-400',
                                          )}
                                        >
                                          {scores.percentage}%
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                          {/* Strengths */}
                          {currentAttempt.feedback.strengths.length > 0 && (
                            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-green-400">
                                <TrendingUp className="h-4 w-4" />
                                Strengths
                              </h4>
                              <ul className="space-y-1">
                                {currentAttempt.feedback.strengths.map(
                                  (strength, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-stone-300"
                                    >
                                      <span className="mt-0.5 text-green-400">
                                        •
                                      </span>
                                      <span>{strength}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Weaknesses */}
                          {currentAttempt.feedback.weaknesses.length > 0 && (
                            <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-400">
                                <AlertCircle className="h-4 w-4" />
                                Areas for Improvement
                              </h4>
                              <ul className="space-y-1">
                                {currentAttempt.feedback.weaknesses.map(
                                  (weakness, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-stone-300"
                                    >
                                      <span className="mt-0.5 text-orange-400">
                                        •
                                      </span>
                                      <span>{weakness}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}

                          {/* Recommendations */}
                          {currentAttempt.feedback.recommendations.length >
                            0 && (
                            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                              <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
                                <Target className="h-4 w-4" />
                                Recommendations
                              </h4>
                              <ul className="space-y-1">
                                {currentAttempt.feedback.recommendations.map(
                                  (rec, i) => (
                                    <li
                                      key={i}
                                      className="flex items-start gap-2 text-sm text-stone-300"
                                    >
                                      <span className="mt-0.5 text-blue-400">
                                        •
                                      </span>
                                      <span>{rec}</span>
                                    </li>
                                  ),
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-center gap-4 pt-4">
                        <Button
                          size="lg"
                          variant="outline"
                          onClick={() => {
                            loadQuizData();
                          }}
                          className="min-w-[120px]"
                        >
                          <History className="mr-2 h-4 w-4" />
                          View History
                        </Button>
                        {!currentAttempt.passed &&
                          (currentAttempt.attemptNumber || 1) < 3 && (
                            <Button
                              size="lg"
                              onClick={() => handleStartQuiz(false)}
                              className="min-w-[150px] bg-green-600 hover:bg-green-700"
                            >
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Retry Quiz (
                              {3 - (currentAttempt.attemptNumber || 1)} left)
                            </Button>
                          )}
                        {(currentAttempt.attemptNumber || 1) >= 3 &&
                          !currentAttempt.passed && (
                            <div className="text-center">
                              <p className="mb-2 text-sm text-red-400">
                                Maximum attempts reached (3/3)
                              </p>
                              <Button
                                size="lg"
                                onClick={() => handleStartQuiz(true)}
                                className="min-w-[150px] bg-blue-600 hover:bg-blue-700"
                              >
                                <Zap className="mr-2 h-4 w-4" />
                                Generate New Quiz
                              </Button>
                            </div>
                          )}
                        {currentAttempt.passed && (
                          <div className="text-center">
                            <Badge className="border-green-500 bg-green-500/20 text-green-400">
                              ✅ Quiz Passed Successfully
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </AnimatePresence>

      {/* Attempt Detail Modal */}
      {selectedAttemptDetail && (
        <QuizAttemptDetailModal
          isOpen={true}
          onClose={() => setSelectedAttemptDetail(null)}
          attempt={selectedAttemptDetail}
          quizTitle={roadmapTitle}
        />
      )}

      {/* AI Limit Modal */}
      <AiLimitModal
        isOpen={showLimitModal}
        onClose={() => setShowLimitModal(false)}
        onUpgrade={handleUpgrade}
      />
    </>
  );
}
