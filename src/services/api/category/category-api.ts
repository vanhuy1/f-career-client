// src/services/api/category/category-api.ts

import {
  Category,
  CategoryListResponse,
  CreateCategoryReq,
  UpdateCategoryReq,
} from '@/types/Category';
import { httpClient } from '@/utils/axios';
import { RequestBuilder } from '@/utils/axios/request-builder';

class CategoryService {
  private rb = new RequestBuilder().setResourcePath('categories');

  /** GET /categories */
  async findAll(): Promise<CategoryListResponse> {
    const url = this.rb.buildUrl();
    return httpClient.get<CategoryListResponse>({
      url,
      typeCheck: (data) => ({
        success: true,
        data: data as CategoryListResponse,
      }),
    });
  }

  /** GET /categories/:id */
  async findOne(id: string): Promise<Category> {
    const url = this.rb.buildUrl(id);
    return httpClient.get<Category>({
      url,
      typeCheck: (data) => ({ success: true, data: data as Category }),
    });
  }

  /** POST /categories */
  async create(payload: CreateCategoryReq): Promise<Category> {
    const url = this.rb.buildUrl();
    return httpClient.post<Category, CreateCategoryReq>({
      url,
      body: payload,
      typeCheck: (data) => ({ success: true, data: data as Category }),
    });
  }

  /** PATCH /categories/:id */
  async update(id: string, payload: UpdateCategoryReq): Promise<Category> {
    const url = this.rb.buildUrl(id);
    return httpClient.patch<Category, UpdateCategoryReq>({
      url,
      body: payload,
      typeCheck: (data) => ({ success: true, data: data as Category }),
    });
  }

  /** DELETE /categories/:id */
  async delete(id: string): Promise<void> {
    const url = this.rb.buildUrl(id);
    await httpClient.delete<void>({
      url,
      typeCheck: (data) => ({ success: true, data }),
    });
  }
}

export const categoryService = new CategoryService();
