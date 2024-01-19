import { HttpException, HttpStatus, Injectable, NotFoundException, Param, Redirect, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';


@Injectable()
export class AuthService {
    client_id: string;
    client_secret: string;
    redirect_uri: string;
    
    constructor(private configService: ConfigService) {
        //get environment variables, throw error if they dont exist
        try {
            this.client_id = this.configService.get<string>('SPOTIFY_CLIENT_ID');
            this.client_secret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET');
            this.redirect_uri = this.configService.get<string>('SPOTIFY_REDIRECT_URI');
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

    async handleCallback(params: any): Promise<string> {
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
            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": authorization_credentials
                },
                body: data.toString()
            });

            const responseData = await response.json();

            console.log(responseData);

            // return frontend url to controller to redirect user???
            return 'Success!';
        } catch (error) {
            console.error("An error occured: " + error);
            throw new Error("An error occured in the callback function")
        }
    }
}
