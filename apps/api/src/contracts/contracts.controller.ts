import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ContractsService } from './contracts.service';
import {
  ContractResponse,
  CreateContractDto,
  UpdateContractDto,
} from './dto/contract.dto';
import { GetUser } from '../auth/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('contracts') // Base Path /contracts
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get('me') // GET /contracts/me
  findAll(@GetUser('id') userId: number): Promise<ContractResponse[]> {
    return this.contractsService.findAllByUser(userId);
  }

  @Get(':id') // GET /contracts/:id
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
  ): Promise<ContractResponse> {
    return this.contractsService.findOne(id, userId);
  }

  @Post() // POST /contracts
  create(
    @GetUser('id') userId: number,
    @Body() dto: CreateContractDto,
  ): Promise<ContractResponse> {
    return this.contractsService.create(userId, dto);
  }

  @Patch(':id') // PATCH /contracts/:id
  update(
    @Param('id', ParseIntPipe) id: number,
    @GetUser('id') userId: number,
    @Body() dto: UpdateContractDto,
  ): Promise<ContractResponse> {
    return this.contractsService.update(id, userId, dto);
  }
}
