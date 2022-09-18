import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AirportDto } from './airport.dto';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

@Controller('airports')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirportController {

    constructor( private readonly service: AirportService) {}

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':idAirport')
    async findOne(@Param('idAirport') idAirport: string) {
        return await this.service.findOne(idAirport);
    }

    @Post()
    async create(@Body() airportDto: AirportDto) {
        const airport: AirportEntity = plainToInstance(AirportEntity, airportDto);
        return await this.service.create(airport);
    }

    @Put(':idAirport')
    async update(@Param('idAirport') idAirport: string, @Body() airportDto: AirportDto) {
        const airportUpdate: AirportEntity = plainToInstance(AirportEntity, airportDto);
        return await this.service.update(idAirport, airportUpdate);
    }

    @Delete(':idAirport')
    @HttpCode(204)
    async delete(@Param('idAirport') idAirport: string) {
        return await this.service.delete(idAirport);
    }

}
