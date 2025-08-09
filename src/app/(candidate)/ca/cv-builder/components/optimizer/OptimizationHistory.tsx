'use client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Clock,
  ArrowRight,
  FileText,
  Briefcase,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CvOptimizationHistoryItem } from '@/services/api/cv/cv-api';

interface OptimizationHistoryProps {
  history: CvOptimizationHistoryItem[];
  onRestore: (historyItem: CvOptimizationHistoryItem) => void;
  className?: string;
}

export default function OptimizationHistory({
  history,
  onRestore,
  className = '',
}: OptimizationHistoryProps) {
  if (!history || history.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center px-4 py-12 ${className}`}
      >
        <div className="mb-4 rounded-full bg-gray-100 p-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No History Yet
        </h3>
        <p className="max-w-sm text-center text-sm text-gray-500">
          Your optimization history will appear here after you run your first CV
          optimization.
        </p>
      </div>
    );
  }

  const getSuggestionCount = (
    suggestions: CvOptimizationHistoryItem['suggestions'],
  ) => {
    let count = 0;
    if (suggestions.summary) count++;
    if (suggestions.skills) count++;
    if (suggestions.experience && suggestions.experience.length > 0) count++;
    if (suggestions.education && suggestions.education.length > 0) count++;
    return count;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-purple-600" />
        <h2 className="text-lg font-semibold text-gray-900">
          Optimization History
        </h2>
        <Badge variant="secondary" className="ml-auto">
          {history.length}{' '}
          {history.length === 1 ? 'Optimization' : 'Optimizations'}
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((item) => {
            const suggestionCount = getSuggestionCount(item.suggestions);
            const date = new Date(item.createdAt);

            return (
              <Card
                key={item.id}
                className="cursor-pointer transition-all hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-gray-500" />
                        <h4 className="font-medium text-gray-900">
                          {item.jobTitle || 'Untitled Position'}
                        </h4>
                        {item.isApplied && (
                          <Badge
                            variant="secondary"
                            className="ml-2 bg-green-100 text-green-700"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Applied
                          </Badge>
                        )}
                      </div>

                      {item.jobDescription && (
                        <p className="line-clamp-2 text-sm text-gray-500">
                          {item.jobDescription}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(date, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(date, 'HH:mm')}
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {suggestionCount} suggestions
                        </div>
                      </div>

                      {/* Quick preview of suggestions */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.suggestions.summary && (
                          <Badge variant="outline" className="text-xs">
                            Summary
                          </Badge>
                        )}
                        {item.suggestions.skills && (
                          <Badge variant="outline" className="text-xs">
                            Skills ({item.suggestions.skills.suggestions.length}
                            )
                          </Badge>
                        )}
                        {item.suggestions.experience &&
                          item.suggestions.experience.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Experience ({item.suggestions.experience.length})
                            </Badge>
                          )}
                        {item.suggestions.education &&
                          item.suggestions.education.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              Education ({item.suggestions.education.length})
                            </Badge>
                          )}
                      </div>
                    </div>

                    <div className="ml-4">
                      <Button
                        size="sm"
                        variant={item.isApplied ? 'outline' : 'default'}
                        onClick={() => onRestore(item)}
                        disabled={item.isApplied}
                      >
                        {item.isApplied ? (
                          'Already Applied'
                        ) : (
                          <>
                            Restore
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
