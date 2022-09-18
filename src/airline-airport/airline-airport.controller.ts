import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AirportDto } from 'src/airport/airport.dto';
import { AirportEntity } from 'src/airport/airport.entity';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors.interceptor';
import { AirlineAirportService } from './airline-airport.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {

    constructor(private readonly service: AirlineAirportService) {}

    @Post(':idAirline/airports/:idAirport')
    async addAirportToAirline(@Param('idAirline') idAirline: string, @Param('idAirport') idAirport: string) {
        return await this.service.addAirportToAirline(idAirport, idAirline);
    }

    @Get(':idAirline/airports/:idAirport')
    async findAirportFromAirline(@Param('idAirline') idAirline: string, @Param('idAirport') idAirport: string) {
        return await this.service.findAirportFromAirline(idAirline, idAirport);
    }

    @Get(':idAirline/airports')
    async findAirportsFromAirline(@Param('idAirline') idAirline: string) {
        return await this.service.findAirportsFromAirline(idAirline);
    }

    @Put(':idAirline/airports')
    async updateAirportsFromAirline(@Body() airportDto: AirportDto[], @Param('idAirline') idAirline: string) {
        const airport: AirportEntity[] = plainToInstance(AirportEntity, airportDto);
        return await this.service.updateAirportsFromAirline(idAirline,airport);
    }

    @Delete(':idAirline/airports/:idAirport')
    @HttpCode(204)
    async deleteAirportFromAirline(@Param('idAirline') idAirline: string, @Param('idAirport') idAirport: string) {
        return await this.service.deleteAirportFromAirline(idAirline, idAirport);
    }

}
