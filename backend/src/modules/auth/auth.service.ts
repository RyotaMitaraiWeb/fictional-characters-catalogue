import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/services/prisma.service';
import { RegisterDto } from './dto/registerdto';
import { SuccessfulAuthenticationDto } from './dto/successfulAuthentication.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { roles } from 'src/common/constants/roles';
import { LoginDto } from './dto/loginDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  private readonly _saltRounds = Number(this.config.get('BCRYPT_SALT_ROUNDS'));
  private readonly _loginFailedMessage = 'Wrong username or password!';

  async register(registerBody: RegisterDto): Promise<SuccessfulAuthenticationDto> {
    const user = await this.prisma.user.create({
      data: {
        username: registerBody.username,
        password: await bcrypt.hash(registerBody.password, this._saltRounds),
        roles: {
          connect: {
            id: roles.user.id,
          },
        },
      },
    });

    return this._toSuccessfulAuthenticationDto(user);
  }

  async login(loginBody: LoginDto): Promise<SuccessfulAuthenticationDto> {
    const user = await this.prisma.user.findUnique({
      where: { username: loginBody.username },
    });
    if (user === null) {
      throw new UnauthorizedException(this._loginFailedMessage);
    }

    const passwordMatches = await bcrypt.compare(loginBody.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(this._loginFailedMessage);
    }

    return this._toSuccessfulAuthenticationDto(user);
  }

  async usernameExists(username: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { username }, select: { id: true } });
    return user !== null;
  }

  private _toSuccessfulAuthenticationDto(user: {
    id: number;
    username: string;
    password: string;
  }): SuccessfulAuthenticationDto {
    const result = new SuccessfulAuthenticationDto();
    result.id = user.id;
    result.username = user.username;

    return result;
  }
}
