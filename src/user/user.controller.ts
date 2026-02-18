import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { UserService } from './user.service';
import { UserRole } from './enums/user-role.enum';
import { RolesGuard } from '@auth/guards/roles.guard';
import { UserOwnershipGuard } from '@auth/guards/user-ownership.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user with any role (Admin only)' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.userService.create(createUserDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new customer user (public)' })
  @ApiResponse({
    status: 201,
    description: 'Customer user created successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  register(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    // Force role to customer for public registration
    const customerDto = { ...createUserDto, role: UserRole.CUSTOMER };
    return this.userService.create(customerDto);
  }

  @Post('bootstrap-admin')
  @ApiOperation({
    summary: 'Create first admin user (only works if no admins exist)',
  })
  @ApiResponse({
    status: 201,
    description: 'First admin user created successfully',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request or admin already exists',
  })
  async bootstrapAdmin(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    // Force role to admin
    const adminDto = { ...createUserDto, role: UserRole.ADMIN };
    return this.userService.createBootstrapAdmin(adminDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all active users with pagination' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page (default: 10)',
  })
  @ApiResponse({ status: 200, description: 'Paginated list of users' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.userService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user profile (Owner or Admin only)' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'), UserOwnershipGuard)
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
