/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/* Service & Logic */
import { UserService } from './user.service';
import { User } from './schema/user.schema';
import { UserRole } from './enums/user-role.enum';

/* Fakers */
import {
  createUserFaker,
  generateUserModelFaker,
  generateManyUserModels,
} from '@faker/user.faker';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hashSync: jest.fn(() => 'hashedPassword'),
  compareSync: jest.fn(() => true),
}));

describe('UserService', () => {
  let service: UserService;

  // Mock instance that will be returned by the constructor
  const mockSave = jest.fn();
  const mockInstance = {
    save: mockSave,
  };

  // Mocking the Mongoose Model as a constructor function
  const mockUserModel = jest.fn().mockImplementation(() => mockInstance) as any;
  mockUserModel.find = jest.fn();
  mockUserModel.findOne = jest.fn();
  mockUserModel.findById = jest.fn();
  mockUserModel.findByIdAndUpdate = jest.fn();
  mockUserModel.findByIdAndDelete = jest.fn();
  mockUserModel.countDocuments = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Test Create logic with Hashing and Mapping
   */
  describe('create', () => {
    it('should create a user, hash password, and return ResponseUserDto', async () => {
      const dto = createUserFaker({
        password: 'secretPassword',
        role: UserRole.ADMIN,
      });
      const savedUser = generateUserModelFaker();
      savedUser.role = UserRole.ADMIN;

      mockSave.mockResolvedValue(savedUser);

      const result = await service.create(dto);

      expect(bcrypt.hashSync).toHaveBeenCalledWith('secretPassword', 10);
      expect(result).not.toHaveProperty('password');
      expect(result.role).toBe(UserRole.ADMIN);
      expect(result.fullName).toBe(savedUser.fullName);
    });

    it('should throw BadRequestException if email or username already exists (Mongo Error 11000)', async () => {
      const dto = createUserFaker();

      mockSave.mockRejectedValue({
        code: 11000,
        keyPattern: { username: 1 },
      });

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });
  });

  /**
   * Test retrieval with pagination
   */
  describe('findAll', () => {
    it('should return paginated users with metadata', async () => {
      const mockUsers = generateManyUserModels(2);
      mockUserModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUsers),
      });
      mockUserModel.countDocuments.mockResolvedValue(15);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(2);
      expect(result.data[0]).not.toHaveProperty('password');
      expect(result.data[0]).toHaveProperty('role');
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.lastPage).toBe(2);
    });

    it('should handle pagination with page 2', async () => {
      const mockUsers = generateManyUserModels(3);
      mockUserModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockUsers),
      });
      mockUserModel.countDocuments.mockResolvedValue(25);

      const result = await service.findAll(2, 10);

      expect(result.page).toBe(2);
      expect(result.total).toBe(25);
      expect(result.lastPage).toBe(3);
    });
  });

  /**
   * Test ID validation and retrieval
   */
  describe('findOne', () => {
    it('should return a user if valid ID is provided', async () => {
      const validId = '65ae1f2b9d3e2a1b8c7d6e5f'; // Real-like Mongo ID
      const mockUser = generateUserModelFaker(validId);

      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findOne(validId);
      expect(result.username).toBe(mockUser.username);
    });

    it('should throw BadRequestException if ID format is invalid', async () => {
      await expect(service.findOne('not-a-valid-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const validId = '65ae1f2b9d3e2a1b8c7d6e5f';
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(validId)).rejects.toThrow(NotFoundException);
    });
  });

  /**
   * Test update logic
   */
  describe('update', () => {
    it('should update and return the mapped user', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const updateData = { fullName: 'Updated Name' };
      const updatedUser = generateUserModelFaker(id);
      updatedUser.fullName = 'Updated Name';

      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedUser),
      });

      const result = await service.update(id, updateData);
      expect(result.fullName).toBe('Updated Name');
    });
  });

  /**
   * Test deletion
   */
  describe('remove', () => {
    it('should successfully delete a user', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ _id: id }),
      });

      await expect(service.remove(id)).resolves.toBeUndefined();
    });
  });
});
