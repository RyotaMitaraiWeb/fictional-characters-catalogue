import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let prisma: PrismaService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, ConfigService, PrismaService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    config = module.get<ConfigService>(ConfigService);

    jest.spyOn(config, 'get').mockReturnValueOnce('10');
    jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('a' as never);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('Returns a user if created successfully', async () => {
      const register = new AuthRequestDto();
      register.username = 'a';
      register.password = '1';

      const user = {
        id: 1,
        username: register.username,
        password: register.password,
        roles: ['User'],
      };

      jest.spyOn(prisma.user, 'create').mockResolvedValueOnce(user);

      const result = await service.register(register);
      expect(result.id).toBe(user.id);
      expect(result.username).toBe(user.username);
    });
  });

  describe('login', () => {
    it('Returns a user if login is successful', async () => {
      const login = new AuthRequestDto();
      login.username = 'a';
      login.password = '1';

      const user = {
        id: 1,
        username: login.username,
        password: login.password,
        roles: ['User'],
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true as never);

      const result = await service.login(login);
      expect(result.id).toBe(user.id);
      expect(result.username).toBe(user.username);
    });

    it('Throws an Unauthorized exception if the user does not exist', async () => {
      const login = new AuthRequestDto();
      login.username = 'a';
      login.password = '1';

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      expect(() => service.login(login)).rejects.toThrow(UnauthorizedException);
    });

    it('Throws an Unauthorized exception if the password is wrong', async () => {
      const login = new AuthRequestDto();
      login.username = 'a';
      login.password = '1';

      const user = {
        id: 1,
        username: login.username,
        password: login.password,
        roles: ['User'],
      };

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false as never);

      expect(() => service.login(login)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('usernameExists', () => {
    it('Returns true if a user exists', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({} as any);

      const result = await service.usernameExists('a');
      expect(result).toBe(true);
    });

    it('Returns false if a user does not exist', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      const result = await service.usernameExists('a');
      expect(result).toBe(false);
    });
  });
});
