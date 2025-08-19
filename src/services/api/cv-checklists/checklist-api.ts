import {
  CompanyCvChecklist,
  CreateChecklistReq,
  UpdateChecklistReq,
  GetChecklistsQuery,
} from '@/types/CvChecklist';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class ChecklistService {
  private rb = new RequestBuilder().setResourcePath('companies');

  /**
   * Get all checklists for a company
   * GET /api/v1/companies/{companyId}/cv-checklists
   */
  async getByCompanyId(
    companyId: string,
    query?: GetChecklistsQuery,
  ): Promise<CompanyCvChecklist[]> {
    let url = this.rb.buildUrl(`${companyId}/cv-checklists`);

    // Build query parameters
    const queryParams: string[] = [];
    if (query?.page) queryParams.push(`page=${query.page}`);
    if (query?.limit) queryParams.push(`limit=${query.limit}`);
    if (query?.isActive !== undefined)
      queryParams.push(`isActive=${query.isActive}`);
    if (query?.isDefault !== undefined)
      queryParams.push(`isDefault=${query.isDefault}`);
    if (query?.search)
      queryParams.push(`search=${encodeURIComponent(query.search)}`);
    if (query?.sortBy) queryParams.push(`sortBy=${query.sortBy}`);
    if (query?.sortOrder) queryParams.push(`sortOrder=${query.sortOrder}`);

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    console.log(`[ChecklistService] GET request to: ${url}`);

    try {
      const response = await httpClient.get<CompanyCvChecklist[]>({
        url,
        typeCheck: (data) => ({
          success: true,
          data: data as CompanyCvChecklist[],
        }),
      });
      console.log(`[ChecklistService] GET response:`, response);
      return response;
    } catch (error) {
      console.error(`[ChecklistService] GET failed:`, error);
      throw error;
    }
  }

  /**
   * Get single checklist by ID
   * GET /api/v1/companies/{companyId}/cv-checklists/{id}
   */
  async findOne(
    companyId: string,
    checklistId: number,
  ): Promise<CompanyCvChecklist> {
    const url = this.rb.buildUrl(`${companyId}/cv-checklists/${checklistId}`);
    const response = await httpClient.get<CompanyCvChecklist>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CompanyCvChecklist,
      }),
    });
    return response;
  }

  /**
   * Create new checklist
   * POST /api/v1/companies/{companyId}/cv-checklists
   */
  async create(
    companyId: string,
    payload: CreateChecklistReq,
  ): Promise<CompanyCvChecklist> {
    const url = this.rb.buildUrl(`${companyId}/cv-checklists`);
    const response = await httpClient.post<
      CompanyCvChecklist,
      CreateChecklistReq
    >({
      url,
      body: payload,
      typeCheck: (data) => ({
        success: true,
        data: data as CompanyCvChecklist,
      }),
    });
    return response;
  }

  /**
   * Update existing checklist
   * PATCH /api/v1/companies/{companyId}/cv-checklists/{id}
   */
  async update(
    companyId: string,
    checklistId: number,
    payload: UpdateChecklistReq,
  ): Promise<CompanyCvChecklist> {
    const url = this.rb.buildUrl(`${companyId}/cv-checklists/${checklistId}`);
    const response = await httpClient.patch<
      CompanyCvChecklist,
      UpdateChecklistReq
    >({
      url,
      body: payload,
      typeCheck: (data) => ({
        success: true,
        data: data as CompanyCvChecklist,
      }),
    });
    return response;
  }

  /**
   * Delete checklist
   * DELETE /api/v1/companies/{companyId}/cv-checklists/{id}
   */
  async delete(companyId: string, checklistId: number): Promise<void> {
    const url = this.rb.buildUrl(`${companyId}/cv-checklists/${checklistId}`);
    console.log(`[ChecklistService] DELETE request to: ${url}`);

    try {
      await httpClient.delete<void>({
        url,
        typeCheck: (data) => ({ success: true, data: data }),
      });
      console.log(`[ChecklistService] DELETE successful`);
    } catch (error) {
      console.error(`[ChecklistService] DELETE failed:`, error);
      throw error;
    }
  }

  /**
   * Set checklist as default
   * POST /api/v1/companies/{companyId}/cv-checklists/{id}/set-default
   */
  async setDefault(
    companyId: string,
    checklistId: number,
  ): Promise<CompanyCvChecklist> {
    const url = this.rb.buildUrl(
      `${companyId}/cv-checklists/${checklistId}/set-default`,
    );
    console.log(`[ChecklistService] POST set-default request to: ${url}`);

    try {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      const response = await httpClient.post<CompanyCvChecklist, {}>({
        url,
        body: {},
        typeCheck: (data) => ({
          success: true,
          data: data as CompanyCvChecklist,
        }),
      });
      console.log(`[ChecklistService] POST set-default response:`, response);
      return response;
    } catch (error) {
      console.error(`[ChecklistService] POST set-default failed:`, error);
      throw error;
    }
  }

  // Note: duplicate, toggleActive, and getAnalytics endpoints
  // are not implemented in the backend yet

  /**
   * Validate checklist data before submission
   */
  validateChecklist(
    payload: CreateChecklistReq | UpdateChecklistReq,
  ): string[] {
    const errors: string[] = [];

    if ('checklistName' in payload) {
      if (!payload.checklistName || payload.checklistName.trim().length === 0) {
        errors.push('Checklist name is required');
      }
    }

    if (payload.checklistItems) {
      if (payload.checklistItems.length === 0) {
        errors.push('At least one checklist item is required');
      }

      payload.checklistItems.forEach((item, index) => {
        if (!item.criterion || item.criterion.trim().length === 0) {
          errors.push(`Item ${index + 1}: Criterion is required`);
        }

        if (item.weight < 1 || item.weight > 10) {
          errors.push(`Item ${index + 1}: Weight must be between 1 and 10`);
        }

        if (!item.id || item.id.trim().length === 0) {
          errors.push(`Item ${index + 1}: ID is required`);
        }
      });

      // Check for duplicate IDs
      const ids = payload.checklistItems.map((item) => item.id);
      const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
      if (duplicateIds.length > 0) {
        errors.push(`Duplicate item IDs found: ${duplicateIds.join(', ')}`);
      }
    }

    return errors;
  }
}

export const checklistService = new ChecklistService();
