// src/services/companyService.ts

import {
  Company,
  CompanyListResponse,
  CreateCompanyReq,
  UpdateCompanyReq,
  CompanyStats,
} from '@/types/Company';
import {
  CreateScheduleEventRequest,
  ScheduleEventResponse,
  ScheduleEventsListResponse,
  GetScheduleEventsQuery,
} from '@/types/Schedule';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class CompanyService {
  private requestBuilder: RequestBuilder;

  constructor() {
    this.requestBuilder = new RequestBuilder().setResourcePath('companies');
  }

  /**
   * Lấy danh sách company (có pagination)
   */
  async findAll(limit?: number, offset?: number): Promise<CompanyListResponse> {
    const url = this.requestBuilder.buildUrl();
    console.log(limit, offset); // handle share page
    const response = await httpClient.get<CompanyListResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CompanyListResponse,
      }),
    });

    console.log(response, 'string: ');
    return response;
  }

  /**
   * Lấy chi tiết 1 company theo ID
   */
  async findOne(id: string): Promise<Company> {
    const url = this.requestBuilder.buildUrl(id);
    const response = await httpClient.get<Company>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as Company,
      }),
    });
    console.log('company', response);
    return response;
  }

  /**
   * Tạo mới company
   */
  async create(payload: CreateCompanyReq): Promise<Company> {
    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.post<Company, CreateCompanyReq>({
      url,
      body: payload,
      typeCheck: (data) => ({
        success: true,
        data: data as Company,
      }),
    });
    return response;
  }

  /**
   * Cập nhật company theo ID
   */
  async update(id: string, payload: UpdateCompanyReq): Promise<Company> {
    const url = this.requestBuilder.buildUrl(id);
    const response = await httpClient.patch<Company, UpdateCompanyReq>({
      url,
      body: payload,
      typeCheck: (data) => ({
        success: true,
        data: data as Company,
      }),
    });
    return response;
  }

  /**
   * Xóa company theo ID
   */
  async delete(id: string): Promise<{ message: string }> {
    const url = this.requestBuilder.buildUrl(id);
    const response = await httpClient.delete<{ message: string }>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as { message: string },
      }),
    });
    return response;
  }

  /**
   * Get company statistics
   */
  async getStats(companyId: number): Promise<CompanyStats> {
    const url = this.requestBuilder.buildUrl(`${companyId}/stats`);
    const response = await httpClient.get<CompanyStats>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CompanyStats,
      }),
    });
    return response;
  }

  /**
   * Create a new schedule event for a company
   */
  async createEvent(
    companyId: number,
    data: CreateScheduleEventRequest,
  ): Promise<ScheduleEventResponse> {
    const url = this.requestBuilder.buildUrl(`${companyId}/events`);
    const response = await httpClient.post<
      ScheduleEventResponse,
      CreateScheduleEventRequest
    >({
      url,
      body: data,
      typeCheck: (data) => {
        return {
          success: true,
          data: data as ScheduleEventResponse,
        };
      },
      config: {
        withCredentials: false,
      },
    });
    return response;
  }

  /**
   * Get schedule events for a company
   */
  async getEvents(
    companyId: number,
    query?: GetScheduleEventsQuery,
  ): Promise<ScheduleEventsListResponse> {
    const queryParams = new URLSearchParams();

    if (query?.type) queryParams.append('type', query.type);
    if (query?.status) queryParams.append('status', query.status);
    if (query?.page) queryParams.append('page', query.page.toString());
    if (query?.limit) queryParams.append('limit', query.limit.toString());
    if (query?.startDate) queryParams.append('startDate', query.startDate);
    if (query?.endDate) queryParams.append('endDate', query.endDate);

    const url = this.requestBuilder.buildUrl(
      `${companyId}/events${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
    );

    const response = await httpClient.get<ScheduleEventsListResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as ScheduleEventsListResponse,
      }),
    });
    return response;
  }
}

export const companyService = new CompanyService();
