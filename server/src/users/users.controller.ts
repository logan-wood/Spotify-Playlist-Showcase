import { Controller, Get, InternalServerErrorException, Req } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { Request } from 'express';
import { SpotifyService } from 'src/spotify/spotify.service';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly spotifyService: SpotifyService) {}

    @Get()
    async getAll(): Promise<User[]> {
        return await this.usersService.findAll(); 
    }

    @Get('fromCookie')
    async getFromCookie(@Req() request: Request): Promise<User> {
        return await this.usersService.findOneBySpotifyCookie(request);
    }

    /**
     * For use with spotify web player SDK. Contrary to what I learnt while implementing spotify's API, the access token is used in the frontend. Thus, the access token needs to be validated here.
     * @param request 
     * @returns 
     */
    @Get('accessToken')
    async getAccessToken(@Req() request: Request): Promise<string> {
        const user = await this.usersService.findOneBySpotifyCookie(request)

        if (user) {
            await this.spotifyService.checkAccessTokenExpired(user)
        }

        return user.access_token;
    }

}
