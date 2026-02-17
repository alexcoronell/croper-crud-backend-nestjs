import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
} from '@nestjs/common';
import type { Response } from 'express'; // Import from express
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/* Services & DTOs */
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * User login endpoint.
   * Sets an HttpOnly cookie with the JWT and returns user profile data.
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User login (HttpOnly Cookie strategy)' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response, // Essential for cookie handling
  ) {
    return this.authService.login(loginDto, response);
  }

  /**
   * Logout endpoint.
   * Clears the authentication cookie from the client.
   */
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clear auth cookie' })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  logout(@Res({ passthrough: true }) response: Response) {
    return this.authService.logout(response);
  }
}
