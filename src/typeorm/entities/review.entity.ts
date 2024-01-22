// src/entities/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsString } from 'class-validator';
import { Product } from './product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Review text cannot be empty' })
  text: string;

  @Column()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be greater than or equal to 1' })
  rating: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
}
