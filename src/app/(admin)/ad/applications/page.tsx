'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FileText,
  TrendingUp,
  Users,
  Clock,
  Target,
  Brain,
  RefreshCw,
  CalendarDays,
  Award,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

import { analyticsService } from '@/services/api/admin/analytics.api';
import {
  ApplicationAnalyticsData,
  ApplicationAnalyticsParams,
} from '@/types/admin/ApplicationAnalytics';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function ApplicationAnalyticsPage() {
  const [data, setData] = useState<ApplicationAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'monthly',
  );
  const [startDate, setStartDate] = useState<Date>(
    new Date(new Date().getFullYear(), 0, 1),
  );
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: ApplicationAnalyticsParams = {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        interval,
      };

      const response = await analyticsService.getApplicationAnalytics(params);
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch application analytics data');
      console.error('Error fetching application analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, interval]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleDetails = (section: string) => {
    setShowDetails((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'in_review':
        return 'bg-blue-100 text-blue-800';
      case 'shorted_list':
        return 'bg-purple-100 text-purple-800';
      case 'interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart configurations
  const applicationTrendChartData = {
    labels:
      data?.applicationTrends.map((trend) =>
        new Date(trend.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      ) || [],
    datasets: [
      {
        label: 'Total Applications',
        data: data?.applicationTrends.map((trend) => trend.applications) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
      },
      {
        label: 'Hired',
        data: data?.applicationTrends.map((trend) => trend.hired) || [],
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 2,
      },
      {
        label: 'Rejected',
        data: data?.applicationTrends.map((trend) => trend.rejected) || [],
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 2,
      },
    ],
  };

  const statusDistributionChartData = {
    labels: data?.statusDistribution.map((status) => status.status) || [],
    datasets: [
      {
        data: data?.statusDistribution.map((status) => status.count) || [],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(245, 158, 11)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
          'rgb(139, 92, 246)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const aiScoreDistributionChartData = {
    labels:
      data?.aiAnalysisInsights.scoreDistribution.map((score) => score.range) ||
      [],
    datasets: [
      {
        label: 'Number of Applications',
        data:
          data?.aiAnalysisInsights.scoreDistribution.map(
            (score) => score.count,
          ) || [],
        backgroundColor: 'rgba(139, 92, 246, 0.5)',
        borderColor: 'rgb(139, 92, 246)',
        borderWidth: 2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Application Analytics
          </h1>
          <p className="mt-2 text-gray-600">Loading analytics data...</p>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Application Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Analyze application trends and performance
          </p>
        </div>
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="font-medium text-red-800">
              {error || 'Failed to load application analytics data'}
            </div>
            <Button onClick={fetchData} className="mt-4" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Application Analytics
          </h1>
          <p className="mt-2 text-gray-600">
            Analyze application trends, status distribution, and AI insights
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
          <Select
            value={interval}
            onValueChange={(value) =>
              setInterval(value as 'daily' | 'weekly' | 'monthly')
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-auto justify-start text-left font-normal"
              >
                <CalendarDays className="mr-2 h-4 w-4" />
                {formatDate(startDate)} - {formatDate(endDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="space-y-4 p-4">
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    className="rounded-md border"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => date && setEndDate(date)}
                    className="rounded-md border"
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button onClick={fetchData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data.applicationTrends
                .reduce((sum, trend) => sum + trend.applications, 0)
                .toLocaleString()}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Overall hire rate:{' '}
              {data.conversionRates.overallHireRate.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data.conversionRates.applicationToInterview.toFixed(1)}%
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Application to Interview
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Average AI Score
            </CardTitle>
            <Brain className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data.aiAnalysisInsights.averageAiScore.toFixed(1)}
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Median: {data.aiAnalysisInsights.medianAiScore}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Time to Hire
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {data.timeMetrics.averageTimeToHire.toFixed(1)}d
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Response: {data.timeMetrics.averageTimeToResponse.toFixed(1)}d
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rates Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Conversion Rates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Application → Interview</span>
                <span className="font-medium">
                  {data.conversionRates.applicationToInterview.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.conversionRates.applicationToInterview}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Interview → Hire</span>
                <span className="font-medium">
                  {data.conversionRates.interviewToHire.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.conversionRates.interviewToHire}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Hire Rate</span>
                <span className="font-medium">
                  {data.conversionRates.overallHireRate.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.conversionRates.overallHireRate}
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Rejection Rate</span>
                <span className="font-medium">
                  {data.conversionRates.rejectionRate.toFixed(1)}%
                </span>
              </div>
              <Progress
                value={data.conversionRates.rejectionRate}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Application Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={applicationTrendChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top' as const,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie
                data={statusDistributionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={aiScoreDistributionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              AI Processing Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {data.aiAnalysisInsights.processingStatus.completed}
                </div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {data.aiAnalysisInsights.processingStatus.pending}
                </div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {data.aiAnalysisInsights.processingStatus.failed}
                </div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {data.aiAnalysisInsights.processingStatus.successRate.toFixed(
                    1,
                  )}
                  %
                </div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>Score-Hire Correlation</span>
                <span className="font-medium">
                  {data.aiAnalysisInsights.scoreHireCorrelation.toFixed(2)}
                </span>
              </div>
              <Progress
                value={data.aiAnalysisInsights.scoreHireCorrelation * 100}
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Status Distribution Details
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDetails('status')}
            >
              {showDetails.status ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {showDetails.status && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Count</TableHead>
                  <TableHead>Percentage</TableHead>
                  <TableHead>Avg. Time in Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.statusDistribution.map((status, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Badge className={getStatusColor(status.status)}>
                        {status.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {status.count.toLocaleString()}
                    </TableCell>
                    <TableCell>{status.percentage.toFixed(1)}%</TableCell>
                    <TableCell>
                      {status.avgTimeInStatus.toFixed(1)} days
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>

      {/* Top Performing Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing Jobs
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleDetails('jobs')}
            >
              {showDetails.jobs ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {showDetails.jobs && (
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Hires</TableHead>
                  <TableHead>Hire Rate</TableHead>
                  <TableHead>Avg. AI Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topPerformingJobs.map((job, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {job.jobTitle}
                    </TableCell>
                    <TableCell>{job.companyName}</TableCell>
                    <TableCell>{job.totalApplications}</TableCell>
                    <TableCell>{job.hires}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {job.hireRate.toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={job.avgAiScore >= 80 ? 'default' : 'secondary'}
                      >
                        {job.avgAiScore.toFixed(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
