import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { CartItem } from './cart-item.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'The unique identifier of the cart' })
  id: number;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username associated with the cart',
  })
  username: string;

  @OneToOne(() => User, (user) => user.cart)
  @JoinColumn()
  @ApiProperty({
    type: () => User,
    description: 'The user associated with the cart',
  })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, { cascade: true })
  @ApiProperty({
    type: [CartItem],
    description: 'The items associated with the cart',
  })
  items: CartItem[];
}
