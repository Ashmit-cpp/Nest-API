import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller';
import { ProductsService } from './services/products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product.entity';
import { Review } from 'src/typeorm/entities/review.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from 'src/utils/app-options.constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Review]),
    CacheModule.registerAsync(RedisOptions),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
