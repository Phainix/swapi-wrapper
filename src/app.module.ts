import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { PeopleModule } from './people/people.module';

@Module({
  imports: [CommonModule, PeopleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
