import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(errorMessage: string) {
    super(errorMessage, HttpStatus.UNAUTHORIZED);
  }
}
