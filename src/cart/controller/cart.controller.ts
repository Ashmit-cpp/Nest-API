// src/cart/cart.controller.ts
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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCart(@Request() req): Promise<Cart> {
    return this.cartService.getCartByUserName(req.user.username);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('add/:productId')
  async addToCart(
    @Request() req,
    @Param('productId') productId: number,
    @Body('quantity') quantity: number,
  ): Promise<Cart> {
    return this.cartService.addToCart(req.user.username, productId, quantity);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:productId')
  async deleteFromCart(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Cart> {
    return this.cartService.deleteFromCart(req.user.username, productId);
  }
}
