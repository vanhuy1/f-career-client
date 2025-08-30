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
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { paymentHistoryService } from '@/services/api/payment/payment-history-api';

interface PaymentHistoryItem {
  id: number;
  amount: number;
  paymentMethod: 'VISA' | 'MOMO' | 'VNPAY' | 'PAYOS';
  status: 'SUCCESS' | 'FAILED';
  transactionId?: string;
  createdAt: string;
  package: {
    id: number;
    name: string;
    description: string;
    price: number;
    durationDays: number;
    type: string;
  };
  coupon?: {
    id: number;
    code: string;
    discountPercentage: number;
  };
}

interface PaymentStats {
  total: number;
  successful: number;
  failed: number;
  totalAmount: number;
}

const PAYMENT_STATUSES = {
  SUCCESS: { name: 'Success', color: 'bg-green-100 text-green-800' },
  FAILED: { name: 'Failed', color: 'bg-red-100 text-red-800' },
};

export default function CandidatePaymentHistoryPage() {
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, [currentPage, statusFilter, paymentMethodFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentHistoryService.getPaymentHistory({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        status:
          statusFilter !== 'all'
            ? (statusFilter as 'SUCCESS' | 'FAILED')
            : undefined,
        paymentMethod:
          paymentMethodFilter !== 'all'
            ? (paymentMethodFilter as 'VISA' | 'MOMO' | 'VNPAY' | 'PAYOS')
            : undefined,
      });

      setPayments(response.data);
      setTotalPages(Math.ceil(response.meta.total / ITEMS_PER_PAGE));
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await paymentHistoryService.getPaymentStats();
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
      'Package',
      'Amount',
      'Status',
      'Method',
      'Date',
      'Transaction ID',
    ];
    const csvContent = [
      headers.join(','),
      ...payments.map((payment) => {
        const dateInfo = formatDateWithTimeZone(payment.createdAt);
        return [
          payment.id,
          payment.package.name,
          payment.amount,
          payment.status,
          payment.paymentMethod,
          `${dateInfo.date} ${dateInfo.time}`,
          payment.transactionId || 'N/A',
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

    toast.success('Payment history exported successfully');
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

  const getStatusInfo = (status: string) => {
    return (
      PAYMENT_STATUSES[status as keyof typeof PAYMENT_STATUSES] || {
        name: status,
        color: 'bg-gray-100 text-gray-800',
      }
    );
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
          <p className="text-gray-600">
            View your payment transactions and history
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportExcel} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          {/* Total Transactions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Transactions
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats?.total || 0}
                  </p>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Successful Transactions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Successful
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.successful || 0}
                  </p>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Failed Transactions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Failed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats?.failed || 0}
                  </p>
                </div>
                <div className="rounded-full bg-red-100 p-3">
                  <Calendar className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Amount */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spent
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatVND(stats?.totalAmount || 0)}
                  </p>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            {/* Payment Method Filter */}
            <Select
              value={paymentMethodFilter}
              onValueChange={setPaymentMethodFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Methods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="PAYOS">PayOS</SelectItem>
                <SelectItem value="VISA">VISA</SelectItem>
                <SelectItem value="MOMO">MOMO</SelectItem>
                <SelectItem value="VNPAY">VNPAY</SelectItem>
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
                            <p className="font-medium">
                              {payment.package.name}
                            </p>
                          </div>
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
