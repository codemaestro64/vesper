import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SiweMessage, type SiweMessage as SiweMessageData } from 'siwe';
import { isAddress } from 'ethers';
import { NonceService } from '@/nonce/nonce.service';
import { UsersService } from '@/users/users.service';
import { DRIZZLE, type DrizzleDB } from '../database/database.module';
import { AuditAction, auditLogs } from '@vesper/database';
import { JwtPayload } from './strategies/jwt.strategy';
import {
  NonceResponse,
  VerifySignatureDto,
  VerifySignatureResponse,
} from './dto';
import { CONFIG } from '@/config/config.keys';

interface AuditLogInput {
  action: AuditAction;
  walletAddress?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuthService {
  private readonly supportedChainIds: readonly number[];
  private readonly siweDomain: string;
  private readonly siweUri: string;
  private readonly jwtDuration: number;

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly nonceService: NonceService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.supportedChainIds = this.configService.get<number[]>(
      CONFIG.SUPPORTED_CHAIN_IDS,
    )!;
    this.siweDomain = this.configService.get<string>(CONFIG.APP_DOMAIN)!;
    this.siweUri = this.configService.get<string>(CONFIG.APP_URI)!;
    this.jwtDuration = this.configService.get<number>(CONFIG.JWT_DURATION)!;
  }

  async generateNonce(
    address: string,
    ipAddress?: string,
  ): Promise<NonceResponse> {
    if (!isAddress(address)) {
      throw new BadRequestException('Invalid Ethereum address');
    }

    await this.usersService.findOrCreate({
      walletAddress: address,
    });

    const nonce: string = await this.nonceService.generate(address);

    const siweMessage = new SiweMessage({
      domain: this.siweDomain,
      address,
      statement: 'Sign in with your Ethereum wallet.',
      uri: this.siweUri,
      version: '1',
      nonce,
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    await this.log({
      action: AuditAction.NONCE_GENERATED,
      walletAddress: address.toLowerCase(),
      ipAddress,
    });

    return {
      nonce,
      message: siweMessage.prepareMessage(),
    };
  }

  async verifySignature(
    dto: VerifySignatureDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<VerifySignatureResponse> {
    const fields = await this.verifySiweMessage(dto);

    this.validateDomain(fields);
    this.validateUri(fields);
    this.validateChain(fields.chainId);

    const nonceValid: boolean = await this.nonceService.consume(
      fields.address,
      fields.nonce,
    );

    if (!nonceValid) {
      await this.log({
        action: AuditAction.LOGIN_FAILED,
        walletAddress: fields.address.toLowerCase(),
        ipAddress,
        metadata: { reason: 'Invalid or expired nonce' },
      });

      throw new UnauthorizedException('Invalid or expired nonce');
    }

    const user = await this.usersService.findOrCreate({
      walletAddress: fields.address,
    });

    const payload: JwtPayload = {
      sub: user.walletAddress,
    };

    const options: JwtSignOptions = {
      expiresIn: this.jwtDuration,
    };

    const token: string = this.jwtService.sign(payload, options);

    await this.log({
      action: AuditAction.LOGIN_SUCCESS,
      walletAddress: user.walletAddress,
      ipAddress,
      userAgent,
      metadata: { chainId: fields.chainId },
    });

    return {
      accessToken: token,
      expiresIn: String(this.jwtDuration),
      user,
    };
  }

  async logout(walletAddress: string, ipAddress?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGOUT,
      walletAddress: walletAddress,
      ipAddress,
    });
  }

  private async verifySiweMessage(
    dto: VerifySignatureDto,
  ): Promise<SiweMessageData> {
    try {
      const siweMessage = new SiweMessage(dto.message);
      const { data } = await siweMessage.verify({
        signature: dto.signature,
      });
      return data;
    } catch {
      throw new UnauthorizedException('Signature verification failed');
    }
  }

  private validateDomain(fields: SiweMessageData): void {
    if (fields.domain !== this.siweDomain) {
      throw new UnauthorizedException('Domain mismatch');
    }
  }

  private validateUri(fields: SiweMessageData): void {
    if (fields.uri !== this.siweUri) {
      throw new UnauthorizedException('URI mismatch');
    }
  }

  private validateChain(chainId: number): void {
    if (!this.supportedChainIds.includes(chainId)) {
      throw new UnauthorizedException(`Unsupported chain: ${chainId}`);
    }
  }

  private parseChainIds(chainIds: number[]): readonly number[] {
    if (chainIds.length === 0) {
      throw new Error('SUPPORTED_CHAIN_IDS must contain valid numbers');
    }

    return chainIds;
  }

  private async log(data: AuditLogInput): Promise<void> {
    await this.db.insert(auditLogs).values({
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    });
  }
}
