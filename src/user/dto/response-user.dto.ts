import { ApiProperty } from '@nestjs/swagger';

export class ResponseUserDto {
  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'johndoe88' })
  username: string;

  @ApiProperty({ example: 'admin@agro.com' })
  email: string;
}
