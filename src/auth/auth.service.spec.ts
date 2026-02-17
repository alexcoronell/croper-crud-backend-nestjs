import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import { generateUserModelFaker } from '@faker/user.faker';

/* eslint-disable @typescript-eslint/unbound-method */
describe('AuthService', () => {
  let service: AuthService;

  // Mock for Express Response
  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  const mockUserService = {
    findByUsernameForAuth: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
    verify: jest.fn(),
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should set cookie and return user info on valid credentials', async () => {
      const mockUser = generateUserModelFaker();
      const loginDto: LoginDto = {
        username: mockUser.username!,
        password: 'Password123!',
      };

      mockUserService.findByUsernameForAuth.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const result = await service.login(loginDto, mockResponse);

      // Assertions for Cookie strategy
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'mock-jwt-token',
        expect.any(Object),
      );
      expect(result).not.toHaveProperty('access_token'); // Should not return token in body
      expect(result.user.username).toBe(mockUser.username);
      expect(result.message).toBe('Login successful');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const mockUser = generateUserModelFaker();
      mockUserService.findByUsernameForAuth.mockResolvedValue(mockUser);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        service.login({ username: 'user', password: 'wrong' }, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUserService.findByUsernameForAuth.mockResolvedValue(null);

      await expect(
        service.login({ username: 'ghost', password: 'any' }, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should call clearCookie with correct parameters', () => {
      const result = service.logout(mockResponse);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        'access_token',
        expect.any(Object),
      );
      expect(result.message).toBe('Logged out successfully');
    });
  });
});
