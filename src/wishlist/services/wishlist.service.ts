// src/wishlist/wishlist.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from 'src/typeorm/entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async getWishlistByUserId(userId: number): Promise<Wishlist> {
    try {
      const existingWishlist = await this.wishlistRepository.findOne({
        where: { user: { id: userId } },
        relations: ['products'],
      });

      if (existingWishlist) {
        return existingWishlist;
      }

      // If wishlist doesn't exist, create a new one
      const newWishlist = this.wishlistRepository.create({
        user: { id: userId },
        products: [],
      });
      return await this.wishlistRepository.save(newWishlist);
    } catch (error) {
      throw new NotFoundException(
        `Wishlist for user with ID ${userId} not found`,
      );
    }
  }

  async addToWishlist(userId: number, productId: number): Promise<string> {
    try {
      const wishlist = await this.getWishlistByUserId(userId);
      wishlist.products.push({ id: productId } as any);
      await this.wishlistRepository.save(wishlist);

      return `Product with ID ${productId} successfully added to the wishlist for user with ID ${userId}.`;
    } catch (error) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }
}
