import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/common/services/prisma.service';
import { ConfigService } from '@nestjs/config';
import { SuccessfulAuthenticationDto } from './dto/successfulAuthentication.dto';
import { AuthRequestDto } from './dto/authRequest.dto';
import { TokensDto } from './dto/tokens.dto';
import { randomUUID } from 'crypto';
import { UnauthorizedException } from '@nestjs/common';

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

  describe('login', () => {
    it('Returns correct response when successful', async () => {
      const register = new AuthRequestDto();
      register.username = 'ryota';
      register.password = '123456';

      const user: SuccessfulAuthenticationDto = new SuccessfulAuthenticationDto();
      user.id = 1;
      user.username = register.username;

      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('a').mockResolvedValueOnce('b');
      jest.spyOn(authService, 'login').mockResolvedValueOnce(user);

      const result = await controller.login(register);

      expect(result.user).toEqual(user);
      expect(result.tokens).toEqual({ access: 'a', refresh: 'b' });
    });
  });

  describe('refresh', () => {
    it('Returns tokens and user when successful', async () => {
      const tokens: TokensDto = {
        access: 'a',
        refresh: 'b',
      };

      const user: SuccessfulAuthenticationDto = {
        id: 1,
        username: 'ryota',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({ ...user, uuid: randomUUID() });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce('c').mockResolvedValueOnce('d');

      const result = await controller.refresh(tokens);
      expect(result.tokens).toEqual({ access: 'c', refresh: 'd' });
      expect(result.user).toEqual(user);
    });

    it('Throws a 401 error if an error is thrown', async () => {
      const tokens: TokensDto = {
        access: 'a',
        refresh: 'b',
      };

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

      expect(() => controller.refresh(tokens)).rejects.toThrow(UnauthorizedException);
    });
  });
});
