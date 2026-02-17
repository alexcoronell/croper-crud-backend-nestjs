import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/* Services */
import { UserService } from '../user/user.service';

/* DTOs */
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validates user credentials and generates a JWT access token.
   * Uses username and password for authentication.
   * @param loginDto The credentials provided by the user.
   * @returns An object containing the access token and non-sensitive user data.
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // 1. Find user by username using the internal method that includes password
    const user = await this.userService.findByUsernameForAuth(username);

    // 2. Validate user existence and password hash
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // 3. Check if the user account is active
    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    // 4. Prepare the JWT payload
    // We include sub (standard for ID), username, and role for RBAC logic in the frontend
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };

    // 5. Return the token and public user information for the frontend (Exercise 2)
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    };
  }

  /**
   * Optional: Token verification helper if needed for custom flows.
   * @param token JWT string
   */
  verifyToken(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
