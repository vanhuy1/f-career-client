'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  BarChart3,
  FileText,
  RefreshCw,
} from 'lucide-react';

type AIStatus =
  | 'PENDING'
  | 'PENDING_SCORE'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

interface AIAnalysisData {
  id: string;
  status: AIStatus;
  score?: number;
  analysis?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data - replace with your actual data fetching
const mockData: AIAnalysisData = {
  id: '12345',
  status: 'COMPLETED',
  score: 85,
  analysis:
    'The analysis shows strong performance across multiple metrics. The content demonstrates high quality with excellent structure and clarity. Key strengths include comprehensive coverage of topics, logical flow, and engaging presentation. Areas for improvement include minor optimization opportunities in technical implementation and potential for enhanced user interaction elements.',
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:45:00Z',
};

const getStatusConfig = (status: AIStatus) => {
  switch (status) {
    case 'PENDING':
      return {
        label: 'Pending',
        variant: 'secondary' as const,
        icon: Clock,
        color: 'text-gray-500',
        description: 'Analysis request is queued',
      };
    case 'PENDING_SCORE':
      return {
        label: 'Pending Score',
        variant: 'secondary' as const,
        icon: BarChart3,
        color: 'text-blue-500',
        description: 'Analysis complete, calculating score',
      };
    case 'PROCESSING':
      return {
        label: 'Processing',
        variant: 'default' as const,
        icon: Loader2,
        color: 'text-blue-500',
        description: 'AI analysis in progress',
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        variant: 'default' as const,
        icon: CheckCircle,
        color: 'text-green-500',
        description: 'Analysis completed successfully',
      };
    case 'FAILED':
      return {
        label: 'Failed',
        variant: 'destructive' as const,
        icon: XCircle,
        color: 'text-red-500',
        description: 'Analysis failed to complete',
      };
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreLabel = (score: number) => {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 60) return 'Needs Improvement';
  return 'Poor';
};

export default function AiAnalysisPage() {
  const [data] = useState<AIAnalysisData>(mockData);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const statusConfig = getStatusConfig(data.status);
  const StatusIcon = statusConfig.icon;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="text-primary h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">AI Analysis</h1>
            <p className="text-muted-foreground">Analysis ID: {data.id}</p>
          </div>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon
                className={`h-5 w-5 ${statusConfig.color} ${data.status === 'PROCESSING' ? 'animate-spin' : ''}`}
              />
              Analysis Status
            </CardTitle>
            <CardDescription>{statusConfig.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={statusConfig.variant} className="text-sm">
                {statusConfig.label}
              </Badge>
              <div className="text-muted-foreground text-sm">
                <div>Created: {formatDate(data.createdAt)}</div>
                <div>Updated: {formatDate(data.updatedAt)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Card */}
        {data.status === 'COMPLETED' && data.score !== undefined && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                AI Score
              </CardTitle>
              <CardDescription>
                Overall analysis score out of 100
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-4xl font-bold ${getScoreColor(data.score)}`}
                    >
                      {data.score}
                    </span>
                    <div>
                      <div className="text-sm font-medium">out of 100</div>
                      <div className={`text-sm ${getScoreColor(data.score)}`}>
                        {getScoreLabel(data.score)}
                      </div>
                    </div>
                  </div>
                </div>
                <Progress value={data.score} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Card */}
        {data.status === 'COMPLETED' && data.analysis && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                AI Analysis
              </CardTitle>
              <CardDescription>
                Detailed analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {data.analysis}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State for Processing */}
        {(data.status === 'PROCESSING' ||
          data.status === 'PENDING' ||
          data.status === 'PENDING_SCORE') && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">
                    {data.status === 'PROCESSING' &&
                      'Processing your analysis...'}
                    {data.status === 'PENDING' && 'Your analysis is queued...'}
                    {data.status === 'PENDING_SCORE' &&
                      'Calculating final score...'}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    This may take a few minutes
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {data.status === 'FAILED' && (
          <Card className="border-red-200">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="text-center">
                  <p className="font-medium text-red-700">Analysis Failed</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    There was an error processing your analysis. Please try
                    again.
                  </p>
                </div>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  Retry Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
