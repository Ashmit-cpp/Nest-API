// src/wishlist/wishlist.controller.ts
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from '../services/wishlist.service';
import { Wishlist } from 'src/typeorm/entities/wishlist.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getWishlist(@Request() req) {
    console.log(req.user.username);

    return this.wishlistService.getWishlistByUserName(req.user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add/:productId')
  async addToWishlist(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Wishlist> {
    console.log(req.user.username);

    return this.wishlistService.addToWishlist(req.user.username, productId);
  }
}
