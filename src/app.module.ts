import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';

@Module({
  imports: [AirlineModule, AirportModule, AirlineAirportModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
