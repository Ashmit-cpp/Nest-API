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

  async getWishlistByEmail(Email: string): Promise<Wishlist> {
    try {
      const existingWishlist = await this.wishlistRepository.findOne({
        where: { user: { email: Email } },
        relations: ['products', 'user'],
      });

      if (existingWishlist) {
        return existingWishlist;
      }

      // If wishlist doesn't exist, create a new one
      const user = await this.userRepository.findOne({
        where: { email: Email },
      });

      if (!user) {
        throw new NotFoundException(`User with username ${Email} not found`);
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
        `Wishlist for user with username ${Email} not found`,
      );
    }
  }

  async removeFromWishlist(
    Email: string,
    productId: number,
  ): Promise<Wishlist> {
    try {
      const wishlist = await this.getWishlistByEmail(Email);

      const updatedProducts = wishlist.products.reduce((acc, product) => {
        if (product.id == productId) {
          // console.log('product.id', product.id);
          // console.log('productId', productId);
          return acc;
        }
        return [...acc, product];
      }, [] as any[]);

      wishlist.products = updatedProducts;
      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`User with username ${Email} not found`);
    }
  }

  async addToWishlist(Email: string, productId: number): Promise<Wishlist> {
    try {
      const wishlist = await this.getWishlistByEmail(Email);
      wishlist.products.push({ id: productId } as any);
      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      throw new NotFoundException(`User with ID ${Email} not found`);
    }
  }
}
