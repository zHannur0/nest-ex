import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Seller } from './seller.entity';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Cart } from './cart.entity';
import { City } from './city.entity';
import { Item } from './item.entity';
import { IncidentService } from '../incident/incident.service';
import { Incident } from '../incident/incident.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Seller, Cart, City, Item, Incident])],
    providers: [SellerService, IncidentService],
    controllers: [SellerController],
})
export class SellerModule {}
