import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SpotifyProfile } from 'src/spotify/spotify.types';


@Injectable()
export class AuthService {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    client_domain: string;
    
    constructor(private configService: ConfigService, 
        private readonly usersService: UsersService,
        @InjectRepository(User) private readonly usersRepository: Repository<User>) {
        //get environment variables, throw error if they dont exist
        try {
            this.client_id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
            this.client_secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
            this.redirect_uri = this.configService.get<string>('SPOTIFY_REDIRECT_URI');
            this.client_domain = this.configService.get<string>('CLIENT_DOMAIN');
        } catch(error) {
            console.error('Unable to find environment variables: ' + error.message);
            throw new NotFoundException('environment variables not found');
        }
    }

    getLoginUrl(): URL {
        const state: string = randomUUID();
        const scope: string = 'user-read-private user-read-email playlist-read-private streaming user-modify-playback-state';
         
        // construct url        
        var login_url: URL = new URL('https://accounts.spotify.com/authorize')

        login_url.searchParams.append('client_id', this.client_id);
        login_url.searchParams.append('response_type', 'code');
        login_url.searchParams.append('redirect_uri', this.redirect_uri);
        login_url.searchParams.append('state', state);
        login_url.searchParams.append('scope', scope)

        return login_url;
    }

    async handleCallback(params: any, @Res({ passthrough: true }) response: Response): Promise<string> {
        //get url parameters, check if error exists, handle accordingly
        if (params.error != null) {
            console.log(params.error);
            throw new UnauthorizedException('Authentication with spotify failed.');
        }

        // get data for post request
        const data = new URLSearchParams({ 
            code: params.code,
            redirect_uri: this.redirect_uri,
            grant_type: "authorization_code"
        });
        const authorization_credentials = "Basic " + Buffer.from(this.client_id + ":" + this.client_secret).toString('base64');

        // POST request, exchange code for for authorization token and refresh token
        try {
            const spotifyResponse = await fetch('https://accounts.spotify.com/api/token', {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": authorization_credentials
                },
                body: data.toString()
            });

            const responseData = await spotifyResponse.json();

            // Access token has been acquired, get user profile
            // One off call to spotify API, since we know the access token is valid
            const spotifyProfileResponse = await fetch('https://api.spotify.com/v1/me/', {
                method: 'GET', 
                headers: { Authorization: `Bearer ${responseData.access_token}`},
                credentials: 'include'
            });
            const spotifyProfile: SpotifyProfile = await spotifyProfileResponse.json()

            // check whether user exists in database
            const existingUser = await this.usersService.findOneBySpotifyId(spotifyProfile.id)
            if (existingUser != null) {
                // console.log('Detected existing user, updating access_token and refresh_token')
                
                // update access_token and refresh_token
                this.usersService.udpateRefreshToken(existingUser, responseData.refresh_token)
                this.usersService.udpateAccessToken(existingUser, responseData.access_token)
            } else {
                // console.log('Detected new user, adding to database...')
                
                // create unique cookie identifier
                const cookieValue = randomUUID();
                response.cookie('spotify_cookie', cookieValue, {
                    maxAge: 2629746000
                });

                // create new user in DB
                try {
                    const newUser = this.usersRepository.create({
                        spotify_id: spotifyProfile.id,
                        username: spotifyProfile.display_name,
                        spotify_cookie: cookieValue,
                        access_token: responseData.access_token,
                        access_token_expires_on: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
                        refresh_token: responseData.refresh_token
                    })

                    this.usersService.createOne(newUser)
                } catch (error) {
                    console.error('There was an error creating the new user entity: ' + error.message);
                    throw new InternalServerErrorException('There was an error creating a new user')
                }
            }

            // redirect user to frontend login callback
            response.redirect(this.client_domain + '/login')

            return;
        } catch (error) {
            console.error("An error occured: " + error);
            throw new InternalServerErrorException("An error occured in the callback function")
        }
    }
}
