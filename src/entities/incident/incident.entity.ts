import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Incident {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    effect: string;
}
