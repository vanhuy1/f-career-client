'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Building2,
  Users,
  Briefcase,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { analyticsService } from '@/services/api/admin/analytics.api';
import { AnalyticsData, Alert, RecentActivity } from '@/types/admin/Analytics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsService.getDashboardAnalytics();
        setAnalyticsData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatGrowthRate = (rate: number) => {
    const percentage = (rate * 100).toFixed(1);
    return rate >= 0 ? `+${percentage}%` : `${percentage}%`;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <XCircle className="h-4 w-4" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4" />;
      case 'low':
        return <Clock className="h-4 w-4" />;
      default:
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  // Chart data for metrics overview
  const metricsChartData = analyticsData
    ? {
        labels: ['Users', 'Companies', 'Jobs', 'Applications'],
        datasets: [
          {
            label: 'Total Count',
            data: [
              analyticsData.dashboardMetrics.totalUsers,
              analyticsData.dashboardMetrics.totalCompanies,
              analyticsData.dashboardMetrics.totalActiveJobs,
              analyticsData.dashboardMetrics.totalApplications,
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.5)',
              'rgba(16, 185, 129, 0.5)',
              'rgba(245, 158, 11, 0.5)',
              'rgba(139, 69, 19, 0.5)',
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)',
              'rgb(245, 158, 11)',
              'rgb(139, 69, 19)',
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  // Growth rate chart data
  const growthChartData = analyticsData
    ? {
        labels: [
          'User Growth',
          'Company Growth',
          'Job Growth',
          'Application Growth',
        ],
        datasets: [
          {
            label: 'Growth Rate (%)',
            data: [
              analyticsData.dashboardMetrics.userGrowthRate * 100,
              analyticsData.dashboardMetrics.companyGrowthRate * 100,
              analyticsData.dashboardMetrics.jobGrowthRate * 100,
              analyticsData.dashboardMetrics.applicationGrowthRate * 100,
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.5)',
              'rgba(168, 85, 247, 0.5)',
              'rgba(236, 72, 153, 0.5)',
              'rgba(249, 115, 22, 0.5)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(168, 85, 247)',
              'rgb(236, 72, 153)',
              'rgb(249, 115, 22)',
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Loading analytics data...</p>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-red-600">Failed to load analytics data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage companies and users efficiently
        </p>
      </div>

      {/* Alerts Section */}
      {analyticsData.alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Alerts</h2>
          <div className="space-y-3">
            {analyticsData.alerts.map((alert: Alert) => (
              <div
                key={alert.id}
                className={`rounded-lg border p-4 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-center gap-3">
                  {getSeverityIcon(alert.severity)}
                  <div className="flex-1">
                    <h3 className="font-medium">{alert.title}</h3>
                    <p className="mt-1 text-sm">{alert.message}</p>
                    <p className="mt-2 text-xs opacity-75">
                      {formatTimestamp(alert.timestamp)}
                    </p>
                  </div>
                  {!alert.acknowledged && (
                    <div className="h-2 w-2 rounded-full bg-current"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.dashboardMetrics.totalUsers.toLocaleString()}
            </div>
            <p
              className={`mt-1 text-xs ${analyticsData.dashboardMetrics.userGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatGrowthRate(analyticsData.dashboardMetrics.userGrowthRate)}{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.dashboardMetrics.totalCompanies.toLocaleString()}
            </div>
            <p
              className={`mt-1 text-xs ${analyticsData.dashboardMetrics.companyGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatGrowthRate(
                analyticsData.dashboardMetrics.companyGrowthRate,
              )}{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Jobs
            </CardTitle>
            <Briefcase className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.dashboardMetrics.totalActiveJobs.toLocaleString()}
            </div>
            <p
              className={`mt-1 text-xs ${analyticsData.dashboardMetrics.jobGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatGrowthRate(analyticsData.dashboardMetrics.jobGrowthRate)}{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Applications
            </CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {analyticsData.dashboardMetrics.totalApplications.toLocaleString()}
            </div>
            <p
              className={`mt-1 text-xs ${analyticsData.dashboardMetrics.applicationGrowthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {formatGrowthRate(
                analyticsData.dashboardMetrics.applicationGrowthRate,
              )}{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Platform Overview
            </CardTitle>
            <CardDescription>Total counts across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            {metricsChartData && (
              <Bar
                data={metricsChartData}
                options={{
                  responsive: true,
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
            )}
          </CardContent>
        </Card>

        <Card className="border border-gray-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Growth Rates
            </CardTitle>
            <CardDescription>
              Monthly growth percentage by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            {growthChartData && (
              <Bar
                data={growthChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        callback: function (value) {
                          return value + '%';
                        },
                      },
                    },
                  },
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="border border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest platform activities and registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">
                    ID
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.recentActivity.map(
                  (activity: RecentActivity) => (
                    <tr
                      key={activity.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {activity.type === 'user_registration' ? (
                            <Users className="h-4 w-4 text-blue-500" />
                          ) : (
                            <Briefcase className="h-4 w-4 text-green-500" />
                          )}
                          <span className="text-sm font-medium capitalize">
                            {activity.type.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="max-w-md px-4 py-3 text-sm text-gray-700">
                        {activity.description}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatTimestamp(activity.timestamp)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {activity.userId || activity.entityId}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
