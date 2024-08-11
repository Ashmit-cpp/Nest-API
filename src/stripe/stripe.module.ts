// src/modules/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { Wishlist } from 'src/typeorm/entities/wishlist.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { StripeController } from './controllers/stripe.controller';
import { StripeService } from './services/stripe.service';
import { Cart } from 'src/typeorm/entities/cart.entity';
import { CartService } from 'src/cart/services/cart.services';
import { CartModule } from 'src/cart/cart.module';
import { CartItem } from 'src/typeorm/entities/cart-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist, Product, User, Cart, CartItem]),
    UsersModule,
    ProductsModule,
    CartModule,
  ],
  controllers: [StripeController],
  providers: [StripeService, CartService],
  exports: [StripeService],
})
export class StripeModule {}
