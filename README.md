# 🌾 Croper Management API

<p align="center">
  <a href="http://nestjs.com/" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
  </a>
</p>

<p align="center">
  A robust and scalable RESTful API for agricultural product and user management built with NestJS, MongoDB, and JWT authentication.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NestJS-11.0-E0234E?logo=nestjs" alt="NestJS" />
  <img src="https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-9.2-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tests-60%20passed-success" alt="Tests" />
  <img src="https://img.shields.io/badge/License-UNLICENSED-red" alt="License" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Authentication](#-authentication)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Code Quality](#-code-quality)
- [Contributing](#-contributing)

---

## 🎯 Overview

Croper Management API is a production-ready backend application designed for managing agricultural products and users. Built with modern best practices, it provides a secure, scalable, and maintainable foundation for agricultural management systems.

### Key Highlights

- ✅ **60 Unit Tests** with 100% pass rate
- 🔐 **JWT Authentication** with HttpOnly cookies
- 🛡️ **Role-Based Access Control** (RBAC)
- 📚 **Interactive API Documentation** with Swagger
- 🗄️ **MongoDB Integration** with Mongoose ODM
- 🎨 **Clean Architecture** with modular design
- 🔍 **Input Validation** with class-validator
- 🚀 **Production Ready** with Docker support

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with HttpOnly cookies
- Secure password hashing with bcrypt
- Role-based access control (Admin, Customer)
- User ownership guards for resource protection
- Token verification and refresh mechanisms

### 👥 User Management
- User registration with validation
- Profile management (CRUD operations)
- Role assignment (Admin/Customer)
- Password encryption
- Active/inactive user status

### 📦 Product Management
- Complete CRUD operations for products
- Pagination support
- Category-based organization
- Stock management
- Admin-only write operations

### 🛡️ Security Features
- HttpOnly cookies for XSS protection
- CORS configuration
- Input validation and sanitization
- MongoDB injection prevention
- Secure password storage

### 📊 API Features
- RESTful API design
- Swagger/OpenAPI documentation
- Global exception handling
- Request/Response DTOs
- Comprehensive error messages

---

## 🛠️ Tech Stack

### Core Framework
- **NestJS 11.0** - Progressive Node.js framework
- **TypeScript 5.7** - Type-safe JavaScript
- **Node.js** - JavaScript runtime

### Database
- **MongoDB 7** - NoSQL database
- **Mongoose 9.2** - ODM for MongoDB
- **Mongo Express** - Web-based admin interface

### Authentication & Security
- **Passport JWT** - JWT authentication strategy
- **bcrypt 6.0** - Password hashing
- **cookie-parser** - Cookie handling
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

### Documentation & Testing
- **Swagger/OpenAPI** - API documentation
- **Jest 30.0** - Testing framework
- **ts-jest** - TypeScript Jest transformer
- **@faker-js/faker** - Test data generation
- **Supertest** - HTTP assertions

### Code Quality
- **ESLint 9.18** - Linting
- **Prettier 3.4** - Code formatting
- **Husky 9.1** - Git hooks
- **lint-staged** - Pre-commit linting

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **pnpm** - Fast package manager

---

## 🏗️ Architecture

### Modular Design

```
src/
├── auth/           # Authentication module
│   ├── decorators/ # Custom decorators (Roles)
│   ├── guards/     # Auth guards (JWT, Roles, Ownership)
│   ├── strategies/ # Passport strategies
│   └── dto/        # Data transfer objects
├── user/           # User management module
│   ├── schema/     # Mongoose schemas
│   ├── dto/        # Data transfer objects
│   └── enums/      # User roles enum
├── product/        # Product management module
│   ├── schema/     # Mongoose schemas
│   └── dto/        # Data transfer objects
└── main.ts         # Application entry point
```

### Design Patterns
- **Dependency Injection** - NestJS IoC container
- **Repository Pattern** - Data access abstraction
- **DTO Pattern** - Data validation and transformation
- **Guard Pattern** - Authorization logic
- **Decorator Pattern** - Metadata and route protection

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.x
- pnpm >= 8.x
- Docker & Docker Compose (optional)
- MongoDB 7.x (or use Docker)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd croper-crud-backend-nestjs
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start MongoDB with Docker** (optional)
```bash
docker-compose up -d
```

5. **Run the application**
```bash
# Development mode with hot-reload
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

6. **Seed the database** (optional)
```bash
# Populate with test data
pnpm run seed
```

This will create:
- 1 admin user (username: `admin`, password: `admin12345`)
- 10 customer users with fake data
- 50 products with fake data

### Quick Start with Docker

```bash
# Start all services
docker-compose up -d

# Start the application
pnpm run start:dev

# Seed the database (optional)
pnpm run seed
```

The API will be available at:
- **API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/docs
- **Mongo Express**: http://localhost:8081

---

## 📚 API Documentation

### Interactive Documentation

Access the Swagger UI at `http://localhost:3000/docs` for:
- Complete API reference
- Request/Response schemas
- Try-it-out functionality
- Authentication testing

### Main Endpoints

#### Authentication
```
POST   /api/v1/auth/login     # User login (sets HttpOnly cookie)
POST   /api/v1/auth/logout    # User logout (clears cookie)
```

#### Users
```
POST   /api/v1/user/register  # Register new user
GET    /api/v1/user           # Get all users (requires auth)
GET    /api/v1/user/:id       # Get user by ID (requires auth)
PATCH  /api/v1/user/:id       # Update user (requires auth + ownership)
DELETE /api/v1/user/:id       # Delete user (requires auth + ownership)
```

#### Products
```
POST   /api/v1/product        # Create product (Admin only)
GET    /api/v1/product        # Get all products (public)
GET    /api/v1/product/:id    # Get product by ID (public)
PATCH  /api/v1/product/:id    # Update product (Admin only)
DELETE /api/v1/product/:id    # Delete product (Admin only)
```

### Example Requests

#### Register User
```bash
curl -X POST http://localhost:3000/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123!",
    "role": "customer"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "password": "SecurePass123!"
  }' \
  -c cookies.txt
```

#### Create Product (Admin)
```bash
curl -X POST http://localhost:3000/api/v1/product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Organic Wheat",
    "description": "Premium quality organic wheat",
    "price": 25.99,
    "stock": 1000,
    "category": "Grains"
  }'
```

---

## 🔐 Authentication

### JWT Strategy with HttpOnly Cookies

This API uses a secure authentication approach:

1. **Login**: User credentials are validated, JWT is generated and stored in an HttpOnly cookie
2. **Requests**: Cookie is automatically sent with each request
3. **Validation**: JWT is verified on protected routes
4. **Logout**: Cookie is cleared from the client

### Security Benefits
- ✅ **XSS Protection**: JavaScript cannot access HttpOnly cookies
- ✅ **CSRF Protection**: SameSite cookie attribute
- ✅ **Secure Transport**: Cookies only sent over HTTPS in production
- ✅ **Token Expiration**: 24-hour token lifetime

### Role-Based Access Control

Two user roles are supported:
- **Admin**: Full access to all resources
- **Customer**: Limited access, can only modify own profile

### Protected Routes

Use the `@UseGuards()` decorator with:
- `AuthGuard('jwt')` - Requires valid JWT
- `RolesGuard` - Requires specific role
- `UserOwnershipGuard` - Requires resource ownership

Example:
```typescript
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
@Post()
create(@Body() dto: CreateProductDto) {
  return this.productService.create(dto);
}
```

---

## 🧪 Testing

### Test Coverage

- **7 Test Suites** - All passing
- **60 Unit Tests** - 100% pass rate
- **Test Coverage**: Services, Controllers, Guards

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:cov

# E2E tests
pnpm test:e2e

# Debug mode
pnpm test:debug
```

### Test Structure

```
src/
├── auth/
│   ├── auth.service.spec.ts      # 4 tests
│   └── auth.controller.spec.ts   # 2 tests
├── user/
│   ├── user.service.spec.ts      # 8 tests
│   └── user.controller.spec.ts   # 5 tests
├── product/
│   ├── product.service.spec.ts   # 19 tests
│   └── product.controller.spec.ts # 22 tests
└── app.controller.spec.ts         # 1 test
```

### Test Features
- Mock data generation with Faker
- Isolated unit tests
- Comprehensive edge case coverage
- Error scenario testing
- Authentication flow testing

---

## 📁 Project Structure

```
croper-crud-backend-nestjs/
├── .husky/                 # Git hooks configuration
├── dist/                   # Compiled output
├── faker/                  # Test data generators
│   ├── product.faker.ts
│   └── user.faker.ts
├── src/
│   ├── auth/              # Authentication module
│   │   ├── decorators/    # @Roles() decorator
│   │   ├── dto/           # LoginDto
│   │   ├── guards/        # JWT, Roles, Ownership guards
│   │   ├── strategies/    # JWT strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── product/           # Product management
│   │   ├── dto/           # Create/Update DTOs
│   │   ├── schema/        # Mongoose schema
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   └── product.module.ts
│   ├── user/              # User management
│   │   ├── dto/           # Create/Update/Response DTOs
│   │   ├── enums/         # UserRole enum
│   │   ├── schema/        # Mongoose schema
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── test/                  # E2E tests
├── .env                   # Environment variables
├── .editorconfig          # Editor configuration
├── .gitignore            # Git ignore rules
├── .prettierrc           # Prettier configuration
├── docker-compose.yml    # Docker services
├── eslint.config.mjs     # ESLint configuration
├── jest.setup.ts         # Jest global setup
├── nest-cli.json         # NestJS CLI config
├── package.json          # Dependencies
├── pnpm-lock.yaml        # Lock file
├── tsconfig.json         # TypeScript config
└── README.md             # This file
```

---

## 🌱 Database Seeding

The project includes a convenient seeding script to populate your database with test data.

### What Gets Created

- **1 Admin User**
  - Username: `admin`
  - Password: `admin12345`
  - Full access to all resources

- **10 Customer Users**
  - Realistic fake data (names, emails, usernames)
  - Password: `Password123!` (same for all)
  - Limited access (own profile only)

- **50 Products**
  - Various categories (Grains, Tools, Seeds, Livestock, etc.)
  - Random prices ($10 - $500)
  - Random stock (50 - 1000 units)

### Running the Seeder

```bash
# Make sure MongoDB and API are running
docker-compose up -d
pnpm run start:dev

# Run the seeding script
pnpm run seed
```

### Output Example

```
🌱 Starting database seeding...

📋 Step 1: Creating admin user...
✓ Created user: admin (admin)

📋 Step 2: Creating 10 customer users...
✓ Created user: johndoe123 (customer)
✓ Created user: janesmith456 (customer)
...

📋 Step 3: Logging in as admin...
✓ Logged in as: admin

📋 Step 4: Creating 50 products...
✓ Created product: Premium Wheat
✓ Created product: Organic Corn
...

✅ Database seeding completed successfully!

📊 Summary:
   - 1 Admin user created
   - 10 Customer users created
   - 50 Products created

🔐 Admin credentials:
   Username: admin
   Password: admin12345
```

### Features

- ✅ **Idempotent**: Safe to run multiple times
- ✅ **No Dependencies**: Pure JavaScript, no npm install needed
- ✅ **Error Handling**: Clear error messages
- ✅ **Realistic Data**: Faker-like data generation

For more details, see [scripts/README.md](scripts/README.md)

---

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
MONGO_USER=admin
MONGO_PASSWORD=admin123

# JWT Configuration
JWT_SECRET=your_super_secure_secret_key_here
JWT_EXPIRES_IN=24h

# Application
PORT=3000
NODE_ENV=development
```

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/` | Yes |
| `MONGO_USER` | MongoDB username | `admin` | No |
| `MONGO_PASSWORD` | MongoDB password | `admin123` | No |
| `JWT_SECRET` | Secret key for JWT signing | - | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration | `24h` | No |
| `PORT` | Application port | `3000` | No |
| `NODE_ENV` | Environment mode | `development` | No |

---

## 📜 Scripts

### Development
```bash
pnpm run start          # Start application
pnpm run start:dev      # Start with hot-reload
pnpm run start:debug    # Start in debug mode
```

### Build
```bash
pnpm run build          # Compile TypeScript
pnpm run start:prod     # Run production build
```

### Testing
```bash
pnpm test               # Run unit tests
pnpm test:watch         # Run tests in watch mode
pnpm test:cov           # Generate coverage report
pnpm test:e2e           # Run E2E tests
pnpm test:debug         # Debug tests
```

### Code Quality
```bash
pnpm run lint           # Lint and auto-fix
pnpm run lint:fix       # Fix all linting issues
pnpm run format         # Format code with Prettier
pnpm run pre-commit     # Run pre-commit checks
```

### Database
```bash
pnpm run seed           # Populate database with test data
```

### Docker
```bash
docker-compose up -d    # Start services
docker-compose down     # Stop services
docker-compose logs -f  # View logs
```

---

## 🎨 Code Quality

### Linting & Formatting

- **ESLint**: TypeScript-specific rules with strict type checking
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for automated checks
- **lint-staged**: Run linters on staged files only

### Pre-commit Checks

Automatically runs on `git commit`:
1. ESLint with auto-fix
2. Prettier formatting
3. TypeScript compilation check

### Code Standards

- Strict TypeScript configuration
- No implicit `any` types
- Comprehensive error handling
- Consistent naming conventions
- JSDoc comments for public APIs

---

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Run tests**
   ```bash
   pnpm test
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

### Code Review Guidelines

- Write clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed
- Follow existing code style
- Keep PRs focused and small

---

## 📄 License

This project is **UNLICENSED** - Private/Proprietary software.

---

## 👨‍💻 Author

**Alex Coronell**

---

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
- [Passport](http://www.passportjs.org/) - Simple, unobtrusive authentication

---

## 📞 Support

For questions and support:
- Open an issue on GitHub
- Contact the development team
- Check the [NestJS Documentation](https://docs.nestjs.com)

---

<p align="center">
  Made with ❤️ using NestJS
</p>
