import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

/* Interfaces */
import { UserRole } from '@user/enums/user-role.enum';

/**
 * Payload structure encoded within the JWT
 */
interface JwtPayload {
  sub: string; // User ID
  username: string;
  role: UserRole;
  iat?: number; // Issued at
  exp?: number; // Expiration
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    super({
      // Extract JWT from cookies instead of Authorization header
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any): string | null => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          return (request?.cookies?.access_token as string | undefined) ?? null;
        },
      ]),
      // Ensure the token has not expired
      ignoreExpiration: false,
      // Secret key for verification from .env
      secretOrKey: secret,
    });
  }

  /**
   * This method is called after the JWT is successfully decoded and verified.
   * The returned object is automatically injected into the Request object as 'req.user'.
   * @param payload Decoded JWT data
   * @returns Object to be attached to the request
   */
  validate(payload: JwtPayload): {
    userId: string;
    username: string;
    role: UserRole;
  } {
    // If you need to check if the user still exists or is active in DB,
    // you could inject UserService and perform a check here.

    // Returning this object allows guards (like RolesGuard and OwnershipGuard)
    // to access these properties via request.user
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
