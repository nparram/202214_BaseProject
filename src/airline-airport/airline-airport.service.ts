import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-erros';
import { Repository } from 'typeorm';

@Injectable()
export class AirlineAirportService {

    constructor(
        @InjectRepository(AirlineEntity)
        private readonly airlineRepository: Repository<AirlineEntity>,

        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) { }

    async addAirportToAirline(idAirport: string, idAirline: string): Promise<AirlineEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id: idAirport } });
        if (!airport) {
            throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id: idAirline }, relations: ["airports"] });        
        if (!airline) {
            throw new BusinessLogicException("The Airline with the given id was not found", BusinessError.NOT_FOUND);
        }

        airline.airports = [...airline.airports, airport];
        return await this.airlineRepository.save(airline);
    }

    async findAirportsFromAirline(idAirline: string): Promise<AirportEntity[]> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id: idAirline }, relations: ["airports"] });        
        if (!airline) {
            throw new BusinessLogicException("The Airline with the given id was not found", BusinessError.NOT_FOUND);
        }

        return airline.airports;
    }

    async findAirportFromAirline(idAirline: string, idAirport: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id: idAirport } });
        if (!airport) {
            throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id: idAirline }, relations: ["airports"] });        
        if (!airline) {
            throw new BusinessLogicException("The Airline with the given id was not found", BusinessError.NOT_FOUND);
        }
        const airlineAirport: AirportEntity = airline.airports.find( e => e.id === airport.id );

        if(!airlineAirport) {
            throw new BusinessLogicException("The Airport with the given id is not associated to the Airline", BusinessError.PRECONDITION_FAILED);
        }

        return airlineAirport;
    }

    async updateAirportsFromAirline(idAirline: string, airports: AirportEntity[]): Promise<AirlineEntity> {
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id: idAirline }, relations: ["airports"] });        
        if (!airline) {
            throw new BusinessLogicException("The Airline with the given id was not found", BusinessError.NOT_FOUND);
        }
        for (let i = 0; i < airports.length; i++) {
            const airport: AirportEntity = await this.airportRepository.findOne({ where: { id: `${airports[i].id}` } });
            if (!airport) {
                throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
            }
        }
        airline.airports = airports;
        return await this.airlineRepository.save(airline);
    }

    async deleteAirportFromAirline(idAirline: string, idAirport: string) {
        const airline: AirlineEntity = await this.airlineRepository.findOne({ where: { id: idAirline }, relations: ["airports"] });        
        if (!airline) {
            throw new BusinessLogicException("The Airline with the given id was not found", BusinessError.NOT_FOUND);
        }

        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id: idAirport } });
        if (!airport) {
            throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
        }

        const airlineAirport = airline.airports.find( e => e.id === airport.id );
        if(!airlineAirport) {
            throw new BusinessLogicException("The Airport with the given id is not associated to the Airline", BusinessError.PRECONDITION_FAILED);
        }
        airline.airports = airline.airports.filter( e => e.id !== airport.id );

        return await this.airlineRepository.save(airline);
    }
}
