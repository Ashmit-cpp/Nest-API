// src/controllers/wishlist.controller.ts
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
import {
  ApiParam,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { Body, UseInterceptors } from '@nestjs/common/decorators';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@ApiTags('Wishlist')
@Controller('wishlist')
// @UseInterceptors(CacheInterceptor)
export class WishlistController {
  constructor(
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly wishlistService: WishlistService,
  ) {}

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Retrieve user wishlist' })
  @ApiResponse({
    status: 200,
    description: 'Returns the wishlist for the authenticated user',
    type: Wishlist,
  })
  @UseInterceptors(CacheInterceptor)
  @CacheKey('custom_key')
  @CacheTTL(20)
  async getWishlist(@Request() req): Promise<Wishlist> {
    console.log(req.user.username);
    console.log('Generated Cache Key:', 'custom_key');
    // await this.cacheManager.add('key');*

    return this.wishlistService.getWishlistByUserName(req.user.username);
  }

  @ApiSecurity('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post('add/:productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({
    status: 201,
    description: 'Adds the specified product to the wishlist',
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
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiParam({ name: 'productId', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'Removes the specified product from the wishlist',
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
