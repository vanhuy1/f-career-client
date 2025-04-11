import { AxiosRequestConfig } from 'axios';
import { ParseParams, SafeParseReturnType } from 'zod';

export type GlobalError = {
  messages?: string[];
};

export type ApiSuccessResponse<T> = T; // Changed to just T, no wrapper

export type ApiFailureResponse = {
  errorType: string | string[];
  message: string;
  statusCode: number | string;
  timestamp: number;
};

export type GetRequestProps = {
  url: string;
  typeCheck?: (
    data: unknown,
    params?: Partial<ParseParams>,
  ) => SafeParseReturnType<unknown, unknown>;
  config?: AxiosRequestConfig;
};

export type PostRequestProps<T> = {
  url: string;
  typeCheck?: (
    data: unknown,
    params?: Partial<ParseParams>,
  ) => SafeParseReturnType<unknown, unknown>;
  body: T;
  config?: AxiosRequestConfig;
};

export type PutRequestProps<T> = PostRequestProps<T>;
export type PatchRequestProps<T> = PostRequestProps<T>;
export type DeleteRequestProps = GetRequestProps;
