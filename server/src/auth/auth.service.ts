import { HttpException, HttpStatus, Injectable, Res, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { Response } from 'express';


@Injectable()
export class AuthService {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    client_domain: string;
    
    constructor(private configService: ConfigService) {
        //get environment variables, throw error if they dont exist
        try {
            this.client_id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
            this.client_secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
            this.redirect_uri = this.configService.get<string>('SPOTIFY_REDIRECT_URI');
            this.client_domain = this.configService.get<string>('CLIENT_DOMAIN');
        } catch(e) {
            throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    getLoginUrl(): URL {
        const state: string = randomUUID();
        const scope: string = 'user-read-private';
         
        // construct url        
        var login_url: URL = new URL('https://accounts.spotify.com/authorize')
        // client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`

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

            console.log(responseData);

            response.cookie('isLoggedIn', true);
            response.cookie('identifier', 'abcdefghi');

            // figure out a way to correlate an ID to user (SQL database?)

            // redirect user
            response.redirect(this.client_domain + '/dashboard')

            return 'Successly logged user in';
        } catch (error) {
            console.error("An error occured: " + error);
            throw new Error("An error occured in the callback function")
        }
    }
}
