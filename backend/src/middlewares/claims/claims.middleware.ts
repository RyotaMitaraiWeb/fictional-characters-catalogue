import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClaimsService } from 'src/common/modules/claims/claims.service';

@Injectable()
export class ClaimsMiddleware implements NestMiddleware {
  constructor(private readonly claimsService: ClaimsService) {}
  async use(req: Request, _res: Response, next: () => void) {
    await this.claimsService.setClaims(req);
    next();
  }
}
