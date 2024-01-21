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
    
    async findOneBySpotifyCookie(request: Request): Promise<User> {
        try {
            const spotify_cookie = request.cookies.identifier;

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

    udpateRefreshToken(user: User, refresh_token: string) {
        console.log(user.refresh_token);
        user.refresh_token = refresh_token;
        
        try {
            this.usersRepository.save(user);
        } catch(error) {
            console.error('Failed to update refresh_token in database: ' + error.message);
            throw new InternalServerErrorException('An internal server error occured');
        }
    }
}