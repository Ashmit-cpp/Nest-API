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
    return this.cartService.getCartByUserName(req.user.username);
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
  ): Promise<Cart> {
    return this.cartService.addToCart(req.user.username, productId, quantity);
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
  async deleteFromCart(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Cart> {
    return this.cartService.deleteFromCart(req.user.username, productId);
  }
}
