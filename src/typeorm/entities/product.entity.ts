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
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the product',
  })
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @ApiProperty({
    example: 'Product Name',
    description: 'The name of the product',
    required: true,
  })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  @ApiProperty({
    example: 'Product Description',
    description: 'The description of the product',
    required: true,
  })
  description: string;

  @Column()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(1, { message: 'Price must be greater than or equal to 1' })
  @ApiProperty({
    example: 19.99,
    description: 'The price of the product',
    required: true,
  })
  price: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Invalid URL format for imageUrl' })
  @ApiProperty({
    example: 'https://example.com/product-image.jpg',
    description: 'The URL of the product image',
  })
  imageUrl: string;

  @Column()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  @ApiProperty({
    example: 100,
    description: 'The stock quantity of the product',
    required: true,
  })
  stock: number;

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable()
  @ApiProperty({
    type: [Category],
    description: 'The categories associated with the product',
  })
  categories: Category[];

  @OneToMany(() => Review, (review) => review.product, { cascade: true })
  @ApiProperty({
    type: [Review],
    description: 'The reviews associated with the product',
  })
  reviews: Review[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  @ApiProperty({
    type: [CartItem],
    description: 'The cart items associated with the product',
  })
  cartItems: CartItem[];

  @Column({ nullable: true })
  createdBy: string;
}
