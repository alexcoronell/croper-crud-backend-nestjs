import { faker } from '@faker-js/faker';
import { CreateProductDto } from '@product/dto/create-product.dto';
import { Product } from '@product/schema/product.schema';

/**
 * Generates a plain object matching the CreateProductDto structure.
 * Useful for controller tests and seeding.
 */
export const createProductFaker = (
  overrides: Partial<CreateProductDto> = {},
): CreateProductDto => ({
  name: faker.commerce.productName() + ' ' + faker.string.alphanumeric(5),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 1000 })),
  stock: faker.number.int({ min: 0, max: 500 }),
  category: faker.helpers.arrayElement([
    'Grains',
    'Tools',
    'Seeds',
    'Livestock',
  ]),
  ...overrides,
});

/**
 * Generates an array of CreateProductDto objects.
 */
export const generateManyCreateProductDto = (
  size: number = 1,
): CreateProductDto[] => {
  return Array.from({ length: size }, () => createProductFaker());
};

/**
 * Generates a mock of a full Product document as it would come from MongoDB.
 */
export const generateProductModelFaker = (
  id: string = faker.database.mongodbObjectId(),
): Partial<Product> => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  _id: id as any,
  ...createProductFaker(),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * Generates an array of full Product model mocks.
 */
export const generateManyProductsModels = (
  size: number = 1,
): Partial<Product>[] => {
  return Array.from({ length: size }, () => generateProductModelFaker());
};
