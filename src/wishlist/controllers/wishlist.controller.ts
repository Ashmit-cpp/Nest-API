// src/wishlist/wishlist.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from '../services/wishlist.service';
import { Wishlist } from 'src/typeorm/entities/wishlist.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiParam, ApiResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Retrieve user wishlist',
    type: Wishlist,
  })
  async getWishlist(@Request() req): Promise<Wishlist> {
    console.log(req.user.username);
    return this.wishlistService.getWishlistByUserName(req.user.username);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('add/:productId')
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'Add product to wishlist',
    type: Wishlist,
  })
  async addToWishlist(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Wishlist> {
    console.log(req.user.username);
    return this.wishlistService.addToWishlist(req.user.username, productId);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:productId')
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Remove product from wishlist',
    type: Wishlist,
  })
  async removeFromWishlist(
    @Request() req,
    @Param('productId') productId: number,
  ): Promise<Wishlist> {
    console.log(req.user.username);

    return this.wishlistService.removeFromWishlist(
      req.user.username,
      productId,
    );
  }
}
