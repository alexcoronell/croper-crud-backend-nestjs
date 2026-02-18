import { IsString, IsNumber, IsPositive, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object for creating a new product.
 * Contains validation rules and Swagger documentation for all product properties.
 */
export class CreateProductDto {
  /**
   * Product name.
   * Must be at least 3 characters long.
   * @example 'Organic Coffee Beans'
   */
  @ApiProperty({ example: 'Organic Coffee Beans', description: 'Product name' })
  @IsString()
  @MinLength(3)
  readonly name: string;

  /**
   * Detailed product description.
   * @example 'High-quality Arabica coffee beans from Colombia'
   */
  @ApiProperty({
    example: 'High-quality Arabica coffee beans from Colombia',
    description: 'Product description',
  })
  @IsString()
  readonly description: string;

  /**
   * Product price in USD.
   * Must be a positive number.
   * @example 25.99
   */
  @ApiProperty({ example: 25.99, description: 'Price in USD' })
  @IsNumber()
  @IsPositive()
  readonly price: number;

  /**
   * Available units in stock.
   * Must be a non-negative number.
   * @example 100
   */
  @ApiProperty({ example: 100, description: 'Available units in stock' })
  @IsNumber()
  readonly stock: number;

  /**
   * Product category for classification.
   * @example 'Beverages'
   */
  @ApiProperty({ example: 'Beverages', description: 'Product category' })
  @IsString()
  readonly category: string;
}
