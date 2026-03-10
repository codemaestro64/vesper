import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetNonceDto, VerifySignatureDto } from './dto';
import { NonceResponse, VerifySignatureResponse } from '@vesper/types';
import { GetUser } from './decorators/user.decorator';

@Controller('auth') // Base Path /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Request a nonce to sign.
   * Rate limited: 10/min per IP.
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('nonce') // GET /auth/nonce
  getNonce(
    @Query() dto: GetNonceDto,
    @Ip() ip: string,
  ): Promise<NonceResponse> {
    return this.authService.generateNonce(dto.address, dto.chainId, ip);
  }

  /**
   * Submit signed SIWE message and receive JWT.
   * Rate limited: 5/min per IP.
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('verify') // POST /auth/verify
  async verify(
    @Body() dto: VerifySignatureDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VerifySignatureResponse> {
    const resp = await this.authService.verifySignature(dto, ip, userAgent);

    res.cookie('token', resp.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: resp.expiresIn - Date.now(),
    });

    return resp;
  }

  /**
   * Logout
   * Server logs the event
   */
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout') // POST /auth/logout
  async logout(
    @GetUser('walletAddress') walletAddress: string,
    @Ip() ip: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const resp = await this.authService.logout(walletAddress, ip);
    res.clearCookie('token');
    return resp;
  }
}
