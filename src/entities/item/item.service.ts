// item.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item } from './item.entity';
import { Cart } from './cart.entity';

@Injectable()
export class ItemService {
    constructor(
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
    ) {}

    async createItem(type: string, weight: number, quality: string, price: number, cartId: number): Promise<Item> {
        const item = new Item();
        item.type = type;
        item.weight = weight;
        item.quality = quality;
        item.price = price;

        const cart = await this.cartRepository.findOne(cartId);
        item.cart = cart;

        return this.itemRepository.save(item);
    }

    async findAll(): Promise<Item[]> {
        return this.itemRepository.find({ relations: ['cart'] });
    }

    async findOne(id: number): Promise<Item> {
        return this.itemRepository.findOne(id, { relations: ['cart'] });
    }

    async updateItem(id: number, type: string, weight: number, quality: string, price: number): Promise<void> {
        await this.itemRepository.update(id, { type, weight, quality, price });
    }
}
