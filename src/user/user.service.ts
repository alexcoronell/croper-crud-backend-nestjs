import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

/* Schema & Interfaces */
import { User } from './schema/user.schema';

/* DTOs */
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /**
   * Helper to map a database document to a clean ResponseUserDto.
   * Ensures internal fields like 'password' are never leaked.
   */
  private mapToResponseDto(user: User): ResponseUserDto {
    return {
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Creates a new user with hashed password.
   * Handles MongoDB duplicate key errors for email and username.
   */
  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const { password, ...userData } = createUserDto;

    try {
      const newUser = new this.userModel({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      const savedUser = await newUser.save();
      return this.mapToResponseDto(savedUser);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === 11000) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        const field = Object.keys(error.keyPattern)[0];
        throw new BadRequestException(
          `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
        );
      }
      throw new BadRequestException(
        'An error occurred while creating the user',
      );
    }
  }

  /**
   * Retrieves a paginated list of active users.
   * @param page Current page number (defaults to 1)
   * @param limit Number of items per page (defaults to 10)
   * @returns Paginated user data and metadata
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Execute search and count in parallel for better performance
    const [users, total] = await Promise.all([
      this.userModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments({ isActive: true }),
    ]);

    const data = users.map((user) => this.mapToResponseDto(user));

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a specific user by its MongoDB ObjectId.
   */
  async findOne(id: string): Promise<ResponseUserDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid User ID format');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(user);
  }

  /**
   * Updates user profile information.
   * Password updates should be handled in a dedicated security service.
   */
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid User ID format');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.mapToResponseDto(updatedUser);
  }

  /**
   * Permanently removes a user from the database.
   */
  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid User ID format');
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Internal method for Auth process.
   * Includes the password field which is hidden by default.
   */
  async findByEmailForAuth(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  /**
   * Internal method to find a user by username for authentication purposes.
   * Includes the password field.
   */
  async findByUsernameForAuth(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).select('+password').exec();
  }

  /**
   * Creates the first admin user (bootstrap).
   * Only works if no admin users exist in the database.
   * This is a special endpoint for initial setup.
   */
  async createBootstrapAdmin(
    createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    // Check if any admin already exists
    const existingAdmin = await this.userModel
      .findOne({ role: 'admin' })
      .exec();

    if (existingAdmin) {
      throw new BadRequestException(
        'Admin user already exists. Use /user/create-admin endpoint with admin authentication.',
      );
    }

    // Create the first admin
    return this.create(createUserDto);
  }
}
