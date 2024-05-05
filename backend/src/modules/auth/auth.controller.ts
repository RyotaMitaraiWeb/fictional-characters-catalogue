import { Body, Controller, Get } from '@nestjs/common';
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

  @Get('register')
  async register(@Body() body: AuthRequestDto): Promise<SuccessfulAuthenticationResponseDto> {
    const user = await this.authService.register(body);
    const tokens = await this._generateTokens(user);

    const res = new SuccessfulAuthenticationResponseDto();
    res.user = user;
    res.tokens = tokens;
    return res;
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
      this.jwtService.signAsync({
        id: user.id,
        uuid: randomUUID(),
      }),
    ]);

    return { access, refresh };
  }
}
