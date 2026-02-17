import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('product') // Categorizes endpoints in Swagger UI
@Controller('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Endpoint to create a new product.
   * Restricted to authenticated users via JWT.
   */
  @Post()
  @ApiBearerAuth() // Requirement: Protection via JWT
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * Endpoint to retrieve all products with pagination support.
   */
  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    // Since we provided default values, page and limit will always be defined
    return this.productService.findAll(+page, +limit);
  }

  /**
   * Endpoint to retrieve a single product by its ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product found.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  /**
   * Endpoint to update an existing product.
   * Restricted to authenticated users via JWT.
   */
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an existing product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * Endpoint to delete a product.
   * Restricted to authenticated users via JWT.
   */
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
