import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { PeopleModule } from './people/people.module';
import { PlanetsModule } from './planets/planets.module';

@Module({
  imports: [CommonModule, PeopleModule, PlanetsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
