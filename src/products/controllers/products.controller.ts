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
} from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from 'src/typeorm/entities/product.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Review } from 'src/typeorm/entities/review.entity';
import {
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiOperation, // Import ApiOperation
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve a list of products' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve a list of products',
    type: Product,
    isArray: true,
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<Product[]> {
    return this.productsService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve product by id' })
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Retrieve product by id',
    type: Product,
  })
  findOne(@Param('id') id: number): Promise<Product | undefined> {
    return this.productsService.findOne(id);
  }

  @ApiBody({
    type: Product,
    description: 'Create a new product',
  })
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('/create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Create a new product',
    type: Product,
  })
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
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Update product by id',
    type: Product,
  })
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
  @ApiParam({ name: 'id', type: 'number' })
  @ApiResponse({ status: 204, description: 'Delete product by id' })
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
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Add a review to the product',
    type: Review,
  })
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
