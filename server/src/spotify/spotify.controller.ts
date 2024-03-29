import { Controller, Get, Put, Query, Req } from '@nestjs/common';
import { SpotifyService } from './spotify.service';
import { Playlist, SpotifyProfile, Track } from './spotify.types';
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
        const spotifyCookie = await this.usersService.findOneBySpotifyCookie(request);

        // get requested data
        return await this.spotifyService.getProfileByUser(spotifyCookie);
    }

    @Get('getNewAccessToken')
    async getNewAccessToken(@Req() request: Request): Promise<User> {
        // get current user profile
        const currentUser = await this.usersService.findOneBySpotifyCookie(request);

        // get requested data
        return await this.spotifyService.getNewAccessToken(currentUser);
    }

    @Get('playlists')
    async getPlaylists(@Req() request: Request): Promise<Playlist[]> {
        const currentUser: User = await this.usersService.findOneBySpotifyCookie(request);

        return await this.spotifyService.getPlaylists(currentUser);
    }

    @Get('playlist')
    async getPlaylist(@Req() request: Request, @Query('playlist_id') playlist_id: string): Promise<Playlist> {
        const currentUser: User = await this.usersService.findOneBySpotifyCookie(request);
        
        return await this.spotifyService.getPlaylist(currentUser, playlist_id);
    }

    @Get('track')
    async getTrack(@Query('track_id') track_id: string): Promise<Track> {
        return await this.spotifyService.getTrack(track_id)
    }

    @Get('play')
    async play(@Req() request: Request, @Query('device_id') device_id: string, @Query('track_id') track_id: string, @Query('position_ms') position_ms: number): Promise<Object> {
        const currentUser = await this.usersService.findOneBySpotifyCookie(request);

        return await this.spotifyService.playTrack(currentUser, device_id, track_id, position_ms)
    }
}
