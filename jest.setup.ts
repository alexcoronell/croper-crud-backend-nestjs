// Global Jest setup file
// This file mocks @faker-js/faker to avoid ESM module issues

/* eslint-disable @typescript-eslint/no-unsafe-return */
jest.mock('@faker-js/faker', () => ({
  faker: {
    commerce: {
      productName: jest.fn(() => 'Test Product'),
      productDescription: jest.fn(() => 'Test Description'),
      price: jest.fn(() => '99.99'),
    },
    string: {
      alphanumeric: jest.fn(() => 'ABC123'),
    },
    number: {
      int: jest.fn(() => 100),
    },
    helpers: {
      arrayElement: jest.fn((arr: any[]) => arr[0]),
    },
    database: {
      mongodbObjectId: jest.fn(() => '507f1f77bcf86cd799439011'),
    },
    person: {
      fullName: jest.fn(() => 'John Doe'),
    },
    internet: {
      username: jest.fn(() => 'testuser'),
      email: jest.fn(() => 'test@example.com'),
    },
  },
}));
