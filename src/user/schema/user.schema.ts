import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { UserRole } from '../enums/user-role.enum';

/**
 * Mongoose schema for User documents.
 * Represents user accounts with authentication and authorization information.
 *
 * Features:
 * - Automatic timestamps (createdAt, updatedAt)
 * - Password field hidden by default from queries
 * - Unique constraints on username and email
 * - Role-based access control
 */
@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  /**
   * User's full name.
   */
  @Prop({ required: true, trim: true })
  fullName: string;

  /**
   * Unique username for authentication.
   * Stored in lowercase for case-insensitive matching.
   */
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  username: string;

  /**
   * User's email address.
   * Stored in lowercase with unique constraint.
   */
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  /**
   * Hashed password.
   * Hidden from queries by default for security (select: false).
   */
  @Prop({ required: true, select: false })
  password: string;

  /**
   * Account status flag.
   * Inactive users cannot authenticate.
   */
  @Prop({ default: true })
  isActive: boolean;

  /**
   * User's role for authorization.
   * Defaults to CUSTOMER for new registrations.
   */
  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  /**
   * Timestamp of user creation.
   * Automatically managed by Mongoose.
   */
  createdAt: Date;

  /**
   * Timestamp of last update.
   * Automatically managed by Mongoose.
   */
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
