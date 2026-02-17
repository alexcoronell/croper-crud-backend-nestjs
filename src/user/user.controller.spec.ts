import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { createUserFaker, generateManyUserModels } from '@faker/user.faker';
import { UserRole } from './enums/user-role.enum';

/* eslint-disable @typescript-eslint/unbound-method */
describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  // Mocking the UserService methods
  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create (register)', () => {
    it('should call service.create and return the ResponseUserDto', async () => {
      const dto = createUserFaker();
      const expectedResponse = {
        fullName: dto.fullName,
        username: dto.username,
        email: dto.email,
        role: dto.role || UserRole.CUSTOMER,
      };

      mockUserService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('findAll', () => {
    it('should return an array of users from the service', async () => {
      const mockUsers = generateManyUserModels(2).map((u) => ({
        fullName: u.fullName,
        username: u.username,
        email: u.email,
        role: u.role,
      }));

      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should call service.findOne with the correct ID', async () => {
      const id = 'mongo-id-123';
      const mockResponse = {
        fullName: 'Test User',
        username: 'testuser',
        email: 'test@test.com',
        role: UserRole.CUSTOMER,
      };

      mockUserService.findOne.mockResolvedValue(mockResponse);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('update', () => {
    it('should call service.update with correct params', async () => {
      const id = 'user-id';
      const updateDto = { fullName: 'New Name' };
      const expectedResponse = {
        fullName: 'New Name',
        username: 'existing',
        email: 'test@test.com',
        role: UserRole.CUSTOMER,
      };

      mockUserService.update.mockResolvedValue(expectedResponse);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result.fullName).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should call service.remove and return undefined', async () => {
      const id = 'delete-me';
      mockUserService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });
  });
});
