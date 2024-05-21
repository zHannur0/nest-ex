// city.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City)
        private cityRepository: Repository<City>,
    ) {}

    async createCity(name: string, distance: number): Promise<City> {
        const city = new City();
        city.name = name;
        city.distance = distance;
        return this.cityRepository.save(city);
    }

    async findAll(): Promise<City[]> {
        return this.cityRepository.find();
    }

    async findOne(id: number): Promise<City> {
        return this.cityRepository.findOne(id);
    }

    async updateCity(id: number, name: string, distance: number): Promise<void> {
        await this.cityRepository.update(id, { name, distance });
    }
}
