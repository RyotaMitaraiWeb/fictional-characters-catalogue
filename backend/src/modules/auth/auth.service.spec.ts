import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/services/prisma.service';
import { AuthRequestDto } from './dto/authRequest.dto';
import * as bcrypt from 'bcrypt';

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
});
