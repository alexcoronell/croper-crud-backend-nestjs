import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/**
 * PartialType makes all properties from CreateProductDto optional
 * while keeping the validation rules and Swagger documentation.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
