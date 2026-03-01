import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Ip,
  Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetNonceDto, VerifySignatureDto } from './dto/verify-signature.dto';
import { GetUser } from './decorators/user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Request a nonce to sign.
   * Rate limited: 10/min per IP.
   */
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Get('nonce')
  getNonce(@Query() dto: GetNonceDto, @Ip() ip: string) {
    return this.authService.generateNonce(dto.address, ip);
  }

  /**
   * Submit signed SIWE message and receive JWT.
   * Rate limited: 5/min per IP.
   */
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @HttpCode(HttpStatus.OK)
  @Post('verify')
  verify(
    @Body() dto: VerifySignatureDto,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.authService.verifySignature(dto, ip, userAgent);
  }

  /**
   * Logout
   * Server logs the event; add a blocklist here if needed.
   */
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  logout(@GetUser('userId') userId: number, @Ip() ip: string) {
    return this.authService.logout(userId, ip);
  }
}
