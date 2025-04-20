import { Module } from '@nestjs/common';
import { PlanetsService } from './planets.service';
import { PlanetsController } from './planets.controller';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [PlanetsController],
  imports: [CommonModule],
  providers: [PlanetsService],
  exports: [PlanetsService],
})
export class PlanetsModule {}
