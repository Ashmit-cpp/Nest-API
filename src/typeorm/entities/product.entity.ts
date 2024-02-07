// src/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsOptional, IsUrl } from 'class-validator';
import { Category } from './category.entity';
import { CartItem } from './cart-item.entity';
import { Review } from './review.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: string;

  @Column()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(1, { message: 'Price must be greater than or equal to 1' })
  price: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format for imageUrl' })
  imageUrl: string;

  @Column()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  stock: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  categories: Category[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];

  @Column({ nullable: true })
  createdById: number;
}
