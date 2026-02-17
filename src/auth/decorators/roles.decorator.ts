import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@user/enums/user-role.enum';

/**
 * Key used to store role metadata in the execution context.
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles are allowed to access a route.
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
