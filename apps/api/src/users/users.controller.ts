import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('users') // Base Path /users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me') // GET /users/me
  getMe(@GetUser('id') userId: number) {
    return this.usersService.findById(userId);
  }
}
