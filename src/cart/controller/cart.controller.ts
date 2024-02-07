// src/controllers/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { Cart } from 'src/typeorm/entities/cart.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CartService } from '../services/cart.services';
import { ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Returns the cart for the authenticated user',
    type: Cart,
  })
  async getCart(@Request() req): Promise<Cart> {
    return this.cartService.getCartByuserId(req.user.userId);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('add/:productId')
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to add to the cart',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated cart after adding the product',
    type: Cart,
  })
  async addToCart(
    @Request() req,
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
    @Body('totalPrice') totalPrice: number,
  ): Promise<Cart> {
    console.log(req.user.userId);

    return this.cartService.addToCart(
      req.user.userId,
      productId,
      quantity,
      totalPrice,
    );
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:productId')
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to delete from the cart',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated cart after deleting the product',
    type: Cart,
  })
  async deleteAllFromCart(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Cart> {
    return this.cartService.deleteAllFromCart(req.user.userId, productId);
  }
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('reduce/:productId')
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to deletes only one from the cart',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated cart after deleting only one product',
    type: Cart,
  })
  async deleteOneFromCart(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Cart> {
    return this.cartService.reduceQuantity(req.user.userId, productId);
  }
  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('increase/:productId')
  @ApiParam({
    name: 'productId',
    description: 'The ID of the product to increase in the cart',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the updated cart after adding one product',
    type: Cart,
  })
  async AddOneFromCart(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Cart> {
    return this.cartService.increaseQuantity(req.user.userId, productId);
  }
}
