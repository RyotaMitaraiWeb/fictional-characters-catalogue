import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import { SuccessfulAuthenticationResponseDto } from './dto/successfulAuthenticationResponse.dto';
import { SuccessfulAuthenticationDto } from './dto/successfulAuthentication.dto';
import { TokensDto } from './dto/tokens.dto';
import { randomUUID } from 'crypto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  async register(@Body() body: AuthRequestDto): Promise<SuccessfulAuthenticationResponseDto> {
    const user = await this.authService.register(body);
    const tokens = await this._generateTokens(user);

    const res = new SuccessfulAuthenticationResponseDto();
    res.user = user;
    res.tokens = tokens;
    return res;
  }

  @Post('login')
  async login(@Body() body: AuthRequestDto): Promise<SuccessfulAuthenticationResponseDto> {
    const user = await this.authService.login(body);
    const tokens = await this._generateTokens(user);

    const res = new SuccessfulAuthenticationResponseDto();
    res.user = user;
    res.tokens = tokens;
    return res;
  }

  @Post('refresh')
  async refresh(@Body() tokensBody: TokensDto): Promise<SuccessfulAuthenticationResponseDto> {
    try {
      const user = await this.jwtService.verifyAsync(tokensBody.refresh);
      const tokens = await this._generateTokens(user);
      return {
        user: {
          id: user.id,
          username: user.username,
        },
        tokens,
      };
    } catch {
      throw new UnauthorizedException('Refresh token invalid or expired, please reauthenticate');
    }
  }

  @Get('username-exists')
  @HttpCode(HttpStatus.NO_CONTENT)
  async usernameExists(@Query('username') username: string): Promise<undefined> {
    const usernameExists = await this.authService.usernameExists(username);
    if (!usernameExists) {
      throw new NotFoundException();
    }

    return;
  }

  private async _generateTokens(user: SuccessfulAuthenticationDto): Promise<TokensDto> {
    const [access, refresh] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: user.id,
          username: user.username,
        },
        { expiresIn: '5m' },
      ),
      this.jwtService.signAsync(
        {
          id: user.id,
          username: user.username,
          uuid: randomUUID(),
        },
        {
          expiresIn: '15d',
        },
      ),
    ]);

    return { access, refresh };
  }
}
