// src/wishlist/wishlist.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
        return existingWishlist;
      }

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

      const updatedProducts = wishlist.products.reduce((acc, product) => {
        if (product.id == productId) {
          return acc;
        }
        return [...acc, product];
      }, [] as any[]);

      if (wishlist.products.length === updatedProducts.length) {
        throw new NotFoundException(
          `Product with ID ${productId} not found in the wishlist`,
        );
      }

      wishlist.products = updatedProducts;
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

      const isProductInWishlist = wishlist.products.some(
        (product) => product.id == productId,
      );
      if (isProductInWishlist) {
        throw new ConflictException('Product is already in the wishlist');
      }

      wishlist.products.push({ id: productId } as any);
      return await this.wishlistRepository.save(wishlist);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error; // Re-throw specific exceptions directly
      }

      throw new InternalServerErrorException(
        'An unexpected error occurred while adding to the wishlist.',
      );
    }
  }
}
