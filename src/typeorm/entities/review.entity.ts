// src/entities/review.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;
  @ApiProperty()
  @Column()
  @IsNotEmpty({ message: 'Review text cannot be empty' })
  text: string;
  @ApiProperty()
  @Column()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be greater than or equal to 1' })
  rating: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  product: Product;
  @Column()
  createdbyUserId: number;
}
