import { Controller, Get, Query } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyProfile } from './spotify.types';
import { User } from 'src/users/user.entity';

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    // development only
    // @Get()
    // async getCurrrentUserProfile(@Query('access_token') user: User): Promise<SpotifyProfile> {
    //     return await this.spotifyService.getCurrentProfile(user);
    // }
}
