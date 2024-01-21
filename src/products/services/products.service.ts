// src/modules/product/product.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/typeorm/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findOne(id: number): Promise<Product | undefined> {
    return this.productRepository.findOne({
      where: { id },
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
}
