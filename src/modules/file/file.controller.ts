import {
  Post,
  Controller,
  UseInterceptors,
  UploadedFile,
  Body,
} from '@nestjs/common';
import handleRequestError from 'src/util/handleRequestError';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: string },
  ) {
    try {
      return await this.fileService.uploadFile(file, body.userId);
    } catch (error) {
      handleRequestError(error, '上传文件失败');
    }
  }
}
