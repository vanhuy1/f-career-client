'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  MapPin,
  Briefcase,
  Calendar,
  Target,
  Filter,
  RefreshCw,
} from 'lucide-react';

import { analyticsService } from '@/services/api/admin/analytics.api';
import { CompanyAnalyticsData } from '@/types/admin/ComanyAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

type IntervalType = 'daily' | 'weekly' | 'monthly';

export default function CompanyAnalyticsPage() {
  const [analyticsData, setAnalyticsData] =
    useState<CompanyAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Date filter state
  const [startDate, setStartDate] = useState<string>('2024-01-01');
  const [endDate, setEndDate] = useState<string>('2024-12-31');
  const [interval, setInterval] = useState<IntervalType>('monthly');

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await analyticsService.getCompanyAnalytics({
        startDate: `${startDate}T00:00:00.000Z`,
        endDate: `${endDate}T23:59:59.999Z`,
        interval: interval,
      });
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch company analytics data');
      console.error('Error fetching company analytics:', err);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, interval]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const handleApplyFilters = () => {
    fetchAnalytics();
  };

  const setDateRange = (range: string) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    switch (range) {
      case 'thisMonth':
        setStartDate(new Date(year, month, 1).toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        setInterval('daily');
        break;
      case 'lastMonth':
        setStartDate(new Date(year, month - 1, 1).toISOString().split('T')[0]);
        setEndDate(new Date(year, month, 0).toISOString().split('T')[0]);
        setInterval('daily');
        break;
      case 'thisQuarter':
        const quarterStart = new Date(year, Math.floor(month / 3) * 3, 1);
        setStartDate(quarterStart.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        setInterval('weekly');
        break;
      case 'thisYear':
        setStartDate(new Date(year, 0, 1).toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        setInterval('monthly');
        break;
      case 'lastYear':
        setStartDate(new Date(year - 1, 0, 1).toISOString().split('T')[0]);
        setEndDate(new Date(year - 1, 11, 31).toISOString().split('T')[0]);
        setInterval('monthly');
        break;
    }

    // Auto-apply when preset is selected
    setTimeout(() => {
      fetchAnalytics();
    }, 100);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="container mx-auto space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Company Analytics</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[80px]" />
                <Skeleton className="mt-2 h-4 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">{error}</h1>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Company Analytics</h1>
        <Badge variant="outline" className="text-sm">
          <Calendar className="mr-1 h-4 w-4" />
          {interval.charAt(0).toUpperCase() + interval.slice(1)} View
        </Badge>
      </div>

      {/* Date Filter Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Date Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="start-date">Start Date</Label>
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date">End Date</Label>
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interval">Interval</Label>
              <Select
                value={interval}
                onValueChange={(value: IntervalType) => setInterval(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleApplyFilters}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Filter className="mr-2 h-4 w-4" />
                )}
                Apply
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setStartDate('2024-01-01');
                  setEndDate('2024-12-31');
                  setInterval('monthly');
                }}
                disabled={loading}
                className="px-3"
                title="Reset to default"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Quick Date Range Presets */}
          <div className="mt-4 border-t pt-4">
            <Label className="mb-2 block text-sm font-medium">
              Quick Presets:
            </Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange('thisMonth')}
                className="text-xs"
              >
                This Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange('lastMonth')}
                className="text-xs"
              >
                Last Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange('thisQuarter')}
                className="text-xs"
              >
                This Quarter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange('thisYear')}
                className="text-xs"
              >
                This Year
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDateRange('lastYear')}
                className="text-xs"
              >
                Last Year
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing data from{' '}
              <strong>{new Date(startDate).toLocaleDateString()}</strong> to{' '}
              <strong>{new Date(endDate).toLocaleDateString()}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {interval.charAt(0).toUpperCase() + interval.slice(1)} aggregation
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Growth Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Companies
            </CardTitle>
            <Building2 className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(analyticsData.growthMetrics.totalCompanies)}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatNumber(analyticsData.growthMetrics.activeCompanies)} active
              companies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Growth
            </CardTitle>
            <TrendingUp className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(analyticsData.growthMetrics.growthRate)}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatNumber(analyticsData.growthMetrics.newCompaniesThisMonth)}{' '}
              new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Company Size
            </CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(analyticsData.growthMetrics.avgCompanySize)}
            </div>
            <p className="text-muted-foreground text-xs">
              {formatNumber(analyticsData.growthMetrics.verifiedCompanies)}{' '}
              verified
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Size Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Company Size Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Size Range</TableHead>
                <TableHead>Count</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Avg Job Postings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.sizeDistribution.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {item.sizeRange}
                  </TableCell>
                  <TableCell>{formatNumber(item.count)}</TableCell>
                  <TableCell>{formatPercentage(item.percentage)}</TableCell>
                  <TableCell>{item.avgJobPostings}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Industry Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Industry Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Industry</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead>Market Share</TableHead>
                <TableHead>Avg Jobs</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Hire Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.industryAnalysis.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.industry}</TableCell>
                  <TableCell>{formatNumber(item.count)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatPercentage(item.percentage)}
                    </Badge>
                  </TableCell>
                  <TableCell>{item.avgJobPostings}</TableCell>
                  <TableCell>{formatNumber(item.totalApplications)}</TableCell>
                  <TableCell>{formatPercentage(item.avgHireRate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Hiring Companies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Hiring Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Total Jobs</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Hires</TableHead>
                <TableHead>Hire Rate</TableHead>
                <TableHead>Avg Time to Hire</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.topHiringCompanies.map((company) => (
                <TableRow key={company.companyId}>
                  <TableCell className="font-medium">
                    {company.companyName}
                  </TableCell>
                  <TableCell>{formatNumber(company.totalJobs)}</TableCell>
                  <TableCell>
                    {formatNumber(company.totalApplications)}
                  </TableCell>
                  <TableCell>{formatNumber(company.totalHires)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {formatPercentage(company.hireRate)}
                    </Badge>
                  </TableCell>
                  <TableCell>{company.avgTimeToHire} days</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Geographic Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Companies</TableHead>
                <TableHead>Market Share</TableHead>
                <TableHead>Total Jobs</TableHead>
                <TableHead>Avg Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.geographicDistribution.map((location, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {location.location}
                  </TableCell>
                  <TableCell>{formatNumber(location.count)}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {formatPercentage(location.percentage)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatNumber(location.totalJobs)}</TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(location.avgSalary)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Registration Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registration Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>New Companies</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyticsData.registrationTrends.map((trend, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {new Date(trend.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatNumber(trend.newCompanies)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
