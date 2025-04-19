import { Controller, HttpCode, Get, Param } from '@nestjs/common';
import { PeopleService } from './people.service';
import { Person, DetailedPerson } from './interfaces/people.interface';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get('')
  @HttpCode(200)
  findAll(): Promise<Person[]> {
    return this.peopleService.getPeople();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DetailedPerson> {
    return this.peopleService.getPersonById(id);
  }
}
