import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineAirportService } from './airline-airport.service';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;
  let airportRepository: Repository<AirportEntity>;
  let airlineRepository: Repository<AirlineEntity>;
  let airline: AirlineEntity;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineAirportService],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
    airportRepository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    airlineRepository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    airportRepository.clear();
    airlineRepository.clear();
    airportsList = [];

    for(let i = 0; i < 5; i++) {
      const airport: AirportEntity = await airportRepository.save({
        name: faker.company.name(),
        code: faker.random.alphaNumeric(3),
        city: faker.address.city(),
        country: faker.address.country()
      });
      airportsList.push(airport);
    }

    airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.random.words(),
      fundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: airportsList
    });
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addAirportToAirline should add an airport to a airline', async () => {
    const airport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country()
    });

    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.random.words(),
      fundationDate: faker.date.past(),
      webPage: faker.internet.url()
    });

    const result: AirlineEntity = await service.addAirportToAirline(airport.id, airline.id);

    expect(result.airports.length).toBe(1);
    expect(result.airports[0]).not.toBeNull();
    expect(result.airports[0].name).toEqual(airport.name);
    expect(result.airports[0].code).toEqual(airport.code);
    expect(result.airports[0].country).toEqual(airport.country);
    expect(result.airports[0].city).toEqual(airport.city);
  });

  it('addAirportToAirline should thrown exception for an invalid airport', async () => {
    const airline = await airlineRepository.save({
      name: faker.company.name(),
      description: faker.random.words(),
      fundationDate: faker.date.past(),
      webPage: faker.internet.url()
    });

    await expect( () => service.addAirportToAirline("0", airline.id) ).rejects.toHaveProperty("message", "The Airport with the given id was not found");

  });

  it('addAirportToAirline should thrown exception for an invalid airline', async () => {
    const airport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country()
    });

    await expect( () => service.addAirportToAirline(airline.id, "0") ).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });

  it('findAirportsFromAirline should return airports by airline', async () => {
    const airports: AirportEntity[] = await service.findAirportsFromAirline(airline.id);
    
    expect(airports.length).toBe(5);
  });

  it('findAirportsFromAirline should thrown exception for an invalid airline', async () => {
    await expect( () => service.findAirportsFromAirline("0") ).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

  it('findAirportFromAirline should return an airport by airline', async () => {
    const airport: AirportEntity = airportsList[0];
    const storeAirport: AirportEntity = await service.findAirportFromAirline(airline.id, airport.id);

    expect(storeAirport).not.toBeNull();
    expect(storeAirport.name).toEqual(airport.name);
    expect(storeAirport.code).toEqual(airport.code);
    expect(storeAirport.country).toEqual(airport.country);
    expect(storeAirport.city).toEqual(airport.city);
  });

  it('findAirportFromAirline should thrown exception for an invalid airport', async () => {
    await expect( () => service.findAirportFromAirline(airline.id, "0")).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });

  it('findAirportFromAirline should thrown exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect( () => service.findAirportFromAirline("0", airport.id)).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

  it('updateAirportsFromAirline should update airports list for a airline', async () => {
    const airport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country()
    });

    const updatedAirline: AirlineEntity = await service.updateAirportsFromAirline(airline.id, [airport]);

    expect(updatedAirline.airports.length).toBe(1);
    expect(updatedAirline.airports[0]).not.toBeNull();
    expect(updatedAirline.airports[0].name).toEqual(airport.name);
    expect(updatedAirline.airports[0].code).toEqual(airport.code);
    expect(updatedAirline.airports[0].country).toEqual(airport.country);
    expect(updatedAirline.airports[0].city).toEqual(airport.city);
  });

  it('updateAirportsFromAirline should thrown exception for an invalid airline', async () => {
    const airport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country()
    });

    await expect( () => service.updateAirportsFromAirline("0", [airport])).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

  it('updateAirportsFromAirline should thrown exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.id = "0";
    await expect( () => service.updateAirportsFromAirline(airline.id, [airport])).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });
  
  it('deleteAirportFromAirline should remove an airport from airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.deleteAirportFromAirline(airline.id, airport.id);

    const storedAirline: AirlineEntity = await airlineRepository.findOne({where: {id: `${airline.id}` }, relations: ["airports"]});
    const deletedAirport: AirportEntity = storedAirline.airports.find(a => a.id === airport.id);
    expect(deletedAirport).toBeUndefined();
  });

  it('deleteAirportFromAirline should thrown exception for an invalid airline', async () => {
    const airport: AirportEntity = airportsList[0];
    await expect( () => service.deleteAirportFromAirline("0", airport.id) ).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.id = "0";
    await expect( () => service.deleteAirportFromAirline(airline.id, airport.id) ).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });

  it('deleteAirportFromAirline should thrown exception for an non associated airport', async () => {
    const airport: AirportEntity = await airportRepository.save({
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country()
    });
    await expect( () => service.deleteAirportFromAirline(airline.id, airport.id) ).rejects.toHaveProperty("message", "The Airport with the given id is not associated to the Airline");
  });

});
