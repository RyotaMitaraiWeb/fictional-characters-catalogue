import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SuccessfulAuthenticationDto } from './dto/successfulAuthentication.dto';
import { AuthRequestDto } from './dto/authRequest.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let jwtService: JwtService;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [JwtService, AuthService, PrismaService, ConfigService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jwtService = module.get<JwtService>(JwtService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('Returns correct response when successful', async () => {
      const register = new AuthRequestDto();
      register.username = 'ryota';
      register.password = '123456';

      const user: SuccessfulAuthenticationDto = new SuccessfulAuthenticationDto();
      user.id = 1;
      user.username = register.username;

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('a').mockResolvedValueOnce('b');
      jest.spyOn(authService, 'register').mockResolvedValueOnce(user);

      const result = await controller.register(register);

      expect(result.user).toEqual(user);
      expect(result.tokens).toEqual({ access: 'a', refresh: 'b' });
    });
  });
});
