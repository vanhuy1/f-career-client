'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Trophy,
  // Removed unused Target import
  Award,
  History,
  Clock,
  TrendingUp,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { quizService } from '@/services/api/quiz/quiz-api';
import { QuizAttempt } from '@/types/Quiz';

interface QuizHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
  roadmapTitle: string;
  onRetry?: () => void;
}

export default function QuizHistoryModal({
  isOpen,
  onClose,
  quizId,
  roadmapTitle,
  onRetry,
}: QuizHistoryModalProps) {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bestScore, setBestScore] = useState(0);
  const [averageScore, setAverageScore] = useState(0);
  const [passed, setPassed] = useState(false);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const history = await quizService.getQuizHistory(quizId);
      setAttempts(history);

      // Calculate stats
      if (history.length > 0) {
        const scores = history.map((a) => a.percentage || 0);
        setBestScore(Math.max(...scores));
        setAverageScore(scores.reduce((sum, s) => sum + s, 0) / scores.length);
        setPassed(history.some((a) => a.passed));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    if (isOpen && quizId) {
      loadHistory();
    }
  }, [isOpen, quizId, loadHistory]);

  if (!isOpen) return null;

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
          className="relative z-10 w-full max-w-3xl"
        >
          <div className="overflow-hidden rounded-xl border border-green-500/20 bg-stone-900 shadow-2xl">
            {/* Header */}
            <div className="border-b border-green-500/20 bg-gradient-to-r from-green-500/10 to-blue-500/10 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-green-500/20 p-2">
                    <History className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      Quiz History
                    </h2>
                    <p className="mt-0.5 text-sm text-stone-400">
                      {roadmapTitle}
                    </p>
                  </div>
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
            </div>

            {/* Content */}
            <ScrollArea className="h-[500px]">
              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-700 border-t-green-500" />
                  </div>
                ) : (
                  <div className="space-y-6">
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
                        <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                        <p className="text-sm text-stone-400">Average</p>
                        <p className="text-2xl font-bold text-white">
                          {averageScore.toFixed(0)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-stone-800/50 p-4 text-center">
                        <Award className="mx-auto mb-2 h-8 w-8 text-green-400" />
                        <p className="text-sm text-stone-400">Status</p>
                        <p className="text-lg font-bold">
                          {passed ? (
                            <span className="text-green-400">Passed</span>
                          ) : (
                            <span className="text-orange-400">Not Passed</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Attempts List */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-stone-300">
                        All Attempts
                      </h4>
                      {attempts.map((attempt, index) => (
                        <div
                          key={attempt.id}
                          className="rounded-lg border border-stone-700 bg-stone-800/30 p-4"
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
                                  <Clock className="mr-1 inline h-3 w-3" />
                                  {Math.floor(attempt.timeSpent / 60)}m{' '}
                                  {attempt.timeSpent % 60}s
                                </p>
                              )}
                            </div>
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
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 pt-4">
                      <Button
                        variant="outline"
                        onClick={onClose}
                        className="min-w-[120px]"
                      >
                        Close
                      </Button>
                      {onRetry && attempts.length < 3 && (
                        <Button
                          onClick={onRetry}
                          className="min-w-[150px] bg-green-600 hover:bg-green-700"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Retry Quiz
                        </Button>
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
  );
}
