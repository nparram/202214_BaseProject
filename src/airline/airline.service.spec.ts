import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(getRepositoryToken(AirlineEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];

    for(let i = 0; i < 5; i++) {
      const airline: AirlineEntity = await repository.save({
        name: faker.company.name(),
        description: faker.random.words(),
        fundationDate: faker.date.past(),
        webPage: faker.internet.url()
      });
      airlinesList.push(airline);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines',  async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return a airline by id', async () => {
    const storedAirline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedAirline.id);
    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedAirline.name);
    expect(airline.description).toEqual(storedAirline.description);
    expect(airline.fundationDate).toEqual(storedAirline.fundationDate);
    expect(airline.webPage).toEqual(storedAirline.webPage);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    await expect( () => service.findOne("0") ).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.random.words(),
      fundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: []
    };

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storeAirline: AirlineEntity = await repository.findOne({where: {id: `${newAirline.id}` }});
    expect(storeAirline).not.toBeNull();
    expect(storeAirline.name).toEqual(newAirline.name);
    expect(storeAirline.description).toEqual(newAirline.description);
    expect(storeAirline.fundationDate).toEqual(newAirline.fundationDate);
    expect(storeAirline.webPage).toEqual(newAirline.webPage);
  });

  it('create should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: null,
      description: faker.random.words(),
      fundationDate: faker.date.past(),
      webPage: faker.internet.url(),
      airports: []
    };

    await expect( () => service.create(airline) ).rejects.toThrowError();
  });

  it('create should throw an exception for an fundation date equal or later than today', async () => {
    const airline: AirlineEntity = {
      id: "",
      name: faker.company.name(),
      description: faker.random.words(),
      fundationDate: faker.date.future(),
      webPage: faker.internet.url(),
      airports: []
    };

    await expect( () => service.create(airline) ).rejects.toHaveProperty("message", "The foundation date cannot be equal or later than today.");
  });

  it('update should modify a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = "new name";
    airline.description = "new description";
    airline.fundationDate = faker.date.past();

    const AirlineUpdated: AirlineEntity = await service.update(airline.id, airline);
    expect(AirlineUpdated).not.toBeNull();

    const storeAirline: AirlineEntity = await repository.findOne({where: {id: `${airline.id}` }});
    expect(storeAirline).not.toBeNull();
    expect(storeAirline.name).toEqual(airline.name);
    expect(storeAirline.description).toEqual(airline.description);
    expect(storeAirline.fundationDate).toEqual(airline.fundationDate);
    expect(storeAirline.webPage).toEqual(airline.webPage);
  });

  it('update should throw an exception for an invalid airline', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      name: "new name",
      description: "new desription"
    };
    await expect( () => service.update("0", airline) ).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

  it('update should throw an exception for an fundation date equal or later than today', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      fundationDate: faker.date.future()
    };
    await expect( () => service.update(airline.id, airline) ).rejects.toHaveProperty("message", "The foundation date cannot be equal or later than today.");
  });

  it('delete should remove a airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);

    const airlineDeleted: AirlineEntity = await repository.findOne({where: {id: `${airline.id}` }});
    expect(airlineDeleted).toBeNull();
  });

  it('delete should throw an exception for an invalid airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    await service.delete(airline.id);

    await expect( () => service.delete(airline.id) ).rejects.toHaveProperty("message", "The Airline with the given id was not found");
  });

});
