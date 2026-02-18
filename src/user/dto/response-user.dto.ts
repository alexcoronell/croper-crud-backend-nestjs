import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../enums/user-role.enum';

export class ResponseUserDto {
  @ApiProperty()
  _id: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'johndoe88' })
  username: string;

  @ApiProperty({ example: 'admin@email.com' })
  email: string;

  @ApiProperty({ example: 'customer' })
  role: UserRole;
}
