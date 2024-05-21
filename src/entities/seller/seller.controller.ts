import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { SellerService } from './seller.service';
import { Seller } from './seller.entity';

@Controller('sellers')
export class SellerController {
    constructor(private readonly sellerService: SellerService) {}

    @Post()
    create(@Body() createSellerDto: { name: string, money: number, cartCapacity: number, cityId: number }): Promise<Seller> {
        return this.sellerService.createSeller(createSellerDto.name, createSellerDto.money, createSellerDto.cartCapacity, createSellerDto.cityId);
    }

    @Get()
    findAll(): Promise<Seller[]> {
        return this.sellerService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number): Promise<Seller> {
        return this.sellerService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() updateSellerDto: { money: number, cartCapacity: number }): Promise<void> {
        return this.sellerService.updateSeller(id, updateSellerDto.money, updateSellerDto.cartCapacity);
    }

    @Patch(':id/travel')
    travel(@Param('id') id: number): Promise<string> {
        return this.sellerService.travelToNewCity(id);
    }
}
