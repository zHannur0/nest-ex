// cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
    ) {}

    async createCart(maxCapacity: number, speed: number): Promise<Cart> {
        const cart = new Cart();
        cart.maxCapacity = maxCapacity;
        cart.speed = speed;
        return this.cartRepository.save(cart);
    }

    async findAll(): Promise<Cart[]> {
        return this.cartRepository.find();
    }

    async findOne(id: number): Promise<Cart> {
        return this.cartRepository.findOne(id);
    }

    async updateCart(id: number, maxCapacity: number, speed: number): Promise<void> {
        await this.cartRepository.update(id, { maxCapacity, speed });
    }
}
