import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { Playlist, SpotifyProfile } from "./spotify.types";
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
        if (user.access_token_expires_on.getTime() < Date.now()) {
            console.log('access_token is expired?')
        }
        else {
            console.log('access_token is not expired')
        }
        
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
        if (user.access_token_expires_on.getTime() > Date.now()) {
            console.log('access token expired')
            // access token is expired, update access token
            await this.getNewAccessToken(user)
            .catch((error) => {
                console.error('There was an error updating the user\'s access token: ' + error.message);
                throw new InternalServerErrorException('There was an error updating the user\'s access token');
            })
        }
        else {
            console.log('access_token is not expired')
        }

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
}