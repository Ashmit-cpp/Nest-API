// src/controllers/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from 'src/typeorm/entities/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Review } from 'src/typeorm/entities/review.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Product | undefined> {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  create(
    @Body() productData: Partial<Product>,
    @Request() req,
  ): Promise<Product> {
    const createdBy = req.user.username;
    productData.createdBy = createdBy;
    productData.reviews = [];
    return this.productsService.create(productData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product | undefined> {
    return this.productsService.update(+id, productData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req): Promise<void> {
    const product = await this.productsService.findOne(id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    if (product.createdBy !== req.user.username) {
      throw new UnauthorizedException(
        'You are not authorized to delete this product',
      );
    }

    await this.productsService.remove(id);
  }

  // @UseGuards(JwtAuthGuard)
  @Put('/addreview/:id')
  async addReview(
    @Param('id') id: string,
    @Body() reviewData: { text: string; rating: number },
  ): Promise<Review | undefined> {
    const product = await this.productsService.findOne(+id);

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const check = await this.productsService.addReview(product, reviewData);
    console.log(check);
    return check;
  }

}
