import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';

export default function handleRequestError(error: any, message: string) {
  throw new HttpException(error.message || message, HttpStatus.BAD_REQUEST);
}
