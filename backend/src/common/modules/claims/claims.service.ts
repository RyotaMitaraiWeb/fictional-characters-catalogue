import { Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ClaimsDto } from './dto/claims.dto';

@Injectable({ scope: Scope.REQUEST })
export class ClaimsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private _jwtSecret = this.configService.get('JWT_SECRET');
  claims: ClaimsDto | null = null;

  async setClaims(request: Request): Promise<void> {
    const authorization = request.headers.authorization;
    if (!authorization) {
      this.claims = null;
      return;
    }

    const token = authorization.replace('Bearer ', '');
    try {
      const data: ClaimsDto = await this.jwtService.verifyAsync(token, { secret: this._jwtSecret });

      const claims = new ClaimsDto();
      claims.id = data.id;
      claims.username = data.username;

      this.claims = claims;
    } catch {
      this.claims = null;
    }
  }
}
