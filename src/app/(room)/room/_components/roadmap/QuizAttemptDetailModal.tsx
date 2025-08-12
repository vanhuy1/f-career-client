'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { QuizAttempt } from '@/types/Quiz';

interface QuizAttemptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  attempt: QuizAttempt;
  quizTitle?: string;
}

export default function QuizAttemptDetailModal({
  isOpen,
  onClose,
  attempt,
  quizTitle,
}: QuizAttemptDetailModalProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [showOnlyIncorrect, setShowOnlyIncorrect] = useState(false);

  if (!isOpen || !attempt) return null;

  const correctCount = attempt.answers?.filter((a) => a.isCorrect).length || 0;
  const incorrectCount =
    attempt.answers?.filter((a) => !a.isCorrect).length || 0;
  // Removed unused totalQuestions variable

  const filteredAnswers = showOnlyIncorrect
    ? attempt.answers?.filter((a) => !a.isCorrect) || []
    : attempt.answers || [];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative z-10 w-full max-w-5xl"
        >
          <div className="overflow-hidden rounded-xl border border-green-500/20 bg-stone-900 shadow-2xl">
            {/* Header */}
            <div className="border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Attempt #{attempt.attemptNumber || 1} Details
                  </h2>
                  <p className="mt-0.5 text-sm text-stone-400">
                    {quizTitle} •{' '}
                    {new Date(
                      attempt.completedAt || attempt.startedAt,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onClose}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Score Summary */}
              <div className="mt-4 grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                  <Trophy className="mx-auto mb-1 h-6 w-6 text-yellow-400" />
                  <p className="text-xs text-stone-400">Score</p>
                  <p className="text-lg font-bold text-white">
                    {(attempt.percentage || 0).toFixed(0)}%
                  </p>
                </div>
                <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                  <CheckCircle2 className="mx-auto mb-1 h-6 w-6 text-green-400" />
                  <p className="text-xs text-stone-400">Correct</p>
                  <p className="text-lg font-bold text-green-400">
                    {correctCount}
                  </p>
                </div>
                <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                  <XCircle className="mx-auto mb-1 h-6 w-6 text-red-400" />
                  <p className="text-xs text-stone-400">Incorrect</p>
                  <p className="text-lg font-bold text-red-400">
                    {incorrectCount}
                  </p>
                </div>
                <div className="rounded-lg bg-stone-800/50 p-3 text-center">
                  <Clock className="mx-auto mb-1 h-6 w-6 text-blue-400" />
                  <p className="text-xs text-stone-400">Time</p>
                  <p className="text-lg font-bold text-white">
                    {attempt.timeSpent
                      ? `${Math.floor(attempt.timeSpent / 60)}m ${attempt.timeSpent % 60}s`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <ScrollArea className="h-[600px]">
              <div className="p-6">
                {/* Filter */}
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">
                    Questions Review
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOnlyIncorrect(!showOnlyIncorrect)}
                    className={cn(
                      'transition-colors',
                      showOnlyIncorrect &&
                        'border-red-500 bg-red-500/20 text-red-400',
                    )}
                  >
                    {showOnlyIncorrect ? 'Show All' : 'Show Incorrect Only'}
                  </Button>
                </div>

                {/* Topic Performance */}
                {attempt.feedback?.topicScores &&
                  Object.keys(attempt.feedback.topicScores).length > 0 && (
                    <div className="mb-6 rounded-lg border border-stone-700 bg-stone-800/30 p-4">
                      <h4 className="mb-3 text-sm font-medium text-stone-300">
                        Performance by Topic
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(attempt.feedback.topicScores).map(
                          ([topic, scores]) => (
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
                                  className="h-2 w-32"
                                />
                                <span
                                  className={cn(
                                    'min-w-[50px] text-right text-sm font-medium',
                                    scores.percentage >= 80
                                      ? 'text-green-400'
                                      : scores.percentage >= 60
                                        ? 'text-yellow-400'
                                        : 'text-red-400',
                                  )}
                                >
                                  {scores.correct}/{scores.total}
                                </span>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                {/* Questions List */}
                <div className="space-y-4">
                  {filteredAnswers.map((answer, index) => (
                    <div
                      key={answer.questionId}
                      className={cn(
                        'overflow-hidden rounded-lg border transition-all',
                        answer.isCorrect
                          ? 'border-green-500/30 bg-green-500/5'
                          : 'border-red-500/30 bg-red-500/5',
                      )}
                    >
                      {/* Question Header */}
                      <button
                        className="w-full p-4 text-left transition-colors hover:bg-stone-800/30"
                        onClick={() =>
                          setExpandedQuestion(
                            expandedQuestion === answer.questionId
                              ? null
                              : answer.questionId,
                          )
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="mb-2 flex items-center gap-2">
                              <span className="text-xs text-stone-500">
                                Q{index + 1}
                              </span>
                              {answer.isCorrect ? (
                                <CheckCircle2 className="h-4 w-4 text-green-400" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-400" />
                              )}
                              <Badge
                                variant="outline"
                                className={cn(
                                  'text-xs',
                                  answer.questionDifficulty === 'easy' &&
                                    'border-green-500 text-green-400',
                                  answer.questionDifficulty === 'medium' &&
                                    'border-yellow-500 text-yellow-400',
                                  answer.questionDifficulty === 'hard' &&
                                    'border-red-500 text-red-400',
                                )}
                              >
                                {answer.questionDifficulty}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="border-purple-500 text-xs text-purple-400"
                              >
                                {answer.questionTopic}
                              </Badge>
                              {answer.earnedPoints !== undefined && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'text-xs',
                                    answer.earnedPoints > 0
                                      ? 'border-green-500 text-green-400'
                                      : 'border-stone-500 text-stone-400',
                                  )}
                                >
                                  {answer.earnedPoints}/{answer.points} pts
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-white">
                              {answer.questionText || `Question ${index + 1}`}
                            </p>
                          </div>
                          <div className="ml-2">
                            {expandedQuestion === answer.questionId ? (
                              <ChevronUp className="h-4 w-4 text-stone-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-stone-400" />
                            )}
                          </div>
                        </div>
                      </button>

                      {/* Expanded Content */}
                      {expandedQuestion === answer.questionId && (
                        <div className="border-t border-stone-700 px-4 pb-4">
                          <div className="mt-4 space-y-3">
                            {/* Your Answer */}
                            <div>
                              <p className="mb-2 text-xs font-medium text-stone-400">
                                Your Answer:
                              </p>
                              {answer.selectedAnswerTexts &&
                              answer.selectedAnswerTexts.length > 0 ? (
                                <div className="space-y-1">
                                  {answer.selectedAnswerTexts.map((text, i) => (
                                    <div
                                      key={i}
                                      className={cn(
                                        'rounded p-2 text-sm',
                                        answer.isCorrect
                                          ? 'bg-green-500/10 text-green-300'
                                          : 'bg-red-500/10 text-red-300',
                                      )}
                                    >
                                      • {text}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-yellow-400">
                                  No answer selected
                                </p>
                              )}
                            </div>

                            {/* Correct Answer */}
                            {!answer.isCorrect && answer.correctAnswerTexts && (
                              <div>
                                <p className="mb-2 text-xs font-medium text-stone-400">
                                  Correct Answer:
                                </p>
                                <div className="space-y-1">
                                  {answer.correctAnswerTexts.map((text, i) => (
                                    <div
                                      key={i}
                                      className="rounded bg-green-500/10 p-2 text-sm text-green-300"
                                    >
                                      • {text}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Question Type */}
                            <div className="flex items-center gap-4 text-xs text-stone-500">
                              <span>Type: {answer.questionType}</span>
                              <span>Points: {answer.points}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* AI Feedback */}
                {attempt.feedback && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-white">
                      AI Feedback
                    </h3>

                    {/* Strengths */}
                    {attempt.feedback.strengths.length > 0 && (
                      <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-green-400">
                          <TrendingUp className="h-4 w-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {attempt.feedback.strengths.map((strength, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-stone-300"
                            >
                              <span className="mt-0.5 text-green-400">•</span>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {attempt.feedback.weaknesses.length > 0 && (
                      <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-orange-400">
                          <AlertCircle className="h-4 w-4" />
                          Areas for Improvement
                        </h4>
                        <ul className="space-y-1">
                          {attempt.feedback.weaknesses.map((weakness, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-stone-300"
                            >
                              <span className="mt-0.5 text-orange-400">•</span>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Recommendations */}
                    {attempt.feedback.recommendations.length > 0 && (
                      <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-400">
                          <Target className="h-4 w-4" />
                          Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {attempt.feedback.recommendations.map((rec, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-stone-300"
                            >
                              <span className="mt-0.5 text-blue-400">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="border-t border-stone-700 p-4">
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="min-w-[120px]"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
