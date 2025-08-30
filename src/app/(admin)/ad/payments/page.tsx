'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/job-search/pagination';
import {
  CreditCard,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  Calendar,
  RefreshCw,
  Loader2,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { paymentHistoryService } from '@/services/api/payment/payment-history-api';

interface PaymentRecord {
  id: number;
  userId: number;
  packageType: number;
  couponId?: number;
  amount: number;
  paymentMethod: string;
  status: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    email: string;
    fullName?: string;
  };
  company?: {
    id: number;
    name: string;
  };
  coupon?: {
    id: number;
    code: string;
    discountPercentage: number;
  };
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageAmount: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
}

const PACKAGE_TYPES = {
  1: { name: 'TOP COMPANY', color: 'bg-blue-100 text-blue-800' },
  2: { name: 'TOP JOB', color: 'bg-amber-100 text-amber-800' },
  3: { name: 'VIP JOB', color: 'bg-purple-100 text-purple-800' },
  4: { name: 'PREMIUM JOB', color: 'bg-indigo-100 text-indigo-800' },
  5: { name: 'AI POINT', color: 'bg-green-100 text-green-800' },
};

const PAYMENT_STATUSES = {
  SUCCESS: { name: 'Success', color: 'bg-green-100 text-green-800' },
  FAILED: { name: 'Failed', color: 'bg-red-100 text-red-800' },
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageTypeFilter, setPackageTypeFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('all');

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    // Reset to page 1 when filters change
    if (currentPage !== 1) {
      setCurrentPage(1);
    } else {
      fetchPayments();
    }
    fetchStats();
  }, [statusFilter, packageTypeFilter, dateRange]);

  useEffect(() => {
    fetchPayments();
  }, [currentPage]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentHistoryService.getAllPayments({
        page: currentPage,
        limit: ITEMS_PER_PAGE,

        status: statusFilter !== 'all' ? statusFilter : undefined,
        packageType:
          packageTypeFilter !== 'all' ? parseInt(packageTypeFilter) : undefined,
        dateRange: dateRange !== 'all' ? dateRange : undefined,
      });

      setPayments(response.data);
      setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await paymentHistoryService.getAllPaymentStats();
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchPayments();
    fetchStats();
    toast.success('Data refreshed');
  };

  const handleExportExcel = () => {
    // Create CSV content
    const headers = [
      'ID',
      'User/Company',
      'Package',
      'Amount',
      'Status',
      'Method',
      'Date',
    ];
    const csvContent = [
      headers.join(','),
      ...payments.map((payment) => {
        const info = getUserOrCompanyInfo(payment);
        const dateInfo = formatDateWithTimeZone(payment.createdAt);
        return [
          payment.id,
          `${info.name} (${info.type} ID: ${info.id})`,
          getPackageTypeInfo(payment.packageType).name,
          payment.amount,
          payment.status,
          payment.paymentMethod,
          `${dateInfo.date} ${dateInfo.time}`,
        ].join(',');
      }),
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `payment-history-${new Date().toISOString().split('T')[0]}.csv`,
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Payment data exported successfully');
  };

  const formatVND = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateWithTimeZone = (
    dateString: string,
  ): { date: string; time: string } => {
    const date = new Date(dateString);
    // Add 7 hours to convert to Vietnam timezone
    date.setHours(date.getHours() + 7);

    return {
      date: format(date, 'MMM dd, yyyy'),
      time: format(date, 'HH:mm'),
    };
  };

  const getPackageTypeInfo = (type: number) => {
    return (
      PACKAGE_TYPES[type as keyof typeof PACKAGE_TYPES] || {
        name: 'Unknown',
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  const getStatusInfo = (status: string) => {
    return (
      PAYMENT_STATUSES[status as keyof typeof PAYMENT_STATUSES] || {
        name: status,
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  const getUserOrCompanyInfo = (payment: PaymentRecord) => {
    if (payment.packageType === 5) {
      // AI Point - Candidate
      return {
        name: payment.user?.fullName || payment.user?.email || 'N/A',
        id: payment.userId,
        type: 'Candidate',
      };
    } else {
      // Other packages - Company
      return {
        name: payment.company?.name || 'N/A',
        id: payment.userId,
        type: 'Company',
      };
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all payment transactions
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={handleRefresh} disabled={loading}>
            <RefreshCw
              className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex h-20 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatVND(stats?.totalRevenue || 0)}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Transactions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.totalTransactions || 0}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Success Rate */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Success Rate
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats?.successRate || 0}%
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {formatVND(stats?.monthlyRevenue || 0)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stats?.monthlyGrowth || 0}% from last month
                  </p>
                </div>
                <div className="rounded-full bg-orange-100 p-3">
                  <Calendar className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Section */}
      {stats && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Package Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Package Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(PACKAGE_TYPES).map(([type, info]) => {
                  const count = payments.filter(
                    (p) => p.packageType === parseInt(type),
                  ).length;
                  const percentage =
                    payments.length > 0
                      ? ((count / payments.length) * 100).toFixed(1)
                      : 0;
                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-3 w-3 rounded-full ${info.color.split(' ')[0]}`}
                        ></div>
                        <span className="text-sm font-medium">{info.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold">{count}</div>
                        <div className="text-xs text-gray-500">
                          {percentage}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Payment Status Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Payment Status Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Success</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-green-600">
                      {payments.filter((p) => p.status === 'SUCCESS').length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {stats.successRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Failed</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600">
                      {payments.filter((p) => p.status === 'FAILED').length}
                    </div>
                    <div className="text-xs text-gray-500">
                      {(100 - stats.successRate).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Revenue Trends */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Revenue Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {formatVND(stats.totalRevenue)}
                </div>
                <div className="text-sm text-gray-500">Total Revenue</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {formatVND(stats.monthlyRevenue)}
                </div>
                <div className="text-sm text-gray-500">
                  Monthly Revenue
                  {stats.monthlyGrowth > 0 && (
                    <span className="ml-1 text-green-600">
                      +{stats.monthlyGrowth.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {formatVND(stats.averageAmount)}
                </div>
                <div className="text-sm text-gray-500">Average Transaction</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="SUCCESS">Success</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>

            {/* Package Type Filter */}
            <Select
              value={packageTypeFilter}
              onValueChange={setPackageTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Packages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Packages</SelectItem>
                <SelectItem value="1">TOP COMPANY</SelectItem>
                <SelectItem value="2">TOP JOB</SelectItem>
                <SelectItem value="3">VIP JOB</SelectItem>
                <SelectItem value="4">PREMIUM JOB</SelectItem>
                <SelectItem value="5">AI POINT</SelectItem>
              </SelectContent>
            </Select>

            {/* Date Range */}
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Transaction ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.id}
                        </TableCell>
                        <TableCell>
                          <div>
                            {(() => {
                              const info = getUserOrCompanyInfo(payment);
                              return (
                                <>
                                  <p className="font-medium">{info.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {info.type} ID: {info.id}
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              getPackageTypeInfo(payment.packageType).color
                            }
                          >
                            {getPackageTypeInfo(payment.packageType).name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium text-green-600">
                              {formatVND(payment.amount)}
                            </p>
                            {payment.coupon && (
                              <p className="text-xs text-gray-500">
                                Coupon: {payment.coupon.code} (-
                                {payment.coupon.discountPercentage}%)
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusInfo(payment.status).color}
                          >
                            {getStatusInfo(payment.status).name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.paymentMethod}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            {(() => {
                              const dateInfo = formatDateWithTimeZone(
                                payment.createdAt,
                              );
                              return (
                                <>
                                  <p className="text-sm">{dateInfo.date}</p>
                                  <p className="text-xs text-gray-500">
                                    {dateInfo.time}
                                  </p>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600">
                            {payment.transactionId || 'N/A'}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex justify-center">
                  <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
