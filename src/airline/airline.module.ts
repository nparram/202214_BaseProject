import { Module } from '@nestjs/common';
import { AirlineService } from './airline.service';
import { AirlineController } from './airline.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from './airline.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity])],
  providers: [AirlineService],
  controllers: [AirlineController]
})
export class AirlineModule {}
