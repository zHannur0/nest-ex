import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './seller.entity';
import { Cart } from './cart.entity';
import { City } from './city.entity';
import { Item } from './item.entity';
import { IncidentService } from '../incident/incident.service';

@Injectable()
export class SellerService {
    constructor(
        @InjectRepository(Seller)
        private sellerRepository: Repository<Seller>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
        @InjectRepository(City)
        private cityRepository: Repository<City>,
        @InjectRepository(Item)
        private itemRepository: Repository<Item>,
        private readonly incidentService: IncidentService,
    ) {}

    async createSeller(name: string, money: number, cartCapacity: number, cityId: number): Promise<Seller> {
        const seller = new Seller();
        seller.name = name;
        seller.money = money;
        seller.cartCapacity = cartCapacity;

        const cart = new Cart();
        cart.maxCapacity = cartCapacity;
        cart.speed = 5; // Default speed
        seller.cart = await this.cartRepository.save(cart);

        seller.currentCity = await this.cityRepository.findOne(cityId);

        return this.sellerRepository.save(seller);
    }

    async findAll(): Promise<Seller[]> {
        return this.sellerRepository.find({ relations: ['cart', 'currentCity', 'cart.items'] });
    }

    async findOne(id: number): Promise<Seller> {
        return this.sellerRepository.findOne(id, { relations: ['cart', 'currentCity', 'cart.items'] });
    }

    async updateSeller(id: number, money: number, cartCapacity: number): Promise<void> {
        await this.sellerRepository.update(id, { money, cartCapacity });
    }

    async moveSellerToCity(sellerId: number, cityId: number): Promise<void> {
        const seller = await this.sellerRepository.findOne(sellerId, { relations: ['currentCity'] });
        const newCity = await this.cityRepository.findOne(cityId);

        seller.currentCity = newCity;
        await this.sellerRepository.save(seller);
    }

    async buyItem(sellerId: number, itemType: string, weight: number, quality: string, price: number): Promise<void> {
        const seller = await this.sellerRepository.findOne(sellerId, { relations: ['cart', 'cart.items'] });

        if (seller.money < price) {
            throw new Error('Not enough money');
        }

        const totalWeight = seller.cart.items.reduce((acc, item) => acc + item.weight, 0);
        if (totalWeight + weight > seller.cart.maxCapacity) {
            throw new Error('Not enough space in the cart');
        }

        const item = new Item();
        item.type = itemType;
        item.weight = weight;
        item.quality = quality;
        item.price = price;
        item.cart = seller.cart;

        await this.itemRepository.save(item);

        seller.money -= price;
        await this.sellerRepository.save(seller);
    }

    async processIncident(sellerId: number): Promise<string> {
        const seller = await this.sellerRepository.findOne(sellerId, { relations: ['cart', 'cart.items'] });
        const incident = await this.incidentService.getRandomIncident();

        switch (incident.effect) {
            case 'rain':
                seller.cart.speed -= 2;
                if (Math.random() < 0.2) {
                    const randomItemIndex = Math.floor(Math.random() * seller.cart.items.length);
                    const item = seller.cart.items[randomItemIndex];
                    item.quality = this.decreaseItemQuality(item.quality);
                    await this.itemRepository.save(item);
                }
                break;
            case 'smooth_road':
                seller.cart.speed = Math.min(seller.cart.speed + 2, 5);
                break;
            case 'broken_cart':
                seller.cart.daysLost++;
                break;
            case 'river':
                seller.cart.daysLost++;
                seller.cart.speed = Math.max(seller.cart.speed - 1, 1);
                break;
            case 'local_guide':
                seller.cart.speed += 3;
                break;
            case 'bandits':
                if (seller.money > 0) {
                    seller.money -= Math.min(seller.money, 10);
                } else {
                    const randomItemIndex = Math.floor(Math.random() * seller.cart.items.length);
                    await this.itemRepository.remove(seller.cart.items[randomItemIndex]);
                }
                break;
            case 'inn':
                if (seller.money >= 5) {
                    seller.money -= 5;
                }
                break;
            case 'item_spoiled':
                const randomItemIndex = Math.floor(Math.random() * seller.cart.items.length);
                const item = seller.cart.items[randomItemIndex];
                item.quality = this.decreaseItemQuality(item.quality);
                await this.itemRepository.save(item);
                break;
            default:
                break;
        }

        await this.sellerRepository.save(seller);
        return incident.description;
    }

    private decreaseItemQuality(currentQuality: string): string {
        const qualityOrder = ['normal', 'slightly_spoiled', 'half_spoiled', 'almost_spoiled', 'completely_spoiled'];
        const index = qualityOrder.indexOf(currentQuality);
        return qualityOrder[Math.min(index + 1, qualityOrder.length - 1)];
    }

    async travelToNewCity(sellerId: number): Promise<string> {
        const seller = await this.sellerRepository.findOne(sellerId, { relations: ['currentCity', 'cart', 'cart.items'] });
        const cities = await this.cityRepository.find();
        const randomCity = cities[Math.floor(Math.random() * cities.length)];

        const distance = randomCity.distance;
        let daysTaken = 0;
        while (daysTaken * seller.cart.speed < distance) {
            daysTaken++;
            const incidentDescription = await this.processIncident(sellerId);
            console.log(incidentDescription);
        }

        seller.currentCity = randomCity;
        await this.sellerRepository.save(seller);

        return `Seller arrived in ${randomCity.name} after ${daysTaken} days.`;
    }
}
