import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

export interface PaymentHistoryItem {
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

export interface PaymentStats {
  total: number;
  successful: number;
  failed: number;
  totalAmount: number;
}

export interface AdminPaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageAmount: number;
  monthlyRevenue: number;
  monthlyGrowth: number;
}

export interface AdminPaymentRecord {
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
  coupon?: {
    id: number;
    code: string;
    discountPercentage: number;
  };
}

export interface AdminPaymentResponse {
  data: AdminPaymentRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAdminPaymentsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  packageType?: number;
  dateRange?: string;
}

export interface PaymentHistoryResponse {
  data: PaymentHistoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetPaymentHistoryParams {
  page?: number;
  limit?: number;
  paymentMethod?: 'VISA' | 'MOMO' | 'VNPAY' | 'PAYOS';
  status?: 'SUCCESS' | 'FAILED';
}

class PaymentHistoryService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath(
      'payment-history',
    );
  }

  async getPaymentHistory(
    params: GetPaymentHistoryParams = {},
  ): Promise<PaymentHistoryResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.paymentMethod)
      queryParams.append('paymentMethod', params.paymentMethod);
    if (params.status) queryParams.append('status', params.status);

    const url = this.requestBuilder.buildUrl(`?${queryParams.toString()}`);

    const response = await httpClient.get<PaymentHistoryResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as PaymentHistoryResponse,
        };
      },
    });
    return response;
  }

  async getPaymentStats(): Promise<PaymentStats> {
    const url = this.requestBuilder.buildUrl('stats');
    const response = await httpClient.get<PaymentStats>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as PaymentStats,
        };
      },
    });
    return response;
  }

  async getPaymentById(id: number): Promise<PaymentHistoryItem> {
    const url = this.requestBuilder.buildUrl(id.toString());
    const response = await httpClient.get<PaymentHistoryItem>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as PaymentHistoryItem,
        };
      },
    });
    return response;
  }

  // Create payment record
  async createPayment(data: {
    userId: number;
    packageType: number;
    couponId?: number;
    amount: number;
    paymentMethod: 'VISA' | 'MOMO' | 'VNPAY' | 'PAYOS';
    status: 'SUCCESS' | 'FAILED';
    transactionId?: string;
  }): Promise<PaymentHistoryItem> {
    const url = this.requestBuilder.buildUrl('');
    const response = await httpClient.post<PaymentHistoryItem, typeof data>({
      url,
      body: data,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as PaymentHistoryItem,
        };
      },
    });
    return response;
  }

  // Admin methods
  async getAllPayments(
    params: GetAdminPaymentsParams = {},
  ): Promise<AdminPaymentResponse> {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.search) queryParams.append('search', params.search);
    if (params.status) queryParams.append('status', params.status);
    if (params.packageType)
      queryParams.append('packageType', params.packageType.toString());
    if (params.dateRange) queryParams.append('dateRange', params.dateRange);

    const url = this.requestBuilder.buildUrl(
      `admin/all?${queryParams.toString()}`,
    );
    const response = await httpClient.get<AdminPaymentResponse>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as AdminPaymentResponse,
        };
      },
    });
    return response;
  }

  async getAllPaymentStats(): Promise<AdminPaymentStats> {
    const url = this.requestBuilder.buildUrl('admin/stats');
    const response = await httpClient.get<AdminPaymentStats>({
      url,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as AdminPaymentStats,
        };
      },
    });
    return response;
  }
}

export const paymentHistoryService = new PaymentHistoryService();
