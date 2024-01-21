// src/wishlist/wishlist.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/user.entity';
import { Wishlist } from 'src/typeorm/entities/wishlist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async getWishlistByUserName(userName: string): Promise<Wishlist> {
    try {
      const existingWishlist = await this.wishlistRepository.findOne({
        where: { user: { username: userName } },
        relations: ['products', 'user'],
      });

      if (existingWishlist) {
        console.log(existingWishlist);
        return existingWishlist;
      }

      // If wishlist doesn't exist, create a new one
      const user = await this.userRepository.findOne({
        where: { username: userName },
      });

      if (!user) {
        throw new NotFoundException(`User with username ${userName} not found`);
      }

      const newWishlist = this.wishlistRepository.create({
        user: user,
        products: [],
      });

      return await this.wishlistRepository.save(newWishlist);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(
        `Wishlist for user with username ${userName} not found`,
      );
    }
  }

  async removeFromWishlist(
    userName: string,
    productId: number,
  ): Promise<Wishlist> {
    try {
      const wishlist = await this.getWishlistByUserName(userName);
      const index = wishlist.products.findIndex(
        (product) => product.id === productId,
      );

      if (index === -1) {
        throw new NotFoundException(
          `Product with ID ${productId} not found in the wishlist`,
        );
      }

      wishlist.products.splice(index, 1);

      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`User with username ${userName} not found`);
    }
  }
  async addToWishlist(userName: string, productId: number): Promise<Wishlist> {
    try {
      const wishlist = await this.getWishlistByUserName(userName);
      wishlist.products.push({ id: productId } as any);
      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      throw new NotFoundException(`User with ID ${userName} not found`);
    }
  }
}
