// src/cart/cart.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Cart } from 'src/typeorm/entities/cart.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CartService } from '../services/cart.services';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Request() req): Promise<Cart> {
    return this.cartService.getCartByUserName(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add/:productId')
  async addToCart(
    @Request() req,
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<Cart> {
    return this.cartService.addToCart(req.user.username, productId, quantity);
  }
}
