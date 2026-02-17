import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @ApiProperty()
  @IsNumber()
  readonly stock: number;

  @ApiProperty()
  @IsString()
  readonly category: string;
}
