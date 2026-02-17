import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { Response } from 'express';

/* eslint-disable @typescript-eslint/unbound-method */
describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const mockAuthService = {
    login: jest.fn(),
    logout: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return the result from authService.login', async () => {
      const loginDto = { username: 'testuser', password: 'password123' };
      const expectedResponse = {
        access_token: 'jwt-token',
        user: { username: 'testuser', role: 'customer' },
      };

      mockAuthService.login.mockResolvedValue(expectedResponse);

      const result = await controller.login(loginDto, mockResponse);

      expect(service.login).toHaveBeenCalledWith(loginDto, mockResponse);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with response object', () => {
      const expectedResponse = { message: 'Logged out successfully' };
      mockAuthService.logout.mockReturnValue(expectedResponse);

      const result = controller.logout(mockResponse);

      expect(service.logout).toHaveBeenCalledWith(mockResponse);
      expect(result).toEqual(expectedResponse);
    });
  });
});
