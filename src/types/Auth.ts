export interface AuthResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
  meta: {
    message: string;
    statusCode: number;
  };
}
