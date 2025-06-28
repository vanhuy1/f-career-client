import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

export interface CreatePaymentPayload {
  amount: number;
  description: string;
  orderCode: number | string;
  returnUrl: string;
  cancelUrl: string;
}

export interface PayOSResponse<T> {
  code: string;
  desc: string;
  data: T;
  signature: string;
}

export interface PaymentLinkData {
  bin: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  description: string;
  orderCode: number | string;
  currency: string;
  paymentLinkId: string;
  status: string;
  checkoutUrl: string;
  qrCode: string;
}

export interface PaymentStatusResponse {
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'FAILED';
  amount: number;
  description: string;
  orderCode: number | string;
  paymentTime?: string;
}

class PayOSService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('payos');
  }

  async createPaymentLink(
    data: CreatePaymentPayload,
  ): Promise<PaymentLinkData> {
    const url = this.requestBuilder.buildUrl('create-link');
    const response = await httpClient.post<
      PayOSResponse<PaymentLinkData>,
      CreatePaymentPayload
    >({
      url,
      body: data,
      typeCheck: (responseData) => {
        if (
          responseData &&
          typeof responseData === 'object' &&
          'code' in responseData &&
          'data' in responseData &&
          responseData.data &&
          typeof responseData.data === 'object' &&
          'checkoutUrl' in responseData.data
        ) {
          return {
            success: true,
            data: (responseData as PayOSResponse<PaymentLinkData>).data,
          };
        }
        throw new Error('Invalid response format from server');
      },
    });
    return response.data;
  }

  async getPaymentStatus(
    orderCode: string | number,
  ): Promise<PaymentStatusResponse> {
    const url = this.requestBuilder.buildUrl(`status/${orderCode}`);
    const response = await httpClient.get<PayOSResponse<PaymentStatusResponse>>(
      {
        url,
        typeCheck: (responseData) => {
          if (
            responseData &&
            typeof responseData === 'object' &&
            'code' in responseData &&
            'data' in responseData &&
            responseData.data &&
            typeof responseData.data === 'object' &&
            'status' in responseData.data
          ) {
            return {
              success: true,
              data: (responseData as PayOSResponse<PaymentStatusResponse>).data,
            };
          }
          throw new Error('Invalid response format from server');
        },
      },
    );
    return response.data;
  }
}

export const payosService = new PayOSService();
