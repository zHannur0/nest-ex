import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident } from './incident.entity';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Incident])],
    providers: [IncidentService],
    controllers: [IncidentController],
})
export class IncidentModule {}
