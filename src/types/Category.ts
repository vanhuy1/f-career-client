// src/types/Category.ts

export interface Category {
  id: string;
  name: string;
}

/** Mảng Category trả về khi gọi GET /categories */
export type CategoryListResponse = Category[];

/** Payload khi tạo mới category */
export interface CreateCategoryReq {
  name: string;
}

/** Payload khi cập nhật category */
export type UpdateCategoryReq = Partial<CreateCategoryReq>;
