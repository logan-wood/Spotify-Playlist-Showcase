import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Repository } from 'typeorm';
import { Presentation } from './entities/presentation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SpotifyService } from 'src/spotify/spotify.service';

@Injectable()
export class PresentationsService {
  constructor(
    @InjectRepository(Presentation)
    private readonly presentationsRepository: Repository<Presentation>,
    private readonly spotifyService: SpotifyService
  ) {}

  async create(createPresentationDto: CreatePresentationDto) {
    // create track queue
    // check all tracks have a record in database
    return await this.presentationsRepository.save(createPresentationDto);
  }

  async findAll() {
    return await this.presentationsRepository.find();
  }

  async findOne(playlist_id: string, user: User) {
    const presentation = await this.presentationsRepository.findOne({
      where: {
        playlist_id: playlist_id,
        user: { id: user.id }
      }
    });

    console.log(user)

    if (presentation) {
      // record found
      return presentation;
    } else {
      // no record found, create new presentation
      // try {
      //   console.log(`No presentation found for playlist ${playlist_id}, creating new presentation`);
      //   const newPresentation = await this.create({ user_id: user.id, playlist_id: playlist_id });

      //   return newPresentation;
      // } catch(error) {
      //   console.error('An error occured auto generating a presentation: ' + error)
      //   throw new InternalServerErrorException('Presentation not found - an error occured generating new presentation');
      // }
    } 
  } 

  update(id: number, updatePresentationDto: UpdatePresentationDto) {
    return `This action updates a #${id} presentation`;
  }

  remove(id: number) {
    return `This action removes a #${id} presentation`;
  }
}
