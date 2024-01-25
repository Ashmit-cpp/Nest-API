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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from 'src/typeorm/entities/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Review } from 'src/typeorm/entities/review.entity';
import { ApiSecurity, ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Products')
@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of products' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('name') name: string,
  ): Promise<Product[]> {
    return this.productsService.findAll({ page, limit, name });
  }
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve product by id' })
  findOne(@Param('id') id: number): Promise<Product | undefined> {
    return this.productsService.findOne(id);
  }
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @ApiOperation({ summary: 'Create a new product' })
  create(
    @Body() productData: Partial<Product>,
    @Request() req,
  ): Promise<Product> {
    const createdBy = req.user.username;
    productData.createdBy = createdBy;
    productData.reviews = [];
    return this.productsService.create(productData);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update product by id' })
  update(
    @Param('id') id: string,
    @Body() productData: Partial<Product>,
  ): Promise<Product | undefined> {
    return this.productsService.update(+id, productData);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete product by id' })
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

    await this.productsService.deleteReviews(product);
    await this.productsService.remove(id);
  }

  @ApiBody({
    type: Review,
    description: 'Add a review to the product',
  })
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put('/addreview/:id')
  @ApiOperation({ summary: 'Add a review to the product' })
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
