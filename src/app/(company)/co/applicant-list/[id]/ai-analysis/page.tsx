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
import { useApplicantDetail } from '@/services/state/applicantDetailSlice';

type AIStatus =
  | 'PENDING'
  | 'PENDING_SCORE'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED';

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
  const applicant = useApplicantDetail();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use applicant data or default to PENDING if no AI status is available
  const aiStatus = (applicant?.ai_status as AIStatus) || 'PENDING';
  const aiScore = applicant?.ai_score;
  const aiAnalysis = applicant?.ai_analysis;

  const statusConfig = getStatusConfig(aiStatus);
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

  if (!applicant) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="text-primary h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">AI Analysis</h1>
            <p className="text-muted-foreground">
              Application ID: {applicant.id}
            </p>
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
                className={`h-5 w-5 ${statusConfig.color} ${aiStatus === 'PROCESSING' ? 'animate-spin' : ''}`}
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
                <div>Applied: {formatDate(applicant.applied_at)}</div>
                <div>Updated: {formatDate(applicant.updated_at)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Card */}
        {aiStatus === 'COMPLETED' && aiScore !== undefined && (
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
                      className={`text-4xl font-bold ${getScoreColor(aiScore)}`}
                    >
                      {aiScore}
                    </span>
                    <div>
                      <div className="text-sm font-medium">out of 100</div>
                      <div className={`text-sm ${getScoreColor(aiScore)}`}>
                        {getScoreLabel(aiScore)}
                      </div>
                    </div>
                  </div>
                </div>
                <Progress value={aiScore} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Card */}
        {aiStatus === 'COMPLETED' && aiAnalysis && (
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
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {aiAnalysis}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State for Processing */}
        {(aiStatus === 'PROCESSING' ||
          aiStatus === 'PENDING' ||
          aiStatus === 'PENDING_SCORE') && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center space-y-4 py-8">
                <Loader2 className="text-primary h-8 w-8 animate-spin" />
                <div className="text-center">
                  <p className="font-medium">
                    {aiStatus === 'PROCESSING' && 'Processing your analysis...'}
                    {aiStatus === 'PENDING' && 'Your analysis is queued...'}
                    {aiStatus === 'PENDING_SCORE' &&
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
        {aiStatus === 'FAILED' && (
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
