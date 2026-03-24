import { UserResponse } from '@/user';
export interface GetNonceRequest {
    address: string;
    chainId: number;
}
export interface NonceResponse {
    nonce: string;
    message: string;
}
export interface VerifySignatureRequest {
    message: string;
    signature: string;
}
export interface VerifySignatureResponse {
    accessToken: string;
    expiresIn: number;
    user: UserResponse;
}
//# sourceMappingURL=auth.d.ts.map