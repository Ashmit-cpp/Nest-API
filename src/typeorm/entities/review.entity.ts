import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { IsNotEmpty, IsNumber, Min, IsString } from 'class-validator';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the review',
  })
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Review text cannot be empty' })
  @ApiProperty({
    example: 'This product is amazing!',
    description: 'The text of the review',
    required: true,
  })
  text: string;

  @Column()
  @IsNumber({}, { message: 'Rating must be a number' })
  @Min(1, { message: 'Rating must be greater than or equal to 1' })
  @ApiProperty({
    example: 5,
    description: 'The rating given in the review',
    required: true,
  })
  rating: number;

  @ManyToOne(() => Product, (product) => product.reviews)
  @ApiProperty({
    type: () => Product,
    description: 'The product associated with the review',
  })
  product: Product;
}
