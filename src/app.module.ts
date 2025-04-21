import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { PeopleModule } from './people/people.module';
import { PlanetsModule } from './planets/planets.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 300000,
      isGlobal: true,
    }),
    CommonModule,
    PeopleModule,
    PlanetsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
