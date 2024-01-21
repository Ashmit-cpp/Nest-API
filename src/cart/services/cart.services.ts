// src/cart/cart.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from 'src/typeorm/entities/cart.entity';
import { CartItem } from 'src/typeorm/entities/cart-item.entity';
import { Product } from 'src/typeorm/entities/product.entity';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  // src/cart/cart.service.ts
  async getCartByUserName(userName: string): Promise<Cart> {
    try {
      const existingCart = await this.cartRepository.findOne({
        where: { user: { username: userName } },
        relations: ['items', 'items.product'],
      });
      console.log('Existing Cart:', existingCart);
      if (existingCart) {
        return existingCart;
      }

      // If cart doesn't exist, create a new one
      const user = await this.userRepository.findOne({
        where: { username: userName },
      });
      console.log('User:', user);
      if (!user) {
        throw new NotFoundException(`User with username ${userName} not found`);
      }

      const newCart = this.cartRepository.create({
        user: user,
        items: [],
      });

      return await this.cartRepository.save(newCart);
    } catch (error) {
      console.error('Error in getCartByUserName:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(`Cart username ${userName} not found`);
    }
  }

  async addToCart(
    userName: string,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    try {
      const cart = await this.getCartByUserName(userName);
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });
      console.log('Product:', product);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      const existingCartItem = cart.items.find(
        (item) => item.product.id === productId,
      );
      console.log('Existing Cart Item:', existingCartItem);
      if (existingCartItem) {
        existingCartItem.quantity += quantity;
      } else {
        const newCartItem = this.cartItemRepository.create({
          cart: cart,
          product: product,
          quantity: quantity,
        });
        console.log('New Cart Item:', newCartItem);
        cart.items.push(newCartItem);
      }

      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in addToCart:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(`User with username ${userName} not found`);
    }
  }
}
