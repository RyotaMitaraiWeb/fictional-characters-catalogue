import { AuthService } from 'src/modules/auth/auth.service';
import { UniqueUsernameValidator } from './uniqueUsername.validators';
import { Test } from '@nestjs/testing';
import { PrismaService } from 'src/common/services/prisma.service';
import { ConfigService } from '@nestjs/config';

describe('UniqueUsername validator', () => {
  let authService: AuthService;
  let validator: UniqueUsernameValidator;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UniqueUsernameValidator, AuthService, PrismaService, ConfigService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    validator = module.get<UniqueUsernameValidator>(UniqueUsernameValidator);
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('Returns true when the user does not exist', async () => {
    jest.spyOn(authService, 'usernameExists').mockResolvedValueOnce(false);

    const exists = await validator.validate('a');
    expect(exists).toBe(true);
  });

  it('Returns false when the user exists', async () => {
    jest.spyOn(authService, 'usernameExists').mockResolvedValueOnce(true);

    const exists = await validator.validate('a');
    expect(exists).toBe(false);
  });
});
