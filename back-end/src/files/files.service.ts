import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class FilesService {
  public createFileName(base64String: string): string {
    const prefix = 'data:image/';
    const startIndex = base64String.indexOf(prefix);
    const endIndex = base64String.indexOf(';base64,');
    let extension = base64String.substring(
      startIndex + prefix.length,
      endIndex,
    );
    extension = extension === 'svg+xml' ? 'svg' : extension;
    return uuidV4() + '.' + extension;
  }

  public async createImageFile(base64String: string): Promise<string> {
    try {
      const fileName = this.createFileName(base64String);
      const filePath = path.resolve(__dirname, '..', '..', 'static');
      const base64Data = base64String.split(';base64,').pop() as string;
      const decodedData = Buffer.from(base64Data, 'base64');
      if (!fs.existsSync(filePath)) {
        await fs.promises.mkdir(filePath, { recursive: true });
      }
      await fs.promises.writeFile(path.join(filePath, fileName), decodedData);
      return fileName;
    } catch (e) {
      throw new InternalServerErrorException('Something went wrong');
    }
  }

  public async removeImageFile(fileName: string): Promise<void> {
    const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
    fs.unlink(filePath, (err) => {
      if (err) {
        throw new InternalServerErrorException('File is not removed');
      } else {
        return;
      }
    });
  }
}
