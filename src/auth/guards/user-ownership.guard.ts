import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@user/enums/user-role.enum';

/**
 * Guard that ensures users can only access or modify their own resources.
 * Admins bypass this check and can access any resource.
 *
 * Validates that the user ID in the JWT matches the ID in the route parameter.
 *
 * @example
 * ```typescript
 * @UseGuards(AuthGuard('jwt'), UserOwnershipGuard)
 * @Patch(':id')
 * updateProfile(@Param('id') id: string) { ... }
 * ```
 */
@Injectable()
export class UserOwnershipGuard implements CanActivate {
  /**
   * Determines if the current user can access the requested resource.
   * @param context Execution context containing request information
   * @returns true if user owns the resource or is an admin
   * @throws ForbiddenException if user tries to access another user's resource
   */
  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const user = request.user; // Injected by JwtAuthGuard
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const params = request.params;

    if (!user) {
      throw new ForbiddenException('User context not found');
    }

    // 1. If user is Admin, they can bypass ownership check
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (user.role === UserRole.ADMIN) {
      return true;
    }

    // 2. Check if the ID in the URL matches the ID in the JWT token
    // Note: Ensure the parameter name matches your controller (:id)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const isOwner = user.userId === params.id;

    if (!isOwner) {
      throw new ForbiddenException('You can only modify your own profile');
    }

    return true;
  }
}
