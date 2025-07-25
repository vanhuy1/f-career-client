import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

export interface Coupon {
  id: number;
  code: string;
  discountPercentage: number;
  validUntil: Date;
  isActive: boolean;
  createdAt: Date;
}

// DTO for creating a new coupon
export interface CreateCouponDto {
  code: string;
  discountPercentage: number;
  validUntil: string;
}

// DTO for updating an existing coupon
export interface UpdateCouponDto {
  code: string;
  discountPercentage: number;
  validUntil: string;
  isActive: boolean;
}

class CouponService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('coupons');
  }

  async findAll(): Promise<Coupon[]> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.get<Coupon[]>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as Coupon[],
      }),
    });
    return response;
  }

  async findById(id: number): Promise<Coupon> {
    const url = this.requestBuilder.buildUrl(id.toString());
    const response = await httpClient.get<Coupon>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as Coupon,
      }),
    });
    return response;
  }

  async create(dto: CreateCouponDto): Promise<Coupon> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.post<Coupon, CreateCouponDto>({
      url,
      body: dto,
      typeCheck: (data) => ({
        success: true,
        data: data as Coupon,
      }),
    });
    return response;
  }

  async update(id: number, dto: UpdateCouponDto): Promise<Coupon> {
    const url = this.requestBuilder.buildUrl(id.toString());
    const response = await httpClient.patch<Coupon, UpdateCouponDto>({
      url,
      body: dto,
      typeCheck: (data) => ({
        success: true,
        data: data as Coupon,
      }),
    });
    return response;
  }

  async delete(id: number): Promise<void> {
    const url = this.requestBuilder.buildUrl(id.toString());
    await httpClient.delete<void>({
      url,
      typeCheck: (data) => ({
        success: true,
        data,
      }),
    });
  }
}

export const couponService = new CouponService();
