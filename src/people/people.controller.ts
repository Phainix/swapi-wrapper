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
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search',
  })
  async findAll(
    @Query('page') page = 1,
    @Query('search') search = '',
  ): Promise<Paginated<Person>> {
    return this.peopleService.getPeople(page, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<DetailedPerson> {
    return this.peopleService.getPersonById(id);
  }
}
