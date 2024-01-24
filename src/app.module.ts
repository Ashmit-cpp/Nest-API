import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './typeorm/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { Cart } from './typeorm/entities/cart.entity';
import { CartItem } from './typeorm/entities/cart-item.entity';
import { Product } from './typeorm/entities/product.entity';
import { Category } from './typeorm/entities/category.entity';
import { Wishlist } from './typeorm/entities/wishlist.entity';
import { ProductsModule } from './products/products.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { CartModule } from './cart/cart.module';
import { Review } from './typeorm/entities/review.entity';
import { ReportingModule } from './reporting/reporting.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('HOST'),
        port: +configService.get('PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, Cart, CartItem, Product, Category, Wishlist, Review],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
    UsersModule,
    AuthModule,
    ProductsModule,
    WishlistModule,
    CartModule,
    ReportingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
