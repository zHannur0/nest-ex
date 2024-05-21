import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { Cart } from './cart.entity';
import { City } from './city.entity';

@Entity()
export class Seller {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    money: number;

    @Column()
    cartCapacity: number;

    @OneToOne(() => Cart)
    @JoinColumn()
    cart: Cart;

    @ManyToOne(() => City)
    currentCity: City;
}
