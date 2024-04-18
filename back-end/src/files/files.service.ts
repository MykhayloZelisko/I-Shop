import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import path from 'path';
import fs from 'fs';
import { v4 as uuidV4 } from 'uuid';
import { ReadStream } from 'graphql-upload-ts';
import { pipeline } from 'stream';
import { promisify } from 'util';

const pipeLine = promisify(pipeline);

@Injectable()
export class FilesService {
  public createFilePath(fileName: string): string {
    const newFileName = uuidV4() + path.extname(fileName);
    return path.resolve(__dirname, '..', 'static', newFileName);
  }

  public async removeImageFile(filePath: string): Promise<void> {
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new InternalServerErrorException('File is not removed');
      } else {
        return;
      }
    });
  }

  public async createFileStream(
    filePath: string,
    fileSize: number,
    stream: ReadStream,
  ): Promise<void> {
    const writeStream = fs.createWriteStream(filePath);
    let size = 0;

    const onData = (chunk: Buffer): void => {
      size += chunk.length;
      if (size > fileSize) {
        stream.destroy();
        fs.unlinkSync(filePath);
        throw new BadRequestException('File size exceeds the limit of 1MB');
      }
    };

    const onReadError = (): void => {
      new BadRequestException('File size exceeds the limit of 1MB');
    };

    const onWriteError = (): void => {
      new InternalServerErrorException('Could not save image');
    };

    stream.on('data', onData);
    stream.on('error', onReadError);
    writeStream.on('error', onWriteError);

    try {
      await pipeLine(stream, writeStream);
    } catch (error) {
      if (error.statusCode === HttpStatus.BAD_REQUEST) {
        throw new BadRequestException('File size exceeds the limit of 1MB');
      }
      throw new InternalServerErrorException('Could not save image');
    }
  }
}
