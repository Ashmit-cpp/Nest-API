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

@Entity()
@Unique(['username', 'email'])  // Use the Unique decorator on the entity level
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string;

  @Column()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @Column()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @OneToOne(() => Cart, (cart) => cart.user, { cascade: true })
  cart: Cart;

  @OneToMany(() => Wishlist, (wishlist) => wishlist.user)
  wishlist: Wishlist[];
}
