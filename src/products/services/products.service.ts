// src/modules/product/product.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product.entity';
import { Review } from 'src/typeorm/entities/review.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User } from 'src/typeorm/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findAll({
    page,
    limit,
    searchTerm,
    sortBy,
    sortOrder,
  }): Promise<Product[]> {
    const cacheKey = `products:${searchTerm || 'all'}:${page}:${limit}:${sortBy}:${sortOrder}`;
    console.log('returning cached data', cacheKey);
    const cachedData = await this.cacheManager.get<Product[]>(cacheKey);

    if (cachedData) {
      console.log('returning cached data', cachedData);
      return cachedData;
    }
    // If not, fetch the data from the database
    const skip = (page - 1) * limit;
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.reviews', 'reviews')
      .take(limit)
      .skip(skip);

    if (searchTerm) {
      queryBuilder.where('product.name LIKE :name', {
        name: `%${searchTerm}%`,
      });
    }

    // Apply sorting if sortBy and sortOrder are provided
    if (sortBy && sortOrder) {
      queryBuilder.orderBy(
        `product.${sortBy}`,
        sortOrder.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    const products = await queryBuilder.getMany();
    // Cache the fetched data for future use
    await this.cacheManager.set(cacheKey, products, 10);
    return products;
  }

  async findOne(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      // select: []
      where: { id },
      relations: ['reviews'],
    });
  }
  async findByCreateId(createdById: number): Promise<Product[] | undefined> {
    return this.productRepository.find({
      where: { createdById },
      relations: ['reviews'],
    });
  }

  async create(productData: Partial<Product>): Promise<Product> {
    const newProduct = this.productRepository.create(productData);
    return this.productRepository.save(newProduct);
  }

  async update(
    id: number,
    productData: Partial<Product>,
  ): Promise<Product | undefined> {
    await this.productRepository.update(id, productData);
    return this.productRepository.findOne({
      where: { id },
    });
  }

  async remove(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }

  async addReview(
    product: Product,
    reviewData: { text: string; rating: number },
    UserId: number,
  ): Promise<Review> {
    const review = new Review();
    review.text = reviewData.text;
    review.rating = reviewData.rating;
    review.product = product;
    review.createdbyUserId = UserId;
    await this.reviewRepository.save(review);
    return review;
  }

  async deleteReviews(product: Product): Promise<void> {
    const { reviews } = product;

    if (reviews && reviews.length > 0) {
      await Promise.all(
        reviews.map(async (review: Review) => {
          await this.productRepository
            .createQueryBuilder()
            .relation(Product, 'reviews')
            .of(product.id)
            .remove(review.id);
        }),
      );
    }
  }
}
