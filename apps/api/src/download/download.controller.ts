import {
  Body,
  Controller,
  HttpCode,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { DownloadDto } from './dto';
import { DownloadService } from './download.service';

@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async download(
    @Body() dto: DownloadDto,
    @Res() res: Response,
  ): Promise<void> {
    await this.downloadService.streamZip(dto, res);
  }
}
