import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    weight: number;

    @Column()
    quality: string;

    @Column()
    price: number;

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart: Cart;
}
