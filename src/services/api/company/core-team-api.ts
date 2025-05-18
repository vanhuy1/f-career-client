import {
  CoreTeamMember,
  CoreTeamListResponse,
  CoreTeamResponse,
  CreateCoreTeamReq,
  UpdateCoreTeamReq,
} from '@/types/CoreTeam';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class CoreTeamService {
  private requestBuilder: RequestBuilder;
  private companyId: string | null = null;

  constructor() {
    this.requestBuilder = new RequestBuilder();
  }

  setCompanyId(companyId: string) {
    this.companyId = companyId;
    this.requestBuilder.setResourcePath(`companies/${companyId}/core-team`);
    return this;
  }

  /**
   * Lấy danh sách thành viên core team của công ty
   */
  async findAll(): Promise<CoreTeamMember[]> {
    if (!this.companyId) {
      throw new Error('Company ID must be set before calling this method');
    }

    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.get<CoreTeamListResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CoreTeamListResponse,
      }),
    });

    return response.data;
  }

  /**
   * Thêm thành viên mới vào core team
   */
  async create(payload: CreateCoreTeamReq): Promise<CoreTeamMember> {
    if (!this.companyId) {
      throw new Error('Company ID must be set before calling this method');
    }

    const url = this.requestBuilder.buildUrl();
    const response = await httpClient.post<CoreTeamResponse, CreateCoreTeamReq>(
      {
        url,
        body: payload,
        typeCheck: (data) => ({
          success: true,
          data: data as CoreTeamResponse,
        }),
      },
    );

    return response.data;
  }

  /**
   * Cập nhật thông tin thành viên core team
   */
  async update(
    id: string,
    payload: UpdateCoreTeamReq,
  ): Promise<CoreTeamMember> {
    if (!this.companyId) {
      throw new Error('Company ID must be set before calling this method');
    }

    const url = this.requestBuilder.buildUrl(id);
    const response = await httpClient.patch<
      CoreTeamResponse,
      UpdateCoreTeamReq
    >({
      url,
      body: payload,
      typeCheck: (data) => ({
        success: true,
        data: data as CoreTeamResponse,
      }),
    });

    return response.data;
  }

  /**
   * Xóa thành viên khỏi core team
   */
  async delete(id: string): Promise<void> {
    if (!this.companyId) {
      throw new Error('Company ID must be set before calling this method');
    }

    const url = this.requestBuilder.buildUrl(id);
    await httpClient.delete<void>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as void,
      }),
    });
  }
}

export const coreTeamService = new CoreTeamService();
