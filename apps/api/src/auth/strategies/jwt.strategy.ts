import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';
import { UserResponse } from '@vesper/types';
import { CONFIG } from '@/config/config.keys';

export interface JwtPayload {
  sub: string; // wallet address
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const secret = configService.get<string>(CONFIG.JWT_SECRET)!;

    super({
      jwtFromRequest: (req: Request) =>
        (req.cookies as Record<string, string>)?.token ?? null,
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload): Promise<UserResponse> {
    const user = await this.usersService.find(payload.sub);

    if (!user) throw new UnauthorizedException('User not found');
    if (user.bannedAt) throw new ForbiddenException('Account suspended');

    return user;
  }
}
