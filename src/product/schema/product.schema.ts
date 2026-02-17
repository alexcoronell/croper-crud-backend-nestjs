import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({
  timestamps: true, // Automatically manages createdAt and updatedAt
  versionKey: false, // Removes the __v field from documents
})
export class Product extends Document {
  @ApiProperty({ example: 'Organic Coffee Beans', description: 'Product name' })
  @Prop({ required: true, trim: true, unique: true })
  name: string;

  @ApiProperty({
    example: 'High-quality Arabica coffee',
    description: 'Detailed description',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 25.5, description: 'Price in USD' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({ example: 100, description: 'Available units in stock' })
  @Prop({ required: true, min: 0 })
  stock: number;

  @ApiProperty({ example: 'Grains', description: 'Product category' })
  @Prop({ required: true, index: true }) // Index for faster queries
  category: string;

  @ApiProperty({ example: true, default: true })
  @Prop({ default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
