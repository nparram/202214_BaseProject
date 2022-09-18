import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(getRepositoryToken(AirportEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];

    for(let i = 0; i < 5; i++) {
      const airport: AirportEntity = await repository.save({
        name: faker.company.name(),
        code: faker.random.alphaNumeric(3),
        city: faker.address.city(),
        country: faker.address.country()
      });
      airportsList.push(airport);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports',  async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return a airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(storedAirport.id);
    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name);
    expect(airport.code).toEqual(storedAirport.code);
    expect(airport.city).toEqual(storedAirport.city);
    expect(airport.country).toEqual(storedAirport.country);
  });

  it('findOne should throw an exception for an invalid airport', async () => {
    await expect( () => service.findOne("0") ).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });

  it('create should return a new airport', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.company.name(),
      code: faker.random.alphaNumeric(3),
      city: faker.address.city(),
      country: faker.address.country(),
      airlines: []
    };
    
    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storeAirport: AirportEntity = await repository.findOne({where: {id: `${newAirport.id}` }});
    expect(storeAirport).not.toBeNull();
    expect(storeAirport.name).toEqual(newAirport.name);
    expect(storeAirport.code).toEqual(newAirport.code);
    expect(storeAirport.country).toEqual(newAirport.country);
    expect(storeAirport.city).toEqual(newAirport.city);
  });

  it('create should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = {
      id: "",
      name: null,
      code: null,
      city: faker.address.city(),
      country: faker.address.country(),
      airlines: []
    };

    await expect( () => service.create(airport) ).rejects.toThrowError();
  });

  it('create should throw an exception for code cannot be longer than 3 characters', async () => {
    const airport: AirportEntity = {
      id: "",
      name: faker.company.name(),
      code: faker.random.alphaNumeric(4),
      city: faker.address.city(),
      country: faker.address.country(),
      airlines: []
    };
    console.log(airport)
    await expect( () => service.create(airport) ).rejects.toHaveProperty("message", "Airport code cannot be longer than 3 characters");
  });

  it('update should modify a airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = "new name";
    airport.code = faker.random.alphaNumeric(3),
    airport.city = "new city";
    airport.country = "new country";

    const AirportUpdated: AirportEntity = await service.update(airport.id, airport);
    expect(AirportUpdated).not.toBeNull();

    const storeAirport: AirportEntity = await repository.findOne({where: {id: `${airport.id}` }});
    expect(storeAirport).not.toBeNull();
    expect(storeAirport.name).toEqual(airport.name);
    expect(storeAirport.code).toEqual(airport.code);
    expect(storeAirport.city).toEqual(airport.city);
    expect(storeAirport.country).toEqual(airport.country);
  });

  it('update should throw an exception for an invalid airport', async () => {
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport,
      name: "new name",
      city: "new city"
    };
    await expect( () => service.update("0", airport) ).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });

  it('update should throw an exception for code cannot be longer than 3 characters', async () => {
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport,
      code: faker.random.alphaNumeric(4)
    };
    await expect( () => service.update(airport.id, airport) ).rejects.toHaveProperty("message", "Airport code cannot be longer than 3 characters");
  });

  it('delete should remove a airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);

    const airportDeleted: AirportEntity = await repository.findOne({where: {id: `${airport.id}` }});
    expect(airportDeleted).toBeNull();
  });

  it('delete should throw an exception for an invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    await service.delete(airport.id);

    await expect( () => service.delete(airport.id) ).rejects.toHaveProperty("message", "The Airport with the given id was not found");
  });
});
