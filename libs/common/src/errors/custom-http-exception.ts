import { HttpException, HttpStatus } from '@nestjs/common';

interface Error {
  message?: string;
  status?: number | HttpStatus;
}

export class CustomHttpException extends HttpException {
  constructor(e: Error) {
    super(
      e?.message || 'Internal Server Error',
      e?.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
