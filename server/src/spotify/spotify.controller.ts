import { Controller, Get, Query, Req } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { SpotifyProfile } from './spotify.types';
import { User } from 'src/users/user.entity';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Controller('spotify')
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService,
        private readonly usersService: UsersService) {}

    @Get()
    async getCurrrentUserProfile(@Req() request: Request): Promise<SpotifyProfile> {
        // get current user profile
        const spotifyCookie = await this.usersService.findOneBySpotifyCookie(request)

        // get requested data
        return await this.spotifyService.getProfileByUser(spotifyCookie);
    }

    @Get('getNewAccessToken')
    async getNewAccessToken(@Req() request: Request): Promise<User> {
        // get current user profile
        const currentUser = await this.usersService.findOneBySpotifyCookie(request)

        // get requested data
        return await this.spotifyService.getNewAccessToken(currentUser);
    }
}
