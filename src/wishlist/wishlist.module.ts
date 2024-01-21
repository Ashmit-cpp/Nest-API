// src/modules/wishlist/wishlist.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product.entity';
import { User } from 'src/typeorm/entities/user.entity';
import { Wishlist } from 'src/typeorm/entities/wishlist.entity';
import { WishlistController } from './controllers/wishlist.controller';
import { WishlistService } from './services/wishlist.service';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Wishlist,Product,User]),
    UsersModule,
    ProductsModule,
  ],  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
