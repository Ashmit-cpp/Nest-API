import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  username: string;

  @ManyToMany(() => Product, (product) => product.categories)
  @JoinTable()
  products: Product[];
}
