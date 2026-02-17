import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { generateUserModelFaker } from '@faker/user.faker';

/* eslint-disable @typescript-eslint/unbound-method */
describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockUserService = {
    findByUsernameForAuth: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return an access_token and user info on valid credentials', async () => {
      const mockUser = generateUserModelFaker();
      const loginDto: LoginDto = {
        username: mockUser.username!,
        password: 'Password123!',
      };

      mockUserService.findByUsernameForAuth.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('access_token');
      expect(result.user.username).toBe(mockUser.username);
      expect(jwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = generateUserModelFaker();
      mockUserService.findByUsernameForAuth.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        service.login({ username: 'user', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserService.findByUsernameForAuth.mockResolvedValue(null);

      await expect(
        service.login({ username: 'ghost', password: 'any' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
