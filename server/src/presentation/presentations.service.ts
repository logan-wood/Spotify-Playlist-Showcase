import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePresentationDto } from './dto/create-presentation.dto';
import { UpdatePresentationDto } from './dto/update-presentation.dto';
import { Repository } from 'typeorm';
import { Presentation, TrackQueue } from './entities/presentation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SpotifyService } from 'src/spotify/spotify.service';
import { UsersService } from 'src/users/users.service';
import { Track } from 'src/spotify/spotify.types';

@Injectable()
export class PresentationsService {
  constructor(
    @InjectRepository(Presentation)
    private readonly presentationsRepository: Repository<Presentation>,
    private readonly usersService: UsersService,
    private readonly spotifyService: SpotifyService
  ) {}

  async create(createPresentationDto: CreatePresentationDto) {
    const { user_id, playlist_id } = createPresentationDto;

    if (!user_id || !playlist_id) {
      throw new Error('parameters not recieved when creating new presentation');
    }

    const user = await this.usersService.findOne(user_id);

    if (!user) {
      throw new Error('User not found while creating presentation');
    }

    const presentation = new Presentation();
    presentation.user = user;
    presentation.playlist_id = playlist_id;
    presentation.track_queue = []

    const newPresentation = await this.presentationsRepository.save(presentation);

    if (!newPresentation) {
      throw new InternalServerErrorException('There was an error saving the presentation');
    }

    return newPresentation; 
  }

  async findAll() {
    return await this.presentationsRepository.find();
  }

  /**
   * Finds a presentation by it's ID.
   * @param id the id of the presentation to fetch
   * @returns The presentation object, or null if it does not exist
   */
  async find(id: number): Promise<Presentation> {
    return await this.presentationsRepository.findOneBy({ id: id })
  }

    /**
     * Finds a presentation via the Spotify playlist_id and the user. Creates a new presentation if not found.
     * @param playlist_id 
     * @param user 
     * @returns 
     */
  async findOne(playlist_id: string, user: User): Promise<Presentation> {
    const presentation = await this.presentationsRepository.findOne({
      where: {
        playlist_id: playlist_id,
        user: { id: user.id }
      }
    });

    if (presentation) {
      // record found
      return presentation;
    } else {
      // no record found, create new presentation
      try {
        console.log(`No presentation found for playlist ${playlist_id}, creating new presentation`);
        const newPresentation = await this.create({ user_id: user.id, playlist_id: playlist_id });

        return newPresentation;
      } catch(error) {
        console.error('An error occured auto generating a presentation: ' + error)
        throw new InternalServerErrorException('Presentation not found - an error occured generating new presentation');
      }
    } 
  } 

  update(id: number, updatePresentationDto: UpdatePresentationDto) {
    const track_queue: TrackQueue[] = updatePresentationDto.track_queue;

    const updatedPresentation = this.presentationsRepository.update(id, { track_queue: track_queue });

    if (!updatedPresentation) throw new InternalServerErrorException('There was an error updating the presentation in the database.');
  
    return updatedPresentation;
  }

  remove(id: number) {
    return `This action removes a #${id} presentation`;
  }

  async getImages(presentation_id: number, user: User): Promise<string[]> {
    // get presetation from db
    const presentation: Presentation = await this.find(presentation_id);
    if (!presentation) {
      console.error(`ERROR: There was an error retrieving the presentation ${presentation_id}`);
      return;
    }

    let imageArray: string[] = []; // array of image URLs

    await Promise.all(presentation.track_queue.map(async (item) => {
      const track: Track = await this.spotifyService.getTrack(user, item.track_id);
      if (track) {
        imageArray.push(track.album.images[0].url);
      } else {
        console.error(`ERROR: Failed to fetch current track: ${item.track_id}`);
      }
    }));

    return imageArray;
  }
}
