import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  /**
   * Inject the Mongoose model for the Product schema.
   * @param productModel The injected Mongoose model
   */
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  /**
   * Creates a new product record in the database.
   * @param createProductDto Data for the new product
   * @returns The newly created product document
   * @throws BadRequestException if the creation fails or data is invalid
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = new this.productModel(createProductDto);
      return await newProduct.save();
    } catch (error) {
      // Logic to handle potential database constraints or connection issues
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException('Error creating product: ' + errorMessage);
    }
  }

  /**
   * Retrieves a paginated list of active products.
   * Fulfills Exercise 2 requirements for frontend pagination.
   * @param page Current page number (defaults to 1)
   * @param limit Number of items per page (defaults to 10)
   * @returns Paginated product data and metadata
   */
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    // Execute search and count in parallel for better performance
    const [data, total] = await Promise.all([
      this.productModel.find({ isActive: true }).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments({ isActive: true }),
    ]);

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  /**
   * Finds a specific product by its MongoDB Unique ID.
   * @param id The string representation of the ObjectId
   * @returns The found product document
   * @throws BadRequestException if the ID format is invalid
   * @throws NotFoundException if the product does not exist
   */
  async findOne(id: string): Promise<Product> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }

    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  /**
   * Updates an existing product with partial data.
   * @param id The product ID to update
   * @param updateProductDto Partial data for the update
   * @returns The updated product document
   * @throws NotFoundException if the product does not exist
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  /**
   * Permanently removes a product from the database.
   * @param id The product ID to delete
   * @throws NotFoundException if the product does not exist
   */
  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
