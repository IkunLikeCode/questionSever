// 不能为空管道
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

import { HttpException, HttpStatus } from '@nestjs/common';

@Injectable()
export class NotEmptyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new HttpException(
        `${metadata.data}不能为空`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
