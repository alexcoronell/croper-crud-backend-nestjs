import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
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
   * Validates user credentials and generates a JWT stored in an HttpOnly cookie.
   * @param loginDto Credentials
   * @param response Express Response object to set the cookie
   */
  async login(loginDto: LoginDto, response: Response) {
    const { username, password } = loginDto;

    // 1. Find user by username (including password field)
    const user = await this.userService.findByUsernameForAuth(username);

    // 2. Validate credentials
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // 3. Check account status
    if (!user.isActive) {
      throw new UnauthorizedException('User account is disabled');
    }

    // 4. Prepare JWT Payload
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    // 5. Set HttpOnly Cookie
    response.cookie('access_token', token, {
      httpOnly: true, // Prevents JS access (XSS protection)
      secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
      path: '/', // Cookie available for all routes
    });

    // 6. Return user data (token only in cookie, not in body for security)
    return {
      message: 'Login successful',
      user: {
        fullName: user.fullName,
        username: user.username,
        role: user.role,
        email: user.email,
      },
    };
  }

  /**
   * Clears the authentication cookie.
   * @param response Express Response object
   */
  logout(response: Response) {
    response.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Logged out successfully' };
  }

  /**
   * Token verification helper.
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
