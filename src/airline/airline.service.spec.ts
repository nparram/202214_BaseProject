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

  it('findAll should return all airlines', () => {

  });

  it('findOne should return a airline by id', () => {

  });

  it('create should return a new airline', () => {

  });

  it('create should throw an exception for an invalid airline', () => {

  });

  it('create should throw an exception for an fundation date equal or later than today', () => {

  });

  it('update should modify a airline', () => {

  });

  it('update should throw an exception for an invalid airline', () => {

  });

  it('update should throw an exception for an fundation date equal or later than today', () => {

  });

  it('delete should remove a airline', () => {

  });

  it('delete should throw an exception for an invalid airline', () => {

  });

});
