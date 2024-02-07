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
  async getCartByuserId(UserID: number): Promise<Cart> {
    try {
      const existingCart = await this.cartRepository.findOne({
        where: { user: { id: UserID } },
        relations: ['items', 'items.product'],
      });
      // console.log('Existing Cart:', existingCart);
      if (existingCart) {
        return existingCart;
      }

      // If cart doesn't exist, create a new one
      const user = await this.userRepository.findOne({
        where: { id: UserID },
      });
      console.log('User:', user);
      if (!user) {
        throw new NotFoundException(`User with user id ${UserID} not found`);
      }

      const newCart = this.cartRepository.create({
        user: user,
        items: [],
      });

      return await this.cartRepository.save(newCart);
    } catch (error) {
      console.error('Error in getCartByuserId:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(`Cart user id ${UserID} not found`);
    }
  }

  async addToCart(
    UserId: number,
    productId: number,
    quantity: number,
    totalPrice: number,
  ): Promise<Cart> {
    try {
      const cart = await this.getCartByuserId(UserId);
      const product = await this.productRepository.findOne({
        where: { id: productId },
      });
      // console.log('Product:', product);
      if (!product) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }
      const existingCartItem = cart.items.find(
        (item) => item.product.id === +productId,
      );
      // console.log('Existing Cart Item:', existingCartItem);

      if (existingCartItem) {
        existingCartItem.quantity += +quantity;
        existingCartItem.totalPrice += +totalPrice;
      } else {
        const newCartItem = this.cartItemRepository.create({
          cart: cart,
          product: product,
          quantity: quantity,
          totalPrice: totalPrice,
        });
        console.log('New Cart Item:', newCartItem);
        cart.items.push(newCartItem);
      }

      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in addToCart:', error);
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new NotFoundException(`User with user id ${UserId} not found`);
    }
  }

  async deleteAllFromCart(UserId: number, productId: number): Promise<Cart> {
    try {
      const cart = await this.getCartByuserId(UserId);

      const index = cart.items.findIndex(
        (item) => item.product.id == productId,
      );
      console.log(index);
      if (index !== -1) {
        // Remove the item from the cart
        cart.items.splice(index, 1);
      } else {
        throw new NotFoundException(
          `Item with product ID ${productId} not found in the cart`,
        );
      }

      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in deleteFromCart:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(`User with user id ${UserId} not found`);
    }
  }

  async reduceQuantity(UserId: number, productId: number): Promise<Cart> {
    try {
      const cart = await this.getCartByuserId(UserId);
      console.log(cart);
      const existingCartItem = cart.items.find(
        (item) => item.product.id === +productId,
      );

      if (existingCartItem) {
        // Reduce the quantity by 1
        if (existingCartItem.quantity > 1) {
          existingCartItem.quantity -= 1;
          existingCartItem.totalPrice =
            existingCartItem.quantity * existingCartItem.product.price;
        } else {
          // If quantity is already 1, remove the item from the cart
          const index = cart.items.indexOf(existingCartItem);
          cart.items.splice(index, 1);
        }
      } else {
        throw new NotFoundException(
          `Item with product ID ${productId} not found in the cart`,
        );
      }

      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in reduceQuantity:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(`User with user id ${UserId} not found`);
    }
  }

  async increaseQuantity(UserId: number, productId: number): Promise<Cart> {
    try {
      const cart = await this.getCartByuserId(UserId);

      const existingCartItem = cart.items.find(
        (item) => item.product.id === +productId,
      );

      if (existingCartItem) {
        existingCartItem.quantity += 1;
        existingCartItem.totalPrice =
          existingCartItem.quantity * existingCartItem.product.price;
      } else {
        throw new NotFoundException(
          `Item with product ID ${productId} not found in the cart`,
        );
      }

      return await this.cartRepository.save(cart);
    } catch (error) {
      console.error('Error in increaseQuantity:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw NotFoundException directly
      }

      throw new NotFoundException(`User with user id ${UserId} not found`);
    }
  }
}
