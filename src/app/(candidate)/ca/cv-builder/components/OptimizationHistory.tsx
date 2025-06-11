'use client';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, ArrowRight, FileText, Briefcase, Calendar } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface CvSuggestion {
  summary?: {
    suggestion: string;
    reason: string;
  };
  skills?: {
    suggestions: string[];
    reason: string;
  };
  experience?: {
    index: number;
    field: string;
    suggestion: string;
    reason: string;
  }[];
  education?: {
    index: number;
    field: string;
    suggestion: string;
    reason: string;
  }[];
}

interface OptimizationHistoryItem {
  timestamp: string;
  suggestions: CvSuggestion;
  jobTitle?: string;
  jobDescription?: string;
}

interface OptimizationHistoryProps {
  history: OptimizationHistoryItem[];
  onRestore: (index: number) => void;
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

  const getSuggestionCount = (suggestions: CvSuggestion) => {
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
          {history.length === 1 ? 'optimization' : 'optimizations'}
        </Badge>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-4">
          {history.map((item, index) => (
            <Card
              key={index}
              className="group border-l-4 border-l-purple-500 transition-all duration-200 hover:border-l-purple-600 hover:shadow-md"
            >
              <CardContent className="overflow-hidden p-6">
                <div className="mb-4 flex w-full items-start justify-between">
                  <div className="max-w-[calc(100%-80px)] min-w-0 flex-1">
                    <div className="mb-2 flex max-w-full items-center gap-2">
                      <Briefcase className="h-4 w-4 flex-shrink-0 text-purple-600" />
                      <h3 className="max-w-[300px] truncate font-semibold text-gray-900">
                        {item.jobTitle || 'Untitled Position'}
                      </h3>
                    </div>

                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {format(
                          new Date(item.timestamp),
                          'MMM d, yyyy • h:mm a',
                        )}
                      </span>
                    </div>

                    {item.jobDescription && (
                      <div className="mb-4 max-w-full">
                        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
                          {item.jobDescription}
                        </p>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRestore(index)}
                    className="ml-4 flex-shrink-0 transition-colors group-hover:border-purple-200 group-hover:bg-purple-50 group-hover:text-purple-700"
                  >
                    <ArrowRight className="mr-1 h-3 w-3" />
                    Restore
                  </Button>
                </div>

                <div className="flex w-full items-center justify-between">
                  <div className="flex max-w-[70%] flex-wrap gap-2">
                    {item.suggestions.summary && (
                      <Badge
                        variant="outline"
                        className="max-w-[150px] truncate border-purple-200 bg-purple-50 text-xs text-purple-700"
                      >
                        <FileText className="mr-1 h-3 w-3 flex-shrink-0" />
                        <span className="truncate">Summary</span>
                      </Badge>
                    )}
                    {item.suggestions.skills && (
                      <Badge
                        variant="outline"
                        className="max-w-[150px] truncate border-blue-200 bg-blue-50 text-xs text-blue-700"
                      >
                        <span className="truncate">Skills</span>
                      </Badge>
                    )}
                    {item.suggestions.experience &&
                      item.suggestions.experience.length > 0 && (
                        <Badge
                          variant="outline"
                          className="max-w-[150px] truncate border-green-200 bg-green-50 text-xs text-green-700"
                        >
                          <span className="truncate">
                            Experience ({item.suggestions.experience.length})
                          </span>
                        </Badge>
                      )}
                    {item.suggestions.education &&
                      item.suggestions.education.length > 0 && (
                        <Badge
                          variant="outline"
                          className="max-w-[150px] truncate border-amber-200 bg-amber-50 text-xs text-amber-700"
                        >
                          <span className="truncate">
                            Education ({item.suggestions.education.length})
                          </span>
                        </Badge>
                      )}
                  </div>

                  <div className="ml-4 flex-shrink-0 text-xs text-gray-400">
                    {getSuggestionCount(item.suggestions)} suggestions
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
