// src/wishlist/wishlist.controller.ts
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { WishlistService } from '../services/wishlist.service';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get(':userId')
  async getWishlist(@Param('userId') userId: number) {
    return this.wishlistService.getWishlistByUserId(userId);
  }

  @Post('add/:userId/:productId')
  async addToWishlist(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ) {
    return this.wishlistService.addToWishlist(userId, productId);
  }
}
