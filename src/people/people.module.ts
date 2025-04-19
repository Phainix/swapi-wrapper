import { Module } from '@nestjs/common';
import { PeopleService } from './people.service';
import { PeopleController } from './people.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PeopleController],
  imports: [CommonModule],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
