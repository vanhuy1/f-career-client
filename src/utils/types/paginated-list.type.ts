export type PaginatedList<T> = {
  content: T[];
  currentPage: number;
  skippedRecords: number;
  totalPages: number;
  hasNext: boolean;
  payloadSize: number;
  totalRecords: number;
};
