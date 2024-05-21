// city.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Seller } from './seller.entity';

@Entity()
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
}
