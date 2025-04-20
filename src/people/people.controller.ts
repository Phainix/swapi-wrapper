import { Controller, HttpCode, Get, Param, Query } from '@nestjs/common';
import { PeopleService } from './people.service';
import { Person, DetailedPerson } from './interfaces/people.interface';
import { Paginated } from 'src/common/interfaces/pagination.interface';
import { ApiQuery } from '@nestjs/swagger';

@Controller('people')
export class PeopleController {
  constructor(private readonly peopleService: PeopleService) {}

  @Get('')
  @HttpCode(200)
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  findAll(@Query('page') page = 1): Promise<Paginated<Person>> {
    return this.peopleService.getPeople(page);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DetailedPerson> {
    return this.peopleService.getPersonById(id);
  }
}
