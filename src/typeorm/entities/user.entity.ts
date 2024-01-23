import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';
import { Cart } from './cart.entity';
import { Wishlist } from './wishlist.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username', 'email'])
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the user' })
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  @ApiProperty({
    example: 'john_doe',
    description: 'The username of the user',
    required: true,
  })
  username: string;

  @Column()
  @IsEmail({}, { message: 'Invalid email format' })
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
    required: true,
  })
  email: string;

  @Column()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    required: true,
  })
  password: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];
}
