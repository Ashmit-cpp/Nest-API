import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the cart item',
  })
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @ApiProperty({
    type: () => Cart,
    description: 'The cart associated with the cart item',
  })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @ApiProperty({
    type: () => Product,
    description: 'The product associated with the cart item',
  })
  product: Product;

  @Column()
  @ApiProperty({
    example: 2,
    description: 'The quantity of the product in the cart',
  })
  quantity: number;
}
