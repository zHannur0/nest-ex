import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    maxCapacity: number;

    @Column()
    speed: number;

    @OneToMany(() => Item, (item) => item.cart)
    items: Item[];
}
