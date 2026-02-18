import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

/**
 * Data Transfer Object for user responses.
 * Excludes sensitive information like password and internal fields.
 * Used for all API responses that return user data.
 */
export class ResponseUserDto {
  /**
   * MongoDB ObjectId as string.
   * @example '507f1f77bcf86cd799439011'
   */
  @ApiProperty()
  _id: string;

  /**
   * User's full name.
   * @example 'John Doe'
   */
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  /**
   * Unique username.
   * @example 'johndoe88'
   */
  @ApiProperty({ example: 'johndoe88' })
  username: string;

  /**
   * User's email address.
   * @example 'admin@email.com'
   */
  @ApiProperty({ example: 'admin@email.com' })
  email: string;

  /**
   * User's role/access level.
   * @example 'customer'
   */
  @ApiProperty({ example: 'customer' })
  role: UserRole;
}
