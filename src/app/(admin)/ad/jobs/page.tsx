'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Filter,
  RefreshCw,
  Target,
  Crown,
  Building2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
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
import { analyticsService } from '@/services/api/admin/analytics.api';
import {
  JobAnalyticsData,
  JobAnalyticsParams,
} from '@/types/admin/JobAnalytics';
import { cn } from '@/lib/utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
);

export default function JobAnalyticsPage() {
  const [data, setData] = useState<JobAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    to: new Date(), // Today
  });
  const [interval, setInterval] = useState<'daily' | 'weekly' | 'monthly'>(
    'monthly',
  );
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: JobAnalyticsParams = {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
        interval,
      };

      const response = await analyticsService.getJobAnalytics(params);
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch job analytics data');
      console.error('Job analytics fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [dateRange, interval]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const setQuickDateRange = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setDateRange({ from, to });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Chart configurations
  const jobTrendsData = {
    labels:
      data?.jobPostingTrends.map((item) =>
        new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
      ) || [],
    datasets: [
      {
        label: 'Total Jobs',
        data: data?.jobPostingTrends.map((item) => item.totalJobs) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
      {
        label: 'Open Jobs',
        data: data?.jobPostingTrends.map((item) => item.openJobs) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
      {
        label: 'VIP Jobs',
        data: data?.jobPostingTrends.map((item) => item.vipJobs) || [],
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Job Posting Trends',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const createPieChartData = (
    items: {
      name?: string;
      type?: string;
      count: number;
      percentage: number;
    }[],
  ) => ({
    labels: items.map((item) => item.name || item.type),
    datasets: [
      {
        data: items.map((item) => item.count),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 2,
      },
    ],
  });

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">Error loading analytics</p>
              <p className="text-sm">{error}</p>
              <Button onClick={fetchAnalytics} className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Analytics</h1>
          <p className="text-gray-600">
            Comprehensive insights into job market trends and performance
          </p>
        </div>

        {/* Filter Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              {/* Quick Date Range Buttons */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Quick Select
                </label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(30)}
                  >
                    30d
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(90)}
                  >
                    90d
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuickDateRange(365)}
                  >
                    1y
                  </Button>
                </div>
              </div>

              {/* Date Range Pickers */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  From Date
                </label>
                <Popover
                  open={showFromCalendar}
                  onOpenChange={setShowFromCalendar}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !dateRange.from && 'text-muted-foreground',
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        formatDate(dateRange.from)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.from}
                      onSelect={(date) => {
                        if (date) {
                          setDateRange((prev) => ({ ...prev, from: date }));
                          setShowFromCalendar(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  To Date
                </label>
                <Popover open={showToCalendar} onOpenChange={setShowToCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-[240px] justify-start text-left font-normal',
                        !dateRange.to && 'text-muted-foreground',
                      )}
                    >
                      <CalendarDays className="mr-2 h-4 w-4" />
                      {dateRange.to ? (
                        formatDate(dateRange.to)
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateRange.to}
                      onSelect={(date) => {
                        if (date) {
                          setDateRange((prev) => ({ ...prev, to: date }));
                          setShowToCalendar(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-600">
                  Interval
                </label>
                <Select
                  value={interval}
                  onValueChange={(value: 'daily' | 'weekly' | 'monthly') =>
                    setInterval(value)
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Refresh Button */}
              <Button onClick={fetchAnalytics} variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      {data && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Salary
              </CardTitle>
              <DollarSign className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.salaryAnalytics.averageSalary)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total VIP Jobs
              </CardTitle>
              <Crown className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.vipJobsAnalytics.totalVipJobs.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">VIP Revenue</CardTitle>
              <TrendingUp className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.vipJobsAnalytics.vipJobsRevenue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                VIP Conversion Rate
              </CardTitle>
              <Target className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.vipJobsAnalytics.vipConversionRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active VIP Jobs
              </CardTitle>
              <Building2 className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.vipJobsAnalytics.activeVipJobs.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Job Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Job Posting Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={jobTrendsData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Employment Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Employment Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie
                  data={createPieChartData(data.employmentTypeDistribution)}
                  options={pieChartOptions}
                />
              </div>
            </CardContent>
          </Card>

          {/* Category Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Top Job Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Pie
                  data={createPieChartData(
                    data.categoryAnalysis.slice(0, 8).map((cat) => ({
                      name: cat.categoryName,
                      count: cat.count,
                      percentage: cat.percentage,
                    })),
                  )}
                  options={pieChartOptions}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Tables */}
      {data && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Category Analysis Details */}
          <Card>
            <CardHeader>
              <CardTitle>Category Analysis Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.categoryAnalysis
                  .slice(0, showAllCategories ? undefined : 3)
                  .map((category, index) => (
                    <div
                      key={category.categoryId}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{
                            backgroundColor: [
                              'rgba(59, 130, 246, 1)',
                              'rgba(16, 185, 129, 1)',
                              'rgba(245, 158, 11, 1)',
                              'rgba(239, 68, 68, 1)',
                              'rgba(139, 92, 246, 1)',
                              'rgba(236, 72, 153, 1)',
                              'rgba(34, 197, 94, 1)',
                              'rgba(168, 85, 247, 1)',
                            ][index % 8],
                          }}
                        />
                        <div>
                          <span className="text-sm font-medium">
                            {category.categoryName}
                          </span>
                          <div className="text-xs text-gray-500">
                            Avg: {formatCurrency(category.avgSalary)} | Apps:{' '}
                            {category.avgApplications.toFixed(1)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {category.percentage.toFixed(1)}%
                        </Badge>
                        <span className="text-sm font-bold">
                          {category.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              {data.categoryAnalysis.length > 3 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="flex items-center gap-2"
                  >
                    {showAllCategories ? (
                      <>
                        Show Less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        See More ({data.categoryAnalysis.length - 3} more)
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Popular Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.popularSkills.slice(0, 10).map((skill) => (
                  <div
                    key={skill.skillId}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <span className="text-sm font-medium">
                      {skill.skillName}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {skill.percentage.toFixed(1)}%
                      </Badge>
                      <span className="text-sm font-bold">
                        {skill.jobCount.toLocaleString()} jobs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Salary Analytics Details */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Salary Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Average</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(data.salaryAnalytics.averageSalary)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Median</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(data.salaryAnalytics.medianSalary)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Minimum</p>
                <p className="text-2xl font-bold text-gray-600">
                  {formatCurrency(data.salaryAnalytics.minSalary)}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">Maximum</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(data.salaryAnalytics.maxSalary)}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="mb-4 text-lg font-medium">Salary Ranges</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                {data.salaryAnalytics.salaryRanges.map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <span className="text-sm font-medium">{range.range}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {range.percentage.toFixed(1)}%
                      </Badge>
                      <span className="text-sm font-bold">
                        {range.count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
