import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserRole } from '@user/enums/user-role.enum';

@Injectable()
export class UserOwnershipGuard implements CanActivate {
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
