import { Injectable } from '@nestjs/common';
import { TosService } from '../tos/tos.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../../entitys/File';
import path from 'path';
import crypto from 'crypto';
@Injectable()
export class FileService {
  private bucketName = 'blog123';
  constructor(
    private readonly tosService: TosService,
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}
  async uploadFile(file: Express.Multer.File, userId: string) {
    const fileExt = path.extname(file.originalname);
    const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExt}`;
    const fileUrl = `https://${this.bucketName}.tos-cn-beijing.volces.com/${fileName}`;
    const fileSize = file.size;
    const uploadResult = await this.tosService.tosClient.putObject({
      bucket: this.bucketName,
      key: fileName,
      body: file.buffer,
    });
    if (uploadResult.statusCode === 200) {
      const fileEntity = this.fileRepository.create({
        fileName,
        fileSize,
        fileUrl,
        user: {
          id: userId,
        },
      });
      await this.fileRepository.save(fileEntity);
      return fileEntity;
    }
    throw new Error('上传失败');
  }
}
