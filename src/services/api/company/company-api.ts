// src/services/companyService.ts

import {
  Company,
  CompanyListResponse,
  CreateCompanyReq,
  UpdateCompanyReq,
} from '@/types/Company';
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
}

export const companyService = new CompanyService();
