import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { PresentationsService } from './presentations.service';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Request } from 'express';

@Controller('presentations')
export class PresentationsController {
  constructor(private readonly presentationsService: PresentationsService,
    private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createPresentationDto: CreatePresentationDto) {
    return this.presentationsService.create(createPresentationDto);
  }

  @Get()
  async findAll() {
    return this.presentationsService.findAll();
  }

  @Get(':playlist_id')
  async findOne(@Req() request: Request, @Param('playlist_id') playlist_id: string) {
    const currentUser: User = await this.usersService.findOneBySpotifyCookie(request);

    return this.presentationsService.findOne(playlist_id, currentUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePresentationDto: UpdatePresentationDto) {
    return this.presentationsService.update(+id, updatePresentationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presentationsService.remove(+id);
  }
}
