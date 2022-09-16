import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-erros';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {

    constructor(
        @InjectRepository(AirportEntity)
        private readonly airportRepository: Repository<AirportEntity>
    ) {}

    async findAll(): Promise<AirportEntity[]> {
        return await this.airportRepository.find({ relations: ["airports"] });
    }

    async findOne(id: string): Promise<AirportEntity> {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id }, relations: ["airports"] });
        if (!airport) {
            throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        return airport;
    }

    async create(airport: AirportEntity): Promise<AirportEntity> {
        if( airport.code.length > 3 ) {
            throw new BusinessLogicException("Airport code cannot be longer than 3 characters", BusinessError.PRECONDITION_FAILED);
        }
        return await this.airportRepository.save(airport);
    }

    async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
        const airportParsisted: AirportEntity = await this.airportRepository.findOne({ where: { id } });        
        if (!airportParsisted) {
            throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        if( airport.code.length > 3 ) {
            throw new BusinessLogicException("Airport code cannot be longer than 3 characters", BusinessError.PRECONDITION_FAILED);
        }
        airport.id = id;
        return await this.airportRepository.save(airport);
    }

    async delete(id: string) {
        const airport: AirportEntity = await this.airportRepository.findOne({ where: { id } });
        if (!airport) {
            throw new BusinessLogicException("The Airport with the given id was not found", BusinessError.NOT_FOUND);
        }
        await this.airportRepository.remove(airport);
    }
}
