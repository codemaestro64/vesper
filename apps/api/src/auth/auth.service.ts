import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { SiweMessage } from 'siwe';
import { isAddress } from 'ethers';
import { NonceService } from '../nonce/nonce.service';
import { UsersService } from '../users/users.service';
import { DRIZZLE, type DrizzleDB } from '../database/database.module';
import {
  AuditAction,
  type AuditAction as AuditActionType,
  auditLogs,
} from '@vesper/database';
import { VerifySignatureDto } from './dto/verify-signature.dto';

@Injectable()
export class AuthService {
  private readonly supportedChainIds: number[];

  constructor(
    @Inject(DRIZZLE) private readonly db: DrizzleDB,
    private readonly nonceService: NonceService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    const chainIds = this.configService.get<string>(
      'SUPPORTED_CHAIN_IDS',
      '1,137,42161,8453',
    );
    this.supportedChainIds = chainIds.split(',').map(Number);
  }

  async generateNonce(address: string, ipAddress?: string) {
    if (!isAddress(address))
      throw new BadRequestException('Invalid Ethereum address');

    // Ensure user row exists before inserting nonce (FK constraint)
    await this.usersService.findOrCreate({
      walletAddress: address,
      chainId: 1,
    });

    const nonce = await this.nonceService.generate(address);
    const domain = this.configService.get<string>(
      'APP_DOMAIN',
      'localhost:3000',
    );
    const uri = this.configService.get<string>(
      'APP_URI',
      'http://localhost:3000',
    );

    const siweMessage = new SiweMessage({
      domain,
      address,
      statement: 'Sign in with your Ethereum wallet.',
      uri,
      version: '1',
      chainId: 1,
      nonce,
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    });

    await this.log({
      action: AuditAction.NONCE_GENERATED,
      walletAddress: address.toLowerCase(),
      ipAddress,
    });

    return { nonce, message: siweMessage.prepareMessage() };
  }

  async verifySignature(
    dto: VerifySignatureDto,
    ipAddress?: string,
    userAgent?: string,
  ) {
    try {
      const siweMessage = new SiweMessage(dto.message);
      const { data: fields } = await siweMessage.verify({
        signature: dto.signature,
      });

      const expectedDomain = this.configService.get<string>(
        'APP_DOMAIN',
        'localhost:3000',
      );
      if (fields.domain !== expectedDomain) {
        throw new UnauthorizedException('Domain mismatch');
      }

      if (!this.supportedChainIds.includes(fields.chainId)) {
        throw new UnauthorizedException(`Unsupported chain: ${fields.chainId}`);
      }

      const valid = await this.nonceService.consume(
        fields.address,
        fields.nonce,
      );
      if (!valid) {
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
        chainId: fields.chainId,
      });

      const payload = { sub: user.id, address: user.walletAddress };
      const options: JwtSignOptions = {
        expiresIn: this.configService.get('JWT_EXPIRES_IN') ?? '24h',
      };

      const token = this.jwtService.sign(payload, options);

      await this.log({
        action: AuditAction.LOGIN_SUCCESS,
        userId: user.id,
        walletAddress: user.walletAddress,
        ipAddress,
        userAgent,
        metadata: { chainId: fields.chainId },
      });

      return {
        accessToken: token,
        expiresIn: options.expiresIn as string,
        user,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      throw new UnauthorizedException('Signature verification failed');
    }
  }

  async logout(userId: number, ipAddress?: string): Promise<void> {
    await this.log({
      action: AuditAction.LOGOUT,
      userId,
      ipAddress,
    });
  }

  private async log(data: {
    action: AuditActionType;
    userId?: number;
    walletAddress?: string;
    ipAddress?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
  }) {
    await this.db.insert(auditLogs).values({
      ...data,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    });
  }
}
