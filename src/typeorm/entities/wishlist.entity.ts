import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the wishlist item',
  })
  id: number;

  @ApiProperty({
    example: 'john_doe',
    description: 'The username associated with the wishlist item',
  })
  username: string;

  @ManyToOne(() => User, (user) => user.wishlist)
  user: User;

  @ManyToMany(() => Product)
  @JoinTable()
  @ApiProperty({
    type: [Product],
    description: 'The products associated with the wishlist item',
  })
  products: Product[];
}
