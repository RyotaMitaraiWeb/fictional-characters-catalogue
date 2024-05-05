import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import { SuccessfulAuthenticationDto } from './dto/successfulAuthentication.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private readonly _saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS'));

  async register(registerBody: AuthRequestDto): Promise<SuccessfulAuthenticationDto> {
    const user = await this.prisma.user.create({
      data: {
        username: registerBody.username,
        password: await bcrypt.hash(registerBody.password, this._saltRounds),
        roles: ['User'],
      },
    });

    const result = new SuccessfulAuthenticationDto();
    result.id = user.id;
    result.username = user.username;

    return result;
  }
}
