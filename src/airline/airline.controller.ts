import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AirlineDto } from './airline.dto';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineController {

    constructor( private readonly service: AirlineService) {}

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':idAirline')
    async findOne(@Param('idAirline') idAirline: string) {
        return await this.service.findOne(idAirline);
    }

    @Post()
    async create(@Body() airlineDto: AirlineDto) {
        const airline: AirlineEntity = plainToInstance(AirlineEntity, airlineDto);
        return await this.service.create(airline);
    }

    @Put()
    async update(@Param('idAirline') idAirline: string, @Body() airlineDto: AirlineDto) {
        const airlineUpdate: AirlineEntity = plainToInstance(AirlineEntity, airlineDto);
        return await this.service.update(idAirline, airlineUpdate);
    }

    @Delete()
    @HttpCode(204)
    async delete(@Param('idAirline') idAirline: string) {
        return await this.service.delete(idAirline);
    }
}
