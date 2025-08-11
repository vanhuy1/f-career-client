'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { jobService } from '@/services/api/jobs/job-api';
import type { JobStats } from '@/types/Job';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
} from 'chart.js';
import {
  Users,
  Gauge,
  TimerReset,
  CalendarClock,
  RefreshCw,
  BarChart3,
  PieChart,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export function JobSettingsView() {
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;
  const [stats, setStats] = useState<JobStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchStats = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await jobService.getJobStats(String(id));
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load job stats');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const applicationsByStatus = useMemo(() => {
    if (!stats) return { labels: [], values: [] };
    const entries = Object.entries(stats.applicationsByStatus || {});
    // Stable order for professionalism
    const order = [
      'APPLIED',
      'IN_REVIEW',
      'SHORTED_LIST',
      'INTERVIEW',
      'HIRED',
      'REJECTED',
    ];
    const sorted = entries.sort(
      (a, b) => order.indexOf(a[0]) - order.indexOf(b[0]),
    );
    return {
      labels: sorted.map(([k]) => k),
      values: sorted.map(([, v]) => v as number),
    };
  }, [stats]);

  const genderData = useMemo(() => {
    if (!stats) return { labels: [], values: [] };
    const entries = Object.entries(stats.demographics.gender || {});
    return {
      labels: entries.map(([g]) => g),
      values: entries.map(([, v]) => v),
    };
  }, [stats]);

  const ageData = useMemo(() => {
    if (!stats) return { labels: [], values: [] };
    const entries = Object.entries(stats.demographics.age || {});
    // Keep natural order like "18-24", "25-34" etc by sorting by start age
    const sorted = entries.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
    return { labels: sorted.map(([r]) => r), values: sorted.map(([, v]) => v) };
  }, [stats]);

  const locationData = useMemo(() => {
    if (!stats) return { labels: [], values: [] };
    const arr = stats.demographics.location || [];
    const top10 = [...arr].sort((a, b) => b.count - a.count).slice(0, 10);
    return {
      labels: top10.map((l) => l.location),
      values: top10.map((l) => l.count),
    };
  }, [stats]);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
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
              <p className="text-lg font-medium">Error loading job stats</p>
              <p className="text-sm">{error}</p>
              <Button onClick={fetchStats} className="mt-4" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) return null;

  // Colors consistent with admin charts
  const palette = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(34, 197, 94, 0.8)',
    'rgba(168, 85, 247, 0.8)',
  ];
  const paletteSolid = [
    'rgba(59, 130, 246, 1)',
    'rgba(16, 185, 129, 1)',
    'rgba(245, 158, 11, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(139, 92, 246, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(168, 85, 247, 1)',
  ];

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const, labels: { usePointStyle: true } },
      title: { display: false },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, title: { display: false } },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{stats.title}</h1>
        <p className="text-muted-foreground text-sm">
          Created {new Date(stats.createdAt).toLocaleDateString()} • Deadline{' '}
          {new Date(stats.deadline).toLocaleDateString()}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Applications"
          value={stats.totalApplications.toLocaleString()}
          Icon={Users}
        />
        <MetricCard
          title="Average AI Score"
          value={`${(stats.averageAiScore ?? 0).toFixed(1)}`}
          Icon={Gauge}
        />
        <MetricCard
          title="Days Until Deadline"
          value={`${stats.daysUntilDeadline}`}
          Icon={TimerReset}
        />
        <MetricCard
          title="Status"
          value={stats.isExpired ? 'Expired' : 'Active'}
          Icon={CalendarClock}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5" /> Applications by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie
                data={{
                  labels: applicationsByStatus.labels,
                  datasets: [
                    {
                      data: applicationsByStatus.values,
                      backgroundColor: applicationsByStatus.labels.map(
                        (_, i) => palette[i % palette.length],
                      ),
                      borderColor: applicationsByStatus.labels.map(
                        (_, i) => paletteSolid[i % paletteSolid.length],
                      ),
                      borderWidth: 2,
                    },
                  ],
                }}
                options={pieOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5" /> Gender Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Pie
                data={{
                  labels: genderData.labels,
                  datasets: [
                    {
                      data: genderData.values,
                      backgroundColor: genderData.labels.map(
                        (_, i) => palette[i % palette.length],
                      ),
                      borderColor: genderData.labels.map(
                        (_, i) => paletteSolid[i % paletteSolid.length],
                      ),
                      borderWidth: 2,
                    },
                  ],
                }}
                options={pieOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5" /> Age Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: ageData.labels,
                  datasets: [
                    {
                      label: 'Candidates',
                      data: ageData.values,
                      backgroundColor: 'rgba(59, 130, 246, 0.8)',
                      borderColor: 'rgba(59, 130, 246, 1)',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5" /> Top Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Bar
                data={{
                  labels: locationData.labels,
                  datasets: [
                    {
                      label: 'Applications',
                      data: locationData.values,
                      backgroundColor: 'rgba(16, 185, 129, 0.8)',
                      borderColor: 'rgba(16, 185, 129, 1)',
                      borderWidth: 2,
                    },
                  ],
                }}
                options={barOptions}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Candidates List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Top Candidates by AI Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stats.topCandidatesByAiScore?.length ? (
              stats.topCandidatesByAiScore.map((c) => (
                <div
                  key={c.applicationId}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {c.email}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{c.ai_score}</div>
                    <div className="text-muted-foreground text-xs">
                      AI Score
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">No candidates</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  title,
  value,
  Icon,
}: {
  title: string;
  value: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
