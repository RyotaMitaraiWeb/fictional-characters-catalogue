import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  _jwtSecret = this.configService.get('JWT_SECRET');
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const headers = request.headers;
    const authorization = headers.authorization;

    const token = this._extractToken(authorization);
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this._jwtSecret,
      });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private _extractToken(authorization: string | undefined): string {
    if (!authorization) {
      return '';
    }

    return authorization.replace('Bearer ', '');
  }
}
