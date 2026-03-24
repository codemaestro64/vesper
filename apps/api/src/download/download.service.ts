import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Response } from 'express';
import * as archiver from 'archiver';
import { hardhatFiles, foundryFiles } from './template';
import type { DownloadDto } from './dto';

@Injectable()
export class DownloadService {
  /**
   * Streams a zip archive directly into the Express response.
   * The caller (controller) must NOT call res.json() or res.send() after this.
   */
  async streamZip(req: DownloadDto, res: Response): Promise<void> {
    const name = this.sanitiseName(req.contractName);
    const files =
      req.format === 'hardhat'
        ? hardhatFiles(name, req.code)
        : foundryFiles(name, req.code);

    const filename = `${name}-${req.format}.zip`;

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    // Allow the frontend to read the Content-Disposition header
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    const archive = archiver.default('zip', { zlib: { level: 6 } });

    archive.on('error', (err: Error) => {
      // Headers already sent — can't send an error response, just destroy
      console.error('[DownloadService] archiver error', err);
      res.destroy(err);
    });

    archive.pipe(res);

    for (const [filePath, content] of Object.entries(files)) {
      archive.append(content, { name: filePath });
    }

    await archive.finalize();
  }

  /** Strip everything that isn't a valid Solidity identifier character */
  private sanitiseName(raw: string): string {
    const cleaned = raw.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 64);
    if (!cleaned)
      throw new InternalServerErrorException('Invalid contract name');
    return cleaned;
  }
}
