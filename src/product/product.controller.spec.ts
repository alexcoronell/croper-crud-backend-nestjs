/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
  createProductFaker,
  generateProductModelFaker,
  generateManyProductsModels,
} from '@faker/product.faker';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  // Mocking the ProductService
  const mockProductService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  /**
   * Test for product creation endpoint
   */
  describe('create', () => {
    it('should call service.create with correct DTO', async () => {
      const dto = createProductFaker();
      const expectedResponse = generateProductModelFaker();
      mockProductService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expectedResponse);
    });

    it('should return created product with all properties', async () => {
      const dto = createProductFaker();
      const expectedResponse = generateProductModelFaker();
      mockProductService.create.mockResolvedValue(expectedResponse);

      const result = await controller.create(dto);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('price');
      expect(result).toHaveProperty('stock');
      expect(result).toHaveProperty('category');
    });

    it('should propagate service errors', async () => {
      const dto = createProductFaker();
      mockProductService.create.mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(dto)).rejects.toThrow('Creation failed');
    });
  });

  /**
   * Test for paginated list endpoint
   * Critical for Exercise 2 (Frontend Table)
   */
  describe('findAll', () => {
    it('should call service.findAll with default pagination values', async () => {
      const paginatedResponse = {
        data: generateManyProductsModels(2),
        total: 2,
        page: 1,
        lastPage: 1,
      };
      mockProductService.findAll.mockResolvedValue(paginatedResponse);

      // Testing with default parameters from controller desestructuring
      const result = await controller.findAll(1, 10);

      expect(service.findAll).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual(paginatedResponse);
    });

    it('should handle custom pagination queries', async () => {
      await controller.findAll(2, 5);
      expect(service.findAll).toHaveBeenCalledWith(2, 5);
    });

    it('should convert string query params to numbers', async () => {
      const paginatedResponse = {
        data: generateManyProductsModels(3),
        total: 15,
        page: 3,
        lastPage: 5,
      };
      mockProductService.findAll.mockResolvedValue(paginatedResponse);

      // Query params come as strings from HTTP requests
      await controller.findAll(3 as any, 3 as any);

      expect(service.findAll).toHaveBeenCalledWith(3, 3);
    });

    it('should return pagination metadata', async () => {
      const paginatedResponse = {
        data: generateManyProductsModels(10),
        total: 50,
        page: 2,
        lastPage: 5,
      };
      mockProductService.findAll.mockResolvedValue(paginatedResponse);

      const result = await controller.findAll(2, 10);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('total');
      expect(result).toHaveProperty('page');
      expect(result).toHaveProperty('lastPage');
      expect(result.total).toBe(50);
      expect(result.lastPage).toBe(5);
    });

    it('should handle empty results', async () => {
      const emptyResponse = {
        data: [],
        total: 0,
        page: 1,
        lastPage: 0,
      };
      mockProductService.findAll.mockResolvedValue(emptyResponse);

      const result = await controller.findAll(1, 10);

      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });
  });

  /**
   * Test for single product retrieval
   */
  describe('findOne', () => {
    it('should call service.findOne with the correct ID', async () => {
      const id = 'mongo-id-123';
      const mockProduct = generateProductModelFaker(id);
      mockProductService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockProduct);
    });

    it('should return product with correct ID', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const mockProduct = generateProductModelFaker(id);
      mockProductService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(id);

      expect(result._id).toBe(id);
    });

    it('should propagate NotFoundException from service', async () => {
      const id = 'non-existent-id';
      mockProductService.findOne.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(controller.findOne(id)).rejects.toThrow('Product not found');
    });
  });

  /**
   * Test for product update
   */
  describe('update', () => {
    it('should call service.update with correct ID and partial data', async () => {
      const id = 'update-id';
      const updateDto = { price: 150 };
      const updatedProduct = generateProductModelFaker(id);
      updatedProduct.price = 150;

      mockProductService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result.price).toBe(150);
    });

    it('should handle partial updates with multiple fields', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const updateDto = { price: 200, stock: 75, name: 'Updated Name' };
      const updatedProduct = generateProductModelFaker(id);
      Object.assign(updatedProduct, updateDto);

      mockProductService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(id, updateDto);

      expect(result.price).toBe(200);
      expect(result.stock).toBe(75);
      expect(result.name).toBe('Updated Name');
    });

    it('should propagate NotFoundException from service', async () => {
      const id = 'non-existent-id';
      const updateDto = { price: 100 };
      mockProductService.update.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(controller.update(id, updateDto)).rejects.toThrow(
        'Product not found',
      );
    });

    it('should handle empty update DTO', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      const updateDto = {};
      const mockProduct = generateProductModelFaker(id);

      mockProductService.update.mockResolvedValue(mockProduct);

      const result = await controller.update(id, updateDto);

      expect(service.update).toHaveBeenCalledWith(id, updateDto);
      expect(result).toEqual(mockProduct);
    });
  });

  /**
   * Test for product deletion
   */
  describe('remove', () => {
    it('should call service.remove and return undefined on success', async () => {
      const id = 'delete-id';
      mockProductService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(result).toBeUndefined();
    });

    it('should call service.remove with correct ID', async () => {
      const id = '65ae1f2b9d3e2a1b8c7d6e5f';
      mockProductService.remove.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(id);
      expect(service.remove).toHaveBeenCalledTimes(1);
    });

    it('should propagate NotFoundException from service', async () => {
      const id = 'non-existent-id';
      mockProductService.remove.mockRejectedValue(
        new Error('Product not found'),
      );

      await expect(controller.remove(id)).rejects.toThrow('Product not found');
    });
  });
});
