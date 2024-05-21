import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './incident.entity';

@Injectable()
export class IncidentService {
    constructor(
        @InjectRepository(Incident)
        private incidentRepository: Repository<Incident>,
    ) {}

    async getRandomIncident(): Promise<Incident> {
        const incidents = await this.incidentRepository.find();
        const randomIndex = Math.floor(Math.random() * incidents.length);
        return incidents[randomIndex];
    }

    async createIncident(description: string, effect: string): Promise<Incident> {
        const incident = new Incident();
        incident.description = description;
        incident.effect = effect;
        return this.incidentRepository.save(incident);
    }

    async findAll(): Promise<Incident[]> {  
        return this.incidentRepository.find();
    }

    async findOne(id: number): Promise<Incident> {
        return this.incidentRepository.findOne(id);
    }

    async updateIncident(id: number, description: string, effect: string): Promise<void> {
        await this.incidentRepository.update(id, { description, effect });
    }
}
