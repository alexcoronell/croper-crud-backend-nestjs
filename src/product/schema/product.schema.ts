import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Mongoose schema for Product documents.
 * Represents products in the e-commerce catalog.
 *
 * Features:
 * - Automatic timestamps (createdAt, updatedAt)
 * - Unique product names
 * - Indexed category field for faster queries
 * - Price and stock validation (minimum 0)
 */
@Schema({
  timestamps: true, // Automatically manages createdAt and updatedAt
  versionKey: false, // Removes the __v field from documents
})
export class Product extends Document {
  /**
   * Product name.
   * Must be unique across all products.
   */
  @ApiProperty({ example: 'Organic Coffee Beans', description: 'Product name' })
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  /**
   * Detailed product description.
   */
  @ApiProperty({
    example: 'High-quality Arabica coffee',
    description: 'Detailed description',
  })
  @Prop({ required: true })
  description: string;

  /**
   * Product price in USD.
   * Must be non-negative.
   */
  @ApiProperty({ example: 25.5, description: 'Price in USD' })
  @Prop({ required: true, min: 0 })
  price: number;

  /**
   * Available units in stock.
   * Must be non-negative.
   */
  @ApiProperty({ example: 100, description: 'Available units in stock' })
  @Prop({ required: true, min: 0 })
  stock: number;

  /**
   * Product category for classification.
   * Indexed for faster category-based queries.
   */
  @ApiProperty({ example: 'Grains', description: 'Product category' })
  @Prop({ required: true, index: true })
  category: string;

  /**
   * Timestamp of product creation.
   * Automatically managed by Mongoose.
   */
  @ApiProperty()
  createdAt: Date;

  /**
   * Timestamp of last update.
   * Automatically managed by Mongoose.
   */
  @ApiProperty()
  updatedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
