import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, TableCheck } from "typeorm";
import { User } from "./user.entity";
import { Request } from "express";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>
    ) {}

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOneBy({ id });
    }
    
    /**
     * This function gets the currently logged in user
     * 
     * @param request - The request object from the controller, the cookie will be extracted from this
     * @returns - The user associated to the cookie in the request
     */
    async findOneBySpotifyCookie(request: Request): Promise<User> {
        try {
            const spotify_cookie = request.cookies.spotify_cookie;

            return await this.usersRepository.findOneBy({ spotify_cookie });
        } catch (error) {
            throw new NotFoundException('Spotify Cookie Not Found');
        }
    }

    async findOneBySpotifyId(spotify_id: string): Promise<User> {
        return await this.usersRepository.findOne({ where: { spotify_id } });
    }

    async remove(id: number): Promise<void> {
        await this.usersRepository.delete(id);
    }

    async createOne(user: User) {
        try {
            const createdUser = await this.usersRepository.save(user);

            console.log('Successfully created user: ', createdUser);

            return createdUser
        } catch(error) {
            console.error('Unable to add new user to database: ' + error.message);
            throw new InternalServerErrorException('Unable to add new user to database');
        }
    }

    /**
     * 
     * @param user the user object to be updates
     * @param refresh_token the new refresh token
     * @returns the user object with the updated refresh token if successfull, or throws an error
     */
    async udpateRefreshToken(user: User, refresh_token: string): Promise<User> {
        user.refresh_token = refresh_token;
        
        try {
            await this.usersRepository.save(user);

            return user
        } catch(error) {
            console.error('Failed to update refresh_token in database: ' + error.message);
            throw new InternalServerErrorException('An internal server error occured');
        }
    }

    async udpateAccessToken(user: User, access_token: string): Promise<User> {
        user.access_token = access_token;
        user.access_token_expires_on = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        
        try {
            await this.usersRepository.save(user);
           
            return user
        } catch(error) {
            console.error('Failed to update access_token in database: ' + error.message);
            throw new InternalServerErrorException('An internal server error occured');
        }
    }
}