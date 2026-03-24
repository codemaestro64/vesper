export interface GetUserRequest {
    walletAddress: string;
}
export interface UserResponse {
    walletAddress: string;
    ens: string | null;
    createdAt: string;
    lastLoginAt: string;
    bannedAt: string | null;
}
//# sourceMappingURL=user.d.ts.map