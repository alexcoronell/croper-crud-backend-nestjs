import {
  IsEmail,
  IsString,
  MinLength,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums/user-role.enum';

/**
 * Data Transfer Object for creating a new user.
 * Contains validation rules and Swagger documentation for all user properties.
 */
export class CreateUserDto {
  /**
   * The full name of the user.
   * @example 'John Doe'
   */
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  /**
   * Unique username for authentication.
   * Must be at least 4 characters and contain only letters, numbers, and underscores.
   * @example 'johndoe88'
   */
  @ApiProperty({ example: 'johndoe88', description: 'Unique username' })
  @IsString()
  @MinLength(4)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers and underscores',
  })
  username: string;

  /**
   * User's email address.
   * Must be a valid email format.
   * @example 'admin@email.com'
   */
  @ApiProperty({ example: 'admin@email.com' })
  @IsEmail()
  email: string;

  /**
   * User's password.
   * Must be at least 6 characters long.
   * @example 'SecurePass123!'
   */
  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * The access level assigned to the user.
   * Defaults to CUSTOMER if not specified.
   * @example 'customer'
   */
  @ApiProperty({
    enum: UserRole,
    default: UserRole.CUSTOMER,
    description: 'The access level assigned to the user',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
