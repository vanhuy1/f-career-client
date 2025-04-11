export interface Auth {
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
}
