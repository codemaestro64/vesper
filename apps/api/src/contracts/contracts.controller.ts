import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/contract.dto';
import { GetUser } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('/me/contracts')
  findAll(@GetUser('userId') userId: number) {
    return this.contractsService.findAllByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @GetUser('userId') userId: number) {
    return this.contractsService.findOne(id, userId);
  }

  @Post()
  create(@Body() dto: CreateContractDto, @GetUser('userId') userId: number) {
    return this.contractsService.create(userId, dto);
  }
}
