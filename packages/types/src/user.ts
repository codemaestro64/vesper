export interface GetUserRequest {
  walletAddress: string;
}

export interface UserResponse {
  walletAddress: string;
  ens: string | null;
  createdAt: string; // ISO 8601
  lastLoginAt: string; // ISO 8601
  bannedAt: string | null; // ISO 8601
}
