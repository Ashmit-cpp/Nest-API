// src/modules/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product.entity';
import { Review } from 'src/typeorm/entities/review.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async findAll({ page, limit }): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return this.productRepository.find({
      take: limit,
      skip,
      relations: ['reviews'],
    });
  }

  async findOne(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      // select: []
      where: { id },
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
  ): Promise<Review> {
    const review = new Review();
    review.text = reviewData.text;
    review.rating = reviewData.rating;
    review.product = product;
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
