// src/cart/cart.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from 'src/typeorm/entities/cart.entity';
import { CartItem } from 'src/typeorm/entities/cart-item.entity';
import { Product } from 'src/typeorm/entities/product.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { CartController } from './controller/cart.controller';
import { CartService } from './services/cart.services';


@Module({
  imports: [TypeOrmModule.forFeature([Cart, CartItem, Product, User])],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
