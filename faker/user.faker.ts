import { faker } from '@faker-js/faker';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { User } from '@user/schema/user.schema';
import { UserRole } from '@user/enums/user-role.enum';

/**
 * Generates a plain object matching the CreateUserDto structure.
 * Ideal for testing the registration process and controller inputs.
 */
export const createUserFaker = (
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto => ({
  fullName: faker.person.fullName(),
  username: (
    faker.internet.username() + faker.string.alphanumeric(3)
  ).toLowerCase(),
  email: faker.internet.email().toLowerCase(),
  password: 'Password123!',
  role: UserRole.CUSTOMER, // Default role as per business requirements
  ...overrides,
});

/**
 * Generates an array of CreateUserDto objects.
 */
export const generateManyCreateUserDto = (
  size: number = 1,
): CreateUserDto[] => {
  return Array.from({ length: size }, () => createUserFaker());
};

/**
 * Generates a mock of a full User document as it would come from MongoDB.
 * Useful for mocking service responses and repository returns.
 */
export const generateUserModelFaker = (
  id: string = faker.database.mongodbObjectId(),
): Partial<User> => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  _id: id as any,
  ...createUserFaker(),
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
});

/**
 * Generates an array of full User model mocks.
 */
export const generateManyUserModels = (size: number = 1): Partial<User>[] => {
  return Array.from({ length: size }, () => generateUserModelFaker());
};
