import { Injectable } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Repository } from 'typeorm';
import { Presentation } from './entities/presentation.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PresentationsService {
  constructor(
    @InjectRepository(Presentation)
    private readonly presentationsRepository: Repository<Presentation>
  ) {}

  async create(createPresentationDto: CreatePresentationDto) {
    return await this.presentationsRepository.save(createPresentationDto);
  }

  async findAll() {
    return await this.presentationsRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} presentation`;
  }

  update(id: number, updatePresentationDto: UpdatePresentationDto) {
    return `This action updates a #${id} presentation`;
  }

  remove(id: number) {
    return `This action removes a #${id} presentation`;
  }
}
