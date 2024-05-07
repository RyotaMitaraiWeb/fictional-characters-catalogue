import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let jwtService: JwtService;
  let guard: AuthGuard;
  let configSerice: ConfigService;

  const context = {
    switchToHttp() {
      return {
        getRequest() {
          {
            return {
              headers: {
                authorization: 'a',
              },
            };
          }
        },
      };
    },
  } as unknown as ExecutionContext;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService, ConfigService, AuthGuard],
    }).compile();

    jwtService = module.get<JwtService>(JwtService);
    configSerice = module.get<ConfigService>(ConfigService);
    guard = module.get<AuthGuard>(AuthGuard);

    jest.spyOn(configSerice, 'get').mockReturnValue('a');
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('Returns true if the token is valid', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({});

    const result = await guard.canActivate(context);
    expect(result).toBe(true);
  });

  it('Throws an unauthorized exception if the token is invalid', async () => {
    jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce('invalid token');

    expect(() => guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
  });
});
