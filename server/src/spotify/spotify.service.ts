import { InternalServerErrorException } from "@nestjs/common";
import { User } from "src/users/user.entity";
import { SpotifyProfile } from "./spotify.types";

export class SpotifyService {
    async getProfileByUser(user: User): Promise<SpotifyProfile> {
        console.log(user.access_token_expires_on)
        
        try {
            // get spotify user profile
            const response = await fetch('https://api.spotify.com/v1/me/', {
                method: 'GET', 
                headers: { Authorization: `Bearer ${user.access_token}`},
                credentials: 'include'
            })

            if (response.ok) {
                // turn response into SpotifyProfile object
                const data = await response.json() as SpotifyProfile;

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
}