import { BadRequestException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Req } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { Playlist, SpotifyProfile, Track } from "./spotify.types";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "src/users/users.service";

@Injectable()
export class SpotifyService {
    client_id: string;
    client_secret: string;

    constructor(private configService: ConfigService,
        private readonly usersService: UsersService) {
        try {
            this.client_id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
            this.client_secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
        } catch(error) {
            console.error('Unable to find environment variables: ' + error.message);
            throw new NotFoundException('environment variables not found');        
        }
    }

    checkAccessTokenExpired = async (user: User) => {
        const currentTime = new Date();

        if (user.access_token_expires_on.valueOf() < currentTime.valueOf()) {
            console.log('checkAccessToken(): access token is expired - getting new token');
            await this.getNewAccessToken(user)

            .catch((error) => {
                console.error('There was an error updating the user\'s access token: ' + error.message);
                throw new InternalServerErrorException('There was an error updating the user\'s access token');
            })
        }
    }

    /**
     * Acquires a new access token using the refresh token
     * 
     * @param user The user to acquire a new access token for
     * @returns The user object with the updated access token
     */
    async getNewAccessToken(user: User): Promise<User> {
        // make api request to get new refreshToken
        try {
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(this.client_id + ":" + this.client_secret).toString('base64')}`
                },
                body: new URLSearchParams({
                    grant_type: 'refresh_token',
                    refresh_token: user.refresh_token,
                    client_id: this.client_id
                }),
            })

            if (response.ok) {
                const newToken = await response.json();
    
                // update access token in DB
                await this.usersService.udpateAccessToken(user, newToken.access_token)
                .catch((error) => { 
                    console.error('Unable to save new access token in database: ' + error.message);
                    throw new InternalServerErrorException("An internal server error occured");
                });

                return user;
            }
            
        } catch(error) {
            console.error('There was an error updating the refresh token: ' + error.message)
            throw new InternalServerErrorException('There was an internal server error');
        }
    }

    async getProfileByUser(user: User): Promise<SpotifyProfile> {
        this.checkAccessTokenExpired(user)
        
        try {
            // get spotify user profile
            const response = await fetch('https://api.spotify.com/v1/me/', {
                headers: { Authorization: `Bearer ${user.access_token}`},
                credentials: 'include'
            })

            if (response.ok) {
                // turn response into SpotifyProfile object
                const data: SpotifyProfile = await response.json();

                const spotifyProfile: SpotifyProfile = {
                    id: data.id,
                    display_name: data.display_name,
                    images: data.images
                }

                return spotifyProfile;
            } else {
                const error = await response.json()

                return error
            }
        } catch(error) {
            throw new InternalServerErrorException('There was an error getting the current users data');
        }        
    }
    
    async getPlaylists(user: User): Promise<Playlist[]> {
        this.checkAccessTokenExpired(user)

        try {
            const response = await fetch('https://api.spotify.com/v1/me/playlists', {
                headers: { Authorization: `Bearer ${user.access_token}`},
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json();

                const playlists: Playlist[] = data.items;

                return playlists;
            }
        } catch(error) {
            console.log('There was an error fetching the user\'s playlists: ' + error.message);
            throw new InternalServerErrorException('There was an error fetching the user\'s playlists');
        }
    }

    async getPlaylist(user: User, playlist_id: string): Promise<Playlist> {
        this.checkAccessTokenExpired(user)

        try {
            const response = await fetch('https://api.spotify.com/v1/playlists/' + playlist_id, {
                headers: { Authorization: `Bearer ${user.access_token}`},
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();

                return data;
            }
        } catch(error) {
            console.log('There was an error fetching the playlist: ' + error.message);
            throw new InternalServerErrorException('There was an error fetching the playlist');
        }
    }

    async getTrack(user: User, track_id: string): Promise<Track> {
        try {
            const response = await fetch(`https://api.spotify.com/v1/tracks/${track_id}`, {
                headers: { Authorization: `Bearer ${user.access_token}` },
                credentials: 'include'
            })

            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                console.error(`ERROR: Failed to fetch track: ${track_id}. ${response.status}, ${response.status}`)
            }
        } catch(error) {
            console.log('There was an error fetching the playlist: ' + error.message);
            throw new InternalServerErrorException('There was an error getting the track');
        }
    }

    async addToQueue(user: User, track_id: string, device_id: string): Promise<void> {
        this.checkAccessTokenExpired(user);

        if (!track_id) {
            throw new BadRequestException('ERROR: Invalid track_id parameter supplied');
        }
        const url = new URL('https://api.spotify.com/v1/me/player/queue');
        url.searchParams.append('uri', `spotify:track:${track_id}`);
        if (device_id) {
            url.searchParams.append('device_id', device_id); // add param if device is defined - if not, queue on user's current device
        }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { Authorization: `Bearer ${user.access_token}`},
                credentials: 'include',
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error(`ERROR ${response.status}: ${response.statusText}`);
                console.error(errorResponse);
                throw new InternalServerErrorException('There was an error starting playback');
            };

            return;
        } catch(error) {
            console.error(error);
            throw new InternalServerErrorException('There was an error adding to the queue');
        }
    }

    // PUT to spotify
    async playTrack(user: User, body: any, device_id: string): Promise<Object> {
        this.checkAccessTokenExpired(user)

        try {
            const data = {
                uris: ['spotify:track:' + body.track_id],
                position_ms: body.position_ms
            };

            const url = new URL('https://api.spotify.com/v1/me/player/play')
            if (device_id) {
                url.searchParams.append('device_id', device_id); // add param if device is defined - if not, play on user's current device
            }

            const response = await fetch(url, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${user.access_token}`},
                credentials: 'include',
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                console.error(`ERROR ${response.status}: ${response.statusText}`);
                console.error(errorResponse);
                throw new InternalServerErrorException('There was an error starting playback');
            };

            return;
        } catch(error) {
            console.error(error);
            throw new InternalServerErrorException('There was an error starting playback');
        }
    }
}