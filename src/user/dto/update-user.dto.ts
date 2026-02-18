import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

/**
 * Data Transfer Object for updating user information.
 * Extends CreateUserDto with all properties made optional via PartialType.
 * Inherits validation rules and Swagger documentation from CreateUserDto.
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {}
