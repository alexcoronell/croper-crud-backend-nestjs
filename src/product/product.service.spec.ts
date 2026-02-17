/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductService } from './product.service';
import { Product } from './schema/product.schema';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import {
  generateProductModelFaker,
  generateManyProductsModels,
  createProductFaker,
} from '@faker/product.faker';

describe('ProductService', () => {
  let service: ProductService;

  // Mock instance that will be returned by the constructor
  const mockSave = jest.fn();
  const mockInstance = {
    save: mockSave,
  };

  // Mocking the Mongoose Model as a constructor function
  const mockProductModel = jest
    .fn()
    .mockImplementation(() => mockInstance) as any;
  mockProductModel.find = jest.fn();
  mockProductModel.findById = jest.fn();
  mockProductModel.findByIdAndUpdate = jest.fn();
  mockProductModel.findByIdAndDelete = jest.fn();
  mockProductModel.countDocuments = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a product', async () => {
      const dto = createProductFaker();
      const createdProduct = generateProductModelFaker();

      mockSave.mockResolvedValue(createdProduct);

      const result = await service.create(dto);
      expect(result).toBeDefined();
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(createdProduct);
    });

    it('should throw BadRequestException when creation fails', async () => {
      const dto = createProductFaker();
      mockSave.mockRejectedValue(new Error('Database error'));

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException with error message', async () => {
      const dto = createProductFaker();
      mockSave.mockRejectedValue(new Error('Duplicate key error'));

      await expect(service.create(dto)).rejects.toThrow(
        'Error creating product: Duplicate key error',
      );
    });

    it('should handle non-Error exceptions', async () => {
      const dto = createProductFaker();
      mockSave.mockRejectedValue('String error');

      await expect(service.create(dto)).rejects.toThrow(
        'Error creating product: Unknown error',
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const mockProducts = generateManyProductsModels(5);
      const totalCount = 5;

      mockProductModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      });
      mockProductModel.countDocuments.mockResolvedValue(totalCount);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(totalCount);
      expect(result.data[0]).toHaveProperty('name');
    });

    it('should return empty array when no products exist', async () => {
      mockProductModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      });
      mockProductModel.countDocuments.mockResolvedValue(0);

      const result = await service.findAll(1, 10);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.lastPage).toBe(0);
    });

    it('should calculate pagination correctly', async () => {
      const mockProducts = generateManyProductsModels(10);
      const totalCount = 25;

      mockProductModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      });
      mockProductModel.countDocuments.mockResolvedValue(totalCount);

      const result = await service.findAll(2, 10);

      expect(result.page).toBe(2);
      expect(result.total).toBe(25);
      expect(result.lastPage).toBe(3);
      expect(mockProductModel.find).toHaveBeenCalledWith({ isActive: true });
    });

    it('should use default pagination values', async () => {
      const mockProducts = generateManyProductsModels(10);
      mockProductModel.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockProducts),
      });
      mockProductModel.countDocuments.mockResolvedValue(10);

      const result = await service.findAll();

      expect(result.page).toBe(1);
      expect(result.data).toHaveLength(10);
    });
  });

  describe('findOne', () => {
    it('should return a specific product using overrides', async () => {
      const customId = '65ae1f2b9d3e2a1b8c7d6e5f';
      const mockProduct = generateProductModelFaker(customId);

      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.findOne(customId);
      expect(result._id).toBe(customId);
    });

    it('should throw BadRequestException for invalid ID format', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        'Invalid ID format',
      );
    });

    it('should throw BadRequestException for empty ID', async () => {
      await expect(service.findOne('')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('65ae1f2b9d3e2a1b8c7d6e5f')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('65ae1f2b9d3e2a1b8c7d6e5f')).rejects.toThrow(
        'Product with ID 65ae1f2b9d3e2a1b8c7d6e5f not found',
      );
    });

    it('should call findById with correct ID', async () => {
      const customId = '65ae1f2b9d3e2a1b8c7d6e5f';
      const mockProduct = generateProductModelFaker(customId);

      mockProductModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      await service.findOne(customId);
      expect(mockProductModel.findById).toHaveBeenCalledWith(customId);
    });
  });

  describe('update', () => {
    it('should update product fields using overrides', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const updateData = { price: 99.99 };
      const updatedProduct = generateProductModelFaker(id);
      updatedProduct.price = 99.99;

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedProduct),
      });

      const result = await service.update(id, updateData);
      expect(result.price).toBe(99.99);
    });

    it('should call findByIdAndUpdate with correct parameters', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const updateData = { name: 'Updated Product' };
      const updatedProduct = generateProductModelFaker(id);

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedProduct),
      });

      await service.update(id, updateData);
      expect(mockProductModel.findByIdAndUpdate).toHaveBeenCalledWith(
        id,
        updateData,
        { new: true },
      );
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update('65ae1f2b9d3e2a1b8c7d6e5f', { price: 50 }),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update('65ae1f2b9d3e2a1b8c7d6e5f', { price: 50 }),
      ).rejects.toThrow('Product with ID 65ae1f2b9d3e2a1b8c7d6e5f not found');
    });

    it('should update multiple fields', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const updateData = { price: 150, stock: 50, name: 'New Name' };
      const updatedProduct = generateProductModelFaker(id);
      Object.assign(updatedProduct, updateData);

      mockProductModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedProduct),
      });

      const result = await service.update(id, updateData);
      expect(result.price).toBe(150);
      expect(result.stock).toBe(50);
      expect(result.name).toBe('New Name');
    });
  });

  describe('remove', () => {
    it('should successfully delete a product', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const mockProduct = generateProductModelFaker(id);

      mockProductModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      await service.remove(id);
      expect(mockProductModel.findByIdAndDelete).toHaveBeenCalledWith(id);
    });

    it('should not return anything on successful deletion', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const mockProduct = generateProductModelFaker(id);

      mockProductModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await service.remove(id);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if product does not exist', async () => {
      mockProductModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('65ae1f2b9d3e2a1b8c7d6e5f')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove('65ae1f2b9d3e2a1b8c7d6e5f')).rejects.toThrow(
        'Product with ID 65ae1f2b9d3e2a1b8c7d6e5f not found',
      );
    });
  });
});
